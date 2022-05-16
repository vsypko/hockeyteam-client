import React from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Slide from "@mui/material/Slide"
import CookieIcon from "@mui/icons-material/Cookie"
import Stack from "@mui/material/Stack"
import Divider from "@mui/material/Divider"
import DoneIcon from "@mui/icons-material/Done"

function CookieConsen(props) {
  const [agreed, setAgreed] = React.useState(false)
  const consent = React.useRef()

  const handleCookieConsent = () => {
    localStorage.setItem("cc", "concerted")
    setAgreed(true)
  }

  React.useEffect(() => {
    if (localStorage.getItem("cc") === "concerted") {
      setAgreed(true)
    }
  }, [])

  return (
    <Slide direction="right" in={!agreed} container={consent.current}>
      <Box
        ref={consent}
        sx={{
          position: "fixed",
          width: "22em",
          height: "auto",
          bottom: "5px",
          left: "5px",
          "& button": { m: 2 },
        }}
      >
        <Paper elevation={24} sx={{ opacity: 0.95 }}>
          <Stack
            direction="row"
            spacing={6}
            sx={{
              p: 1,

              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CookieIcon sx={{ fontSize: 40 }} />
            <Typography sx={{ fontSize: 24 }}>Cookie consent</Typography>
          </Stack>
          <Divider />
          <Typography
            sx={{ fontSize: "20px", textAlign: "left", ml: 2, mr: 2 }}
          >
            "Hockey Team" use the cookie only to keep you logged in. Any other
            personal information for ads or to perform analytics is not
            collected. Please, ensure your browser allows cookies.
          </Typography>
          <Stack direction="row-reverse">
            <Button
              spacing={2}
              variant="contained"
              size="large"
              onClick={handleCookieConsent}
            >
              <DoneIcon />
              OK
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Slide>
  )
}

export default CookieConsen
