import { makeAutoObservable } from 'mobx'

import allplayers from './playersState'
import arena_filled from '../../assets/rink_filled.png'
import arena_cleaner from '../../assets/rink_clean.png'
import arena_cleaner_mob from '../../assets/rink_clean_mob.png'
import arena_filled_mob from '../../assets/rink_filled_mob.png'
import userState from './userState'
import layerState from './layerState'

class TeamState {
  arena = null
  arenaCleaner = null
  playerUndoList = []
  playerRedoList = []
  orientation = false
  players = allplayers
  leftTeamColor = '#A40000'
  rightTeamColor = '#087008'

  constructor() {
    makeAutoObservable(this)
  }
  setLeftTeamColor(leftTeamColor) {
    this.leftTeamColor = leftTeamColor
  }
  setRightTeamColor(rightTeamColor) {
    this.rightTeamColor = rightTeamColor
  }

  //---init function when canvas rendering------------------------------------------
  rinkInit() {
    this.topLayer = layerState.topLayer
    this.lowLayer = layerState.lowLayer
    this.canvasScape = layerState.canvasScape
    
    this.topctx = this.topLayer.getContext('2d')
    this.lowctx = this.lowLayer.getContext('2d')

    this.rect = this.topLayer.getBoundingClientRect()
    this.offsetTop = this.rect.top
    this.offsetLeft = this.rect.left

    this.draggingPlayerIndex = -1

    this.topLayer.onpointerdown = this.handlePointerDown.bind(this)
    this.topLayer.onpointermove = this.handlePointerMove.bind(this)
    this.topLayer.onpointerout = this.handlePointerOut.bind(this)
    this.topLayer.onpointerup = this.handlePointerUp.bind(this)

    //draw arena on the low layer canvas and clear it---------------------------------------

    this.arena = new Image()
    this.arena.onload = () => {
      this.topctx.imageSmoothingEnabled = true
      this.lowctx.imageSmoothingEnabled = true
      this.arenaPattern = this.lowctx.createPattern(this.arena, 'no-repeat')
      this.lowctx.fillStyle = this.arenaPattern
      this.lowctx.fillRect(0, 0, this.lowLayer.width, this.lowLayer.height)
    }
    this.arena.src = !this.canvasScape ? arena_filled : arena_filled_mob

    this.coordAdjustment()
    this.players.forEach((player) => {
      this.setPlayerIconColor(player.id)
    })
    this.colorPlayers()
  }

  //all players coords adjustment for current device (which may change its orientation------------------

  coordAdjustment() {
    if (this.canvasScape !== this.orientation && this.canvasScape) {
      this.players.forEach((player) => {
        const y = player.y
        const initY = player.initY
        player.y = player.x
        player.initY = player.initX
        player.x = 350 - y
        player.initX = 350 - initY
        if (player.id === 5) {
          player.x = 378 - y
          player.initX = 378 - initY
        }
      })
      if (this.playerUndoList.length > 0) {
        this.playerUndoList.forEach((item) => {
          const y = item.prevY
          item.prevY = item.prevX
          item.prevX = 350 - y
          if (item.playerIndex === 5) {
            item.prevX = 378 - y
          }
        })
      }
      if (this.playerRedoList.length > 0) {
        this.playerRedoList.forEach((item) => {
          const y = item.nextY
          item.nextY = item.nextX
          item.nextX = 350 - y
          if (item.playerIndex === 5) {
            item.nextX = 378 - y
          }
        })
      }
      this.orientation = this.canvasScape
    }
    if (this.canvasScape !== this.orientation && !this.canvasScape) {
      this.players.forEach((player) => {
        const x = player.x
        const initX = player.initX
        player.x = player.y
        player.initX = player.initY
        player.y = 350 - x
        player.initY = 350 - initX
        if (player.id === 5) {
          player.y = 378 - x
          player.initY = 378 - initX
        }
      })
      if (this.playerUndoList.length > 0) {
        this.playerUndoList.forEach((item) => {
          const x = item.prevX
          item.prevX = item.prevY
          item.prevY = 350 - x
          if (item.playerIndex === 5) {
            item.prevY = 378 - x
          }
        })
      }
      if (this.playerRedoList.length > 0) {
        this.playerRedoList.forEach((item) => {
          const x = item.nextX
          item.nextX = item.nextY
          item.nextY = 350 - x
          if (item.playerIndex === 5) {
            item.nextY = 378 - x
          }
        })
      }
      this.orientation = this.canvasScape
    }
  }

  //current player coords adjustment upon receipt data from other devices (which may have vertical or horizontal orientation)

  currentCoordAdjustment(arenaOrientation, playerIndex, x, y) {
    if (!arenaOrientation && this.canvasScape) {
      const fy = y
      y = x
      x = 350 - fy
      if (playerIndex === 5) {
        x = 378 - fy
      }
    }
    if (arenaOrientation && !this.canvasScape) {
      const fx = x
      x = y
      y = 350 - fx
      if (playerIndex === 5) {
        y = 378 - fx
      }
    }
    return { x, y }
  }

  //define players state and sending to the new client--------------------------------------

  arenaStateResponse(msg) {
    let playersState = []
    
    this.players.forEach((player, index) => {
      if (player.selected) {
        playersState.push({
          playerIndex: index,
          x: player.x,
          y: player.y,
        })
      }
    })
    if (userState.socket) {
      userState.socket.send(
        JSON.stringify({
          method: 'arenares',
          id: userState.sessionid,
          nickname: userState.user.user_nickname,
          toUser: msg.nickname,
          arenaOrientation: this.canvasScape,
          playersState,
        })
      )
    }
    playersState = []
  }

  arenaSocketState(msg) {
    if (msg.playersState.length > 0) {
      this.players.forEach((player) => {
        player.selected = false
        player.x = player.initX
        player.y = player.initY
      })
      msg.playersState.forEach((state) => {
        const cca = this.currentCoordAdjustment(msg.arenaOrientation, state.playerIndex, state.x, state.y)
        this.players[state.playerIndex].selected = true
        this.players[state.playerIndex].x = cca.x
        this.players[state.playerIndex].y = cca.y
      })
    }
    this.players.forEach((player) => {
      this.setPlayerIconColor(player.id)
    })
    this.colorPlayers()
  }

  //handler of player selection with choice result broadcast through socket--------------------------------------------

  handlePlayerChoice(id) {
    this.players[id].selected = !this.players[id].selected
    this.players[id].x = this.players[id].initX
    this.players[id].y = this.players[id].initY
    if (userState.socket) {
      userState.socket.send(
        JSON.stringify({
          method: 'playerchoice',
          id: userState.sessionid,
          nickname: userState.user.user_nickname,
          playerId: id,
          selected: this.players[id].selected,
        })
      )
    } else {
      this.socketPlayerChoice(id, this.players[id].selected)
    }
  }

  //handler of receipt data of selected player from socket----------------------------

  socketPlayerChoice(id, selected) {
    this.players[id].selected = selected
    this.players[id].x = this.players[id].initX
    this.players[id].y = this.players[id].initY
    this.players.forEach((player) => {
      this.setPlayerIconColor(player.id)
    })
    this.colorPlayers()
  }

  //colorizing just selected player icon----------------------------------------------

  setPlayerIconColor(id) {
    const svgPlayer = document.getElementsByClassName(this.players[id].name)
    if (this.players[id].selected) {
      if (this.players[id].id < 5) {
        svgPlayer[0].attributes[2].value = this.leftTeamColor
        svgPlayer[1].attributes[2].value = this.leftTeamColor
      } else if (this.players[id].id === 5) {
        svgPlayer[0].attributes[2].value = '#050505'
        svgPlayer[1].attributes[2].value = '#050505'
      } else {
        svgPlayer[0].attributes[2].value = this.rightTeamColor
        svgPlayer[1].attributes[2].value = this.rightTeamColor
      }
    } else {
      svgPlayer[0].attributes[2].value = '#78909c'
      svgPlayer[1].attributes[2].value = '#78909c'
    }
  }

  //initial drawing all selected players using their icons if one just selected--------------------------

  colorPlayers() {
    this.topctx.clearRect(0, 0, this.topLayer.width, this.topLayer.height)
    this.players.forEach((player) => {
      if (player.selected) {
        const URL = window.URL || window.webkitURL || window
        const svgPlayer = document.getElementsByClassName(player.name)
        const clonedSvgPlayer = svgPlayer[0].cloneNode(true)
        const playerBlob = new Blob([clonedSvgPlayer.outerHTML], { type: 'image/svg+xml;charset=utf-8' })
        const playerBlobURL = URL.createObjectURL(playerBlob)
        player.img = new Image()
        player.img.onload = () => {
          this.topctx.drawImage(player.img, player.x, player.y)
        }
        player.img.src = playerBlobURL
      }
    })
  }

  //drawing all selected players if at least one are moving-------------------------------------

  drawPlayers() {
    this.topctx.clearRect(0, 0, this.topLayer.width, this.topLayer.height)
    this.players.forEach((player) => {
      if (player.selected) {
        this.topctx.drawImage(player.img, player.x, player.y)
        if (player.isDraggingBy) {
          this.topctx.fillText(player.isDraggingBy, player.x, player.y)
        }
      }
    })
  }

  //define coords for player grabbing------------------------------------------------------------------------

  playerTouch(x, y, player) {
    if (player.id !== 5) {
      if (x >= player.x && x <= player.x + 37 && y > player.y && y < player.y + 37 && player.selected) {
        return true
      }
    } else {
      if (x >= player.x - 15 && x <= player.x + 15 && y > player.y - 15 && y < player.y + 15 && player.selected) {
        return true
      }
    }
    return false
  }

  //receive pointer down event from client and grab current player-------------------------------------

  handlePointerDown(e) {
    if (e.isPrimary) {
      const x = e.pageX - e.target.offsetLeft
      const y = e.pageY - e.target.offsetTop
      this.draggingPlayerIndex = this.players.findIndex(
        (player) => this.playerTouch(x, y, player) && player.selected && !player.isDraggingBy
      )
      this.topLayer.releasePointerCapture(e.pointerId)
      if (this.draggingPlayerIndex !== -1) {
        if (userState.socket) {
          userState.socket.send(
            JSON.stringify({
              method: 'pointerdown',
              id: userState.sessionid,
              nickname: userState.user.user_nickname,
              arenaOrientation: this.canvasScape,
              pointerSet: {
                playerIndex: this.draggingPlayerIndex,
                x,
                y,
              },
            })
          )
        } else {
          this.handleSocketDown(this.canvasScape, userState.user.user_nickname, this.draggingPlayerIndex, x, y)
        }
      }
    }
  }

  //receive pointer down event from client and grab current player------------------------------

  handleSocketDown(arenaOrientation, nickname, playerIndex, x, y) {
    const cca = this.currentCoordAdjustment(arenaOrientation, playerIndex, x, y)
    this.players[playerIndex].isDraggingBy = nickname
    this.players[playerIndex].corX = cca.x - this.players[playerIndex].x
    this.players[playerIndex].corY = cca.y - this.players[playerIndex].y
    this.playerUndoList.push({ prevX: this.players[playerIndex].x, prevY: this.players[playerIndex].y, playerIndex })
  }

  //define new coords of current moving player and send they to the clients--------------------

  handlePointerMove(e) {
    if (e.isPrimary) {
      if (this.draggingPlayerIndex === -1) {
        return
      }
      const x = e.pageX - e.target.offsetLeft
      const y = e.pageY - e.target.offsetTop
      if (userState.socket) {
        userState.socket.send(
          JSON.stringify({
            method: 'pointermove',
            id: userState.sessionid,
            nickname: userState.user.user_nickname,
            arenaOrientation: this.canvasScape,
            playerSet: {
              playerIndex: this.draggingPlayerIndex,
              x,
              y,
            },
          })
        )
      } else {
        this.handleSocketMove(this.canvasScape, this.draggingPlayerIndex, x, y)
      }
    }
  }

  //receive new current player coords and handle its moving-----------------------------------------

  handleSocketMove(arenaOrientation, playerIndex, x, y) {
    const cca = this.currentCoordAdjustment(arenaOrientation, playerIndex, x, y)
    const startX = this.players[playerIndex].x
    const startY = this.players[playerIndex].y
    const dx = cca.x - this.players[playerIndex].corX - startX
    const dy = cca.y - this.players[playerIndex].corY - startY
    this.players[playerIndex].x += dx
    this.players[playerIndex].y += dy
    this.drawPlayers()
    this.drawPlayersTrack(playerIndex, startX, startY, dx, dy)
  }

  drawPlayersTrack(playerIndex, startX, startY, dx, dy) {
    this.lowctx.beginPath()
    this.lowctx.lineWidth = playerIndex !== 5 ? 4 : 2
    this.lowctx.strokeStyle = playerIndex < 5 ? this.leftTeamColor : playerIndex === 5 ? '#B0B0B0' : this.rightTeamColor
    this.lowctx.fillRect(0, 0, this.lowLayer.width, this.lowLayer.height)
    this.lowctx.moveTo(playerIndex !== 5 ? startX + 18 : startX + 3, playerIndex !== 5 ? startY + 31 : startY + 3)
    this.lowctx.lineTo(
      playerIndex !== 5 ? startX + dx + 18 : startX + dx + 3,
      playerIndex !== 5 ? startY + dy + 31 : startY + dy + 3
    )
    this.lowctx.stroke()
  }

  //pointer out event handler-----------------------------------------------------------

  handlePointerOut() {
    if (this.draggingPlayerIndex === -1) {
      return
    }
    this.handlePointerUp()
  }

  //pointer up event wich let off current player and send event to the clients--------------

  handlePointerUp() {
    if (this.draggingPlayerIndex === -1) {
      return
    }

    if (userState.socket) {
      userState.socket.send(
        JSON.stringify({
          method: 'pointerup',
          id: userState.sessionid,
          nickname: userState.user.user_nickname,
          playerIndex: this.draggingPlayerIndex,
        })
      )
    } else {
      this.handleSocketUp(this.draggingPlayerIndex)
    }
    this.draggingPlayerIndex = -1
  }

  //reseive pointer up event from client and handle pointer out---------------------------------------

  handleSocketUp(playerIndex) {
    this.players[playerIndex].isDraggingBy = ''
    this.players[playerIndex].corX = 0
    this.players[playerIndex].corY = 0
    this.arenaCleaning()
  }

  arenaCleaning() {
    this.arenaCleaner = new Image()
    this.arenaCleaner.onload = () => {
      this.arenaPattern = this.lowctx.createPattern(this.arenaCleaner, 'no-repeat')
      this.lowctx.fillStyle = this.arenaPattern
      this.lowctx.fillRect(0, 0, this.lowLayer.width, this.lowLayer.height)
      this.arenaPattern = this.lowctx.createPattern(this.arena, 'no-repeat')
      this.lowctx.fillStyle = this.arenaPattern
    }

    if (this.topLayer.width < this.topLayer.height) {
      this.arenaCleaner.src = arena_cleaner_mob
    } else {
      this.arenaCleaner.src = arena_cleaner
    }
  }

  undo() {
    if (this.playerUndoList.length > 0) {
      let playerUndo = this.playerUndoList.pop()
      this.playerRedoList.push({
        nextX: this.players[playerUndo.playerIndex].x,
        nextY: this.players[playerUndo.playerIndex].y,
        playerIndex: playerUndo.playerIndex,
      })
      this.players[playerUndo.playerIndex].x = playerUndo.prevX
      this.players[playerUndo.playerIndex].y = playerUndo.prevY
      this.drawPlayers()
    }
  }
  redo() {
    if (this.playerRedoList.length > 0) {
      let playerRedo = this.playerRedoList.pop()
      this.playerUndoList.push({
        prevX: this.players[playerRedo.playerIndex].x,
        prevY: this.players[playerRedo.playerIndex].y,
        playerIndex: playerRedo.playerIndex,
      })
      this.players[playerRedo.playerIndex].x = playerRedo.nextX
      this.players[playerRedo.playerIndex].y = playerRedo.nextY
      this.drawPlayers()
    }
  }
}
export default new TeamState()
