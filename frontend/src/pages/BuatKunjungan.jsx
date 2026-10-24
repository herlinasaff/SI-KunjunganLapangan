import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { createKunjungan } from '../services/kunjunganService'
import { getAllKlien, getAllPetugas, getAllJenisLayanan } from '../services/masterDataService'
import '../styles/Sambang.css'

function BuatKunjungan() {
  const navigate = useNavigate()

  const [klienList, setKlienList] = useState([])
  const [petugasList, setPetugasList] = useState([])
  const [jenisLayananList, setJenisLayananList] = useState([])

  const [klienId, setKlienId] = useState('')
  const [petugasId, setPetugasId] = useState('')
  const [jenisLayananId, setJenisLayananId] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [waktu, setWaktu] = useState('09:00')
  const [prioritas, setPrioritas] = useState('Tinggi')
  const [catatan, setCatatan] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const ambilMasterData = async () => {
      try {
        const [klien, petugas, jenisLayanan] = await Promise.all([
          getAllKlien(),
          getAllPetugas(),
          getAllJenisLayanan(),
        ])
        setKlienList(klien || [])
        setPetugasList(petugas || [])
        setJenisLayananList(jenisLayanan || [])
      } catch (err) {
        setError('Gagal mengambil data master')
      }
    }

    ambilMasterData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!klienId || !jenisLayananId || !tanggal || !waktu) {
      setError('Mohon lengkapi semua bidang yang bertanda bintang (*).')
      return
    }

    setLoading(true)
    try {
      const combinedDateTime = new Date(`${tanggal}T${waktu}`).toISOString()
      await createKunjungan({
        klienId: parseInt(klienId),
        petugasId: petugasId ? parseInt(petugasId) : null,
        jenisLayananId: parseInt(jenisLayananId),
        jadwalMulai: combinedDateTime,
      })

      navigate('/kunjungan')
    } catch (err) {
      setError(err.response?.data?.pesan || 'Gagal membuat kunjungan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '60px' }}>
      <Navbar />

      <main style={{ maxWidth: '620px', margin: '32px auto', padding: '0 20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Link
            to="/kunjungan"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--sambang-blue)',
              fontSize: '13px',
              fontWeight: 650,
              textDecoration: 'none',
            }}
          >
            ← Kembali ke Daftar Kunjungan
          </Link>
        </div>

        <div className="sambang-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--sambang-navy)' }}>
              Buat Kunjungan Baru
            </h1>
            <Link to="/kunjungan" className="sambang-btn-icon">
              ✕
            </Link>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Pilih Klien * */}
            <div className="sambang-field">
              <label>Pilih Klien *</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="sambang-field-wrap">
                  <select
                    value={klienId}
                    onChange={(e) => setKlienId(e.target.value)}
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
                <Link to="/klien" className="sambang-btn sambang-btn-secondary sambang-btn-sm" style={{ whiteSpace: 'nowrap' }}>
                  + Klien Baru
                </Link>
              </div>
            </div>

            {/* Jenis Layanan * */}
            <div className="sambang-field">
              <label>Jenis Layanan *</label>
              <div className="sambang-field-wrap">
                <select
                  value={jenisLayananId}
                  onChange={(e) => setJenisLayananId(e.target.value)}
                  required
                >
                  <option value="">Pilih jenis layanan</option>
                  {jenisLayananList.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.namaLayanan}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tanggal & Waktu */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="sambang-field">
                <label>Tanggal *</label>
                <div className="sambang-field-wrap">
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sambang-field">
                <label>Waktu *</label>
                <div className="sambang-field-wrap">
                  <input
                    type="time"
                    value={waktu}
                    onChange={(e) => setWaktu(e.target.value)}
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
                  value={petugasId}
                  onChange={(e) => setPetugasId(e.target.value)}
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

            {/* Prioritas */}
            <div className="sambang-field">
              <label>Prioritas *</label>
              <div style={{ display: 'flex', gap: '20px', padding: '6px 0' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="prio"
                    value="Rendah"
                    checked={prioritas === 'Rendah'}
                    onChange={(e) => setPrioritas(e.target.value)}
                  />
                  <span>Rendah</span>
                </label>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="prio"
                    value="Sedang"
                    checked={prioritas === 'Sedang'}
                    onChange={(e) => setPrioritas(e.target.value)}
                  />
                  <span>Sedang</span>
                </label>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="prio"
                    value="Tinggi"
                    checked={prioritas === 'Tinggi'}
                    onChange={(e) => setPrioritas(e.target.value)}
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
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Tambahkan catatan khusus..."
                rows={3}
              />
            </div>

            {error && <p className="sambang-error">{error}</p>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => navigate('/kunjungan')}
                className="sambang-btn sambang-btn-secondary"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="sambang-btn sambang-btn-primary"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default BuatKunjungan