import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBucket } from '../context/BucketContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { wishlist, visited } = useBucket()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  if (!user) return null

  return (
    <nav className="navbar">
      <Link to="/explore" className="navbar-brand">
        <span className="brand-icon">✦</span>
        <span className="brand-name">WanderLog</span>
      </Link>

      <div className="navbar-center">
        <Link to="/explore" className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}>
          Explore
        </Link>
        <Link to="/bucket-list" className={`nav-link ${location.pathname === '/bucket-list' ? 'active' : ''}`}>
          My List
          {(wishlist.length + visited.length) > 0 && (
            <span className="nav-badge">{wishlist.length + visited.length}</span>
          )}
        </Link>
      </div>

      <div className="navbar-right">
        <div className="user-info">
          <div className="user-avatar">{user.email[0].toUpperCase()}</div>
          <span className="user-email text-sm">{user.email.split('@')[0]}</span>
        </div>
        <button className="btn btn-ghost" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </nav>
  )
}
