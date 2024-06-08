import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import Chat from './Chat'
import Home from './Home'
import Diagram from './Diagram'

const AppRouter = observer(() => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/diagram" element={<Diagram />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  )
})
export default AppRouter
