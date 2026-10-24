import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  getAllPetugas,
  createPetugasProfil,
  updatePetugasProfil,
  deletePetugasProfil,
  registerUser,
  getAllKualifikasi
} from '../services/masterDataService'
import '../styles/Sambang.css'

function KelolaPetugas() {
  const [list, setList] = useState([])
  const [kualifikasiList, setKualifikasiList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [noTelepon, setNoTelepon] = useState('')
  const [areaKerja, setAreaKerja] = useState('')
  const [kualifikasiTerpilih, setKualifikasiTerpilih] = useState([])

  const [editId, setEditId] = useState(null)

  const ambilData = async () => {
    try {
      const [petugas, kualifikasi] = await Promise.all([
        getAllPetugas(),
        getAllKualifikasi()
      ])
      setList(petugas || [])
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
    setNama('')
    setEmail('')
    setPassword('')
    setNoTelepon('')
    setAreaKerja('')
    setKualifikasiTerpilih([])
  }

  const toggleKualifikasi = (id) => {
    setKualifikasiTerpilih((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleEditClick = (item) => {
    setEditId(item.id)
    setAreaKerja(item.areaKerja || '')
    setKualifikasiTerpilih(item.kualifikasiList?.map((kl) => kl.kualifikasiId) || [])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (editId) {
        // Mode edit: cuma area kerja & kualifikasi
        await updatePetugasProfil(editId, {
          areaKerja,
          kualifikasiIds: kualifikasiTerpilih
        })
      } else {
        // Mode tambah baru: buat akun user dulu, baru profil petugas
        const user = await registerUser({
          nama,
          email,
          password,
          role: 'petugas',
          noTelepon
        })

        await createPetugasProfil({
          userId: user.id,
          areaKerja,
          kualifikasiIds: kualifikasiTerpilih
        })
      }

      resetForm()
      ambilData()
    } catch (err) {
      setError(err.response?.data?.pesan || 'Gagal menyimpan data petugas')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus petugas ini? (akun user tidak akan ikut terhapus)')) return

    try {
      await deletePetugasProfil(id)
      ambilData()
    } catch (err) {
      alert(err.response?.data?.pesan || 'Gagal menghapus (kemungkinan masih memiliki kunjungan terkait)')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px' }}>
      <Navbar />

      <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: 'var(--sambang-navy)' }}>
              Kelola Petugas
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--sambang-muted)' }}>
              Kelola data akun petugas lapangan, area kerja, dan spesialisasi keahlian.
            </p>
          </div>
          <Link to="/dashboard" className="sambang-btn sambang-btn-secondary sambang-btn-sm">
            Kembali ke Dashboard
          </Link>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="sambang-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 750, color: 'var(--sambang-navy)' }}>
            {editId ? 'Edit Petugas (Area Kerja & Kualifikasi)' : 'Tambah Petugas Baru'}
          </h2>

          {!editId && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div className="sambang-field">
                <label>Nama Petugas *</label>
                <div className="sambang-field-wrap">
                  <input
                    type="text"
                    placeholder="Contoh: Andi Pratama"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sambang-field">
                <label>Email *</label>
                <div className="sambang-field-wrap">
                  <input
                    type="email"
                    placeholder="nama@ruteku.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sambang-field">
                <label>Kata Sandi *</label>
                <div className="sambang-field-wrap">
                  <input
                    type="password"
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sambang-field">
                <label>Nomor Telepon *</label>
                <div className="sambang-field-wrap">
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={noTelepon}
                    onChange={(e) => setNoTelepon(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="sambang-field">
            <label>Wilayah / Area Kerja</label>
            <div className="sambang-field-wrap">
              <input
                type="text"
                placeholder="Contoh: Bandung Tengah & Utara"
                value={areaKerja}
                onChange={(e) => setAreaKerja(e.target.value)}
              />
            </div>
          </div>

          <div className="sambang-field">
            <label>Kualifikasi &amp; Keahlian Petugas</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', padding: '6px 0' }}>
              {kualifikasiList.map((k) => (
                <label
                  key={k.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer',
                    background: kualifikasiTerpilih.includes(k.id) ? 'var(--sambang-blue-light)' : '#f8fafc',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: kualifikasiTerpilih.includes(k.id) ? '#bfdbfe' : 'var(--sambang-border)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={kualifikasiTerpilih.includes(k.id)}
                    onChange={() => toggleKualifikasi(k.id)}
                    style={{ accentColor: 'var(--sambang-blue)', cursor: 'pointer' }}
                  />
                  <span>{k.namaKualifikasi}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="sambang-error">{error}</p>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={submitting}
              className="sambang-btn sambang-btn-primary sambang-btn-sm"
            >
              {submitting ? 'Menyimpan...' : editId ? 'Perbarui Petugas' : 'Tambah Petugas'}
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
                <th>Nama Petugas</th>
                <th>Area Kerja</th>
                <th>Kualifikasi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>Memuat data petugas...</td>
                </tr>
              ) : (
                list.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{item.user?.nama || 'Petugas'}</strong>
                      <br />
                      <span style={{ fontSize: '11px', color: 'var(--sambang-muted)' }}>
                        {item.user?.email} · {item.user?.noTelepon || '-'}
                      </span>
                    </td>
                    <td>{item.areaKerja || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {item.kualifikasiList && item.kualifikasiList.length > 0 ? (
                          item.kualifikasiList.map((kl) => (
                            <span key={kl.id || kl.kualifikasiId} className="sambang-badge badge-menunggu">
                              {kl.kualifikasi?.namaKualifikasi}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: 'var(--sambang-muted)', fontSize: '12px' }}>-</span>
                        )}
                      </div>
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
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--sambang-muted)' }}>
                    Belum ada petugas terdaftar.
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

export default KelolaPetugas