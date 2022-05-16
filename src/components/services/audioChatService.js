// import React from "react"
// eslint-disable-next-line no-unused-vars
import adapter from "webrtc-adapter"
import socket from "../store/socketState"

class AudioChat {
  //--------------------------------------------------------------------------------------------------------
  async setPC(client) {
    const constraints = { audio: true, video: false }
    let localStream = null
    try {
      localStream = await navigator.mediaDevices.getUserMedia(constraints)
      client.localStream = localStream
      client.peer = new RTCPeerConnection()
      // {iceServers: [{ urls: "stun:stun.l.google.com:19302" }],}
      localStream.getAudioTracks().forEach((track) => {
        client.peer.addTrack(track, localStream)
      })
    } catch (error) {
      console.error("Error accessing media devices: ", error)
    }

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
          })
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
    client.remoteAudio.srcObject
      .getAudioTracks()
      .forEach((track) => track.stop())
    client.remoteAudio.srcObject = null
    client.remoteAudio = null
    client.localStream.getTracks().forEach((track) => track.stop())
    client.localStream = null
    client.peer.close()
    client.peer = null
    client.connected = false
  }

  //------------------------------------------------------------------------------------------------------

  async setOffer(remoteClients) {
    remoteClients.forEach(async (client) => {
      await this.setPC(client)
      const offer = await client.peer.createOffer()
      await client.peer.setLocalDescription(offer)
      socket.send(
        JSON.stringify({
          method: "offer",
          session: socket.session,
          nickname: socket.nickname,
          toClient: client.nickname,
          offer,
        })
      )
    })
  }

  //-------------------------------------------------------------------------------------------------------------
  async setAnswer(msg) {
    const client = {
      session: msg.session,
      nickname: msg.nickname,
    }
    try {
      await this.setPC(client)
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
        })
      )
      socket.addAudioClient(client)

      await this.setIceCandidate(client)
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
    await this.setIceCandidate(client)
  }

  //-----------------------------------------------------------------------------------------------------------

  async setIceCandidate(client) {
    const [candidate] = socket.getCandidates(client.nickname)
    if (candidate) {
      const iceCandidate = { ...candidate.iceCandidate }
      await client.peer.addIceCandidate(new RTCIceCandidate(iceCandidate))
    }
  }
}

export default new AudioChat()
