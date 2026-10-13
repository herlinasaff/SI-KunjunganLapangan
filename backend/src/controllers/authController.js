const bcrypt = require('bcrypt')
const prisma = require('../config/prisma')
const jwt = require('jsonwebtoken')

// Register - buat user baru
const register = async (req, res) => {
  try {
    const { nama, email, password, role, noTelepon } = req.body

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        role,
        noTelepon
      }
    })

    // Jangan kirim balik password (meskipun sudah ter-hash) ke response
    const { password: _, ...userTanpaPassword } = user

    res.status(201).json(userTanpaPassword)
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mendaftar', error: error.message })
  }
}

// Login - cek email & password
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(404).json({ pesan: 'Email tidak ditemukan' })
    }

    // Bandingkan password yang diketik dengan hash yang tersimpan
    const passwordCocok = await bcrypt.compare(password, user.password)

    if (!passwordCocok) {
      return res.status(401).json({ pesan: 'Password salah' })
    }

    const { password: _, ...userTanpaPassword } = user

    // Buat token JWT berisi id dan role user
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({ pesan: 'Login berhasil', user: userTanpaPassword, token })
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal login', error: error.message })
  }
}

module.exports = { register, login }