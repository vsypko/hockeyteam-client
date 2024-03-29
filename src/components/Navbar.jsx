import React from "react"
import { NavLink } from "react-router-dom"

import Box from "@mui/material/Box"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import Avatar from "@mui/material/Avatar"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ProfileDialog from "./profileDialog"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"

import logo from "../assets/team_logo.png"

import userState from "./store/userState"
import { observer } from "mobx-react-lite"

const Navbar = observer((props) => {
  const [openDrawer, setOpenDrawer] = React.useState(false)
  const [openProfileDialog, setOpenProfileDialog] = React.useState(false)
  const [userAbb, setUserAbb] = React.useState("")
  const [anchorEl, setAnchorEl] = React.useState(null)
  const openMenu = Boolean(anchorEl)

  React.useEffect(() => {
    if (userState.isAuth) {
      setUserAbb(userState.user.user_email.slice(0, 2).toUpperCase())
    }
    // eslint-disable-next-line
  }, [userState.user])

  const handleUserMenu = (e) => {
    setAnchorEl(e.currentTarget)
  }
  const handleProfileDialog = () => {
    setAnchorEl(null)
    setOpenProfileDialog(true)
  }
  const handleCloseUserMenu = () => {
    setAnchorEl(null)
  }
  const handleLogOut = () => {
    userState.logout()
    setAnchorEl(null)
  }

  return (
    <Box>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar disableGutters sx={{ boxShadow: "0 4px 5px gray" }}>
          <IconButton
            size="large"
            color="inherit"
            aria-label="menu"
            sx={{ ml: 1, display: { xs: "flex", sm: "none" } }}
            onClick={() => setOpenDrawer(!openDrawer)}
          >
            {openDrawer ? <CloseIcon fontSize="inherit" /> : <MenuIcon fontSize="inherit" />}
          </IconButton>
          <Drawer anchor="left" open={openDrawer} onClose={() => setOpenDrawer(false)}>
            <Toolbar />
            <List sx={{ fontSize: "20px" }}>
              <ListItemButton component={NavLink} to="/" onClick={() => setOpenDrawer(false)} color="inherit">
                DESCRIPTION
              </ListItemButton>
              <ListItemButton component={NavLink} to="/diagram" onClick={() => setOpenDrawer(false)} color="inherit">
                DIAGRAM
              </ListItemButton>
              <ListItemButton component={NavLink} to="/chat" onClick={() => setOpenDrawer(false)} color="inherit">
                CHAT INFO
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  props.onchange(!props.mode)
                  setOpenDrawer(false)
                }}
                color="inherit"
              >
                {!props.mode ? "DARK MODE" : "LIGHT MODE"}
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
            sx={{ textDecoration: "none", fontSize: 32, fontWeight: "bold" }}
          >
            HOCKEY TEAM
          </Typography>
          <Stack
            flexGrow={1}
            direction="row"
            spacing={8}
            sx={{
              display: { xs: "none", sm: "flex" },
              justifyContent: "center",
            }}
          >
            <Button
              component={NavLink}
              to="/"
              sx={{
                fontSize: "18px",
                color: "lightgrey",
                "&:hover": { color: "white" },
                "&.active": {
                  ontWeight: "bold",
                  textDecoration: "underline",
                  color: "white",
                },
              }}
            >
              DESCRIPTION
            </Button>

            <Button
              component={NavLink}
              to="/diagram"
              sx={{
                fontSize: "18px",
                color: "lightgrey",
                "&:hover": { color: "white" },
                "&.active": {
                  ontWeight: "bold",
                  textDecoration: "underline",
                  color: "white",
                },
              }}
            >
              DIAGRAM
            </Button>
            <Button
              component={NavLink}
              to="/chat"
              sx={{
                fontSize: "18px",
                color: "lightgrey",
                "&:hover": { color: "white" },
                "&.active": {
                  ontWeight: "bold",
                  textDecoration: "underline",
                  color: "white",
                },
              }}
            >
              CHAT INFO
            </Button>
          </Stack>
          <IconButton
            sx={{
              display: { xs: "none", sm: "flex" },
            }}
            size="large"
            onClick={() => props.onchange(!props.mode)}
          >
            {!props.mode ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
          <Stack justifyContent="flex-end">
            {!userState.isAuth ? (
              <IconButton
                sx={{
                  color: "lightgrey",
                  ml: 4,
                  "&:hover": { color: "white" },
                  "&.active": {
                    color: "white",
                  },
                }}
                size="large"
                component={NavLink}
                to="/auth"
              >
                <AccountCircleIcon fontSize="inherit" />
              </IconButton>
            ) : (
              <Box>
                <IconButton
                  aria-controls={openMenu ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openMenu ? "true" : undefined}
                  sx={{
                    color: "lightgrey",
                    ml: 4,
                    "&:hover": { color: "white" },
                    "&.active": {
                      color: "white",
                    },
                  }}
                  size="large"
                  onClick={handleUserMenu}
                >
                  <Avatar>{userAbb}</Avatar>
                </IconButton>
                <Menu id="account-menu" anchorEl={anchorEl} open={openMenu} onClose={handleCloseUserMenu}>
                  <MenuItem onClick={handleProfileDialog}>Profile</MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>My account</MenuItem>
                  <MenuItem component={NavLink} to="/" onClick={handleLogOut}>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <ProfileDialog onopen={openProfileDialog} onclose={setOpenProfileDialog} />
    </Box>
  )
})

export default Navbar
