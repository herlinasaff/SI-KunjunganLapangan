const express = require('express')
const testRoutes = require('./src/routes/testRoutes')
const jenisLayananRoutes = require('./src/routes/jenisLayananRoutes')
const kualifikasiRoutes = require('./src/routes/kualifikasiRoutes')
const klienRoutes = require('./src/routes/klienRoutes')
const authRoutes = require('./src/routes/authRoutes')
const petugasProfilRoutes = require('./src/routes/petugasProfilRoutes')
const kunjunganRoutes = require('./src/routes/kunjunganRoutes')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend jalan!')
})

app.use('/api', testRoutes)
app.use('/api', jenisLayananRoutes)
app.use('/api', kualifikasiRoutes)
app.use('/api', klienRoutes)
app.use('/api', authRoutes)
app.use('/api', petugasProfilRoutes)
app.use('/api', kunjunganRoutes)

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`)
})