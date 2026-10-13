const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/authMiddleware')
const {
  createPetugasProfil,
  getAllPetugasProfil,
  getPetugasProfilById,
  updatePetugasProfil,
  deletePetugasProfil
} = require('../controllers/petugasProfilController')

router.post('/petugas', verifyToken, createPetugasProfil)
router.get('/petugas', verifyToken, getAllPetugasProfil)
router.get('/petugas/:id', verifyToken, getPetugasProfilById)
router.put('/petugas/:id', verifyToken, updatePetugasProfil)
router.delete('/petugas/:id', verifyToken, deletePetugasProfil)

module.exports = router