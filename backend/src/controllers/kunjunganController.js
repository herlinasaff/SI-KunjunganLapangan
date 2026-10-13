const prisma = require('../config/prisma')
const { hitungSkorPrioritas } = require('../utils/prioritasUtils') 

// Fungsi kecil untuk generate kode tiket acak, contoh: TKT-7X9K2M
const generateKodeTiket = () => {
  const karakter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let kode = 'TKT-'
  for (let i = 0; i < 6; i++) {
    kode += karakter.charAt(Math.floor(Math.random() * karakter.length))
  }
  return kode
}

const includeRelasi = {
  klien: true,
  petugas: {
    include: { user: { select: { id: true, nama: true, noTelepon: true } } }
  },
  jenisLayanan: true
}

const createKunjungan = async (req, res) => {
  try {
    const { klienId, petugasId, jenisLayananId, jadwalMulai } = req.body

    // Ambil data klien, petugas, dan jenis layanan dulu (untuk bahan hitung skor)
    const klien = await prisma.klien.findUnique({ where: { id: klienId } })
    const jenisLayanan = await prisma.jenisLayanan.findUnique({ where: { id: jenisLayananId } })

    let petugas = null
    if (petugasId) {
      petugas = await prisma.petugasProfil.findUnique({ where: { id: petugasId } })
    }

    const skorPrioritas = hitungSkorPrioritas({
      jadwalMulai,
      bobotWaktu: jenisLayanan.bobotWaktu,
      bobotLokasi: jenisLayanan.bobotLokasi,
      latKlien: klien.latitude,
      lonKlien: klien.longitude,
      latPetugas: petugas ? petugas.latitude : null,
      lonPetugas: petugas ? petugas.longitude : null
    })

    const kunjungan = await prisma.kunjungan.create({
      data: {
        klienId,
        petugasId: petugasId || null,
        jenisLayananId,
        jadwalMulai: new Date(jadwalMulai),
        kodeTiket: generateKodeTiket(),
        status: 'menunggu',
        skorPrioritas
      },
      include: includeRelasi
    })

    res.status(201).json(kunjungan)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal membuat kunjungan', error: error.message })
  }
}

const getAllKunjungan = async (req, res) => {
  try {
    const { id: userId, role } = req.user

    // Siapkan filter kosong dulu (artinya: tampilkan semua)
    let filter = {}

    // Kalau yang login adalah petugas, filter hanya kunjungan miliknya
    if (role === 'petugas') {
      const petugasProfil = await prisma.petugasProfil.findUnique({
        where: { userId: userId }
      })

      if (!petugasProfil) {
        return res.json([]) // kalau petugas belum punya profil, tampilkan kosong
      }

      filter = { petugasId: petugasProfil.id }
    }

    const data = await prisma.kunjungan.findMany({
      where: filter,
      include: includeRelasi,
      orderBy: { skorPrioritas: { sort: 'desc', nulls: 'last' } }
    })
    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message })
  }
}

const getKunjunganById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await prisma.kunjungan.findUnique({
      where: { id: parseInt(id) },
      include: includeRelasi
    })

    if (!data) {
      return res.status(404).json({ pesan: 'Kunjungan tidak ditemukan' })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message })
  }
}

// Endpoint khusus: cek status pakai kode tiket (tanpa perlu login/token)
const getKunjunganByTiket = async (req, res) => {
  try {
    const { kodeTiket } = req.params
    const data = await prisma.kunjungan.findUnique({
      where: { kodeTiket },
      include: includeRelasi
    })

    if (!data) {
      return res.status(404).json({ pesan: 'Kode tiket tidak ditemukan' })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengambil data', error: error.message })
  }
}

// Update status kunjungan (dipakai petugas: menunggu -> dijadwalkan -> dalam_perjalanan -> tiba -> selesai/gagal)
const updateStatusKunjungan = async (req, res) => {
  try {
    const { id } = req.params
    const { status, alasanGagal } = req.body

    const data = await prisma.kunjungan.update({
      where: { id: parseInt(id) },
      data: { status, alasanGagal },
      include: includeRelasi
    })

    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengubah status', error: error.message })
  }
}

const updateKunjungan = async (req, res) => {
  try {
    const { id } = req.params
    const { petugasId, jenisLayananId, jadwalMulai } = req.body

    const data = await prisma.kunjungan.update({
      where: { id: parseInt(id) },
      data: {
        petugasId,
        jenisLayananId,
        jadwalMulai: jadwalMulai ? new Date(jadwalMulai) : undefined
      },
      include: includeRelasi
    })

    res.json(data)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mengubah data', error: error.message })
  }
}

const deleteKunjungan = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.kunjungan.delete({ where: { id: parseInt(id) } })
    res.json({ pesan: 'Kunjungan berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal menghapus data', error: error.message })
  }
}

module.exports = {
  createKunjungan,
  getAllKunjungan,
  getKunjunganById,
  getKunjunganByTiket,
  updateStatusKunjungan,
  updateKunjungan,
  deleteKunjungan
}