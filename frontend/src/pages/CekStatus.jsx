import { useState } from 'react'
import { getKunjunganByTiket } from '../services/kunjunganService'

const labelStatus = {
  menunggu: 'Menunggu Dijadwalkan',
  dijadwalkan: 'Sudah Dijadwalkan',
  dalam_perjalanan: 'Petugas Dalam Perjalanan',
  tiba: 'Petugas Telah Tiba',
  selesai: 'Kunjungan Selesai',
  gagal: 'Kunjungan Gagal'
}

const warnaStatus = {
  menunggu: 'bg-gray-100 text-gray-700 border-gray-300',
  dijadwalkan: 'bg-blue-100 text-blue-700 border-blue-300',
  dalam_perjalanan: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  tiba: 'bg-purple-100 text-purple-700 border-purple-300',
  selesai: 'bg-green-100 text-green-700 border-green-300',
  gagal: 'bg-red-100 text-red-700 border-red-300'
}

function CekStatus() {
  const [kodeTiket, setKodeTiket] = useState('')
  const [hasil, setHasil] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCek = async (e) => {
    e.preventDefault()
    setError('')
    setHasil(null)
    setLoading(true)

    try {
      const data = await getKunjunganByTiket(kodeTiket.trim())
      setHasil(data)
    } catch (err) {
      setError(err.response?.data?.pesan || 'Kode tiket tidak ditemukan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Cek Status Kunjungan
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Masukkan kode tiket yang Anda terima
        </p>

        <form onSubmit={handleCek} className="flex gap-2 mb-6">
          <input
            type="text"
            value={kodeTiket}
            onChange={(e) => setKodeTiket(e.target.value)}
            placeholder="Contoh: TKT-5I703S"
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? '...' : 'Cek'}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {hasil && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className={`text-center py-2 rounded-md border font-medium ${warnaStatus[hasil.status]}`}>
              {labelStatus[hasil.status]}
            </div>

            <div className="text-sm space-y-1">
              <p><span className="text-gray-500">Jenis Layanan:</span> {hasil.jenisLayanan?.namaLayanan}</p>
              <p><span className="text-gray-500">Petugas:</span> {hasil.petugas?.user?.nama || 'Belum ditentukan'}</p>
              <p>
                <span className="text-gray-500">Jadwal:</span>{' '}
                {new Date(hasil.jadwalMulai).toLocaleString('id-ID')}
              </p>
              {hasil.status === 'gagal' && hasil.alasanGagal && (
                <p className="text-red-600">
                  <span className="text-gray-500">Alasan:</span> {hasil.alasanGagal}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CekStatus