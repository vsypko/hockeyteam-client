import React from "react"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import TextField from "@mui/material/TextField"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Divider from "@mui/material/Divider"

import CloseIcon from "@mui/icons-material/Close"
import userState from "./store/userState"
import { observer } from "mobx-react-lite"

const ProfileDialog = observer((props) => {
  const { onopen, onclose } = props
  const handleClose = () => {
    onclose(false)
  }

  return (
    <Dialog open={onopen} onClose={() => onclose(false)}>
      <DialogTitle>
        EXISTED USER DATA
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
      <DialogContent>
        <DialogContentText m={1}>
          Your ID: {userState.user.user_id}
        </DialogContentText>
        <Divider />
        <DialogContentText m={1}>
          Email: {userState.user.user_email}
        </DialogContentText>
        <Divider />
        <DialogContentText m={1}>
          Nickname:{" "}
          {userState.user.user_nickname
            ? userState.user.user_nickname
            : "You haven't entered your nickname yet. You can enter nicname here:"}
        </DialogContentText>
        <Divider />
        <TextField
          defaultValue={userState.user.user_nickname}
          autoFocus
          margin="dense"
          id="nickname"
          label="Nickname"
          type="text"
          fullWidth
          variant="standard"
          onChange={(e) =>
            userState.setUser({
              ...userState.user,
              user_nickname: e.target.value,
            })
          }
        />
        <DialogContentText m={1}>
          Team player status:{" "}
          {userState.user.user_player
            ? "player"
            : "You are not a player. Please ask an admin to change your status."}
        </DialogContentText>
        <Divider />
        <DialogContentText m={1}>
          Activated: {userState.user.user_activated ? "yes" : "no"}
        </DialogContentText>
        <Divider />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Save</Button>
      </DialogActions>
    </Dialog>
  )
})

export default ProfileDialog
