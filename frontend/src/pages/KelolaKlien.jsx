import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getAllKlien, createKlien, updateKlien, deleteKlien } from '../services/masterDataService'
import '../styles/Sambang.css'

function KelolaKlien() {
  const [klienList, setKlienList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [nama, setNama] = useState('')
  const [noTelepon, setNoTelepon] = useState('')
  const [alamat, setAlamat] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [editId, setEditId] = useState(null)

  const ambilData = async () => {
    try {
      const data = await getAllKlien()
      setKlienList(data || [])
    } catch (err) {
      setError('Gagal mengambil data klien')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ambilData()
  }, [])

  const resetForm = () => {
    setEditId(null)
    setNama('')
    setNoTelepon('')
    setAlamat('')
  }

  const handleEditClick = (klien) => {
    setEditId(klien.id)
    setNama(klien.nama)
    setNoTelepon(klien.noTelepon)
    setAlamat(klien.alamat || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (editId) {
        await updateKlien(editId, { nama, noTelepon, alamat })
      } else {
        await createKlien({ nama, noTelepon, alamat })
      }
      resetForm()
      ambilData()
    } catch (err) {
      setError(err.response?.data?.pesan || 'Gagal menyimpan data klien')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus klien ini?')) return

    try {
      await deleteKlien(id)
      ambilData()
    } catch (err) {
      alert(err.response?.data?.pesan || 'Gagal menghapus klien (kemungkinan masih memiliki riwayat kunjungan)')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px' }}>
      <Navbar />

      <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: 'var(--sambang-navy)' }}>
              Kelola Klien
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--sambang-muted)' }}>
              Kelola direktori klien dan riwayat kontak untuk kunjungan lapangan.
            </p>
          </div>
          <Link to="/kunjungan" className="sambang-btn sambang-btn-secondary sambang-btn-sm">
            Lihat Kunjungan
          </Link>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="sambang-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 750, color: 'var(--sambang-navy)' }}>
            {editId ? 'Edit Data Klien' : 'Tambah Klien Baru'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div className="sambang-field">
              <label>Nama Klien *</label>
              <div className="sambang-field-wrap">
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="sambang-field">
              <label>Nomor Telepon / WhatsApp *</label>
              <div className="sambang-field-wrap">
                <input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={noTelepon}
                  onChange={(e) => setNoTelepon(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="sambang-field" style={{ gridColumn: 'span 1' }}>
              <label>Alamat Lengkap</label>
              <div className="sambang-field-wrap">
                <input
                  type="text"
                  placeholder="Contoh: Jl. Melati No. 12, Bandung"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && <p className="sambang-error">{error}</p>}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start' }}>
            <button
              type="submit"
              disabled={submitting}
              className="sambang-btn sambang-btn-primary sambang-btn-sm"
            >
              {submitting ? 'Menyimpan...' : editId ? 'Perbarui Klien' : 'Tambah Klien'}
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
                <th>Nama Klien</th>
                <th>No. Telepon</th>
                <th>Alamat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>Memuat data klien...</td>
                </tr>
              ) : (
                klienList.map((k, idx) => (
                  <tr key={k.id}>
                    <td>{idx + 1}</td>
                    <td><strong>{k.nama}</strong></td>
                    <td>{k.noTelepon}</td>
                    <td>{k.alamat || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          type="button"
                          onClick={() => handleEditClick(k)}
                          style={{ border: 0, background: 'transparent', color: 'var(--sambang-blue)', fontWeight: 650, cursor: 'pointer', fontSize: '12.5px' }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(k.id)}
                          style={{ border: 0, background: 'transparent', color: '#ef4444', fontWeight: 650, cursor: 'pointer', fontSize: '12.5px' }}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!loading && klienList.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--sambang-muted)' }}>
                    Belum ada data klien.
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

export default KelolaKlien