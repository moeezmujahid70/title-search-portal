"use client"
import React from "react"
import { useState } from "react"
import "./Dashboard.css"

interface DashboardProps {
  onLogout: () => void
}

interface StockData {
  id: number
  symbol: string
  symbolNumber: string
  price: string
  balance: string
}

export default function Dashboard({ onLogout }: DashboardProps) {
  // Stock data in state
  const [stockData, setStockData] = useState<StockData[]>([
    {
      id: 1,
      symbol: "AAPL",
      symbolNumber: "3632",
      price: "220.73 USD",
      balance: "44.3 M",
    },
    {
      id: 2,
      symbol: "GOOGL",
      symbolNumber: "4521",
      price: "2,845.32 USD",
      balance: "12.8 M",
    },
    {
      id: 3,
      symbol: "TSLA",
      symbolNumber: "7890",
      price: "189.56 USD",
      balance: "8.9 M",
    },
    {
      id: 4,
      symbol: "MSFT",
      symbolNumber: "2341",
      price: "415.89 USD",
      balance: "25.7 M",
    },
    {
      id: 5,
      symbol: "AMZN",
      symbolNumber: "5678",
      price: "3,127.45 USD",
      balance: "18.4 M",
    },
    {
      id: 6,
      symbol: "META",
      symbolNumber: "9012",
      price: "298.73 USD",
      balance: "15.2 M",
    },
    {
      id: 7,
      symbol: "NVDA",
      symbolNumber: "3456",
      price: "892.14 USD",
      balance: "31.6 M",
    },
    {
      id: 8,
      symbol: "NFLX",
      symbolNumber: "7891",
      price: "456.82 USD",
      balance: "9.3 M",
    },
  ])

  // Function to add new stock (example usage)
  const addStock = (newStock: Omit<StockData, "id">) => {
    const id = Math.max(...stockData.map((stock) => stock.id)) + 1
    setStockData([...stockData, { ...newStock, id }])
  }

  // Function to remove stock (example usage)
  const removeStock = (id: number) => {
    setStockData(stockData.filter((stock) => stock.id !== id))
  }

  // Function to update stock (example usage)
  const updateStock = (id: number, updatedStock: Partial<StockData>) => {
    setStockData(stockData.map((stock) => (stock.id === id ? { ...stock, ...updatedStock } : stock)))
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
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-left">
              <h2 className="watchlist-title">Watchlist</h2>
              <p className="last-updated">Updated At 20/04/2025 At 4:30 PM</p>
            </div>
            <div className="header-right">
              <div className="search-container">
                <input type="text" placeholder="Search..." className="search-input" />
                <div className="search-icon">🔍</div>
              </div>
            </div>
          </div>

          {/* Watchlist Table */}
          <div className="watchlist-container">
            <div className="table-header">
              <div className="header-symbol">Symbol ({stockData.length})</div>
              <div className="header-price">Price</div>
              <div className="header-balance">Balance</div>
            </div>

            <div className="table-body">
              {stockData.map((stock) => (
                <div key={stock.id} className="table-row">
                  <div className="cell-symbol">
                    <span className="symbol-code">{stock.symbol}</span>
                  </div>
                  <div className="cell-price">{stock.price}</div>
                  <div className="cell-balance">{stock.balance}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
