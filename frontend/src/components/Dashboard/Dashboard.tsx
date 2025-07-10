"use client"
import React from "react"
import { useState, useRef, useEffect } from "react"
import { getApiWithAuth } from "../../utils/api"
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
  // Certificate data in state - start with empty array
  const [certificateData, setCertificateData] = useState<CertificateData[]>([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  const [statusFilter, setStatusFilter] = useState<string>("all")
  const filteredCertificateData = certificateData.filter((cert) => {
    if (statusFilter === "all") return true
    return cert.status.toLowerCase().replace(" ", "-") === statusFilter
  })

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
    // Get certificate list on component mount
    getCertificateList(1)
  }, [])

  const getCertificateList = async (page = 1) => {
    try {
      setLoading(true)
      const response = await getApiWithAuth(`certificates/?limit=8&page=${page}`)
      console.log("=====get certificate list", `certificates/?limit=8&page=${page}` , response.data.data.data)
      setTotalPages(response.data.data.data.pages)
      setCurrentPage(page)

      // Populate the certificateData array with API response
      const apiResults = response.data.data.data.results

      // Map the API data to match our interface structure
      const mappedData = apiResults.map((item: any, index: number) => ({
        id: item.id || (page - 1) * 8 + index + 1,
        certNumber: item.certNumber || item.certificate_number || item.cert_number || `N/A`,
        county: item.county || item.county_name || `N/A`,
        status: item.status || item.certificate_status || `Unknown`,
      }))

      setCertificateData(mappedData)
    } catch (error) {
      console.error("Error fetching certificates:", error)
      // Keep empty array on error
      setCertificateData([])
    } finally {
      setLoading(false)
    }
  }

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getCertificateList(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      getCertificateList(currentPage - 1)
    }
  }

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      getCertificateList(page)
    }
  }

// Generate page numbers for pagination
const getPageNumbers = () => {
  const pages: (number | string)[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    // Show all pages if total pages is less than max visible
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show pages with ellipsis logic
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
  }

  return pages;
};
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
              <div className="search-filter-container">
                <div className="search-container">
                  <input type="text" placeholder="Search..." className="search-input" />
                  <div className="search-icon">🔍</div>
                </div>
                <div className="filter-container">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Status</option>
                    <option value="in-process">In Process</option>
                    <option value="ready">Ready</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Table */}
          <div className="watchlist-container">
            <div className="table-header">
              <div className="header-cert">Cert Number ({filteredCertificateData.length})</div>
              <div className="header-county">County</div>
              <div className="header-status">Status</div>
            </div>

            <div className="table-body">
              {loading ? (
                <div className="loading-container">
                  <p>Loading certificates...</p>
                </div>
              ) : filteredCertificateData.length > 0 ? (
                filteredCertificateData.map((cert) => (
                  <div key={cert.id} className="table-row">
                    <div className="cell-cert">
                      <span className="cert-number">{cert.certNumber}</span>
                    </div>
                    <div className="cell-county">{cert.county}</div>
                    <div className="cell-status">
                      <span className={`status-badge ${cert.status.toLowerCase().replace(" ", "-")}`}>
                        {cert.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data-container">
                  <p>No certificates found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                <div className="pagination-controls">
                  <button className="pagination-btn" onClick={handlePrevPage} disabled={currentPage === 1 || loading}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15,18 9,12 15,6"></polyline>
                    </svg>
                    Previous
                  </button>

                  <div className="page-numbers">
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        className={`page-number ${page === currentPage ? "active" : ""} ${page === "..." ? "ellipsis" : ""}`}
                        onClick={() => typeof page === "number" && handlePageClick(page)}
                        disabled={page === "..." || loading}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    className="pagination-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || loading}
                  >
                    Next
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
