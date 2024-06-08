import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './components/AppRouter'
import CssBaseline from '@mui/material/CssBaseline'
import NavBar from './components/Navbar'
import './styles/app.scss'
import { observer } from 'mobx-react-lite'

import { ThemeProvider, createTheme } from '@mui/material/styles'

import { indigo } from '@mui/material/colors'

const App = observer(() => {
  const currentTheme = window.matchMedia('(prefers-color-scheme: dark)')

  const darkTheme = createTheme({
    palette: {
      primary: indigo,
      mode: 'dark',
    },
  })

  const lightTheme = createTheme({
    palette: {
      primary: indigo,
      mode: 'light',
    },
  })

  const [mode, setMode] = React.useState(currentTheme.matches)

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
