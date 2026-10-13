const prisma = require('../config/prisma')

const createKualifikasi = async (req, res) => {
  try {
    const { namaKualifikasi } = req.body

    const kualifikasi = await prisma.kualifikasi.create({
      data: { namaKualifikasi }
    })

    res.status(201).json(kualifikasi)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal menambah kualifikasi', error: error.message })
  }
}

const getAllKualifikasi = async (req, res) => {
  try {
    const data = await prisma.kualifikasi.findMany()
    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message })
  }
}

const getKualifikasiById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await prisma.kualifikasi.findUnique({
      where: { id: parseInt(id) }
    })

    if (!data) {
      return res.status(404).json({ pesan: 'Kualifikasi tidak ditemukan' })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message })
  }
}

const updateKualifikasi = async (req, res) => {
  try {
    const { id } = req.params
    const { namaKualifikasi } = req.body

    const data = await prisma.kualifikasi.update({
      where: { id: parseInt(id) },
      data: { namaKualifikasi }
    })

    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengubah data', error: error.message })
  }
}

const deleteKualifikasi = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.kualifikasi.delete({ where: { id: parseInt(id) } })
    res.json({ pesan: 'Kualifikasi berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal menghapus data', error: error.message })
  }
}

module.exports = {
  createKualifikasi,
  getAllKualifikasi,
  getKualifikasiById,
  updateKualifikasi,
  deleteKualifikasi
}