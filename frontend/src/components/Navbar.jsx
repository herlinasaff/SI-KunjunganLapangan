import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import SambangLogo from './SambangLogo'
import './Navbar.css'

function Navbar({ onOpenSearch }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [showMasterDropdown, setShowMasterDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const role = user?.role || 'admin'
  const nama = user?.nama || (role === 'admin' ? 'Siti Rahayu' : 'Andi Pratama')
  const roleLabel = role === 'admin' ? 'Administrator' : 'Petugas'

  return (
    <>
      <header className="sambang-top-navbar">
        <div className="navbar-container">
          {/* Brand Logo */}
          <Link to="/dashboard" className="sambang-brand">
            <div className="sambang-logo-box sm on-light">
              <SambangLogo />
            </div>
            <div className="sambang-brand-copy">
              <span className="sambang-brand-name">RuteKu</span>
            </div>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="navbar-nav-links">
            <Link
              to="/dashboard"
              className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>

            <Link
              to="/kunjungan"
              className={`nav-item ${location.pathname === '/kunjungan' ? 'active' : ''}`}
            >
              Daftar Kunjungan
            </Link>

            <Link
              to="/klien"
              className={`nav-item ${location.pathname === '/klien' ? 'active' : ''}`}
            >
              Kelola Klien
            </Link>

            {role === 'admin' && (
              <div className="nav-dropdown-wrap">
                <button
                  type="button"
                  onClick={() => setShowMasterDropdown((prev) => !prev)}
                  className={`nav-item dropdown-btn ${
                    ['/jenis-layanan', '/kualifikasi', '/petugas'].includes(location.pathname) ? 'active' : ''
                  }`}
                >
                  <span>Master Data</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {showMasterDropdown && (
                  <div className="nav-dropdown-menu" onMouseLeave={() => setShowMasterDropdown(false)}>
                    <Link to="/jenis-layanan" onClick={() => setShowMasterDropdown(false)}>
                      Jenis Layanan
                    </Link>
                    <Link to="/kualifikasi" onClick={() => setShowMasterDropdown(false)}>
                      Kualifikasi
                    </Link>
                    <Link to="/petugas" onClick={() => setShowMasterDropdown(false)}>
                      Kelola Petugas
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right Section: Search, Bell & User Profile */}
          <div className="navbar-right-items">
            <button
              type="button"
              onClick={onOpenSearch}
              className="nav-icon-btn"
              title="Cari kunjungan..."
              aria-label="Cari"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button
              type="button"
              className="nav-icon-btn with-badge"
              title="Notifikasi"
              aria-label="Notifikasi"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="nav-notif-dot" />
            </button>

            {/* User Profile Pill */}
            <div className="nav-user-profile-wrap">
              <button
                type="button"
                className="nav-user-pill"
                onClick={() => setShowUserDropdown((prev) => !prev)}
              >
                <div className="nav-avatar">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
                  </svg>
                </div>
                <div className="nav-user-text">
                  <strong className="nav-user-name">{nama}</strong>
                  <span className="nav-user-role">{roleLabel}</span>
                </div>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="nav-chevron">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {showUserDropdown && (
                <div className="nav-user-dropdown" onMouseLeave={() => setShowUserDropdown(false)}>
                  <div className="dropdown-user-header">
                    <strong>{nama}</strong>
                    <span>{user?.email || `${nama.toLowerCase().replace(' ', '.')}@ruteku.id`}</span>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link to="/cek-status" className="dropdown-item">
                    Portal Klien (Cek Tiket)
                  </Link>
                  <button type="button" onClick={handleLogout} className="dropdown-item logout">
                    Keluar (Logout)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (for Petugas or Mobile Responsive - Mockup Page 14) */}
      <nav className="sambang-bottom-bar">
        <Link
          to="/dashboard"
          className={`bottom-bar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Dashboard</span>
        </Link>

        <Link
          to="/kunjungan"
          className={`bottom-bar-item ${location.pathname === '/kunjungan' ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
          <span>Tugas Saya</span>
        </Link>

        <Link
          to="/cek-status"
          className={`bottom-bar-item ${location.pathname === '/cek-status' ? 'active' : ''}`}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Riwayat</span>
        </Link>
      </nav>
    </>
  )
}

export default Navbar