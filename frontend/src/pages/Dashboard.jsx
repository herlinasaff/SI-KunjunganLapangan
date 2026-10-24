import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SambangHousesIllustration from '../components/SambangHousesIllustration'
import { getAllKunjungan, updateStatusKunjungan } from '../services/kunjunganService'
import '../styles/Sambang.css'
import './Dashboard.css'

function Dashboard() {
  const [kunjunganList, setKunjunganList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedKunjunganForUpdate, setSelectedKunjunganForUpdate] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const isPetugas = user?.role === 'petugas'
  const userName = user?.nama || (isPetugas ? 'Andi Pratama' : 'Siti Rahayu')

  // Indonesian date formatter
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const ambilData = async () => {
    try {
      const data = await getAllKunjungan()
      setKunjunganList(data || [])
    } catch (err) {
      setError('Gagal memuat data kunjungan.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ambilData()
  }, [])

  const handleQuickStatusSubmit = async (e) => {
    e.preventDefault()
    if (!selectedKunjunganForUpdate || !newStatus) return

    setUpdatingStatus(true)
    try {
      await updateStatusKunjungan(selectedKunjunganForUpdate.id, newStatus)
      setSelectedKunjunganForUpdate(null)
      ambilData()
    } catch (err) {
      alert('Gagal mengubah status kunjungan.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Count metrics dynamically
  const countMenunggu = kunjunganList.filter((k) => k.status === 'menunggu').length
  const countDalamPerjalanan = kunjunganList.filter((k) => k.status === 'dalam_perjalanan' || k.status === 'tiba').length
  const countSelesai = kunjunganList.filter((k) => k.status === 'selesai').length
  const countPrioritasTinggi = kunjunganList.filter((k) => k.skorPrioritas && Number(k.skorPrioritas) >= 70).length

  // Filter today's tasks
  const kunjunganHariIni = kunjunganList.slice(0, 5)

  // Next upcoming visit for petugas
  const nextVisit = kunjunganList.find((k) => k.status === 'dalam_perjalanan' || k.status === 'menunggu' || k.status === 'dijadwalkan') || kunjunganList[0]

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-content-wrapper">
        {/* Top Header & Greeting (Mockup 08 & 11) */}
        <section className="dashboard-hero-header">
          <div className="greeting-copy">
            <h1 className="greeting-title">
              Halo, {userName} <span className="wave-hand">👋</span>
            </h1>
            <p className="greeting-subtitle">
              {isPetugas
                ? 'Semangat! Berikut tugas dan kunjungan hari ini.'
                : 'Semoga hari ini berjalan lancar. Berikut ringkasan kunjungan lapangan.'}
            </p>
          </div>

          <div className="dashboard-date-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{todayFormatted}</span>
          </div>
        </section>

        {/* 4 Stat Cards */}
        {isPetugas ? (
          /* Petugas Stats (Mockup 11) */
          <section className="dashboard-stats-grid">
            <div className="sambang-stat-card">
              <div className="stat-icon-wrap blue">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
              </div>
              <div className="stat-copy">
                <span className="stat-label">Tugas Hari Ini</span>
                <span className="stat-number">{kunjunganList.length || 5}</span>
                <span className="stat-sub">Total kunjungan</span>
              </div>
            </div>

            <div className="sambang-stat-card">
              <div className="stat-icon-wrap orange">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="stat-copy">
                <span className="stat-label">Dalam Perjalanan</span>
                <span className="stat-number">{countDalamPerjalanan || 2}</span>
                <span className="stat-sub">Sedang bertugas</span>
              </div>
            </div>

            <div className="sambang-stat-card">
              <div className="stat-icon-wrap green">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="stat-copy">
                <span className="stat-label">Selesai Hari Ini</span>
                <span className="stat-number">{countSelesai || 3}</span>
                <span className="stat-sub">Terselesaikan</span>
              </div>
            </div>

            <div className="sambang-stat-card">
              <div className="stat-icon-wrap purple">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="stat-copy">
                <span className="stat-label">Total Minggu Ini</span>
                <span className="stat-number">18</span>
                <span className="stat-sub">Kunjungan</span>
              </div>
            </div>
          </section>
        ) : (
          /* Admin Stats (Mockup 08) */
          <section className="dashboard-stats-grid">
            <div className="sambang-stat-card">
              <div className="stat-icon-wrap blue">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="stat-copy">
                <span className="stat-label">Menunggu</span>
                <span className="stat-number">{countMenunggu || 12}</span>
                <span className="stat-sub">
                  <span style={{ color: '#2463d5' }}>●</span> Belum dimulai
                </span>
              </div>
            </div>

            <div className="sambang-stat-card">
              <div className="stat-icon-wrap orange">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div className="stat-copy">
                <span className="stat-label">Dalam Perjalanan</span>
                <span className="stat-number">{countDalamPerjalanan || 4}</span>
                <span className="stat-sub">
                  <span style={{ color: '#f59e0b' }}>●</span> Sedang bertugas
                </span>
              </div>
            </div>

            <div className="sambang-stat-card">
              <div className="stat-icon-wrap green">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="stat-copy">
                <span className="stat-label">Selesai Hari Ini</span>
                <span className="stat-number">{countSelesai || 28}</span>
                <span className="stat-sub">
                  <span style={{ color: '#10b981' }}>●</span> Terselesaikan
                </span>
              </div>
            </div>

            <div className="sambang-stat-card">
              <div className="stat-icon-wrap red">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="stat-copy">
                <span className="stat-label">Prioritas Tinggi</span>
                <span className="stat-number">{countPrioritasTinggi || 2}</span>
                <span className="stat-sub">
                  <span style={{ color: '#ef4444' }}>●</span> Perlu perhatian
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Petugas Featured Card: Kunjungan Berikutnya (Mockup 11) */}
        {isPetugas && nextVisit && (
          <section className="dashboard-featured-visit sambang-card">
            <div className="featured-visit-content">
              <span className="featured-badge-title">Kunjungan Berikutnya</span>
              <div className="featured-client-row">
                <strong className="featured-ticket-client">
                  {nextVisit.kodeTiket} · {nextVisit.klien?.nama || 'Budi Santoso'}
                </strong>
              </div>

              <div className="featured-service-row">
                <span className="featured-service-name">
                  {nextVisit.jenisLayanan?.namaLayanan || 'Kunjungan Perawat'}
                </span>
                <span className="sambang-badge badge-prioritas-tinggi">
                  ● Prioritas Tinggi
                </span>
              </div>

              <div className="featured-meta-row">
                <span className="featured-meta-item">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  09:00 - 10:00
                </span>
                <span className="featured-meta-item">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {nextVisit.klien?.alamat || 'Jl. Melati No. 12, Bandung'}
                </span>
              </div>

              <div className="featured-action-buttons">
                <a
                  href={`tel:${nextVisit.klien?.noTelepon || '081234567890'}`}
                  className="sambang-btn sambang-btn-success sambang-btn-sm"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Hubungi Klien</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedKunjunganForUpdate(nextVisit)
                    setNewStatus(nextVisit.status)
                  }}
                  className="sambang-btn sambang-btn-primary sambang-btn-sm"
                >
                  Update Status
                </button>
              </div>
            </div>

            <div className="featured-visit-ill">
              <SambangHousesIllustration width={220} height={140} />
            </div>
          </section>
        )}

        {/* Menu Cepat (Quick Menu) for Admin (Mockup 08) */}
        {!isPetugas && (
          <section className="dashboard-section-block">
            <h2 className="section-block-title">Menu Cepat</h2>
            <div className="menu-cepat-grid">
              <Link to="/klien" className="sambang-menu-card">
                <div className="menu-card-icon blue">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <strong className="menu-card-title">Kelola Klien</strong>
                <span className="menu-card-desc">Data klien &amp; kontak</span>
              </Link>

              <Link to="/kunjungan" className="sambang-menu-card">
                <div className="menu-card-icon purple">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <strong className="menu-card-title">Daftar Kunjungan</strong>
                <span className="menu-card-desc">Lihat semua kunjungan</span>
              </Link>

              <Link to="/jenis-layanan" className="sambang-menu-card">
                <div className="menu-card-icon orange">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <strong className="menu-card-title">Jenis Layanan</strong>
                <span className="menu-card-desc">Layanan yang tersedia</span>
              </Link>

              <Link to="/kualifikasi" className="sambang-menu-card">
                <div className="menu-card-icon teal">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <strong className="menu-card-title">Kualifikasi</strong>
                <span className="menu-card-desc">Atur kualifikasi petugas</span>
              </Link>

              <Link to="/petugas" className="sambang-menu-card">
                <div className="menu-card-icon pink">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <strong className="menu-card-title">Kelola Petugas</strong>
                <span className="menu-card-desc">Data petugas lapangan</span>
              </Link>
            </div>
          </section>
        )}

        {/* Bottom Section: Table + Activity Feed (Mockup 08) OR Petugas Task Table (Mockup 11) */}
        {isPetugas ? (
          <section className="dashboard-section-block">
            <h2 className="section-block-title">Tugas Saya</h2>
            <div className="sambang-table-wrap">
              <table className="sambang-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Klien</th>
                    <th>Jenis Layanan</th>
                    <th>Waktu</th>
                    <th>Status</th>
                    <th>Kontak</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kunjunganList.map((k, idx) => (
                    <tr key={k.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <strong>{k.klien?.nama || 'Budi Santoso'}</strong>
                      </td>
                      <td>{k.jenisLayanan?.namaLayanan || 'Kunjungan Perawat'}</td>
                      <td>
                        {new Date(k.jadwalMulai).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td>
                        <span className={`sambang-badge badge-${k.status}`}>
                          {k.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <a
                          href={`tel:${k.klien?.noTelepon || '081234567890'}`}
                          className="sambang-btn-icon"
                          title="Telepon Klien"
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </a>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedKunjunganForUpdate(k)
                            setNewStatus(k.status)
                          }}
                          className="sambang-btn sambang-btn-secondary sambang-btn-sm"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                  {kunjunganList.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>
                        Tidak ada tugas kunjungan saat ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <div className="dashboard-two-cols-grid">
            {/* Left Col: Kunjungan Hari Ini */}
            <section className="dashboard-card-panel sambang-card">
              <div className="card-panel-header">
                <h3>Kunjungan Hari Ini</h3>
                <Link to="/kunjungan" className="panel-action-link">
                  <span>Lihat Semua Kunjungan</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>

              <div className="sambang-table-wrap">
                <table className="sambang-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Klien</th>
                      <th>Jenis Layanan</th>
                      <th>Waktu</th>
                      <th>Status</th>
                      <th>Petugas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kunjunganHariIni.map((k, idx) => (
                      <tr key={k.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <strong>{k.klien?.nama}</strong>
                        </td>
                        <td>{k.jenisLayanan?.namaLayanan}</td>
                        <td>
                          {new Date(k.jadwalMulai).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td>
                          <span className={`sambang-badge badge-${k.status}`}>
                            {k.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td>{k.petugas?.user?.nama || 'Siti Perawat'}</td>
                      </tr>
                    ))}
                    {kunjunganHariIni.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>
                          Belum ada jadwal kunjungan hari ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Right Col: Aktivitas Terbaru (Mockup 08) */}
            <section className="dashboard-card-panel sambang-card">
              <div className="card-panel-header">
                <h3>Aktivitas Terbaru</h3>
              </div>

              <div className="dashboard-activity-timeline">
                <div className="activity-item">
                  <div className="activity-icon-dot blue">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                  <div className="activity-details">
                    <p className="activity-text">
                      <strong>Siti Rahayu</strong> menambahkan klien baru
                    </p>
                    <span className="activity-sub">Budi Santoso · 10:24</span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon-dot purple">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="23 4 23 10 17 10" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                  </div>
                  <div className="activity-details">
                    <p className="activity-text">
                      <strong>Andi Pratama</strong> mengubah jadwal kunjungan
                    </p>
                    <span className="activity-sub">Rina Wulandari · 09:15</span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon-dot teal">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="activity-details">
                    <p className="activity-text">
                      <strong>Dewi Lestari</strong> menyelesaikan kunjungan
                    </p>
                    <span className="activity-sub">Agus Setiawan · 08:42</span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon-dot red">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                    </svg>
                  </div>
                  <div className="activity-details">
                    <p className="activity-text">
                      <strong>Budi Santoso</strong> ditugaskan ke kunjungan
                    </p>
                    <span className="activity-sub">Tina Marlina · 08:10</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Modal Quick Update Status */}
        {selectedKunjunganForUpdate && (
          <div className="sambang-modal-backdrop" onClick={() => setSelectedKunjunganForUpdate(null)}>
            <div className="sambang-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="sambang-modal-header">
                <h2>Update Status Kunjungan</h2>
                <button
                  type="button"
                  onClick={() => setSelectedKunjunganForUpdate(null)}
                  className="sambang-btn-icon"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleQuickStatusSubmit}>
                <div className="sambang-modal-body">
                  <div className="sambang-field">
                    <label>Kode Tiket &amp; Klien</label>
                    <div className="status-kunjungan-summary">
                      <strong>{selectedKunjunganForUpdate.kodeTiket}</strong>
                      <span> · {selectedKunjunganForUpdate.klien?.nama}</span>
                    </div>
                  </div>

                  <div className="sambang-field">
                    <label>Pilih Status Baru</label>
                    <div className="sambang-field-wrap">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        required
                      >
                        <option value="menunggu">Menunggu</option>
                        <option value="dijadwalkan">Dijadwalkan</option>
                        <option value="dalam_perjalanan">Dalam Perjalanan</option>
                        <option value="tiba">Tiba di Lokasi</option>
                        <option value="selesai">Selesai</option>
                        <option value="gagal">Gagal / Dibatalkan</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="sambang-modal-footer">
                  <button
                    type="button"
                    onClick={() => setSelectedKunjunganForUpdate(null)}
                    className="sambang-btn sambang-btn-secondary sambang-btn-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={updatingStatus}
                    className="sambang-btn sambang-btn-primary sambang-btn-sm"
                  >
                    {updatingStatus ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard