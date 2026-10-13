const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  // Ambil token dari header Authorization
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    return res.status(401).json({ pesan: 'Token tidak ditemukan, silakan login dulu' })
  }

  // Formatnya biasanya "Bearer <token>", kita ambil bagian tokennya saja
  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ pesan: 'Format token tidak valid' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // simpan data user (id, role) supaya bisa dipakai di controller berikutnya
    next() // lanjut ke controller tujuan
  } catch (error) {
    return res.status(403).json({ pesan: 'Token tidak valid atau sudah kadaluarsa' })
  }
}

module.exports = verifyToken