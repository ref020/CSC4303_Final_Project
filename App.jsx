import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './Login.jsx'
import Browse from './Browse.jsx'
import ConnectionCheck from './ConnectionCheck.jsx'
import Analytics from './Analytics.jsx'
import { getCurrentUser, clearCurrentUser, isAdmin } from './auth'

function Home() {
  return (
    <div>
      <h1>FlixNet</h1>
      <p>Welcome to FlixNet. Use the login page to authenticate, then browse movie links from the database.</p>
    </div>
  )
}

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    setCurrentUser(getCurrentUser())
  }, [])

  function handleLogout() {
    clearCurrentUser()
    setCurrentUser(null)
    window.location.href = '/'
  }

  return (
    <BrowserRouter>
      <nav style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        {!currentUser && <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>}
        <Link to="/browse" style={{ marginRight: '1rem' }}>Browse Movies</Link>
        <Link to="/check-connection" style={{ marginRight: '1rem' }}>Check Connection</Link>
        {isAdmin(currentUser) && (
          <Link to="/admin/analytics" style={{ marginRight: '1rem' }}>Admin Analytics</Link>
        )}
        {currentUser && (
          <button type="button" onClick={handleLogout} style={{ marginLeft: 'auto' }}>
            Logout
          </button>
        )}
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={setCurrentUser} />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/check-connection" element={<ConnectionCheck />} />
          <Route path="/admin/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}