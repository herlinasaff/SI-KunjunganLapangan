const prisma = require('../config/prisma')

// Field user yang aman ditampilkan (tanpa password)
const userSelectAman = {
  id: true,
  nama: true,
  email: true,
  role: true,
  noTelepon: true
}

// Create - buat profil petugas, sekaligus pilih kualifikasi apa saja yang dimiliki
const createPetugasProfil = async (req, res) => {
  try {
    const { userId, areaKerja, latitude, longitude, kualifikasiIds } = req.body

    const petugas = await prisma.petugasProfil.create({
      data: {
        userId,
        areaKerja,
        latitude,
        longitude,
        kualifikasiList: {
          create: kualifikasiIds.map((kualifikasiId) => ({ kualifikasiId }))
        }
      },
      include: {
        user: { select: userSelectAman },
        kualifikasiList: { include: { kualifikasi: true } }
      }
    })

    res.status(201).json(petugas)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal membuat profil petugas', error: error.message })
  }
}

const getAllPetugasProfil = async (req, res) => {
  try {
    const data = await prisma.petugasProfil.findMany({
      include: {
        user: { select: userSelectAman },
        kualifikasiList: { include: { kualifikasi: true } }
      }
    })
    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message })
  }
}

const getPetugasProfilById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await prisma.petugasProfil.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: userSelectAman },
        kualifikasiList: { include: { kualifikasi: true } }
      }
    })

    if (!data) {
      return res.status(404).json({ pesan: 'Profil petugas tidak ditemukan' })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message })
  }
}

const updatePetugasProfil = async (req, res) => {
  try {
    const { id } = req.params
    const { areaKerja, latitude, longitude } = req.body

    const data = await prisma.petugasProfil.update({
      where: { id: parseInt(id) },
      data: { areaKerja, latitude, longitude }
    })

    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengubah data', error: error.message })
  }
}

const deletePetugasProfil = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.petugasProfil.delete({ where: { id: parseInt(id) } })
    res.json({ pesan: 'Profil petugas berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal menghapus data', error: error.message })
  }
}

module.exports = {
  createPetugasProfil,
  getAllPetugasProfil,
  getPetugasProfilById,
  updatePetugasProfil,
  deletePetugasProfil
}