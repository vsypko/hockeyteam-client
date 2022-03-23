import React, { useEffect } from "react"
import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"

import teamState from "./store/teamState"

import { observer } from "mobx-react-lite"
import { SvgIcon } from "@mui/material"

const Team = observer((props) => {
  useEffect(() => {
    if (teamState.topLayer) {
      teamState.players.forEach((player) => {
        teamState.setPlayerIconColor(player.id)
      })
      teamState.colorPlayers()
    }
  }, [props.leftcolor, props.rightcolor])

  const handleChoice = (id) => {
    teamState.handlePlayerChoice(id)
  }

  return (
    <Stack direction={{ xs: "column", sm: "row" }}>
      {teamState.players.map((player) => (
        <ToggleButton
          size="small"
          key={player.id}
          selected={player.selected}
          value={player.id}
          aria-label={player.name}
          onClick={() => {
            handleChoice(player.id)
          }}
          sx={{
            ml: player.id === 5 ? { xs: 0, sm: 1 } : { xs: 0, sm: 0 },
            mr: player.id === 5 ? { xs: 0, sm: 1 } : { xs: 0, sm: 0 },
            mb: player.id === 5 ? { xs: 1, sm: 0 } : { xs: 0, sm: 0 },
            mt: player.id === 5 ? { xs: 1, sm: 0 } : { xs: 0, sm: 0 },
            borderColor: "#78909c",
            color: "#78909c",
            "&:hover": { color: "#546e7a" },
            fontSize: 12,
            "&.Mui-selected":
              player.id < 5
                ? { color: props.leftcolor }
                : player.id === 5
                ? { color: "#050505" }
                : { color: props.rightcolor },
          }}
        >
          {player.id !== 5 && player.name}
          <SvgIcon viewBox={player.id !== 5 ? "0 0 34 34" : "0 0 8 8"}>
            <player.Player />
          </SvgIcon>
        </ToggleButton>
      ))}
    </Stack>
  )
})
export default Team
