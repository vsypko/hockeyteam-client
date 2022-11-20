// eslint-disable-next-line no-unused-vars
import adapter from "webrtc-adapter"
import socket from "../store/socketState"

class AudioChat {
  //--------------------------------------------------------------------------------------------------------
  async setPC(client, localStream) {
    client.peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })
    localStream.getAudioTracks().forEach((track) => {
      client.peer.addTrack(track, localStream)
    })
    client.remoteAudio = document.createElement("audio")
    client.remoteAudio.autoplay = true

    client.peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.send(
          JSON.stringify({
            method: "candidate",
            session: socket.session,
            nickname: socket.nickname,
            toClient: client.nickname,
            candidate: e.candidate,
          }),
        )
      }
    }

    client.peer.oniceconnectionstatechange = (e) => {
      console.log(client.peer.connectionState)
    }

    client.peer.ontrack = (e) => {
      client.remoteAudio.srcObject = e.streams[0]
    }

    client.peer.onclose = (e) => {
      console.log("close event: ", e)
    }
  }

  //----------------------------------------------------------------------------------------------------

  delPC(client) {
    if (client.remoteAudio.srcObject) {
      client.remoteAudio.srcObject.getAudioTracks().forEach((track) => track.stop())
      client.remoteAudio.srcObject = null
    }
    client.remoteAudio.remove()
    client.remoteAudio = null
    client.peer.close()
    client.peer = null
    client.connected = false
  }

  //------------------------------------------------------------------------------------------------------

  async setOffer(remoteClients, localStream) {
    remoteClients.forEach(async (client) => {
      await this.setPC(client, localStream)
      const offer = await client.peer.createOffer()
      await client.peer.setLocalDescription(offer)
      socket.send(
        JSON.stringify({
          method: "offer",
          session: socket.session,
          nickname: socket.nickname,
          toClient: client.nickname,
          offer,
        }),
      )
    })
  }

  //-------------------------------------------------------------------------------------------------------------
  async setAnswer(msg, localStream) {
    const client = {
      session: msg.session,
      nickname: msg.nickname,
    }
    try {
      await this.setPC(client, localStream)
      const offer = new RTCSessionDescription(msg.offer)
      await client.peer.setRemoteDescription(offer)
      const answer = await client.peer.createAnswer()
      await client.peer.setLocalDescription(answer)

      socket.send(
        JSON.stringify({
          method: "answer",
          session: socket.session,
          nickname: socket.nickname,
          toClient: msg.nickname,
          answer,
        }),
      )
      socket.addAudioClient(client)
    } catch (e) {
      console.error("WebRTC answer error", e)
    }
  }

  //--------------------------------------------------------------------------------------------------------------------

  async setDescription(msg) {
    const client = socket.getAudioClient(msg.nickname)

    try {
      const answer = new RTCSessionDescription(msg.answer)
      await client.peer.setRemoteDescription(answer)
    } catch (e) {
      console.error("WebRTS set description error", e)
    }
  }

  //-----------------------------------------------------------------------------------------------------------

  async setIceCandidates(client, candidate) {
    if (candidate) {
      await client.peer.addIceCandidate(new RTCIceCandidate(candidate))
    }
  }
}

export default new AudioChat()
