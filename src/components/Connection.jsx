import React from "react"

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
import socket from "./store/socketState"

const Connection = observer((props) => {
  const { onopen, onclose } = props

  const handleSubmit = () => {
    socket.setSocket(onclose)
  }

  return (
    <Dialog
      open={onopen}
      onClose={() => onclose(false)}
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
          onClick={() => onclose(false)}
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
          onChange={(e) => socket.setNickname(e.target.value)}
          defaultValue={socket.nickname}
          variant="filled"
          label="Nickname"
          error={socket.errorConnection}
          helperText={socket.serverMsg}
          sx={{
            mb: 2,
            width: "85%",
          }}
        />

        <TextField
          onChange={(e) => socket.setSession(e.target.value)}
          variant="filled"
          label="Session"
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
