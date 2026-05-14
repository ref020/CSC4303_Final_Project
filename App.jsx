import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './Login.jsx'
import Browse from './Browse.jsx'
import ConnectionCheck from './ConnectionCheck.jsx'

function Home() {
  return (
    <div>
      <h1>FlixNet</h1>
      <p>Welcome to FlixNet. Use the login page to authenticate, then browse movie links from the database.</p>
    </div>
  )
}

export default function MyApp() {
  return (
    <BrowserRouter>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        <Link to="/browse" style={{ marginRight: '1rem' }}>Browse Movies</Link>
        <Link to="/check-connection" style={{ marginLeft: '1rem' }}>Check Connection</Link>
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/check-connection" element={<ConnectionCheck />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}