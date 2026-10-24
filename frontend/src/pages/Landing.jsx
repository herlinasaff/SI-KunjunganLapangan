import { Link } from 'react-router-dom'
import SambangLogo from '../components/SambangLogo'
import '../styles/Sambang.css'
import './Landing.css'

function Landing() {
  return (
    <main className="landing-page">
      {/* Left Panel: Hero Navy (Sama persis dengan Login) */}
      <section className="landing-hero">
        <header className="sambang-brand">
          <div className="sambang-logo-box">
            <SambangLogo />
          </div>
          <div className="sambang-brand-copy">
            <span className="sambang-brand-name">RuteKu</span>
            <span className="sambang-brand-tagline">Sistem Layanan Antar Warga</span>
          </div>
        </header>

        <div className="hero-content">
          <span className="hero-eyebrow">LAYANAN KUNJUNGAN LAPANGAN</span>

          <h1>
            Selamat datang di
            <br />
            <span>RuteKu</span>
          </h1>

          <p className="hero-description">
            Sistem Penjadwalan Kunjungan Lapangan untuk membantu pengelolaan jadwal,
            pemantauan progres real-time, dan pelayanan warga yang lebih dekat,
            teratur, serta transparan.
          </p>

          <div className="hero-benefits">
            <div className="benefit-item">
              <span className="benefit-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 12.5 9.5 17 19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>Pengelolaan kunjungan terstruktur</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>Pemantauan status secara praktis</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 3 20 6v5.5c0 5-3.4 8-8 9.5-4.6-1.5-8-4.5-8-9.5V6l8-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="m8.5 12 2.3 2.3 4.7-4.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>Informasi layanan lebih transparan</span>
            </div>
          </div>
        </div>

        <footer className="hero-footer">
          © {new Date().getFullYear()} RuteKu. Melayani dengan sepenuh hati.
        </footer>
      </section>

      {/* Right Panel: Pilihan Akses Layanan */}
      <section className="landing-choices-panel">
        <div className="landing-choices-card">
          <div className="choices-header">
            <span className="choices-eyebrow">PILIH AKSES ANDA</span>
            <h2>Akses Layanan RuteKu</h2>
            <p>Pilih pintu masuk sesuai peran atau kebutuhan Anda.</p>
          </div>

          <div className="access-cards-container">
            {/* Kartu 1: Cek Status Kunjungan */}
            <Link to="/cek-status" className="access-card">
              <div className="access-header-row">
                <div className="access-icon blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <circle cx="10.8" cy="10.8" r="6.8" />
                    <path d="m16 16 4.5 4.5" />
                  </svg>
                </div>
                <div className="access-copy">
                  <h3>Cek Status Kunjungan</h3>
                  <p>Untuk klien yang ingin memantau kunjungannya.</p>
                </div>
                <div className="access-arrow">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>

              <span className="sambang-btn sambang-btn-primary">
                Cek Status Kunjungan
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </span>
              <span className="access-note">Tidak perlu login. Siapkan kode tiket kunjungan Anda.</span>
            </Link>

            {/* Kartu 2: Login Admin & Petugas */}
            <Link to="/login" className="access-card">
              <div className="access-header-row">
                <div className="access-icon purple">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div className="access-copy">
                  <h3>Login Admin &amp; Petugas</h3>
                  <p>Akses dashboard dan pengelolaan tugas layanan.</p>
                </div>
                <div className="access-arrow">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>

              <span className="sambang-btn sambang-btn-secondary">
                Login Sekarang
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </span>
              <span className="access-note">Akses khusus pengguna yang memiliki akun resmi.</span>
            </Link>
          </div>
        </div>

        <footer className="form-footer">
          Sistem Layanan Antar Warga
        </footer>
      </section>
    </main>
  )
}

export default Landing