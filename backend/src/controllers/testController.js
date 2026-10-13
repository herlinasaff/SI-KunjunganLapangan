const prisma = require('../config/prisma')

const testDb = async (req, res) => {
  try {
    const jumlahUser = await prisma.user.count()
    res.json({
      status: 'berhasil',
      pesan: 'Koneksi ke database berhasil',
      jumlahUser: jumlahUser
    })
  } catch (error) {
    res.status(500).json({
      status: 'gagal',
      pesan: 'Koneksi ke database gagal',
      error: error.message
    })
  }
}

module.exports = { testDb }