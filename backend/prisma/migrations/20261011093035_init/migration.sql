-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'petugas', 'klien');

-- CreateEnum
CREATE TYPE "StatusKunjungan" AS ENUM ('menunggu', 'dijadwalkan', 'dalam_perjalanan', 'tiba', 'selesai', 'gagal');

-- CreateEnum
CREATE TYPE "StatusKirim" AS ENUM ('terkirim', 'gagal');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "no_telepon" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "petugas_profil" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "area_kerja" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),

    CONSTRAINT "petugas_profil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kualifikasi" (
    "id" SERIAL NOT NULL,
    "nama_kualifikasi" TEXT NOT NULL,

    CONSTRAINT "kualifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "petugas_kualifikasi" (
    "id" SERIAL NOT NULL,
    "petugas_id" INTEGER NOT NULL,
    "kualifikasi_id" INTEGER NOT NULL,

    CONSTRAINT "petugas_kualifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_layanan" (
    "id" SERIAL NOT NULL,
    "nama_layanan" TEXT NOT NULL,
    "estimasi_durasi" INTEGER NOT NULL,
    "bobot_waktu" DECIMAL(3,2) NOT NULL DEFAULT 0.5,
    "bobot_lokasi" DECIMAL(3,2) NOT NULL DEFAULT 0.5,
    "kualifikasi_id" INTEGER NOT NULL,

    CONSTRAINT "jenis_layanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "klien" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "no_telepon" TEXT NOT NULL,
    "alamat" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "data_tambahan" JSONB,

    CONSTRAINT "klien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kunjungan" (
    "id" SERIAL NOT NULL,
    "klien_id" INTEGER NOT NULL,
    "petugas_id" INTEGER,
    "jenis_layanan_id" INTEGER NOT NULL,
    "jadwal_mulai" TIMESTAMP(3) NOT NULL,
    "skor_prioritas" DECIMAL(5,2),
    "status" "StatusKunjungan" NOT NULL DEFAULT 'menunggu',
    "alasan_gagal" TEXT,
    "kode_tiket" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kunjungan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifikasi" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "kunjungan_id" INTEGER NOT NULL,
    "jenis_notifikasi" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "status_kirim" "StatusKirim" NOT NULL DEFAULT 'terkirim',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "petugas_profil_user_id_key" ON "petugas_profil"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "kunjungan_kode_tiket_key" ON "kunjungan"("kode_tiket");

-- AddForeignKey
ALTER TABLE "petugas_profil" ADD CONSTRAINT "petugas_profil_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "petugas_kualifikasi" ADD CONSTRAINT "petugas_kualifikasi_petugas_id_fkey" FOREIGN KEY ("petugas_id") REFERENCES "petugas_profil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "petugas_kualifikasi" ADD CONSTRAINT "petugas_kualifikasi_kualifikasi_id_fkey" FOREIGN KEY ("kualifikasi_id") REFERENCES "kualifikasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jenis_layanan" ADD CONSTRAINT "jenis_layanan_kualifikasi_id_fkey" FOREIGN KEY ("kualifikasi_id") REFERENCES "kualifikasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kunjungan" ADD CONSTRAINT "kunjungan_klien_id_fkey" FOREIGN KEY ("klien_id") REFERENCES "klien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kunjungan" ADD CONSTRAINT "kunjungan_petugas_id_fkey" FOREIGN KEY ("petugas_id") REFERENCES "petugas_profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kunjungan" ADD CONSTRAINT "kunjungan_jenis_layanan_id_fkey" FOREIGN KEY ("jenis_layanan_id") REFERENCES "jenis_layanan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_kunjungan_id_fkey" FOREIGN KEY ("kunjungan_id") REFERENCES "kunjungan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
