import React from "react"

import Toolbar from "@mui/material/Toolbar"
import Stack from "@mui/material/Stack"
import Drawer from "@mui/material/Drawer"
import Button from "@mui/material/Button"
import ToggleButton from "@mui/material/ToggleButton"

import Box from "@mui/material/Box"
import UndoIcon from "@mui/icons-material/Undo"
import RedoIcon from "@mui/icons-material/Redo"
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact"

import Canvases from "./Canvases"
import Team from "./Team"
import teamState from "./store/teamState"
import userState from "./store/userState"
import Connection from "./Connection"
import { observer } from "mobx-react-lite"

const Diagram = observer(() => {
  const [leftcolor, setLeftcolor] = React.useState(teamState.leftTeamColor)
  const [rightcolor, setRightcolor] = React.useState(teamState.rightTeamColor)
  const [openConnectionDialog, setOpenConnectionDialog] = React.useState(false)

  const handleConnectionDialog = () => {
    if (userState.connected) {
      userState.setConnected(false)
    } else {
      setOpenConnectionDialog(true)
    }
  }

  const handleLeftColor = (color) => {
    setLeftcolor(color)
    teamState.setLeftTeamColor(color)
  }
  const handleRightColor = (color) => {
    setRightcolor(color)
    teamState.setRightTeamColor(color)
  }

  React.useEffect(() => {
    teamState.colorPlayers()
  }, [leftcolor])

  React.useEffect(() => {
    teamState.colorPlayers()
  }, [rightcolor])

  return (
    <Box className="main">
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
          <ToggleButton
            size="small"
            area-label="connection"
            value={userState.connected}
            selected={userState.connected}
            sx={{
              ml: 2,
              color: "#78909c",
              border: "1px solid #78909c",
              "&:hover": { borderColor: "#546e7a", color: "#546e7a" },
              "&.Mui-selected": { color: "#087008" },
            }}
            onClick={handleConnectionDialog}
          >
            <ConnectWithoutContactIcon />
          </ToggleButton>
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
      <Drawer
        sx={{
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

        <ToggleButton
          size="small"
          area-label="connection"
          value={userState.connected}
          selected={userState.connected}
          sx={{
            mt: 2,
            color: "#78909c",
            border: "1px solid #78909c",
            "&:hover": { borderColor: "#546e7a", color: "#546e7a" },
            "&.Mui-selected": { color: "#087008" },
          }}
          onClick={handleConnectionDialog}
        >
          <ConnectWithoutContactIcon />
        </ToggleButton>
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
