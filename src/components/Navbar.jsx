import React from 'react'
import { NavLink } from 'react-router-dom'

import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'

import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

import logo from '../assets/team_logo.png'

import { observer } from 'mobx-react-lite'

const Navbar = observer((props) => {
  const [openDrawer, setOpenDrawer] = React.useState(false)
  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar disableGutters sx={{ boxShadow: '0 4px 5px gray' }}>
          <IconButton
            size="large"
            color="inherit"
            aria-label="menu"
            sx={{ ml: 1, display: { xs: 'flex', sm: 'none' } }}
            onClick={() => setOpenDrawer(!openDrawer)}
          >
            {openDrawer ? (
              <CloseIcon fontSize="inherit" />
            ) : (
              <MenuIcon fontSize="inherit" />
            )}
          </IconButton>
          <Drawer
            anchor="left"
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
          >
            <Toolbar />
            <List sx={{ fontSize: '20px' }}>
              <ListItemButton
                component={NavLink}
                to="/"
                onClick={() => setOpenDrawer(false)}
                color="inherit"
              >
                DESCRIPTION
              </ListItemButton>
              <ListItemButton
                component={NavLink}
                to="/diagram"
                onClick={() => setOpenDrawer(false)}
                color="inherit"
              >
                DIAGRAM
              </ListItemButton>
              <ListItemButton
                component={NavLink}
                to="/chat"
                onClick={() => setOpenDrawer(false)}
                color="inherit"
              >
                CHAT INFO
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  props.onchange(!props.mode)
                  setOpenDrawer(false)
                }}
                color="inherit"
              >
                {!props.mode ? 'DARK MODE' : 'LIGHT MODE'}
              </ListItemButton>
            </List>
          </Drawer>
          <Box ml={1} mr={2}>
            <img src={logo} alt="logo" loading="lazy" className="logo"></img>
          </Box>

          <Typography
            noWrap
            color="inherit"
            to="/"
            component={NavLink}
            sx={{ textDecoration: 'none', fontSize: 32, fontWeight: 'bold' }}
          >
            HOCKEY TEAM
          </Typography>
          <Stack
            flexGrow={1}
            direction="row"
            spacing={8}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              justifyContent: 'center',
            }}
          >
            <Button
              component={NavLink}
              to="/"
              sx={{
                fontSize: '18px',
                color: 'lightgrey',
                '&:hover': { color: 'white' },
                '&.active': {
                  ontWeight: 'bold',
                  textDecoration: 'underline',
                  color: 'white',
                },
              }}
            >
              DESCRIPTION
            </Button>

            <Button
              component={NavLink}
              to="/diagram"
              sx={{
                fontSize: '18px',
                color: 'lightgrey',
                '&:hover': { color: 'white' },
                '&.active': {
                  ontWeight: 'bold',
                  textDecoration: 'underline',
                  color: 'white',
                },
              }}
            >
              DIAGRAM
            </Button>
            <Button
              component={NavLink}
              to="/chat"
              sx={{
                fontSize: '18px',
                color: 'lightgrey',
                '&:hover': { color: 'white' },
                '&.active': {
                  ontWeight: 'bold',
                  textDecoration: 'underline',
                  color: 'white',
                },
              }}
            >
              CHAT INFO
            </Button>
          </Stack>
          <IconButton
            sx={{
              display: { xs: 'none', sm: 'flex' },
            }}
            size="large"
            onClick={() => props.onchange(!props.mode)}
          >
            {!props.mode ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
          <Stack justifyContent="flex-end">
            <IconButton disabled size="large">
              <AccountCircleIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  )
})

export default Navbar
