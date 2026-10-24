import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  getAllJenisLayanan,
  createJenisLayanan,
  updateJenisLayanan,
  deleteJenisLayanan,
  getAllKualifikasi
} from '../services/masterDataService'
import '../styles/Sambang.css'

function KelolaJenisLayanan() {
  const [list, setList] = useState([])
  const [kualifikasiList, setKualifikasiList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [namaLayanan, setNamaLayanan] = useState('')
  const [estimasiDurasi, setEstimasiDurasi] = useState('')
  const [bobotWaktu, setBobotWaktu] = useState('0.5')
  const [bobotLokasi, setBobotLokasi] = useState('0.5')
  const [kualifikasiId, setKualifikasiId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [editId, setEditId] = useState(null)

  const ambilData = async () => {
    try {
      const [jenisLayanan, kualifikasi] = await Promise.all([
        getAllJenisLayanan(),
        getAllKualifikasi()
      ])
      setList(jenisLayanan || [])
      setKualifikasiList(kualifikasi || [])
    } catch (err) {
      setError('Gagal mengambil data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ambilData()
  }, [])

  const resetForm = () => {
    setEditId(null)
    setNamaLayanan('')
    setEstimasiDurasi('')
    setBobotWaktu('0.5')
    setBobotLokasi('0.5')
    setKualifikasiId('')
  }

  const handleEditClick = (item) => {
    setEditId(item.id)
    setNamaLayanan(item.namaLayanan)
    setEstimasiDurasi(item.estimasiDurasi)
    setBobotWaktu(item.bobotWaktu)
    setBobotLokasi(item.bobotLokasi)
    setKualifikasiId(item.kualifikasiId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const data = {
      namaLayanan,
      estimasiDurasi: parseInt(estimasiDurasi),
      bobotWaktu: parseFloat(bobotWaktu),
      bobotLokasi: parseFloat(bobotLokasi),
      kualifikasiId: parseInt(kualifikasiId)
    }

    try {
      if (editId) {
        await updateJenisLayanan(editId, data)
      } else {
        await createJenisLayanan(data)
      }
      resetForm()
      ambilData()
    } catch (err) {
      setError(err.response?.data?.pesan || 'Gagal menyimpan data')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus jenis layanan ini?')) return

    try {
      await deleteJenisLayanan(id)
      ambilData()
    } catch (err) {
      alert(err.response?.data?.pesan || 'Gagal menghapus (kemungkinan masih dipakai di kunjungan)')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px' }}>
      <Navbar />

      <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: 'var(--sambang-navy)' }}>
              Kelola Jenis Layanan
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--sambang-muted)' }}>
              Atur layanan, estimasi durasi, dan bobot prioritas lintas sektor.
            </p>
          </div>
          <Link to="/dashboard" className="sambang-btn sambang-btn-secondary sambang-btn-sm">
            Kembali ke Dashboard
          </Link>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="sambang-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 750, color: 'var(--sambang-navy)' }}>
            {editId ? 'Edit Jenis Layanan' : 'Tambah Jenis Layanan Baru'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div className="sambang-field">
              <label>Nama Layanan *</label>
              <div className="sambang-field-wrap">
                <input
                  type="text"
                  placeholder="Contoh: Kunjungan Perawat"
                  value={namaLayanan}
                  onChange={(e) => setNamaLayanan(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="sambang-field">
              <label>Kualifikasi yang Dibutuhkan *</label>
              <div className="sambang-field-wrap">
                <select
                  value={kualifikasiId}
                  onChange={(e) => setKualifikasiId(e.target.value)}
                  required
                >
                  <option value="">-- Pilih Kualifikasi --</option>
                  {kualifikasiList.map((k) => (
                    <option key={k.id} value={k.id}>{k.namaKualifikasi}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sambang-field">
              <label>Estimasi Durasi (menit) *</label>
              <div className="sambang-field-wrap">
                <input
                  type="number"
                  placeholder="Contoh: 60"
                  value={estimasiDurasi}
                  onChange={(e) => setEstimasiDurasi(e.target.value)}
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="sambang-field">
              <label>Bobot Waktu (0-1) / Bobot Lokasi (0-1)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="sambang-field-wrap" style={{ flex: 1 }}>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={bobotWaktu}
                    onChange={(e) => setBobotWaktu(e.target.value)}
                    placeholder="Waktu"
                    required
                  />
                </div>
                <div className="sambang-field-wrap" style={{ flex: 1 }}>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={bobotLokasi}
                    onChange={(e) => setBobotLokasi(e.target.value)}
                    placeholder="Lokasi"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '12px', color: 'var(--sambang-muted)' }}>
            Catatan: Bobot waktu + bobot lokasi sebaiknya berjumlah 1.0.
          </p>

          {error && <p className="sambang-error">{error}</p>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={submitting}
              className="sambang-btn sambang-btn-primary sambang-btn-sm"
            >
              {submitting ? 'Menyimpan...' : editId ? 'Perbarui Layanan' : 'Tambah Layanan'}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="sambang-btn sambang-btn-secondary sambang-btn-sm"
              >
                Batal
              </button>
            )}
          </div>
        </form>

        {/* Table */}
        <div className="sambang-table-wrap">
          <table className="sambang-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Layanan</th>
                <th>Kualifikasi</th>
                <th>Durasi</th>
                <th>Bobot Waktu / Lokasi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>Memuat data layanan...</td>
                </tr>
              ) : (
                list.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td><strong>{item.namaLayanan}</strong></td>
                    <td>{item.kualifikasi?.namaKualifikasi || '-'}</td>
                    <td>{item.estimasiDurasi} menit</td>
                    <td>
                      <span className="sambang-badge badge-prioritas-sedang">
                        {item.bobotWaktu} / {item.bobotLokasi}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          type="button"
                          onClick={() => handleEditClick(item)}
                          style={{ border: 0, background: 'transparent', color: 'var(--sambang-blue)', fontWeight: 650, cursor: 'pointer', fontSize: '12.5px' }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          style={{ border: 0, background: 'transparent', color: '#ef4444', fontWeight: 650, cursor: 'pointer', fontSize: '12.5px' }}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!loading && list.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--sambang-muted)' }}>
                    Belum ada jenis layanan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default KelolaJenisLayanan