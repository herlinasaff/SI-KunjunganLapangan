import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import BuatKunjungan from './pages/BuatKunjungan'
import DaftarKunjungan from './pages/DaftarKunjungan'
import CekStatus from './pages/CekStatus'
import KelolaKlien from './pages/KelolaKlien'
import KelolaJenisLayanan from './pages/KelolaJenisLayanan'
import KelolaKualifikasi from './pages/KelolaKualifikasi'
import KelolaPetugas from './pages/KelolaPetugas'
import Landing from './pages/Landing'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/cek-status" element={<CekStatus />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/kunjungan" element={<ProtectedRoute><DaftarKunjungan /></ProtectedRoute>} />
        <Route path="/kunjungan/baru" element={<ProtectedRoute><BuatKunjungan /></ProtectedRoute>} />
        <Route path="/klien" element={<ProtectedRoute><KelolaKlien /></ProtectedRoute>} />
        <Route path="/jenis-layanan" element={<ProtectedRoute><KelolaJenisLayanan /></ProtectedRoute>} />
        <Route path="/kualifikasi" element={<ProtectedRoute><KelolaKualifikasi /></ProtectedRoute>} />
        <Route path="/petugas" element={<ProtectedRoute><KelolaPetugas /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App