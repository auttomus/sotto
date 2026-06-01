import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Memulai proses seeding data master Sotto Platform ===');

  // ── 1. SEKOLAH (SCHOOLS) ──────────────────────────────────────
  const school1 = await prisma.school.upsert({
    where: { npsn: '50103175' },
    update: {},
    create: {
      npsn: '50103175',
      name: 'SMK Negeri 1 Denpasar',
      domain: 'smkn1denpasar.sch.id',
      city: 'Denpasar',
      isVerified: true,
    },
  });

  const school2 = await prisma.school.upsert({
    where: { npsn: '20100586' },
    update: {},
    create: {
      npsn: '20100586',
      name: 'SMK Negeri 4 Bandung',
      domain: 'smkn4bdg.sch.id',
      city: 'Bandung',
      isVerified: true,
    },
  });

  const school3 = await prisma.school.upsert({
    where: { npsn: '20532247' },
    update: {},
    create: {
      npsn: '20532247',
      name: 'SMK Negeri 2 Surabaya',
      domain: 'smkn2surabaya.sch.id',
      city: 'Surabaya',
      isVerified: true,
    },
  });
  console.log('[OK] 3 Sekolah terdaftar.');

  // ── 2. JURUSAN (MAJORS) ──────────────────────────────────────
  const skensaMajors = [
    'Teknik Konstruksi dan Perumahan',
    'Desain Pemodelan dan Informasi Bangunan',
    'Teknik Instalasi Tenaga Listrik',
    'Teknik Pemanasan, Tata Udara dan Pendinginan',
    'Teknik Pemesinan',
    'Teknik Elektronika Industri',
    'Teknik Kendaraan Ringan',
    'Teknik Sepeda Motor',
    'Teknik Komputer dan Jaringan',
    'Rekayasa Perangkat Lunak',
    'Desain Komunikasi Visual',
    'Produksi Film',
  ];

  for (const name of skensaMajors) {
    await prisma.major.upsert({
      where: {
        schoolId_name: { schoolId: school1.id, name },
      },
      update: {},
      create: { name, schoolId: school1.id },
    });
  }

  await prisma.major.upsert({
    where: { schoolId_name: { schoolId: school2.id, name: 'Multimedia' } },
    update: {},
    create: { name: 'Multimedia', schoolId: school2.id },
  });

  await prisma.major.upsert({
    where: { schoolId_name: { schoolId: school2.id, name: 'Animasi' } },
    update: {},
    create: { name: 'Animasi', schoolId: school2.id },
  });

  await prisma.major.upsert({
    where: {
      schoolId_name: {
        schoolId: school3.id,
        name: 'Teknik Komputer dan Jaringan',
      },
    },
    update: {},
    create: { name: 'Teknik Komputer dan Jaringan', schoolId: school3.id },
  });
  console.log(`[OK] ${skensaMajors.length + 3} Jurusan terdaftar.`);

  // ── 3. KATEGORI TAGS (SYNERGY DIMENSIONS) ─────────────────────
  const categoryTags = [
    'Frontend',
    'Backend',
    'UI/UX',
    'Audio/Video',
    'Bisnis',
    'Mobile App',
    '3D Modeling',
  ];
  for (const name of categoryTags) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name, isUsable: true },
    });
  }
  console.log(`[OK] ${categoryTags.length} Kategori tag terdaftar.`);

  console.log('=== Proses database seeding Sotto Platform SUKSES PENUH! ===');
}

main()
  .catch((e) => {
    console.error('Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
