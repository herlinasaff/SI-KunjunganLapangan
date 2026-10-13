import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { createKunjungan } from '../services/kunjunganService'
import { getAllKlien, getAllPetugas, getAllJenisLayanan } from '../services/masterDataService'

function BuatKunjungan() {
  const navigate = useNavigate()

  const [klienList, setKlienList] = useState([])
  const [petugasList, setPetugasList] = useState([])
  const [jenisLayananList, setJenisLayananList] = useState([])

  const [klienId, setKlienId] = useState('')
  const [petugasId, setPetugasId] = useState('')
  const [jenisLayananId, setJenisLayananId] = useState('')
  const [jadwalMulai, setJadwalMulai] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const ambilMasterData = async () => {
      try {
        const [klien, petugas, jenisLayanan] = await Promise.all([
          getAllKlien(),
          getAllPetugas(),
          getAllJenisLayanan()
        ])
        setKlienList(klien)
        setPetugasList(petugas)
        setJenisLayananList(jenisLayanan)
      } catch (err) {
        setError('Gagal mengambil data master')
      }
    }

    ambilMasterData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await createKunjungan({
        klienId: parseInt(klienId),
        petugasId: petugasId ? parseInt(petugasId) : null,
        jenisLayananId: parseInt(jenisLayananId),
        jadwalMulai: new Date(jadwalMulai).toISOString()
      })

      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.pesan || 'Gagal membuat kunjungan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="p-8 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Buat Kunjungan Baru</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Klien</label>
            <select
              value={klienId}
              onChange={(e) => setKlienId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">-- Pilih Klien --</option>
              {klienList.map((k) => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Layanan</label>
            <select
              value={jenisLayananId}
              onChange={(e) => setJenisLayananId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">-- Pilih Jenis Layanan --</option>
              {jenisLayananList.map((j) => (
                <option key={j.id} value={j.id}>{j.namaLayanan}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Petugas <span className="text-gray-400">(opsional)</span>
            </label>
            <select
              value={petugasId}
              onChange={(e) => setPetugasId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">-- Belum ditentukan --</option>
              {petugasList.map((p) => (
                <option key={p.id} value={p.id}>{p.user?.nama}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jadwal Mulai</label>
            <input
              type="datetime-local"
              value={jadwalMulai}
              onChange={(e) => setJadwalMulai(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Buat Kunjungan'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BuatKunjungan