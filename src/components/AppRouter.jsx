import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { observer } from "mobx-react-lite"

import Auth from "./Auth"
import Chat from "./Chat"
import Home from "./Home"
import Diagram from "./Diagram"
import userState from "./store/userState"

const AppRouter = observer(() => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/diagram"
        element={
          userState.isAuth ? <Diagram /> : <Navigate replace to="/auth" />
        }
      />
      <Route
        path="/chat"
        element={userState.isAuth ? <Chat /> : <Navigate replace to="/auth" />}
      />
    </Routes>
  )
})
export default AppRouter
