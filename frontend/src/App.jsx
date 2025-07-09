"use client"

import { useState } from "react"
import {Signin, Dashboard} from "./components"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <div className="App">
      {isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Signin onLogin={handleLogin} />}
    </div>
  )
}

export default App
