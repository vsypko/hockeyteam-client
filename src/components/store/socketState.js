import { makeAutoObservable } from "mobx"
import teamState from "./teamState"
import audioChat from "../services/audioChatService"

class Socket {
  wsocket = null
  nickname = ""
  session = null
  isConnected = false
  errorConnection = false
  countConnected = 0

  errorConnectionMsg = ""
  serverTime = ""
  messages = []

  audioClients = []
  inAudio = false
  isAudioChat = false
  localStream = null
  iceCandidates = []

  constructor() {
    makeAutoObservable(this)
  }

  setNickname(name) {
    this.nickname = name
  }

  setSession(session) {
    this.session = session
  }

  setAudioChat(bool) {
    this.isAudioChat = bool
  }

  async setLocalStream() {
    const constraints = { audio: true, video: false }
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
    } catch (error) {
      console.error("Error accessing media devices: ", error)
    }
  }

  addAudioClient(client) {
    this.audioClients.push(client)
  }

  getAudioClient(nickname) {
    return this.audioClients.find((client) => client.nickname === nickname)
  }

  addCandidates(candidate) {
    this.iceCandidates.push(candidate)
  }

  getCandidates(nickname) {
    const iceCandidates = this.iceCandidates.filter(
      (el) => el.nickname === nickname
    )
    return iceCandidates
  }

  delAudioClient(nickname) {
    const clienttoleave = this.audioClients.find(
      (client) => client.nickname === nickname
    )
    if (clienttoleave) {
      audioChat.delPC(clienttoleave)
      this.audioClients = this.audioClients.filter(
        (client) => client !== clienttoleave
      )
      this.iceCandidates = this.iceCandidates.filter(
        (i) => i.nickname !== clienttoleave.nickname
      )
    }
  }

  setInAudio(inAudio) {
    this.inAudio = inAudio
  }

  closeAudioChat() {
    if (this.audioClients.length > 0) {
      this.inAudio = true
      this.audioClients.forEach((client) => {
        audioChat.delPC(client)
        this.send(
          JSON.stringify({
            method: "audioclientleave",
            nickname: this.nickname,
            session: this.session,
            toClient: client.nickname,
          })
        )
      })
    } else {
      this.send(
        JSON.stringify({ method: "lastaudioleave", session: this.session })
      )
    }
    this.localStream.getTracks().forEach((track) => track.stop())
    this.localStream = null
    this.audioClients = []
    this.iceCandidates = []
    this.setAudioChat(false)
  }

  setSocket(callback) {
    this.wsocket = new WebSocket(process.env.REACT_APP_SOCKET_URL)
    this.wsocket.onopen = this.socketOpen.bind(this)
    this.wsocket.onmessage = this.socketMessage.bind(this)
    this.wsocket.onclose = this.socketClose.bind(this)
    this.closeDialog = callback
  }

  socketOpen() {
    this.send(
      JSON.stringify({
        method: "connection",
        session: this.session,
        nickname: this.nickname,
      })
    )
  }

  async socketMessage(event) {
    let msg = JSON.parse(event.data)

    switch (msg.method) {
      case "reject":
        this.isConnected = false
        this.errorConnection = true
        this.errorConnectionMsg = msg.message
        this.wsocket.close()
        break

      case "herokuConnection":
        this.serverTime = msg.serverTime
        break

      case "connected":
        this.isConnected = true
        this.errorConnection = false
        this.errorConnectionMsg = ""
        this.closeDialog(false)
        if (msg.inaudio) this.setInAudio(true)
        break

      case "newclient":
        this.countConnected = msg.number
        this.messages.push(msg)
        break

      case "chat":
        this.messages.push(msg)
        break

      case "arenareq":
        teamState.arenaStateResponse(msg)
        break

      case "arenares":
        teamState.arenaSocketState(msg)
        break

      case "playerchoice":
        teamState.socketPlayerChoice(msg.playerId, msg.selected)
        break

      case "pointerdown":
        teamState.handleSocketDown(
          msg.arenaOrientation,
          msg.nickname,
          msg.pointerSet.playerIndex,
          msg.pointerSet.x,
          msg.pointerSet.y
        )
        break

      case "pointermove":
        teamState.handleSocketMove(
          msg.arenaOrientation,
          msg.playerSet.playerIndex,
          msg.playerSet.x,
          msg.playerSet.y
        )
        break

      case "pointerup":
        teamState.handleSocketUp(msg.playerIndex)
        break

      case "pointerout":
        teamState.handleSocketOut(msg.playerIndex)
        break

      case "inaudio":
        this.setInAudio(true)
        break

      case "audioclients":
        this.setAudioChat(true)
        this.setInAudio(false)
        await this.setLocalStream()
        if (msg.audioClients.length > 0) {
          this.audioClients = msg.audioClients
          await audioChat.setOffer(this.audioClients, this.localStream)
        }
        break

      case "offer":
        await audioChat.setAnswer(msg, this.localStream)
        break

      case "answer":
        await audioChat.setDescription(msg)
        break

      case "candidate":
        this.addCandidates({
          session: msg.session,
          nickname: msg.nickname,
          iceCandidate: msg.candidate,
        })
        break

      case "audioclientleave":
        this.delAudioClient(msg.nickname)
        break

      case "lastaudioleave":
        this.setInAudio(false)
        break

      case "close":
        if (this.countConnected > 1) this.countConnected -= 1
        break

      default:
        console.log("No match cases!", msg)
        break
    }
  }

  socketClose() {
    if (this.isAudioChat) {
      this.closeAudioChat()
    }
    if (this.isConnected) {
      this.send(
        JSON.stringify({
          method: "close",
          session: this.session,
          nickname: this.nickname,
        })
      )
    }

    this.nickname = ""
    this.inAudio = false
    this.countConnected = 0
    this.wsocket.close()
    this.isConnected = false
  }

  send(msg) {
    this.wsocket.send(msg)
  }
}
export default new Socket()
