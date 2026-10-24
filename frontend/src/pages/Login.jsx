import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import SambangLogo from '../components/SambangLogo'
import '../styles/Sambang.css'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      })

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.pesan || 'Login gagal, silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      {/* Left Section: Hero Branding & Benefits */}
      <section className="login-intro">
        <header className="sambang-brand">
          <div className="sambang-logo-box">
            <SambangLogo />
          </div>

          <div className="sambang-brand-copy">
            <span className="sambang-brand-name">RuteKu</span>
            <span className="sambang-brand-tagline">
              Sistem Layanan Antar Warga
            </span>
          </div>
        </header>

        <div className="intro-content">
          <span className="intro-eyebrow">
            PELAYANAN LEBIH DEKAT
          </span>

          <h1>
            Hadir untuk warga,
            <br />
            <span>melayani dengan</span>
            <br />
            sepenuh hati.
          </h1>

          <p className="intro-description">
            Kelola layanan kunjungan warga dengan lebih mudah,
            teratur, dan transparan melalui satu sistem terpadu.
          </p>

          <div className="intro-benefits">
            <div className="benefit-item">
              <span className="benefit-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12.5 9.5 17 19 7.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>Pengelolaan kunjungan terstruktur</span>
            </div>

            <div className="benefit-item">
              <span className="benefit-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="8.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M12 7v5l3.5 2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>Pemantauan status secara praktis</span>
            </div>

            <div className="benefit-item">
              <span className="benefit-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3 20 6v5.5c0 5-3.4 8-8 9.5-4.6-1.5-8-4.5-8-9.5V6l8-3Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m8.5 12 2.3 2.3 4.7-4.7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>Informasi layanan lebih transparan</span>
            </div>
          </div>
        </div>

        <footer className="intro-footer">
          © {new Date().getFullYear()} RuteKu. Melayani dengan sepenuh hati.
        </footer>
      </section>

      {/* Right Section: Form Login */}
      <section className="login-form-panel">
        <Link to="/cek-status" className="login-status-link">
          Cek Status Kunjungan
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        <div className="login-card">
          <div className="login-heading">
            <span className="login-heading-label">SELAMAT DATANG</span>
            <h2>Masuk ke RuteKu</h2>
            <p>
              Masuk menggunakan akun Admin atau Petugas
              untuk melanjutkan.
            </p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-field">
              <label htmlFor="email">Email</label>
              <div className="login-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect
                    x="3.5"
                    y="5.5"
                    width="17"
                    height="13"
                    rx="2.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="m5 7 7 5.5L19 7"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M8 10V7a4 4 0 0 1 8 0v3"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? 'Sembunyikan password' : 'Tampilkan password'
                  }
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M3 3 21 21M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.5 5.2 8.5 7s-1.1 2.8-2.8 4.1M6.2 6.3C3.9 7.8 2.5 10.6 2.5 12c0 1.8 3.3 7 9.5 7 1.1 0 2.1-.2 3-.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M2.5 12s3.3-7 9.5-7 9.5 7 9.5 7-3.3 7-9.5 7-9.5-7-9.5-7Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk ke Akun'}
              {!loading && (
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </form>

          <div className="login-help">
            <span className="help-icon" aria-hidden="true">i</span>
            <p>
              Klien tidak perlu masuk. Gunakan kode tiket pada halaman{' '}
              <Link to="/cek-status">Cek Status Kunjungan</Link>.
            </p>
          </div>
        </div>

        <footer className="form-footer">
          Sistem Layanan Antar Warga
        </footer>
      </section>
    </main>
  )
}

export default Login
