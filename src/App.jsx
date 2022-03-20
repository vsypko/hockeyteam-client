import React from "react"
import { BrowserRouter } from "react-router-dom"
import AppRouter from "./components/AppRouter"
import CssBaseline from "@mui/material/CssBaseline"
import NavBar from "./components/Navbar"
import "./styles/app.scss"
import { observer } from "mobx-react-lite"

import { ThemeProvider, createTheme } from "@mui/material/styles"
import userState from "./components/store/userState"

const App = observer(() => {
  const currentTheme = window.matchMedia("(prefers-color-scheme: dark)")
  const darkTheme = createTheme({ palette: { mode: "dark" } })
  const lightTheme = createTheme({ palette: { mode: "light" } })
  const [mode, setMode] = React.useState(currentTheme.matches)

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      userState.checkAuth()
    }
  }, [])
  return (
    <ThemeProvider theme={mode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar mode={mode} onchange={setMode} />
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  )
})
export default App
