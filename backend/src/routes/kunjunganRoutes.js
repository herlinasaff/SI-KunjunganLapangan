const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/authMiddleware')
const {
  createKunjungan,
  getAllKunjungan,
  getKunjunganById,
  getKunjunganByTiket,
  updateStatusKunjungan,
  updateKunjungan,
  deleteKunjungan
} = require('../controllers/kunjunganController')

// Endpoint publik, TANPA verifyToken, karena klien belum tentu punya akun
router.get('/kunjungan/tiket/:kodeTiket', getKunjunganByTiket)

// Endpoint lainnya tetap terproteksi
router.post('/kunjungan', verifyToken, createKunjungan)
router.get('/kunjungan', verifyToken, getAllKunjungan)
router.get('/kunjungan/:id', verifyToken, getKunjunganById)
router.patch('/kunjungan/:id/status', verifyToken, updateStatusKunjungan)
router.put('/kunjungan/:id', verifyToken, updateKunjungan)
router.delete('/kunjungan/:id', verifyToken, deleteKunjungan)

module.exports = router