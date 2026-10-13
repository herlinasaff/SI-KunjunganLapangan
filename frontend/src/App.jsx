import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import BuatKunjungan from './pages/BuatKunjungan'
import CekStatus from './pages/CekStatus'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/kunjungan/baru" element={<ProtectedRoute><BuatKunjungan /></ProtectedRoute>} />
        <Route path="/cek-status" element={<CekStatus />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App