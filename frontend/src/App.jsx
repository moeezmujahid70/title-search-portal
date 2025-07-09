"use client"

import { useState, useEffect } from "react"
import SignInForm from "./components/SignInForm"
import Dashboard from "./components/Dashboard"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing token on app load
  useEffect(() => {
    const checkAuthToken = () => {
      const token = localStorage.getItem("authToken")

      if (token) {
        setIsLoggedIn(true)
        console.log("Auto-login: Valid token found")
      }

      setIsLoading(false)
    }

    checkAuthToken()
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    // Clear localStorage on logout
    localStorage.removeItem("authToken")
    localStorage.removeItem("username")
    localStorage.removeItem("loginTime")

    setIsLoggedIn(false)
    console.log("Logged out: localStorage cleared")
  }

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    )
  }

  return (
    <div className="App">
      {isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <SignInForm onLogin={handleLogin} />}
    </div>
  )
}

export default App
