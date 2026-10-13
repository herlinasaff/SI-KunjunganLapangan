const prisma = require('../config/prisma')

// Create - tambah jenis layanan baru
const createJenisLayanan = async (req, res) => {
  try {
    const { namaLayanan, estimasiDurasi, bobotWaktu, bobotLokasi, kualifikasiId } = req.body

    const jenisLayanan = await prisma.jenisLayanan.create({
      data: {
        namaLayanan,
        estimasiDurasi,
        bobotWaktu,
        bobotLokasi,
        kualifikasiId
      }
    })

    res.status(201).json(jenisLayanan)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal menambah jenis layanan', error: error.message })
  }
}

// Read - lihat semua jenis layanan
const getAllJenisLayanan = async (req, res) => {
  try {
    const data = await prisma.jenisLayanan.findMany({
      include: { kualifikasi: true }
    })
    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message })
  }
}

// Read - lihat satu jenis layanan berdasarkan id
const getJenisLayananById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await prisma.jenisLayanan.findUnique({
      where: { id: parseInt(id) },
      include: { kualifikasi: true }
    })

    if (!data) {
      return res.status(404).json({ pesan: 'Jenis layanan tidak ditemukan' })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message })
  }
}

// Update - ubah jenis layanan
const updateJenisLayanan = async (req, res) => {
  try {
    const { id } = req.params
    const { namaLayanan, estimasiDurasi, bobotWaktu, bobotLokasi, kualifikasiId } = req.body

    const data = await prisma.jenisLayanan.update({
      where: { id: parseInt(id) },
      data: { namaLayanan, estimasiDurasi, bobotWaktu, bobotLokasi, kualifikasiId }
    })

    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengubah data', error: error.message })
  }
}

// Delete - hapus jenis layanan
const deleteJenisLayanan = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.jenisLayanan.delete({ where: { id: parseInt(id) } })
    res.json({ pesan: 'Jenis layanan berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal menghapus data', error: error.message })
  }
}

module.exports = {
  createJenisLayanan,
  getAllJenisLayanan,
  getJenisLayananById,
  updateJenisLayanan,
  deleteJenisLayanan
}