/**
 * Matriks Komplementaritas M (5×5) untuk MVP.
 * Baris = "Saya butuh (demand)", Kolom = "Saya punya (supply)".
 * Dimensi: [Frontend, Backend, UI/UX, Audio/Video, Bisnis]
 *
 * Nilai tinggi = skill X sangat membutuhkan skill Y.
 */
export const COMPLEMENTARITY_MATRIX: number[][] = [
  //          Frontend  Backend  UI/UX  Audio  Bisnis
  /* Frontend */ [0.3, 0.9, 0.8, 0.1, 0.2],
  /* Backend  */ [0.9, 0.3, 0.4, 0.1, 0.3],
  /* UI/UX    */ [0.8, 0.4, 0.3, 0.5, 0.3],
  /* Audio    */ [0.2, 0.1, 0.5, 0.3, 0.2],
  /* Bisnis   */ [0.3, 0.4, 0.4, 0.2, 0.3],
];

/**
 * Mapping dari nama tag kategori ke index dimensi vektor.
 * Digunakan untuk mengonversi tag postingan → vektor supply.
 */
export const CATEGORY_INDEX_MAP: Record<string, number> = {
  Frontend: 0,
  Backend: 1,
  'UI/UX': 2,
  'Audio/Video': 3,
  Bisnis: 4,
};

export const VECTOR_DIMENSIONS = 5;
