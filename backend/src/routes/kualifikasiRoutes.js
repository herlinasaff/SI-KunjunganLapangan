const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/authMiddleware')

const {
  createKualifikasi,
  getAllKualifikasi,
  getKualifikasiById,
  updateKualifikasi,
  deleteKualifikasi
} = require('../controllers/kualifikasiController')

router.post('/kualifikasi', verifyToken, createKualifikasi)
router.get('/kualifikasi', verifyToken, getAllKualifikasi)
router.get('/kualifikasi/:id', verifyToken, getKualifikasiById)
router.put('/kualifikasi/:id', verifyToken, updateKualifikasi)
router.delete('/kualifikasi/:id', verifyToken, deleteKualifikasi)

module.exports = router