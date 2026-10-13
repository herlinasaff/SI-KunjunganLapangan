import api from './api'

const getHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export const getAllKlien = async () => {
  const response = await api.get('/klien', getHeader())
  return response.data
}

export const getAllPetugas = async () => {
  const response = await api.get('/petugas', getHeader())
  return response.data
}

export const getAllJenisLayanan = async () => {
  const response = await api.get('/jenis-layanan', getHeader())
  return response.data
}