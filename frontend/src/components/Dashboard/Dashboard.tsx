"use client"
import React from "react"
import { useState, useRef, useEffect } from "react"
import "./Dashboard.css"

interface DashboardProps {
  onLogout: () => void
}

interface CertificateData {
  id: number
  certNumber: string
  county: string
  status: string
}

export default function Dashboard({ onLogout }: DashboardProps) {
  // Certificate data in state
  const [certificateData, setCertificateData] = useState<CertificateData[]>([
    {
      id: 1,
      certNumber: "2023-C-000035",
      county: "Logan",
      status: "In process",
    },
    {
      id: 2,
      certNumber: "2023-C-000174",
      county: "Logan",
      status: "In process",
    },
    {
      id: 3,
      certNumber: "2022-C-000174",
      county: "wood",
      status: "Ready",
    },
  ])

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [username, setUsername] = useState("Admin")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  const handleLogout = () => {
    setDropdownOpen(false)
    onLogout()
  }

  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [])

  // Function to add new certificate (example usage)
  const addCertificate = (newCert: Omit<CertificateData, "id">) => {
    const id = Math.max(...certificateData.map((cert) => cert.id)) + 1
    setCertificateData([...certificateData, { ...newCert, id }])
  }

  // Function to remove certificate (example usage)
  const removeCertificate = (id: number) => {
    setCertificateData(certificateData.filter((cert) => cert.id !== id))
  }

  // Function to update certificate (example usage)
  const updateCertificate = (id: number, updatedCert: Partial<CertificateData>) => {
    setCertificateData(certificateData.map((cert) => (cert.id === id ? { ...cert, ...updatedCert } : cert)))
  }

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <h1 className="logo">Logo</h1>
          </div>
          <div className="navbar-right">
            <div className="user-dropdown" ref={dropdownRef}>
              <button className="user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="user-avatar">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="username-text">{username}</span>
                <span className={`dropdown-arrow ${dropdownOpen ? "open" : ""}`}>▼</span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleLogout}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16,17 21,12 16,7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-left">
              <h2 className="watchlist-title">Certificates</h2>
              <p className="last-updated">Updated At 20/04/2025 At 4:30 PM</p>
            </div>
            <div className="header-right">
              <div className="search-container">
                <input type="text" placeholder="Search..." className="search-input" />
                <div className="search-icon">🔍</div>
              </div>
            </div>
          </div>

          {/* Certificate Table */}
          <div className="watchlist-container">
            <div className="table-header">
              <div className="header-cert">Cert Number ({certificateData.length})</div>
              <div className="header-county">County</div>
              <div className="header-status">Status</div>
            </div>

            <div className="table-body">
              {certificateData.map((cert) => (
                <div key={cert.id} className="table-row">
                  <div className="cell-cert">
                    <span className="cert-number">{cert.certNumber}</span>
                  </div>
                  <div className="cell-county">{cert.county}</div>
                  <div className="cell-status">
                    <span className={`status-badge ${cert.status.toLowerCase().replace(" ", "-")}`}>{cert.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
