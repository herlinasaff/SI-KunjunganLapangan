import api from './api'

export const getAllKunjungan = async () => {
  const token = localStorage.getItem('token')
  const response = await api.get('/kunjungan', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const createKunjungan = async (data) => {
  const token = localStorage.getItem('token')
  const response = await api.post('/kunjungan', data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const getKunjunganByTiket = async (kodeTiket) => {
  const response = await api.get(`/kunjungan/tiket/${kodeTiket}`)
  return response.data
}

export const updateStatusKunjungan = async (id, status, alasanGagal) => {
  const token = localStorage.getItem('token')
  const response = await api.patch(
    `/kunjungan/${id}/status`,
    { status, alasanGagal },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data
}