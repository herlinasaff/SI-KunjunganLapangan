// Menghitung jarak antara dua titik koordinat (dalam kilometer)
// Pakai rumus Haversine - rumus standar untuk jarak di permukaan bumi
const hitungJarakKm = (lat1, lon1, lat2, lon2) => {
  const toRadian = (derajat) => (derajat * Math.PI) / 180
  const R = 6371 // radius bumi dalam km

  const dLat = toRadian(lat2 - lat1)
  const dLon = toRadian(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadian(lat1)) *
      Math.cos(toRadian(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

// Menghitung skor prioritas gabungan (waktu + lokasi)
const hitungSkorPrioritas = ({
  jadwalMulai,
  bobotWaktu,
  bobotLokasi,
  latKlien,
  lonKlien,
  latPetugas,
  lonPetugas
}) => {
  // 1. Hitung skor waktu
  const sekarang = new Date()
  const selisihJam = (new Date(jadwalMulai) - sekarang) / (1000 * 60 * 60)
  // Kalau selisihnya negatif (jadwal sudah lewat), anggap 0 supaya tetap dapat skor tinggi
  const selisihJamAman = Math.max(selisihJam, 0)
  const skorWaktu = 1 / (1 + selisihJamAman)

  // 2. Hitung skor lokasi (kalau data koordinat petugas belum ada, skor lokasi dianggap 0)
  let skorLokasi = 0
  if (latPetugas != null && lonPetugas != null && latKlien != null && lonKlien != null) {
    const jarakKm = hitungJarakKm(latKlien, lonKlien, latPetugas, lonPetugas)
    skorLokasi = 1 / (1 + jarakKm)
  }

  // 3. Gabungkan dengan bobot
  const skorPrioritas = Number(bobotWaktu) * skorWaktu + Number(bobotLokasi) * skorLokasi

  return Number(skorPrioritas.toFixed(2))
}

module.exports = { hitungJarakKm, hitungSkorPrioritas }