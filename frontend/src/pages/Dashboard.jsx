import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllKunjungan, updateStatusKunjungan } from '../services/kunjunganService'
import Navbar from '../components/Navbar'

function Dashboard() {
  const [kunjunganList, setKunjunganList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const ambilData = async () => {
    try {
      const data = await getAllKunjungan()
      setKunjunganList(data)
    } catch (err) {
      setError('Gagal mengambil data kunjungan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ambilData()
  }, [])

  const handleUpdateStatus = async (id, statusBaru) => {
    try {
      await updateStatusKunjungan(id, statusBaru)
      ambilData()
    } catch (err) {
      alert('Gagal mengubah status')
    }
  }

  const warnaStatus = {
    menunggu: 'bg-gray-200 text-gray-700',
    dijadwalkan: 'bg-blue-100 text-blue-700',
    dalam_perjalanan: 'bg-yellow-100 text-yellow-700',
    tiba: 'bg-purple-100 text-purple-700',
    selesai: 'bg-green-100 text-green-700',
    gagal: 'bg-red-100 text-red-700'
  }

  if (loading) {
    return <div className="p-8">Memuat data...</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>
  }

  return (
    <div>
      <Navbar />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Daftar Kunjungan</h1>

          {user?.role === 'admin' && (
            <Link
              to="/kunjungan/baru"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
            >
              + Buat Kunjungan Baru
            </Link>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Kode Tiket</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Klien</th>
                {user?.role === 'petugas' && (
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Kontak Klien</th>
                )}
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Jenis Layanan</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Petugas</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Jadwal</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                {user?.role === 'petugas' && (
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {kunjunganList.map((k) => (
                <tr key={k.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">{k.kodeTiket}</td>
                  <td className="px-4 py-3 text-sm">{k.klien?.nama}</td>
                  {user?.role === 'petugas' && (
                    <td className="px-4 py-3 text-sm">{k.klien?.noTelepon}</td>
                  )}
                  <td className="px-4 py-3 text-sm">{k.jenisLayanan?.namaLayanan}</td>
                  <td className="px-4 py-3 text-sm">{k.petugas?.user?.nama || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(k.jadwalMulai).toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${warnaStatus[k.status]}`}>
                      {k.status.replace('_', ' ')}
                    </span>
                  </td>
                  {user?.role === 'petugas' && (
                    <td className="px-4 py-3 text-sm">
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) handleUpdateStatus(k.id, e.target.value)
                        }}
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                      >
                        <option value="" disabled>Ubah status</option>
                        <option value="dijadwalkan">Dijadwalkan</option>
                        <option value="dalam_perjalanan">Dalam Perjalanan</option>
                        <option value="tiba">Tiba</option>
                        <option value="selesai">Selesai</option>
                        <option value="gagal">Gagal</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard