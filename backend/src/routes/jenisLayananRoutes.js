const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/authMiddleware')

const {
  createJenisLayanan,
  getAllJenisLayanan,
  getJenisLayananById,
  updateJenisLayanan,
  deleteJenisLayanan
} = require('../controllers/JenisLayananController')

router.post('/jenis-layanan', verifyToken, createJenisLayanan)
router.get('/jenis-layanan', verifyToken, getAllJenisLayanan)
router.get('/jenis-layanan/:id', verifyToken, getJenisLayananById)
router.put('/jenis-layanan/:id', verifyToken, updateJenisLayanan)
router.delete('/jenis-layanan/:id', verifyToken, deleteJenisLayanan)

module.exports = router