import React from "react"

import Toolbar from "@mui/material/Toolbar"
import Stack from "@mui/material/Stack"
import Drawer from "@mui/material/Drawer"
import Button from "@mui/material/Button"
import ToggleButton from "@mui/material/ToggleButton"
import Tooltip from "@mui/material/Tooltip"
import Badge from "@mui/material/Badge"

import Box from "@mui/material/Box"
import UndoIcon from "@mui/icons-material/Undo"
import RedoIcon from "@mui/icons-material/Redo"
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact"

import Canvases from "./Canvases"
import Team from "./Team"
import teamState from "./store/teamState"
import socket from "./store/socketState"
import Connection from "./Connection"
import { WarningMic, AudioChat } from "./AudioChat"
import { observer } from "mobx-react-lite"

const Diagram = observer(() => {
  const [leftcolor, setLeftcolor] = React.useState(teamState.leftTeamColor)
  const [rightcolor, setRightcolor] = React.useState(teamState.rightTeamColor)
  const [openConnectionDialog, setOpenConnectionDialog] = React.useState(false)
  const [openAlert, setOpenAlert] = React.useState(false)

  const handleConnectionDialog = () => {
    if (socket.isConnected) {
      socket.socketClose()
    } else {
      setOpenConnectionDialog(true)
    }
  }

  const handleLeftColor = (color) => {
    setLeftcolor(color)
    teamState.setLeftTeamColor(color)
    teamState.colorPlayers()
  }
  const handleRightColor = (color) => {
    setRightcolor(color)
    teamState.setRightTeamColor(color)
    teamState.colorPlayers()
  }

  return (
    <Box className="main">
      <WarningMic onopen={openAlert} onclose={setOpenAlert} />
      <Stack direction="row">
        <Toolbar
          variant="dense"
          sx={{
            backgroundColor: "#eceff1",
            display: { xs: "none", sm: "flex" },
            width: "100%",
            boxShadow: "0 4px 5px gray",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            type="color"
            onChange={(e) => handleLeftColor(e.target.value)}
            value={leftcolor}
          />
          <Team leftcolor={leftcolor} rightcolor={rightcolor} />
          <input
            type="color"
            onChange={(e) => handleRightColor(e.target.value)}
            value={rightcolor}
          />
          <Badge
            badgeContent={socket.countConnected}
            color="success"
            sx={{
              "& .MuiBadge-badge": {
                right: 5,
                top: 8,
              },
            }}
          >
            <ToggleButton
              size="small"
              area-label="connection"
              value={socket.isConnected}
              selected={socket.isConnected}
              sx={{
                ml: 2,
                color: "#78909c",
                border: "1px solid #78909c",
                "&:hover": { borderColor: "#546e7a", color: "#546e7a" },
                "&.Mui-selected": { color: "#087008" },
              }}
              onClick={handleConnectionDialog}
            >
              <Tooltip
                title={
                  socket.isConnected
                    ? "Disconnect from a session"
                    : "Connect to session"
                }
                arrow
              >
                <ConnectWithoutContactIcon />
              </Tooltip>
            </ToggleButton>
          </Badge>

          <AudioChat warning={setOpenAlert} />

          <Button
            area-label="undo"
            sx={{
              border: "1px solid #78909c",
              color: "#78909c",
              "&:hover": { borderColor: "#546e7a", color: "#546e7a" },
            }}
            onClick={() => teamState.undo()}
          >
            <UndoIcon />
          </Button>
          <Button
            area-label="redo"
            sx={{
              border: "1px solid #78909c",
              color: "#78909c",
              "&:hover": { borderColor: "#546e7a", color: "#546e7a" },
            }}
            onClick={() => teamState.redo()}
          >
            <RedoIcon />
          </Button>
        </Toolbar>
      </Stack>

      <Canvases />
      {/* 
-------------------------------DROWER------------------------------------------------
      */}

      <Drawer
        sx={{
          mt: 50,
          display: { xs: "flex", sm: "none" },
          backgroundColor: "#eceff1",
          justifyContent: "center",
          alignItems: "center",
        }}
        variant="permanent"
        anchor="right"
      >
        <Toolbar />

        <input
          type="color"
          onChange={(e) => handleLeftColor(e.target.value)}
          value={leftcolor}
        />
        <Team leftcolor={leftcolor} rightcolor={rightcolor} />

        <input
          type="color"
          onChange={(e) => handleRightColor(e.target.value)}
          value={rightcolor}
        />
        <Badge
          badgeContent={socket.countConnected}
          color="success"
          sx={{
            "& .MuiBadge-badge": {
              right: 10,
              top: 20,
            },
          }}
        >
          <ToggleButton
            size="small"
            area-label="connection"
            value={socket.isConnected}
            selected={socket.isConnected}
            sx={{
              mt: 2,
              width: "100%",
              color: "#78909c",
              border: "1px solid #78909c",
              "&:hover": { borderColor: "#546e7a", color: "#546e7a" },
              "&.Mui-selected": { color: "#087008" },
            }}
            onClick={handleConnectionDialog}
          >
            <ConnectWithoutContactIcon />
          </ToggleButton>
        </Badge>

        <AudioChat warning={setOpenAlert} />

        <Button
          area-label="undo"
          sx={{
            border: "1px solid #78909c",
            color: "#78909c",
            "&:hover": { borderColor: "#546e7a", color: "#546e7a" },
          }}
          onClick={() => teamState.undo()}
        >
          <UndoIcon />
        </Button>
        <Button
          area-label="redo"
          sx={{
            color: "#78909c",
            border: "1px solid #78909c",
            "&:hover": { borderColor: "#546e7a", color: "#546e7a" },
          }}
          onClick={() => teamState.redo()}
        >
          <RedoIcon />
        </Button>
      </Drawer>

      <Connection
        onopen={openConnectionDialog}
        onclose={setOpenConnectionDialog}
      />
    </Box>
  )
})

export default Diagram
