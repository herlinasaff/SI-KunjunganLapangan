import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">Sistem Kunjungan Lapangan</h1>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm">
            {user.nama} <span className="opacity-75">({user.role})</span>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded text-sm transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar