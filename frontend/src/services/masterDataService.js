import api from './api'

const getHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export const getAllKlien = async () => {
  const response = await api.get('/klien', getHeader())
  return response.data
}

const getHeaderWithJson = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})

export const createKlien = async (data) => {
  const response = await api.post('/klien', data, getHeader())
  return response.data
}

export const updateKlien = async (id, data) => {
  const response = await api.put(`/klien/${id}`, data, getHeader())
  return response.data
}

export const deleteKlien = async (id) => {
  const response = await api.delete(`/klien/${id}`, getHeader())
  return response.data
}

export const getAllPetugas = async () => {
  const response = await api.get('/petugas', getHeader())
  return response.data
}

export const createPetugasProfil = async (data) => {
  const response = await api.post('/petugas', data, getHeader())
  return response.data
}

export const deletePetugasProfil = async (id) => {
  const response = await api.delete(`/petugas/${id}`, getHeader())
  return response.data
}

export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const getAllJenisLayanan = async () => {
  const response = await api.get('/jenis-layanan', getHeader())
  return response.data
}

export const createJenisLayanan = async (data) => {
  const response = await api.post('/jenis-layanan', data, getHeader())
  return response.data
}

export const updateJenisLayanan = async (id, data) => {
  const response = await api.put(`/jenis-layanan/${id}`, data, getHeader())
  return response.data
}

export const deleteJenisLayanan = async (id) => {
  const response = await api.delete(`/jenis-layanan/${id}`, getHeader())
  return response.data
}

export const getAllKualifikasi = async () => {
  const response = await api.get('/kualifikasi', getHeader())
  return response.data
}

export const createKualifikasi = async (data) => {
  const response = await api.post('/kualifikasi', data, getHeader())
  return response.data
}

export const updateKualifikasi = async (id, data) => {
  const response = await api.put(`/kualifikasi/${id}`, data, getHeader())
  return response.data
}

export const deleteKualifikasi = async (id) => {
  const response = await api.delete(`/kualifikasi/${id}`, getHeader())
  return response.data
}

export const updatePetugasProfil = async (id, data) => {
  const response = await api.put(`/petugas/${id}`, data, getHeader())
  return response.data
}