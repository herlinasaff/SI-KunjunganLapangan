const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/authMiddleware')

const {
  createKlien,
  getAllKlien,
  getKlienById,
  updateKlien,
  deleteKlien
} = require('../controllers/klienController')

router.post('/klien', verifyToken, createKlien)
router.get('/klien', verifyToken, getAllKlien)
router.get('/klien/:id', verifyToken, getKlienById)
router.put('/klien/:id', verifyToken, updateKlien)
router.delete('/klien/:id', verifyToken, deleteKlien)

module.exports = router