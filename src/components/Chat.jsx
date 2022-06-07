import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"
import Input from "@mui/material/Input"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import React from "react"
import socket from "./store/socketState"
import { observer } from "mobx-react-lite"

const Chat = observer(() => {
  const [value, setValue] = React.useState("")
  const messagesEndRef = React.useRef(null)

  const handleSubmit = () => {
    if (socket.wsocket) {
      socket.send(
        JSON.stringify({
          method: "chat",
          session: socket.session,
          nickname: socket.nickname,
          message: value,
          msgId: Date.now(),
        })
      )
    }
    setValue("")
  }

  React.useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  })

  return (
    <Container maxWidth="lg" sx={{ width: "100%", height: "70vh", mt: 2 }}>
      <Stack
        direction="column"
        sx={{
          backgroundColor: "rgba(0,0,50,0.5)",
          height: "100%",
          color: "lightgrey",
          overflowY: "auto",
        }}
      >
        {socket.messages.map((msg, index) => (
          <Stack
            direction="row"
            key={index}
            sx={{
              marginTop: "8px",
              fontSize: "14px",
              marginLeft: "10px",
            }}
          >
            {msg.nickname !== socket.nickname && msg.nickname}
            <Box
              key={msg.msgId}
              ml={1}
              sx={{
                overflowWrap: "break-word",
                padding: "5px",
                maxWidth: "70%",
                width: "fit-content",
                color: "primary",
                borderRadius: "6px",
                backgroundColor: "#505060",
                marginRight: "10px",
                marginLeft: msg.nickname === socket.nickname ? "auto" : "10px",
              }}
            >
              {msg.message}
            </Box>
          </Stack>
        ))}
        <Box ref={messagesEndRef} />
      </Stack>
      <Divider />
      <Stack
        component="form"
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundColor: "rgba(0,0,50,0.5)",
          height: "13%",
          color: "lightgrey",
        }}
      >
        <Input
          id="message-input"
          inputRef={(input) => {
            if (input != null) {
              input.focus()
            }
          }}
          disableUnderline
          type="text"
          autoFocus
          multiline
          maxRows={2}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          variant="outlined"
          label="Message"
          placeholder="Type message..."
          sx={{
            borderRadius: "5px",
            width: "70%",
            color: "white",
          }}
        />
        <Button
          sx={{ marginLeft: "10px" }}
          size="large"
          variant="contained"
          onClick={handleSubmit}
        >
          SEND
        </Button>
      </Stack>
    </Container>
  )
})

export default Chat
