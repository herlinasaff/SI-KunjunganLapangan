const prisma = require('../config/prisma')

const createKlien = async (req, res) => {
  try {
    const { nama, noTelepon, alamat, latitude, longitude, dataTambahan } = req.body

    const klien = await prisma.klien.create({
      data: { nama, noTelepon, alamat, latitude, longitude, dataTambahan }
    })

    res.status(201).json(klien)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal menambah klien', error: error.message })
  }
}

const getAllKlien = async (req, res) => {
  try {
    const data = await prisma.klien.findMany()
    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message })
  }
}

const getKlienById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await prisma.klien.findUnique({
      where: { id: parseInt(id) }
    })

    if (!data) {
      return res.status(404).json({ pesan: 'Klien tidak ditemukan' })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message })
  }
}

const updateKlien = async (req, res) => {
  try {
    const { id } = req.params
    const { nama, noTelepon, alamat, latitude, longitude, dataTambahan } = req.body

    const data = await prisma.klien.update({
      where: { id: parseInt(id) },
      data: { nama, noTelepon, alamat, latitude, longitude, dataTambahan }
    })

    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengubah data', error: error.message })
  }
}

const deleteKlien = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.klien.delete({ where: { id: parseInt(id) } })
    res.json({ pesan: 'Klien berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal menghapus data', error: error.message })
  }
}

module.exports = {
  createKlien,
  getAllKlien,
  getKlienById,
  updateKlien,
  deleteKlien
}