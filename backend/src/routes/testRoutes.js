const express = require('express')
const router = express.Router()
const { testDb } = require('../controllers/testController')

router.get('/test-db', testDb)

module.exports = router