import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Memulai proses seeding data master...');

  // ── 1. Sekolah ──────────────────────────────────────
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
  console.log(`[OK] Sekolah: ${school1.name}`);

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
  console.log(`[OK] Sekolah: ${school2.name}`);

  // ── 2. Kategori Tag (Dimensi Vektor Synergy Engine) ─
  const categoryTags = [
    'Frontend',
    'Backend',
    'UI/UX',
    'Audio/Video',
    'Bisnis',
  ];
  for (const name of categoryTags) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name, isUsable: true },
    });
  }
  console.log(`[OK] ${categoryTags.length} kategori tag tersimpan`);

  // ── 3. Akun & User 1 (Penjual) ─────────────────────
  const account1 = await prisma.account.upsert({
    where: { username: 'arya_pranata' },
    update: {},
    create: {
      username: 'arya_pranata',
      displayName: 'Agus Arya Pranata',
      schoolId: school1.id,
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
  console.log(`[OK] User: ${seller.email}`);

  // ── 4. Akun & User 2 (Pembeli) ─────────────────────
  const account2 = await prisma.account.upsert({
    where: { username: 'client_dummy' },
    update: {},
    create: {
      username: 'client_dummy',
      displayName: 'Dummy Client',
      schoolId: school1.id,
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
  console.log(`[OK] User: ${buyer.email}`);

  // ── 5. Akun & User 3 (Sekolah lain) ────────────────
  const account3 = await prisma.account.upsert({
    where: { username: 'rina_designer' },
    update: {},
    create: {
      username: 'rina_designer',
      displayName: 'Rina Amelia',
      schoolId: school2.id,
      major: 'Multimedia',
      note: 'UI/UX designer. Open for freelance.',
      trustScore: 4.5,
    },
  });

  await prisma.user.upsert({
    where: { email: 'rina.amelia@smkn4bdg.sch.id' },
    update: {},
    create: {
      email: 'rina.amelia@smkn4bdg.sch.id',
      encryptedPassword: 'dummy_hashed_password_3',
      accountId: account3.id,
    },
  });
  console.log(`[OK] User: rina.amelia@smkn4bdg.sch.id`);

  // ── 6. Follow Relationships ─────────────────────────
  // arya follows client_dummy (one-way)
  await prisma.follow.upsert({
    where: {
      accountId_targetAccountId: {
        accountId: account1.id,
        targetAccountId: account2.id,
      },
    },
    update: {},
    create: {
      accountId: account1.id,
      targetAccountId: account2.id,
    },
  });

  // client_dummy follows arya (making it mutual)
  await prisma.follow.upsert({
    where: {
      accountId_targetAccountId: {
        accountId: account2.id,
        targetAccountId: account1.id,
      },
    },
    update: {},
    create: {
      accountId: account2.id,
      targetAccountId: account1.id,
    },
  });

  // rina follows arya (one-way cross-school)
  await prisma.follow.upsert({
    where: {
      accountId_targetAccountId: {
        accountId: account3.id,
        targetAccountId: account1.id,
      },
    },
    update: {},
    create: {
      accountId: account3.id,
      targetAccountId: account1.id,
    },
  });

  // Update follow counts
  await prisma.account.update({
    where: { id: account1.id },
    data: { followersCount: 2, followingCount: 1 },
  });
  await prisma.account.update({
    where: { id: account2.id },
    data: { followersCount: 1, followingCount: 1 },
  });
  await prisma.account.update({
    where: { id: account3.id },
    data: { followersCount: 0, followingCount: 1 },
  });

  console.log('[OK] Follow relationships tersimpan');
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
