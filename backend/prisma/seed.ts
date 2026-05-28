import {
  PrismaClient,
  ListingType,
  ListingStatus,
  OrderStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as Minio from 'minio';

const prisma = new PrismaClient();

// Inisialisasi MinIO Client untuk seeding avatar gambar
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: Number(process.env.MINIO_PORT || 9000),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'admin_minio',
  secretKey: process.env.MINIO_SECRET_KEY || 'supersecret_minio_password',
});

const BUCKET_PUBLIC = process.env.MINIO_BUCKET_PUBLIC || 'public-assets';

/**
 * Membuat inisial nama dengan desain premium & gradasi warna yang dinamis
 */
function generateSvgAvatar(name: string): string {
  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';

  // Daftar warna gradasi premium yang modern dan estetis
  const gradients = [
    { start: '#6366F1', end: '#A855F7' }, // Indigo ke Violet
    { start: '#0D9488', end: '#10B981' }, // Teal ke Emerald
    { start: '#F43F5E', end: '#FB923C' }, // Rose ke Orange
    { start: '#2563EB', end: '#06B6D4' }, // Blue ke Cyan
    { start: '#7C3AED', end: '#D946EF' }, // Violet ke Fuchsia
    { start: '#EA580C', end: '#FACC15' }, // Orange ke Yellow
  ];

  // Hitung hash deterministik dari nama agar pengguna yang sama selalu mendapat gradasi warna yang sama
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  const { start, end } = gradients[index];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
  <defs>
    <linearGradient id="avatar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${start}"/>
      <stop offset="100%" stop-color="${end}"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" fill="url(#avatar-grad)"/>
  <text x="50%" y="54%" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="bold" font-size="64" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">
    ${initial}
  </text>
</svg>`;
}

/**
 * Mengunggah avatar bawaan berformat SVG ke MinIO
 */
async function uploadDefaultAvatar(displayName: string, objectKey: string) {
  const svg = generateSvgAvatar(displayName);
  try {
    // Pastikan bucket ada terlebih dahulu
    const bucketExists = await minioClient.bucketExists(BUCKET_PUBLIC);
    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_PUBLIC);
      // Set bucket policy public
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_PUBLIC}/*`],
          },
        ],
      };
      await minioClient.setBucketPolicy(BUCKET_PUBLIC, JSON.stringify(policy));
    }

    await minioClient.putObject(
      BUCKET_PUBLIC,
      objectKey,
      Buffer.from(svg),
      svg.length,
      { 'content-type': 'image/svg+xml' },
    );
    console.log(`[OK] Avatar berhasil diunggah ke MinIO: ${objectKey}`);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.warn(
      `[WARN] Lewati unggah avatar ${objectKey} ke MinIO (Gunakan port host 9000 jika berjalan secara lokal): ${errMsg}`,
    );
  }
}

async function main() {
  console.log('=== Memulai proses seeding data master Sotto Platform ===');

  // Enkripsi kata sandi dummy menggunakan bcrypt
  const passwordHash = await bcrypt.hash('password123', 10);
  console.log('[OK] Hash sandi pengujian terenkripsi.');

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
  const majorRpl = await prisma.major.upsert({
    where: {
      schoolId_name: { schoolId: school1.id, name: 'Rekayasa Perangkat Lunak' },
    },
    update: {},
    create: { name: 'Rekayasa Perangkat Lunak', schoolId: school1.id },
  });

  const majorDkv = await prisma.major.upsert({
    where: {
      schoolId_name: { schoolId: school1.id, name: 'Desain Komunikasi Visual' },
    },
    update: {},
    create: { name: 'Desain Komunikasi Visual', schoolId: school1.id },
  });

  const majorMm = await prisma.major.upsert({
    where: { schoolId_name: { schoolId: school2.id, name: 'Multimedia' } },
    update: {},
    create: { name: 'Multimedia', schoolId: school2.id },
  });

  const majorAnim = await prisma.major.upsert({
    where: { schoolId_name: { schoolId: school2.id, name: 'Animasi' } },
    update: {},
    create: { name: 'Animasi', schoolId: school2.id },
  });

  const majorTkj = await prisma.major.upsert({
    where: {
      schoolId_name: {
        schoolId: school3.id,
        name: 'Teknik Komputer dan Jaringan',
      },
    },
    update: {},
    create: { name: 'Teknik Komputer dan Jaringan', schoolId: school3.id },
  });
  console.log('[OK] 5 Jurusan terdaftar.');

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

  // ── 4. AKUN & PENGGUNA (ACCOUNTS & USERS) ─────────────────────

  // 1. Arya (RPL Developer - SMKN 1 Denpasar)
  const avatarAryaKey = 'avatar/arya_pranata.svg';
  await uploadDefaultAvatar('Agus Arya Pranata', avatarAryaKey);

  const accountArya = await prisma.account.upsert({
    where: { username: 'arya_pranata' },
    update: {},
    create: {
      username: 'arya_pranata',
      displayName: 'Agus Arya Pranata',
      schoolId: school1.id,
      majorId: majorRpl.id,
      avatarObjectKey: avatarAryaKey,
      note: 'Fullstack Web Developer. Siap mengerjakan Landing Page, Web Portal, dan dashboard admin.',
      trustScore: 5.0,
      followersCount: 2,
      followingCount: 2,
    },
  });

  await prisma.user.upsert({
    where: { email: 'arya.pranata@smkn1denpasar.sch.id' },
    update: {},
    create: {
      email: 'arya.pranata@smkn1denpasar.sch.id',
      encryptedPassword: passwordHash,
      accountId: accountArya.id,
    },
  });

  // 2. Rina (Multimedia Designer - SMKN 4 Bandung)
  const avatarRinaKey = 'avatar/rina_designer.svg';
  await uploadDefaultAvatar('Rina Amelia', avatarRinaKey);

  const accountRina = await prisma.account.upsert({
    where: { username: 'rina_designer' },
    update: {},
    create: {
      username: 'rina_designer',
      displayName: 'Rina Amelia',
      schoolId: school2.id,
      majorId: majorMm.id,
      avatarObjectKey: avatarRinaKey,
      note: 'UI/UX & Graphic Designer. Fokus pada desain aplikasi mobile yang ramah pengguna & maskot ilustrasi.',
      trustScore: 4.8,
      followersCount: 3,
      followingCount: 1,
    },
  });

  await prisma.user.upsert({
    where: { email: 'rina.amelia@smkn4bdg.sch.id' },
    update: {},
    create: {
      email: 'rina.amelia@smkn4bdg.sch.id',
      encryptedPassword: passwordHash,
      accountId: accountRina.id,
    },
  });

  // 3. Budi (Animasi 3D - SMKN 4 Bandung)
  const avatarBudiKey = 'avatar/budi_3d.svg';
  await uploadDefaultAvatar('Budi Setiawan', avatarBudiKey);

  const accountBudi = await prisma.account.upsert({
    where: { username: 'budi_3d' },
    update: {},
    create: {
      username: 'budi_3d',
      displayName: 'Budi Setiawan',
      schoolId: school2.id,
      majorId: majorAnim.id,
      avatarObjectKey: avatarBudiKey,
      note: '3D Modeler & Animator. Menyediakan model 3D aset low-poly untuk game dan arsitektur kelas.',
      trustScore: 4.7,
      followersCount: 0,
      followingCount: 1,
    },
  });

  await prisma.user.upsert({
    where: { email: 'budi.setiawan@smkn4bdg.sch.id' },
    update: {},
    create: {
      email: 'budi.setiawan@smkn4bdg.sch.id',
      encryptedPassword: passwordHash,
      accountId: accountBudi.id,
    },
  });

  // 4. Client Dummy (Pembeli - SMKN 1 Denpasar)
  const avatarClientKey = 'avatar/client_dummy.svg';
  await uploadDefaultAvatar('Dummy Client', avatarClientKey);

  const accountClient = await prisma.account.upsert({
    where: { username: 'client_dummy' },
    update: {},
    create: {
      username: 'client_dummy',
      displayName: 'Dummy Client',
      schoolId: school1.id,
      majorId: majorDkv.id,
      avatarObjectKey: avatarClientKey,
      note: 'Sedang mencari talenta terbaik untuk pembuatan proyek portofolio akhir sekolah kami.',
      trustScore: 4.9,
      followersCount: 1,
      followingCount: 2,
    },
  });

  await prisma.user.upsert({
    where: { email: 'client.dummy@smkn1denpasar.sch.id' },
    update: {},
    create: {
      email: 'client.dummy@smkn1denpasar.sch.id',
      encryptedPassword: passwordHash,
      accountId: accountClient.id,
    },
  });
  console.log('[OK] 4 Akun & Pengguna terdaftar.');

  // ── 5. PENAWARAN (LISTINGS) ───────────────────────────────────

  // Penawaran Arya
  const listingArya1 = await prisma.listing.create({
    data: {
      accountId: accountArya.id,
      type: ListingType.SERVICE,
      title: 'Jasa Pembuatan Landing Page Sekolah Responsif',
      description:
        'Saya menawarkan pembuatan landing page profil sekolah, organisasi, atau portofolio pribadi yang responsif, cepat diakses, ramah SEO, dan berdesain modern menggunakan Tailwind CSS.',
      price: 500000.0,
      deliveryTimeDays: 3,
      isUnlimited: false,
      status: ListingStatus.ACTIVE,
    },
  });

  const listingArya2 = await prisma.listing.create({
    data: {
      accountId: accountArya.id,
      type: ListingType.SERVICE,
      title: 'Jasa Web App Portal Berita Sekolah Next.js',
      description:
        'Layanan kustom pembuatan aplikasi web portal berita, mading digital, atau sistem informasi sekolah berbasis Next.js (App Router) dan terintegrasi dengan CMS admin yang mudah dikelola.',
      price: 1500000.0,
      deliveryTimeDays: 7,
      isUnlimited: false,
      status: ListingStatus.ACTIVE,
    },
  });

  const listingArya3 = await prisma.listing.create({
    data: {
      accountId: accountArya.id,
      type: ListingType.DIGITAL_PRODUCT,
      title: 'E-Book Panduan Lolos Lomba LKS Web Technologies',
      description:
        'Buku panduan lengkap dan e-book tips taktis langkah demi langkah untuk memenangkan Lomba Kompetensi Siswa (LKS) SMK di bidang Web Technologies, ditulis oleh alumni juara nasional.',
      price: 750000.0,
      isUnlimited: true,
      status: ListingStatus.ACTIVE,
    },
  });

  const listingArya4 = await prisma.listing.create({
    data: {
      accountId: accountArya.id,
      type: ListingType.DIGITAL_PRODUCT,
      title: 'Template React Admin Dashboard Tailwind Premium',
      description:
        'Template dashboard admin modern siap pakai untuk React / Next.js dengan styling Tailwind CSS lengkap dengan charts, tabel, form, auth pages layout, dan support dark mode.',
      price: 120000.0,
      isUnlimited: true,
      status: ListingStatus.ACTIVE,
    },
  });

  // Penawaran Rina
  const listingRina1 = await prisma.listing.create({
    data: {
      accountId: accountRina.id,
      type: ListingType.SERVICE,
      title: 'Jasa Desain UI/UX Mobile App Sekolah Modern',
      description:
        'Jasa merancang UI/UX wireframe dan desain visual interaktif berestetika premium untuk aplikasi smartphone Android/iOS di Figma. Dilengkapi dengan design system komponen yang teratur.',
      price: 800000.0,
      deliveryTimeDays: 5,
      isUnlimited: false,
      status: ListingStatus.ACTIVE,
    },
  });

  const listingRina2 = await prisma.listing.create({
    data: {
      accountId: accountRina.id,
      type: ListingType.SERVICE,
      title: 'Jasa Pembuatan Ilustrasi Vektor Maskot Sekolah',
      description:
        'Menggambar dan mendesain maskot ikonik sekolah, jurusan, atau brand produk digital Anda dalam bentuk format vektor SVG/PNG resolusi tinggi. 100% original buatan tangan di Illustrator.',
      price: 350000.0,
      deliveryTimeDays: 2,
      isUnlimited: false,
      status: ListingStatus.ACTIVE,
    },
  });

  const listingRina3 = await prisma.listing.create({
    data: {
      accountId: accountRina.id,
      type: ListingType.DIGITAL_PRODUCT,
      title: 'UI Kit Web Edukasi Figma Premium (30+ Screens)',
      description:
        'Design system dan pustaka komponen web bertema pendidikan sekolah di Figma. Berisi lebih dari 30 layout halaman premium (landing page, admin panel, quiz page, class list, dll).',
      price: 99000.0,
      isUnlimited: true,
      status: ListingStatus.ACTIVE,
    },
  });

  // Penawaran Budi
  const listingBudi1 = await prisma.listing.create({
    data: {
      accountId: accountBudi.id,
      type: ListingType.SERVICE,
      title: 'Jasa Modeling Karakter 3D Game / Animasi',
      description:
        'Saya menerima pesanan modeling karakter 3D bergaya low-poly maupun stylized cartoon untuk aset game engine Unity/Unreal atau kebutuhan video animasi pendek sekolah di Blender.',
      price: 1200000.0,
      deliveryTimeDays: 6,
      isUnlimited: false,
      status: ListingStatus.ACTIVE,
    },
  });

  const listingBudi2 = await prisma.listing.create({
    data: {
      accountId: accountBudi.id,
      type: ListingType.DIGITAL_PRODUCT,
      title: 'Paket Aset Model 3D Kursi & Meja Kelas Sekolah',
      description:
        'Paket model 3D perabot kelas sekolah (kursi kayu, meja guru, papan tulis, loker) siap pakai berformat .FBX / .OBJ yang dioptimalkan untuk performa tinggi di game virtual reality / web 3D.',
      price: 45000.0,
      isUnlimited: true,
      status: ListingStatus.ACTIVE,
    },
  });
  console.log(
    '[OK] 9 Penawaran (Listings) SERVICE & DIGITAL_PRODUCT berhasil dibuat.',
  );

  // ── 6. SUKA PENAWARAN (LISTING LIKES) ─────────────────────────

  // Client menyukai penawaran Arya & Rina
  await prisma.listingLike.createMany({
    data: [
      { accountId: accountClient.id, listingId: listingArya1.id },
      { accountId: accountClient.id, listingId: listingArya2.id },
      { accountId: accountClient.id, listingId: listingRina1.id },
    ],
  });

  // Rina menyukai penawaran Arya & Budi
  await prisma.listingLike.createMany({
    data: [
      { accountId: accountRina.id, listingId: listingArya1.id },
      { accountId: accountRina.id, listingId: listingArya3.id },
      { accountId: accountRina.id, listingId: listingBudi1.id },
    ],
  });

  // Arya menyukai penawaran Rina
  await prisma.listingLike.createMany({
    data: [
      { accountId: accountArya.id, listingId: listingRina1.id },
      { accountId: accountArya.id, listingId: listingRina3.id },
    ],
  });

  // Budi menyukai penawaran Arya & Rina
  await prisma.listingLike.createMany({
    data: [
      { accountId: accountBudi.id, listingId: listingArya4.id },
      { accountId: accountBudi.id, listingId: listingRina2.id },
    ],
  });
  console.log('[OK] Seeding listing likes (suka penawaran) selesai.');

  // ── 7. PESANAN (ORDERS) ───────────────────────────────────────

  // Pesanan 1: Client membeli jasa Landing Page Arya (Aktif - In Progress)
  const order1 = await prisma.order.create({
    data: {
      buyerAccountId: accountClient.id,
      sellerAccountId: accountArya.id,
      listingId: listingArya1.id,
      agreedPrice: 500000.0,
      status: OrderStatus.IN_PROGRESS,
    },
  });

  // Pesanan 2: Client membeli jasa Web Berita Arya (Selesai - Completed)
  const order2 = await prisma.order.create({
    data: {
      buyerAccountId: accountClient.id,
      sellerAccountId: accountArya.id,
      listingId: listingArya2.id,
      agreedPrice: 1500000.0,
      status: OrderStatus.COMPLETED,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 hari yang lalu
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // selesai 3 hari yang lalu
    },
  });

  // Pesanan 3: Rina membeli model 3D Budi (Menunggu Pembayaran - Pending Payment)
  await prisma.order.create({
    data: {
      buyerAccountId: accountRina.id,
      sellerAccountId: accountBudi.id,
      listingId: listingBudi1.id,
      agreedPrice: 1200000.0,
      status: OrderStatus.PENDING_PAYMENT,
    },
  });
  console.log('[OK] 3 Transaksi Pesanan (Orders) tersimpan.');

  // ── 8. ULASAN & ULASAN PROFIL (REVIEWS) ────────────────────────

  // Ulasan untuk Order 2 (Web Berita Arya yang selesai)
  await prisma.review.create({
    data: {
      orderId: order2.id,
      reviewerAccountId: accountClient.id,
      targetAccountId: accountArya.id,
      rating: 5,
      comment:
        'Keren banget! Pengerjaannya cepat sekali, struktur kodenya sangat rapi, dan mudah di-deploy ke server sekolah kami. Mas Agus Arya Pranata juga sangat responsif saat dihubungi. Terima kasih!',
    },
  });
  console.log('[OK] 1 Ulasan 5-bintang tersimpan untuk profil Arya.');

  // ── 9. FOLLOW RELATIONSHIPS (Jejaring Sosial) ──────────────────

  // Arya dan Client saling mengikuti (mutual)
  await prisma.follow.createMany({
    data: [
      { accountId: accountArya.id, targetAccountId: accountClient.id },
      { accountId: accountClient.id, targetAccountId: accountArya.id },
    ],
  });

  // Rina diikuti oleh Arya & Client (cross-school)
  await prisma.follow.createMany({
    data: [
      { accountId: accountArya.id, targetAccountId: accountRina.id },
      { accountId: accountClient.id, targetAccountId: accountRina.id },
    ],
  });

  // Budi mengikuti Rina
  await prisma.follow.createMany({
    data: [{ accountId: accountBudi.id, targetAccountId: accountRina.id }],
  });
  console.log('[OK] 5 Relasi follow sosial jejaring tersimpan.');
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
