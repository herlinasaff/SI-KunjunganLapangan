import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  getAllKualifikasi,
  createKualifikasi,
  updateKualifikasi,
  deleteKualifikasi
} from '../services/masterDataService'
import '../styles/Sambang.css'

function KelolaKualifikasi() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [namaKualifikasi, setNamaKualifikasi] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editId, setEditId] = useState(null)

  const ambilData = async () => {
    try {
      const data = await getAllKualifikasi()
      setList(data || [])
    } catch (err) {
      setError('Gagal mengambil data kualifikasi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ambilData()
  }, [])

  const resetForm = () => {
    setEditId(null)
    setNamaKualifikasi('')
  }

  const handleEditClick = (item) => {
    setEditId(item.id)
    setNamaKualifikasi(item.namaKualifikasi)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (editId) {
        await updateKualifikasi(editId, { namaKualifikasi })
      } else {
        await createKualifikasi({ namaKualifikasi })
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
    if (!confirm('Yakin ingin menghapus kualifikasi ini?')) return

    try {
      await deleteKualifikasi(id)
      ambilData()
    } catch (err) {
      alert(err.response?.data?.pesan || 'Gagal menghapus (kemungkinan masih dipakai di jenis layanan atau petugas)')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px' }}>
      <Navbar />

      <main style={{ maxWidth: '840px', margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: 'var(--sambang-navy)' }}>
              Kelola Kualifikasi
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--sambang-muted)' }}>
              Atur spesialisasi dan keahlian petugas lapangan.
            </p>
          </div>
          <Link to="/dashboard" className="sambang-btn sambang-btn-secondary sambang-btn-sm">
            Kembali ke Dashboard
          </Link>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="sambang-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 750, color: 'var(--sambang-navy)' }}>
            {editId ? 'Edit Kualifikasi' : 'Tambah Kualifikasi Baru'}
          </h2>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="sambang-field-wrap" style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Nama Kualifikasi (contoh: Perawat, Teknisi AC, Surveyor)"
                value={namaKualifikasi}
                onChange={(e) => setNamaKualifikasi(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="sambang-btn sambang-btn-primary"
              style={{ minHeight: '49px' }}
            >
              {submitting ? '...' : editId ? 'Perbarui' : 'Tambah'}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="sambang-btn sambang-btn-secondary"
                style={{ minHeight: '49px' }}
              >
                Batal
              </button>
            )}
          </div>

          {error && <p className="sambang-error">{error}</p>}
        </form>

        {/* Table */}
        <div className="sambang-table-wrap">
          <table className="sambang-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>No</th>
                <th>Nama Kualifikasi</th>
                <th style={{ width: '140px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '24px' }}>Memuat data kualifikasi...</td>
                </tr>
              ) : (
                list.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td><strong>{item.namaKualifikasi}</strong></td>
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
                  <td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: 'var(--sambang-muted)' }}>
                    Belum ada data kualifikasi.
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

export default KelolaKualifikasi