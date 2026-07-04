export const wedding = {
  brideName: "Zainab",
  groomName: "Muhammad Ziad Rahmatullah",
  groomNickname: "Ziad",
  displayNames: "Zainab & Ziad",
  mempelai: {
    wanita: {
      nama: "Zainab",
      anakKe: "Putri dari",
      ayah: "Bapak Drs. H. Eka Komara, M.Pd.",
      ibu: "Ibu Aah Robi'ah",
    },
    pria: {
      nama: "Muhammad Ziad Rahmatullah",
      anakKe: "Putra dari",
      ayah: "Bapak (Alm.) Edi Supardi",
      ibu: "Ibu Hj. Uum Mulyanah",
    },
  },
  weddingDateISO: "2026-08-16",
  akad: {
    label: "Akad Nikah",
    time: "08:00",
    floor: "Lantai 2",
  },
  resepsi: {
    label: "Resepsi",
    time: "12:45",
    floor: "Lantai 1",
  },
  venue: {
    name: "Kuningan Islamic Center",
    address:
      "Jl. Dr. Ir. Soekarno, Winduherang, Kec. Kuningan, Kabupaten Kuningan, Jawa Barat 45552",
    mapsUrl: "https://maps.app.goo.gl/8xmXhAH7QpNNMu9i8",
  },
  // Countdown target: akad start time on the wedding date, local time.
  countdownTargetISO: "2026-08-16T08:00:00",
  ayat: {
    arabic:
      "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ",
    // Standard Kemenag RI translation. Verify against quran.kemenag.go.id before publishing.
    translationId:
      "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
    source: "QS. Ar-Rum (30): 21",
  },
} as const;
