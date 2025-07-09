"use client"

import React from "react"

import { useState } from "react"
import "./SignInForm.css"

interface SignInFormProps {
  onLogin: () => void
}

export default function SignInForm({ onLogin }: SignInFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Add your authentication logic here
    console.log("Sign in attempt:", { username, password })

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Call the onLogin function to switch to dashboard
      onLogin()
    }, 1000)
  }

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className={`signin-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}
