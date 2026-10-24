import { useState } from 'react'
import { Link } from 'react-router-dom'
import SambangLogo from '../components/SambangLogo'
import SambangHousesIllustration from '../components/SambangHousesIllustration'
import { getKunjunganByTiket } from '../services/kunjunganService'
import '../styles/Sambang.css'
import './CekStatus.css'

const TAHAPAN_STATUS = [
  { key: 'menunggu', label: 'Menunggu' },
  { key: 'dijadwalkan', label: 'Dijadwalkan' },
  { key: 'dalam_perjalanan', label: 'Dalam Perjalanan' },
  { key: 'tiba', label: 'Di Lokasi' },
  { key: 'selesai', label: 'Selesai' },
]

function CekStatus() {
  const [kodeTiket, setKodeTiket] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [hasil, setHasil] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const handleCek = async (e) => {
    if (e) e.preventDefault()
    if (!kodeTiket.trim()) return

    setLoading(true)
    setNotFound(false)
    setHasil(null)
    setHasSearched(true)

    try {
      const data = await getKunjunganByTiket(kodeTiket.trim())
      setHasil(data)
    } catch (err) {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setNotFound(false)
    setHasil(null)
    setHasSearched(false)
    setKodeTiket('')
  }

  // Determine active step index
  const getLangkahAktif = () => {
    if (!hasil) return -1
    const idx = TAHAPAN_STATUS.findIndex((s) => s.key === hasil.status)
    return idx >= 0 ? idx : 0
  }

  const langkahAktif = getLangkahAktif()

  return (
    <div className="status-screen">
      <div className="status-mobile-card">
        {/* Top Header */}
        <header className="status-top-bar">
          <Link to="/" className="status-back-link" aria-label="Kembali ke Beranda">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5m7 7-7-7 7-7" />
            </svg>
            <span>Kembali Halaman Utama</span>
          </Link>
          <div className="status-brand-mini">
            <SambangLogo className="status-mini-logo" />
          </div>
        </header>

        {/* STATE 1: Search Form (Default / Initial View - Mockup 03) */}
        {!hasil && !notFound && (
          <div className="status-initial-state">
            <div className="status-badge-icon blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>

            <h1 className="status-main-title">Cek Status Kunjungan</h1>
            <p className="status-main-desc">
              Masukkan kode tiket untuk melihat status kunjungan Anda.
            </p>

            <form onSubmit={handleCek} className="status-search-form">
              <div className="sambang-field-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" />
                  <path d="M2 15a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" />
                </svg>
                <input
                  type="text"
                  value={kodeTiket}
                  onChange={(e) => setKodeTiket(e.target.value.toUpperCase())}
                  placeholder="Masukkan kode tiket"
                  autoComplete="off"
                  required
                />
              </div>

              <button
                type="submit"
                className="sambang-btn sambang-btn-primary"
                disabled={loading}
              >
                {loading ? 'Memeriksa...' : 'Lihat Status'}
                {!loading && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                )}
              </button>
            </form>

            <div className="sambang-note status-info-note">
              <span className="sambang-note-icon">i</span>
              <p>Kode tiket bisa Anda dapatkan dari petugas saat kunjungan berlangsung.</p>
            </div>

            <div className="status-bottom-illustration">
              <SambangHousesIllustration width="100%" height="auto" />
            </div>
          </div>
        )}

        {/* STATE 2: Not Found (Mockup 06) */}
        {notFound && (
          <div className="status-not-found-state">
            <div className="status-badge-icon red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h1 className="status-main-title">Kode tiket tidak ditemukan</h1>
            <p className="status-main-desc">
              Pastikan kode tiket yang Anda masukkan sudah benar. Jika masih bermasalah, hubungi petugas kami.
            </p>

            <div className="status-not-found-actions">
              <button
                type="button"
                onClick={handleReset}
                className="sambang-btn sambang-btn-secondary"
              >
                Coba Lagi
              </button>

              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="status-contact-btn"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Hubungi Petugas</span>
              </a>
            </div>
          </div>
        )}

        {/* STATE 3: Ticket Found / Status Progress (Mockup 07 & 12) */}
        {hasil && (
          <div className="status-result-state">
            {/* Top Banner Status */}
            <div className="status-live-banner">
              <div className="live-check-circle">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="live-status-text">
                {hasil.status === 'selesai'
                  ? 'Kunjungan Telah Selesai'
                  : hasil.status === 'dalam_perjalanan'
                    ? 'Kunjungan Sedang Berlangsung'
                    : hasil.status === 'tiba'
                      ? 'Petugas Telah Tiba di Lokasi'
                      : 'Kunjungan Terjadwal'}
              </span>
            </div>

            {/* Ticket Card Details */}
            <div className="status-card-box">
              <div className="status-client-header">
                <div className="client-avatar-badge">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="client-info">
                  <span className="client-ticket-code">{hasil.kodeTiket}</span>
                  <strong className="client-name">{hasil.klien?.nama || 'Klien RuteKu'}</strong>
                  <span className="client-service">{hasil.jenisLayanan?.namaLayanan || 'Layanan Kunjungan'}</span>
                </div>
              </div>

              {/* Step Timeline Indicator */}
              <div className="status-timeline-wrap">
                <div className={`timeline-step ${langkahAktif >= 0 ? (langkahAktif === 0 ? 'active' : 'done') : ''}`}>
                  <div className="step-circle" />
                  <div className="step-content">
                    <span className="step-name">Menunggu</span>
                    <span className="step-time">08:00 - 09:00</span>
                  </div>
                </div>

                <div className="timeline-line" />

                <div className={`timeline-step ${langkahAktif >= 2 ? (langkahAktif === 2 ? 'active' : 'done') : ''}`}>
                  <div className="step-circle" />
                  <div className="step-content">
                    <span className="step-name">Dalam Perjalanan</span>
                    <span className="step-time">09:00 - 10:00</span>
                  </div>
                </div>

                <div className="timeline-line" />

                <div className={`timeline-step ${langkahAktif >= 4 ? 'done' : ''}`}>
                  <div className="step-circle" />
                  <div className="step-content">
                    <span className="step-name">Selesai</span>
                    <span className="step-time">10:00 - 11:00</span>
                  </div>
                </div>
              </div>

              {/* Officer Section */}
              <div className="status-petugas-row">
                <div className="petugas-copy">
                  <span className="petugas-label">Petugas</span>
                  <div className="petugas-profile">
                    <div className="petugas-avatar">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
                      </svg>
                    </div>
                    <strong className="petugas-name">{hasil.petugas?.user?.nama || 'Petugas RuteKu'}</strong>
                  </div>
                </div>

                <a
                  href={`tel:${hasil.petugas?.user?.noTelepon || '081234567890'}`}
                  className="petugas-call-button"
                  aria-label="Hubungi Petugas"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </a>
              </div>

              {/* Detail toggle */}
              <button
                type="button"
                onClick={() => setShowDetailModal(true)}
                className="status-detail-link-btn"
              >
                <span>Lihat Detail Kunjungan</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Note box */}
            <div className="sambang-note status-info-note">
              <span className="sambang-note-icon">i</span>
              <p>
                {hasil.status === 'dalam_perjalanan'
                  ? 'Kunjungan sedang dalam perjalanan. Petugas diperkirakan tiba dalam 15 menit.'
                  : hasil.status === 'tiba'
                    ? 'Petugas sudah berada di lokasi Anda untuk memulai pelayanan.'
                    : hasil.status === 'selesai'
                      ? 'Kunjungan telah selesai. Terima kasih atas kepercayaan Anda.'
                      : 'Kunjungan Anda sedang dijadwalkan oleh tim kami.'}
              </p>
            </div>

            {/* Check another ticket */}
            <button
              type="button"
              onClick={handleReset}
              className="status-check-another-btn"
            >
              Cek Kode Tiket Lain
            </button>
          </div>
        )}

        {/* Modal Detail Kunjungan */}
        {showDetailModal && hasil && (
          <div className="sambang-modal-backdrop" onClick={() => setShowDetailModal(false)}>
            <div className="sambang-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="sambang-modal-header">
                <h2>Informasi Detail Kunjungan</h2>
                <button
                  type="button"
                  onClick={() => setShowDetailModal(false)}
                  className="sambang-btn-icon"
                  aria-label="Tutup"
                >
                  ✕
                </button>
              </div>

              <div className="sambang-modal-body">
                <div className="detail-info-grid">
                  <div className="detail-item">
                    <span className="detail-lbl">Kode Tiket</span>
                    <strong className="detail-val font-mono">{hasil.kodeTiket}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="detail-lbl">Status</span>
                    <span className={`sambang-badge badge-${hasil.status}`}>
                      {hasil.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-lbl">Nama Klien</span>
                    <strong className="detail-val">{hasil.klien?.nama}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="detail-lbl">Nomor Telepon</span>
                    <span className="detail-val">{hasil.klien?.noTelepon || '-'}</span>
                  </div>
                  <div className="detail-item full">
                    <span className="detail-lbl">Alamat Kunjungan</span>
                    <span className="detail-val">{hasil.klien?.alamat || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-lbl">Jenis Layanan</span>
                    <strong className="detail-val">{hasil.jenisLayanan?.namaLayanan}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="detail-lbl">Jadwal Mulai</span>
                    <span className="detail-val">
                      {new Date(hasil.jadwalMulai).toLocaleString('id-ID', {
                        dateStyle: 'full',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-lbl">Petugas Lapangan</span>
                    <strong className="detail-val">{hasil.petugas?.user?.nama || 'Belum Ditugaskan'}</strong>
                  </div>
                </div>
              </div>

              <div className="sambang-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowDetailModal(false)}
                  className="sambang-btn sambang-btn-primary sambang-btn-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CekStatus