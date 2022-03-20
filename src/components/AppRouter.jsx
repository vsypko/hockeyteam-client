import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Auth from './Auth'
import Chat from './Chat'
import Index from './Index'
import Diagram from './Diagram'

const AppRouter = () => {
  const user = true

  return (
    <Routes>
      <Route path="/" element={<Index/>} />
      <Route path="/auth" element={<Auth/>} />
      {user ? <Route path="/chat" element={<Chat />} /> : <Navigate replace to="/auth" />}
      {user ? <Route path="/diagram" element={<Diagram />} /> : <Navigate replace to="/auth" />}
    </Routes>
  )
}
export default AppRouter
