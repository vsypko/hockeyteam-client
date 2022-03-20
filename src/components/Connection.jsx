import React, { useEffect } from "react"
import userState from "./store/userState"
import teamState from "./store/teamState"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { observer } from "mobx-react-lite"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import { SOCKET_URL } from "../utils/consts"

const Connection = observer((props) => {
  useEffect(() => {
    if (userState.connected && !userState.socket) {
      const socket = new WebSocket(SOCKET_URL)
      userState.setSocket(socket)

      userState.socket.onopen = () => {
        userState.socket.send(
          JSON.stringify({
            method: "connection",
            id: userState.sessionid,
            nickname: userState.user.user_nickname,
          })
        )
      }

      userState.socket.onmessage = (e) => {
        let msg = JSON.parse(e.data)
        switch (msg.method) {
          case "connection":
            handleChat(msg)
            break
          case "chat":
            handleChat(msg)
            break
          case "arenareq":
            arenaReq(msg)
            break
          case "arenares":
            arenaRes(msg)
            break
          case "playerchoice":
            playerChoice(msg)
            break
          case "pointerdown":
            pointerDown(msg)
            break
          case "pointermove":
            pointerMove(msg)
            break
          case "pointerup":
            pointerUp(msg)
            break
          case "pointerout":
            pointerOut(msg)
            break
          default:
            console.log("Disconnected")
            break
        }
      }
    } else {
      if (!userState.connected && userState.socket) {
        userState.socket.close()
        userState.setSocket(null)
        userState.setUser({
          ...userState.user,
          user_nickname: "",
        })
        console.log(`Session ${userState.sessionid} closed`)
      }
    }

    // eslint-disable-next-line
  }, [userState.connected])

  const handleSubmit = () => {
    userState.setConnected(!userState.connected)
    props.onclose(false)
  }
  const handleChat = (msg) => {
    userState.setChatMessages(msg)
  }

  const arenaReq = (msg) => {
    teamState.arenaStateResponse(msg)
  }
  const arenaRes = (msg) => {
    teamState.arenaSocketState(msg)
  }
  const playerChoice = (msg) => {
    teamState.socketPlayerChoice(msg.playerId, msg.selected)
  }

  const pointerDown = (msg) => {
    teamState.handleSocketDown(
      msg.arenaOrientation,
      msg.nickname,
      msg.pointerSet.playerIndex,
      msg.pointerSet.x,
      msg.pointerSet.y
    )
  }

  const pointerMove = (msg) => {
    teamState.handleSocketMove(
      msg.arenaOrientation,
      msg.playerSet.playerIndex,
      msg.playerSet.x,
      msg.playerSet.y
    )
  }

  const pointerUp = (msg) => {
    teamState.handleSocketUp(msg.playerIndex)
  }
  const pointerOut = (msg) => {
    teamState.handleSocketOut(msg.playerIndex)
  }

  return (
    <Dialog
      open={props.onopen}
      onClose={() => props.onclose(false)}
      maxWidth="sm"
      sx={{
        "& .MuiPaper-root": {
          alignItems: "center",
        },
      }}
    >
      <DialogTitle>
        JOINT GAME CONNECTION
        <IconButton
          aria-label="close"
          onClick={() => props.onclose(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 10,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <DialogContentText mb={2} width="85%">
          To create joint game or connect to the mutual game, enter your
          nickname and session ID
        </DialogContentText>
        <TextField
          autoFocus
          onChange={(e) =>
            userState.setUser({
              ...userState.user,
              user_nickname: e.target.value,
            })
          }
          defaultValue={userState.user.user_nickname}
          variant="filled"
          label="Nickname"
          sx={{
            mb: 2,
            width: "85%",
          }}
        />
        <TextField
          onChange={(e) => userState.setSessionid(e.target.value)}
          variant="filled"
          label="Session id"
          sx={{
            width: "85%",
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>SUBMIT</Button>
      </DialogActions>
    </Dialog>
  )
})

export default Connection
