import React from "react"

import ToggleButton from "@mui/material/ToggleButton"
import IconButton from "@mui/material/IconButton"
import Collapse from "@mui/material/Collapse"
import Alert from "@mui/material/Alert"
import Tooltip from "@mui/material/Tooltip"
import MicIcon from "@mui/icons-material/Mic"
import CloseIcon from "@mui/icons-material/Close"
import Badge from "@mui/material/Badge"

import socket from "./store/socketState"

import { observer } from "mobx-react-lite"

export const WarningMic = (props) => {
  const { onopen, onclose } = props
  return (
    <Collapse in={onopen}>
      <Alert
        sx={{ paddingRight: 11 }}
        variant="filled"
        severity="warning"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              onclose(false)
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        Please connect to session first
      </Alert>
    </Collapse>
  )
}

export const AudioChat = observer(({ warning }) => {
  const handleAudioChat = async () => {
    if (!socket.isConnected) {
      warning(true)
      setTimeout(() => {
        warning(false)
      }, 3000)
      return
    }
    if (socket.isAudioChat) {
      socket.closeAudioChat()
      return
    }
    socket.send(
      JSON.stringify({
        method: "whoisaudio",
        session: socket.session,
        nickname: socket.nickname,
      })
    )
  }

  return (
    <Badge
      variant="dot"
      color="error"
      invisible={!socket.inAudio}
      sx={{
        "& .MuiBadge-badge": {
          right: 20,
          top: 5,
        },
      }}
    >
      <ToggleButton
        size="small"
        area-label="audio-chat"
        value={socket.isAudioChat}
        selected={socket.isAudioChat}
        sx={{
          mr: { xs: 0, sm: 2 },
          mb: { xs: 2, sm: 0 },
          width: "100%",
          color: "#78909c",
          border: "1px solid #78909c",
          "&:hover": { borderColor: "#546e7a", color: "#546e7a" },
          "&.Mui-selected": { color: "#087008" },
        }}
        onClick={handleAudioChat}
      >
        <Tooltip
          title={
            socket.isAudioChat ? "Disable voice chat" : "Enable voice chat"
          }
          arrow
        >
          <MicIcon />
        </Tooltip>
      </ToggleButton>
    </Badge>
  )
})
