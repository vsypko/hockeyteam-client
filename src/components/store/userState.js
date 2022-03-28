import { makeAutoObservable } from 'mobx'
import axios from 'axios'

class UserState {
  user = {}
  isAuth = false
  sessionid = null
  socket = null
  connected = false
  messages=[]

  constructor() {
    makeAutoObservable(this)
  }

  setServerTime(time) {
    this.serverTime = time
  }

  setAuth(bool) {
    this.isAuth = bool
  }

  setConnected(bool) {
    this.connected = bool
  }

  setSocket(socket) {
    this.socket = socket
  }

  setUser(user) {
    this.user = user
  }

  setSessionid(id) {
    this.sessionid = id
  }

  setChatMessages(msg) {
    this.messages.push(msg)
  }
 async checkAuth() {
   try {
    this.response = await axios.get(`${process.env.REACT_APP_API_URL}/refresh`, {withCredentials: true})
    this.setAuth(true)
    localStorage.setItem('token', this.response.data.accessToken)
    this.setUser(this.response.data.user)
   } catch (e) {
    console.log(e.response.data.message)
   }

  }

  async logout() {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/logout`)
        localStorage.removeItem('token')
        this.setAuth(false)
        this.setUser({})
      } catch (e) {
        console.log(e.response)
      }
    }

}
export default new UserState()
