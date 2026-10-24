import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getAllKunjungan, createKunjungan, updateStatusKunjungan } from '../services/kunjunganService'
import { getAllKlien, getAllPetugas, getAllJenisLayanan } from '../services/masterDataService'
import '../styles/Sambang.css'
import './DaftarKunjungan.css'

function DaftarKunjungan() {
  const [kunjunganList, setKunjunganList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Master data for filters & modal
  const [klienList, setKlienList] = useState([])
  const [petugasList, setPetugasList] = useState([])
  const [layananList, setLayananList] = useState([])

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPetugas, setFilterPetugas] = useState('')
  const [filterPrioritas, setFilterPrioritas] = useState('')
  const [filterLayanan, setFilterLayanan] = useState('')

  // Side Panel / Drawer State (Mockup 10)
  const [selectedDetail, setSelectedDetail] = useState(null)

  // Modal Buat Kunjungan State (Mockup 13)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formKlienId, setFormKlienId] = useState('')
  const [formLayananId, setFormLayananId] = useState('')
  const [formPetugasId, setFormPetugasId] = useState('')
  const [formTanggal, setFormTanggal] = useState('')
  const [formWaktu, setFormWaktu] = useState('')
  const [formPrioritas, setFormPrioritas] = useState('Tinggi')
  const [formCatatan, setFormCatatan] = useState('')
  const [submittingCreate, setSubmittingCreate] = useState(false)

  // Modal Status Update State
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [statusToUpdate, setStatusToUpdate] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const ambilData = async () => {
    try {
      const [kunjungan, klien, petugas, layanan] = await Promise.all([
        getAllKunjungan(),
        getAllKlien(),
        getAllPetugas(),
        getAllJenisLayanan(),
      ])
      setKunjunganList(kunjungan || [])
      setKlienList(klien || [])
      setPetugasList(petugas || [])
      setLayananList(layanan || [])
    } catch (err) {
      setError('Gagal memuat data kunjungan.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ambilData()
  }, [])

  // Calculate active filter count
  const activeFilterCount = [filterStatus, filterPetugas, filterPrioritas, filterLayanan].filter(Boolean).length

  const handleResetFilters = () => {
    setSearchQuery('')
    setFilterStatus('')
    setFilterPetugas('')
    setFilterPrioritas('')
    setFilterLayanan('')
  }

  // Filtered List
  const filteredList = kunjunganList.filter((k) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchTiket = k.kodeTiket?.toLowerCase().includes(q)
      const matchKlien = k.klien?.nama?.toLowerCase().includes(q)
      const matchPetugas = k.petugas?.user?.nama?.toLowerCase().includes(q)
      if (!matchTiket && !matchKlien && !matchPetugas) return false
    }

    if (filterStatus && k.status !== filterStatus) return false
    if (filterPetugas && String(k.petugasId) !== filterPetugas) return false
    if (filterLayanan && String(k.jenisLayananId) !== filterLayanan) return false

    if (filterPrioritas) {
      const skor = Number(k.skorPrioritas || 50)
      if (filterPrioritas === 'Tinggi' && skor < 70) return false
      if (filterPrioritas === 'Sedang' && (skor < 40 || skor >= 70)) return false
      if (filterPrioritas === 'Rendah' && skor >= 40) return false
    }

    return true
  })

  // Submit Create Visit (Mockup 13)
  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!formKlienId || !formLayananId || !formTanggal || !formWaktu) {
      alert('Mohon lengkapi semua bidang yang wajib diisi (*).')
      return
    }

    setSubmittingCreate(true)
    try {
      const combinedDateTime = new Date(`${formTanggal}T${formWaktu}`).toISOString()
      await createKunjungan({
        klienId: parseInt(formKlienId),
        jenisLayananId: parseInt(formLayananId),
        petugasId: formPetugasId ? parseInt(formPetugasId) : null,
        jadwalMulai: combinedDateTime,
      })

      setShowCreateModal(false)
      // Reset form
      setFormKlienId('')
      setFormLayananId('')
      setFormPetugasId('')
      setFormTanggal('')
      setFormWaktu('')
      setFormCatatan('')
      ambilData()
    } catch (err) {
      alert(err.response?.data?.pesan || 'Gagal membuat kunjungan baru.')
    } finally {
      setSubmittingCreate(false)
    }
  }

  // Update status handler
  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault()
    if (!selectedDetail || !statusToUpdate) return

    setUpdatingStatus(true)
    try {
      await updateStatusKunjungan(selectedDetail.id, statusToUpdate)
      setShowStatusModal(false)
      // Update local state
      setSelectedDetail((prev) => (prev ? { ...prev, status: statusToUpdate } : null))
      ambilData()
    } catch (err) {
      alert('Gagal mengupdate status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Helper for priority tag
  const getPrioritasInfo = (skorPrioritas) => {
    const val = Number(skorPrioritas || 75)
    if (val >= 70) return { label: 'Tinggi', cls: 'badge-prioritas-tinggi' }
    if (val >= 40) return { label: 'Sedang', cls: 'badge-prioritas-sedang' }
    return { label: 'Rendah', cls: 'badge-prioritas-rendah' }
  }

  return (
    <div className="daftar-kunjungan-page">
      <Navbar />

      <main className="daftar-content-container">
        {/* Back Link */}
        <div className="daftar-back-row">
          <Link to="/dashboard" className="daftar-back-link">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5m7 7-7-7 7-7" />
            </svg>
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>

        {/* Page Header (Mockup 09) */}
        <div className="daftar-header-row">
          <div className="daftar-titles">
            <h1 className="daftar-title">Daftar Kunjungan</h1>
            <p className="daftar-subtitle">Kelola seluruh jadwal kunjungan lapangan.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="sambang-btn sambang-btn-primary"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Buat Kunjungan</span>
          </button>
        </div>

        {/* Filter Bar (Mockup 09) */}
        <section className="daftar-filter-card sambang-card">
          <div className="filter-search-box sambang-field-wrap">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode tiket, nama klien, atau nama petugas..."
            />
          </div>

          <div className="filter-dropdowns-row">
            {/* Status */}
            <div className="filter-select-wrap">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Status</option>
                <option value="menunggu">Menunggu</option>
                <option value="dijadwalkan">Dijadwalkan</option>
                <option value="dalam_perjalanan">Dalam Perjalanan</option>
                <option value="tiba">Tiba di Lokasi</option>
                <option value="selesai">Selesai</option>
                <option value="gagal">Gagal</option>
              </select>
            </div>

            {/* Petugas */}
            <div className="filter-select-wrap">
              <select value={filterPetugas} onChange={(e) => setFilterPetugas(e.target.value)}>
                <option value="">Petugas</option>
                {petugasList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.user?.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Prioritas */}
            <div className="filter-select-wrap">
              <select value={filterPrioritas} onChange={(e) => setFilterPrioritas(e.target.value)}>
                <option value="">Prioritas</option>
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>

            {/* Jenis Layanan */}
            <div className="filter-select-wrap">
              <select value={filterLayanan} onChange={(e) => setFilterLayanan(e.target.value)}>
                <option value="">Jenis Layanan</option>
                {layananList.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.namaLayanan}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Count & Reset */}
            {activeFilterCount > 0 && (
              <span className="active-filter-badge">{activeFilterCount} filter aktif</span>
            )}

            {(activeFilterCount > 0 || searchQuery) && (
              <button type="button" onClick={handleResetFilters} className="filter-reset-btn">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                <span>Reset</span>
              </button>
            )}
          </div>
        </section>

        {/* Table (Mockup 09) */}
        <section className="sambang-table-wrap">
          <table className="sambang-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Kode Tiket</th>
                <th>Nama Klien</th>
                <th>Jenis Layanan</th>
                <th>Petugas</th>
                <th>Tanggal &amp; Waktu</th>
                <th>Status</th>
                <th>Prioritas</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((k, idx) => {
                const prio = getPrioritasInfo(k.skorPrioritas)
                return (
                  <tr
                    key={k.id}
                    onClick={() => setSelectedDetail(k)}
                    className="clickable-table-row"
                  >
                    <td>{idx + 1}</td>
                    <td>
                      <span className="table-ticket-code">{k.kodeTiket}</span>
                    </td>
                    <td>
                      <strong>{k.klien?.nama || 'Klien'}</strong>
                    </td>
                    <td>{k.jenisLayanan?.namaLayanan || 'Layanan'}</td>
                    <td>{k.petugas?.user?.nama || 'Siti Perawat'}</td>
                    <td>
                      {new Date(k.jadwalMulai).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      <br />
                      <span className="table-time-muted">
                        {new Date(k.jadwalMulai).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td>
                      <span className={`sambang-badge badge-${k.status}`}>
                        {k.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`sambang-badge ${prio.cls}`}>{prio.label}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedDetail(k)
                        }}
                        className="table-action-dots"
                        title="Detail Kunjungan"
                        aria-label="Aksi"
                      >
                        ⋮
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '36px' }}>
                    <p style={{ margin: 0, color: 'var(--sambang-muted)', fontSize: '13.5px' }}>
                      Tidak ada data kunjungan yang sesuai kriteria pencarian.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* ========================================================
           DETAIL KUNJUNGAN — PANEL SAMPING (Drawer - Mockup 10)
           ======================================================== */}
        {selectedDetail && (
          <div className="sambang-drawer-backdrop" onClick={() => setSelectedDetail(null)}>
            <div className="sambang-drawer-panel" onClick={(e) => e.stopPropagation()}>
              {/* Drawer Top Header */}
              <div className="drawer-header">
                <div className="drawer-header-left">
                  <button
                    type="button"
                    onClick={() => setSelectedDetail(null)}
                    className="drawer-back-btn"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M19 12H5m7 7-7-7 7-7" />
                    </svg>
                    <span>Daftar Kunjungan</span>
                  </button>
                  <h2 className="drawer-title">Detail Kunjungan</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDetail(null)}
                  className="sambang-btn-icon"
                  aria-label="Tutup"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Body Content */}
              <div className="drawer-body">
                {/* Ticket code & badges row */}
                <div className="drawer-badges-row">
                  <span className="drawer-ticket-code">{selectedDetail.kodeTiket}</span>
                  <span className={`sambang-badge badge-${selectedDetail.status}`}>
                    ● {selectedDetail.status.replace('_', ' ')}
                  </span>
                  <span className="sambang-badge badge-prioritas-tinggi">
                    ● Prioritas Tinggi
                  </span>
                </div>

                {/* Client Profile Box */}
                <div className="drawer-client-card">
                  <div className="drawer-avatar">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="drawer-client-info">
                    <strong className="drawer-client-name">
                      {selectedDetail.klien?.nama || 'Budi Santoso'}
                    </strong>
                    <span className="drawer-client-phone">
                      {selectedDetail.klien?.noTelepon || '+62 812 3456 7890'}
                    </span>
                    <span className="drawer-client-addr">
                      {selectedDetail.klien?.alamat || 'Jl. Melati No. 12, Bandung'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="drawer-actions-row">
                  <a
                    href={`tel:${selectedDetail.klien?.noTelepon || '081234567890'}`}
                    className="sambang-btn sambang-btn-secondary sambang-btn-sm"
                  >
                    Hubungi Klien
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusToUpdate(selectedDetail.status)
                      setShowStatusModal(true)
                    }}
                    className="sambang-btn sambang-btn-primary sambang-btn-sm"
                  >
                    Update Status
                  </button>
                </div>

                {/* Section: Informasi Kunjungan */}
                <div className="drawer-section">
                  <h3 className="drawer-section-title">Informasi Kunjungan</h3>
                  <div className="drawer-info-list">
                    <div className="drawer-info-item">
                      <span className="info-icon">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </span>
                      <div className="info-text">
                        <strong>
                          {new Date(selectedDetail.jadwalMulai).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </strong>
                      </div>
                    </div>

                    <div className="drawer-info-item">
                      <span className="info-icon">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </span>
                      <div className="info-text">
                        <strong>
                          {new Date(selectedDetail.jadwalMulai).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {' - '}
                          {new Date(new Date(selectedDetail.jadwalMulai).getTime() + 60 * 60 * 1000).toLocaleTimeString(
                            'id-ID',
                            { hour: '2-digit', minute: '2-digit' }
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="drawer-info-item">
                      <span className="info-icon">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <div className="info-text">
                        <strong>{selectedDetail.petugas?.user?.nama || 'Siti Perawat'}</strong>
                        <span>Petugas</span>
                      </div>
                    </div>

                    <div className="drawer-info-item">
                      <span className="info-icon">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="12 2 2 7 12 12 22 7 12 2" />
                          <polyline points="2 17 12 22 22 17" />
                        </svg>
                      </span>
                      <div className="info-text">
                        <strong>{selectedDetail.jenisLayanan?.namaLayanan || 'Kunjungan Perawat'}</strong>
                        <span>Jenis Layanan</span>
                      </div>
                    </div>

                    <div className="drawer-info-item">
                      <span className="info-icon">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      </span>
                      <div className="info-text">
                        <span className="info-catatan-label">Catatan</span>
                        <p className="info-catatan-body">
                          {selectedDetail.alasanGagal || 'Pasien lansia, pastikan membawa peralatan medis lengkap.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Riwayat Aktivitas (Mockup 10) */}
                <div className="drawer-section">
                  <h3 className="drawer-section-title">Riwayat Aktivitas</h3>
                  <div className="drawer-timeline">
                    <div className="drawer-timeline-step">
                      <div className="dt-circle teal" />
                      <div className="dt-content">
                        <strong>Dibuat oleh Admin</strong>
                        <span>10 Okt 2025 · 14:20</span>
                      </div>
                    </div>

                    <div className="drawer-timeline-line" />

                    <div className="drawer-timeline-step">
                      <div className="dt-circle blue" />
                      <div className="dt-content">
                        <strong>Ditugaskan ke {selectedDetail.petugas?.user?.nama || 'Siti Perawat'}</strong>
                        <span>11 Okt 2025 · 09:15</span>
                      </div>
                    </div>

                    <div className="drawer-timeline-line" />

                    <div className="drawer-timeline-step">
                      <div className="dt-circle orange" />
                      <div className="dt-content">
                        <strong>Status diubah ke Dalam Perjalanan</strong>
                        <span>12 Okt 2025 · 08:45</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
           MODAL BUAT KUNJUNGAN BARU (Mockup 13)
           ======================================================== */}
        {showCreateModal && (
          <div className="sambang-modal-backdrop" onClick={() => setShowCreateModal(false)}>
            <div className="sambang-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="sambang-modal-header">
                <h2>Buat Kunjungan Baru</h2>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="sambang-btn-icon"
                  aria-label="Tutup"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSubmit}>
                <div className="sambang-modal-body">
                  {/* Pilih Klien * */}
                  <div className="sambang-field">
                    <label>Pilih Klien *</label>
                    <div className="klien-select-with-btn">
                      <div className="sambang-field-wrap">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <select
                          value={formKlienId}
                          onChange={(e) => setFormKlienId(e.target.value)}
                          required
                        >
                          <option value="">Cari atau pilih klien...</option>
                          {klienList.map((k) => (
                            <option key={k.id} value={k.id}>
                              {k.nama} — {k.noTelepon}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Link
                        to="/klien"
                        className="sambang-btn sambang-btn-secondary sambang-btn-sm"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        + Klien Baru
                      </Link>
                    </div>
                  </div>

                  {/* Jenis Layanan * */}
                  <div className="sambang-field">
                    <label>Jenis Layanan *</label>
                    <div className="sambang-field-wrap">
                      <select
                        value={formLayananId}
                        onChange={(e) => setFormLayananId(e.target.value)}
                        required
                      >
                        <option value="">Pilih jenis layanan</option>
                        {layananList.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.namaLayanan}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tanggal & Waktu * */}
                  <div className="form-two-cols">
                    <div className="sambang-field">
                      <label>Tanggal *</label>
                      <div className="sambang-field-wrap">
                        <input
                          type="date"
                          value={formTanggal}
                          onChange={(e) => setFormTanggal(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="sambang-field">
                      <label>Waktu *</label>
                      <div className="sambang-field-wrap">
                        <input
                          type="time"
                          value={formWaktu}
                          onChange={(e) => setFormWaktu(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Petugas */}
                  <div className="sambang-field">
                    <label>Petugas</label>
                    <div className="sambang-field-wrap">
                      <select
                        value={formPetugasId}
                        onChange={(e) => setFormPetugasId(e.target.value)}
                      >
                        <option value="">Pilih petugas</option>
                        {petugasList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.user?.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Prioritas (Radio buttons Rendah, Sedang, Tinggi) */}
                  <div className="sambang-field">
                    <label>Prioritas *</label>
                    <div className="prioritas-radios-group">
                      <label className="prioritas-radio-label">
                        <input
                          type="radio"
                          name="prioritas"
                          value="Rendah"
                          checked={formPrioritas === 'Rendah'}
                          onChange={(e) => setFormPrioritas(e.target.value)}
                        />
                        <span>Rendah</span>
                      </label>

                      <label className="prioritas-radio-label">
                        <input
                          type="radio"
                          name="prioritas"
                          value="Sedang"
                          checked={formPrioritas === 'Sedang'}
                          onChange={(e) => setFormPrioritas(e.target.value)}
                        />
                        <span>Sedang</span>
                      </label>

                      <label className="prioritas-radio-label high">
                        <input
                          type="radio"
                          name="prioritas"
                          value="Tinggi"
                          checked={formPrioritas === 'Tinggi'}
                          onChange={(e) => setFormPrioritas(e.target.value)}
                        />
                        <span>Tinggi</span>
                      </label>
                    </div>
                  </div>

                  {/* Catatan (opsional) */}
                  <div className="sambang-field">
                    <label>Catatan (opsional)</label>
                    <textarea
                      className="sambang-textarea"
                      value={formCatatan}
                      onChange={(e) => setFormCatatan(e.target.value)}
                      placeholder="Tambahkan catatan khusus..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="sambang-modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="sambang-btn sambang-btn-secondary sambang-btn-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submittingCreate}
                    className="sambang-btn sambang-btn-primary sambang-btn-sm"
                  >
                    {submittingCreate ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Update Status */}
        {showStatusModal && selectedDetail && (
          <div className="sambang-modal-backdrop" onClick={() => setShowStatusModal(false)}>
            <div className="sambang-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="sambang-modal-header">
                <h2>Update Status Kunjungan</h2>
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="sambang-btn-icon"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateStatusSubmit}>
                <div className="sambang-modal-body">
                  <div className="sambang-field">
                    <label>Pilih Status Baru</label>
                    <div className="sambang-field-wrap">
                      <select
                        value={statusToUpdate}
                        onChange={(e) => setStatusToUpdate(e.target.value)}
                        required
                      >
                        <option value="menunggu">Menunggu</option>
                        <option value="dijadwalkan">Dijadwalkan</option>
                        <option value="dalam_perjalanan">Dalam Perjalanan</option>
                        <option value="tiba">Tiba di Lokasi</option>
                        <option value="selesai">Selesai</option>
                        <option value="gagal">Gagal / Batal</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="sambang-modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowStatusModal(false)}
                    className="sambang-btn sambang-btn-secondary sambang-btn-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={updatingStatus}
                    className="sambang-btn sambang-btn-primary sambang-btn-sm"
                  >
                    {updatingStatus ? 'Menyimpan...' : 'Simpan'}
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

export default DaftarKunjungan
