import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Memulai proses seeding data master...');

  // 1. Injeksi Data Sekolah
  const school = await prisma.school.upsert({
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
  console.log(`[OK] Data Sekolah Tersimpan: ${school.name}`);

  // 2. Injeksi Akun & User 1 (Penjual)
  const account1 = await prisma.account.upsert({
    where: { username: 'arya_pranata' },
    update: {},
    create: {
      username: 'arya_pranata',
      displayName: 'Agus Arya Pranata',
      schoolId: school.id,
      major: 'Rekayasa Perangkat Lunak',
      note: 'Fullstack Developer. Siap menerima project web.',
      trustScore: 5.0,
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: 'arya.pranata@smkn1denpasar.sch.id' },
    update: {},
    create: {
      email: 'arya.pranata@smkn1denpasar.sch.id',
      encryptedPassword: 'dummy_hashed_password_1',
      accountId: account1.id,
    },
  });
  console.log(`[OK] Data User Tersimpan: ${seller.email}`);

  // 3. Injeksi Akun & User 2 (Pembeli)
  const account2 = await prisma.account.upsert({
    where: { username: 'client_dummy' },
    update: {},
    create: {
      username: 'client_dummy',
      displayName: 'Dummy Client',
      schoolId: school.id,
      major: 'Desain Komunikasi Visual',
      note: 'Sedang mencari developer untuk project akhir.',
      trustScore: 4.8,
    },
  });

  const buyer = await prisma.user.upsert({
    where: { email: 'client.dummy@smkn1denpasar.sch.id' },
    update: {},
    create: {
      email: 'client.dummy@smkn1denpasar.sch.id',
      encryptedPassword: 'dummy_hashed_password_2',
      accountId: account2.id,
    },
  });
  console.log(`[OK] Data User Tersimpan: ${buyer.email}`);

  console.log('Proses seeding selesai.');
}

main()
  .catch((e) => {
    console.error('Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
