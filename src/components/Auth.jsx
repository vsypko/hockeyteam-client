import React from "react"
import { Navigate } from "react-router-dom"
import GoogleLogin from "react-google-login"
import IconGoogle from "./SvgGoogle"
import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"

import userState from "./store/userState"
import api from "../http/index.js"
import { observer } from "mobx-react-lite"

const Auth = observer(() => {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const [login, setLogin] = React.useState(true)
  const descriptionText = login ? "Don't have an account?" : "Have an account?"

  const authHandler = async (action, email, password) => {
    try {
      const response = await api.post(action, { email, password })
      userState.setAuth(true)
      setError("")
      localStorage.setItem("token", response.data.accessToken)
      userState.setUser(response.data.user)
    } catch (e) {
      setError(e.response?.data?.message)
      console.log(e.response)
    }
  }

  const handleSubmit = async () => {
    if (login) {
      await authHandler("/login", email, password)
    } else {
      await authHandler("/registration", email, password)
    }
  }

  const responseGoogle = (response) => {
    console.log(response)
  }

  if (userState.isAuth) {
    return <Navigate replace to="/diagram" />
  }

  return (
    <Container
      component="main"
      noValidate
      fixed
      maxWidth="sm"
      sx={{ height: "80vh", mt: 2 }}
    >
      <Stack
        component="form"
        value={userState.isAuth}
        direction="column"
        spacing={2}
        alignItems="center"
        sx={{
          backgroundColor: "rgba(0,0,50,0.1)",
          height: "100%",
          color: "primary",
        }}
      >
        <Typography mt={2}>{login ? "LOG IN" : "SIGN UP"}</Typography>
        <Typography color="error" mt={2}>
          {error}
        </Typography>
        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          variant="filled"
          label="email"
          error={!!(error && error)}
          sx={{
            width: "80%",
            backgroundColor: "rgba(0,0,40,0.05)",
          }}
        />
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          variant="filled"
          label="password"
          error={!!(error && error)}
          sx={{
            width: "80%",
            backgroundColor: "rgba(0,0,40,0.05)",
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          sx={{ width: "80%" }}
          onClick={handleSubmit}
          variant="contained"
        >
          {login ? "LOG IN" : "SIGN UP"}
        </Button>
        <Typography>
          {descriptionText}
          <Button
            onClick={() => setLogin(!login)}
            sx={{ textTransform: "none", outline: "none" }}
          >
            {login ? "Sign up?" : "Log in?"}
          </Button>
        </Typography>
        <Typography>OR</Typography>

        <GoogleLogin
          clientId="723906188335-js8s27s5k9rhq018nmcfrnhflv474dlb.apps.googleusercontent.com"
          render={(renderProps) => (
            <Button
              onClick={renderProps.onClick}
              variant="contained"
              startIcon={<IconGoogle />}
              sx={{ width: "80%" }}
            >
              AUTHENTICATE WITH A GOOGLE ACCOUNT
            </Button>
          )}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      </Stack>
    </Container>
  )
})

export default Auth
