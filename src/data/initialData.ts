import { ProgramStore, WeekPlan, ProgramItem } from '../types/schedule';

export const WEEK_1_DRIVE_URL = 'https://drive.google.com/drive/folders/1IPqE7_sRv7mMc5hRAhJifFiC42VtB-K1?hl=tr';
export const WEEK_2_DRIVE_URL = 'https://drive.google.com/drive/folders/1MY7fXtKi7LvN9KKsEzZeYwjRhXVHF1_I?hl=tr';

export const DEFAULT_TAGS = [
  'HTML & CSS',
  'JavaScript',
  'UI / UX & Figma',
  'Web Projesi',
  'Responsive Tasarım',
  'Genel',
];

export function generateDefaultItems(weekNumber: number): ProgramItem[] {
  // Kullanıcı düzenleyecek diye boş bırakılmış temiz program maddeleri (saat/seans yok)
  return [
    {
      id: `w${weekNumber}-item-1`,
      text: '', // Sen düzenleyeceksin diye boş bırakıldı
      tag: 'HTML & CSS',
      isCompleted: false,
    },
    {
      id: `w${weekNumber}-item-2`,
      text: '',
      tag: 'HTML & CSS',
      isCompleted: false,
    },
    {
      id: `w${weekNumber}-item-3`,
      text: '',
      tag: 'Web Projesi',
      isCompleted: false,
    },
  ];
}

export function generateEmptyWeek(weekNumber: number): WeekPlan {
  const isWeek1 = weekNumber === 1;
  const isWeek2 = weekNumber === 2;
  return {
    weekNumber,
    title: `${weekNumber}. Hafta`,
    topic: isWeek1 ? 'Web Tasarımına Giriş & HTML/CSS' : isWeek2 ? 'Temel HTML Yapıları & Afiş Tasarımı' : '',
    driveFolderUrl: isWeek1 ? WEEK_1_DRIVE_URL : isWeek2 ? WEEK_2_DRIVE_URL : '',
    driveTitle: isWeek1 ? '1. Hafta Web Tasarımı Drive Klasörü' : isWeek2 ? '2. Hafta Drive Klasörü (Afiş Dahil)' : '',
    content: '',
    items: generateDefaultItems(weekNumber),
  };
}

export const TOTAL_WEEKS = 38;

export function createInitialProgramStore(): ProgramStore {
  const weeks: WeekPlan[] = [];
  for (let i = 1; i <= TOTAL_WEEKS; i++) {
    weeks.push(generateEmptyWeek(i));
  }

  return {
    ownerName: 'Mustafa Ali Güleç',
    programTitle: '38 Haftalık Web Tasarımı Programı',
    totalWeeks: TOTAL_WEEKS,
    weeks,
    lastUpdated: new Date().toISOString(),
  };
}

const STORAGE_KEY = 'mustafa_ali_gulec_38_hafta_web_tasarim_v5_dark';
const LEGACY_STORAGE_KEY = 'mustafa_ali_gulec_30_hafta_web_tasarim_v4_dark';

export function loadProgramFromStorage(): ProgramStore {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.weeks)) {
        // Migrate to 38 weeks if older version had fewer weeks
        while (parsed.weeks.length < TOTAL_WEEKS) {
          parsed.weeks.push(generateEmptyWeek(parsed.weeks.length + 1));
        }

        parsed.totalWeeks = TOTAL_WEEKS;
        if (parsed.programTitle && parsed.programTitle.includes('30 Haftalık')) {
          parsed.programTitle = parsed.programTitle.replace('30 Haftalık', '38 Haftalık');
        }

        if (!parsed.weeks[0].driveFolderUrl) {
          parsed.weeks[0].driveFolderUrl = WEEK_1_DRIVE_URL;
          parsed.weeks[0].driveTitle = '1. Hafta Web Tasarımı Drive Klasörü';
        }
        if (parsed.weeks[1] && !parsed.weeks[1].driveFolderUrl) {
          parsed.weeks[1].driveFolderUrl = WEEK_2_DRIVE_URL;
          parsed.weeks[1].driveTitle = '2. Hafta Drive Klasörü (Afiş Dahil)';
        }
        // Ensure items array exists on all weeks
        parsed.weeks.forEach((w: WeekPlan, idx: number) => {
          if (!w.items) {
            w.items = generateDefaultItems(idx + 1);
          }
        });

        saveProgramToStorage(parsed);
        return parsed;
      }
    }
  } catch (err) {
    console.error('Program yükleme hatası:', err);
  }

  const initial = createInitialProgramStore();
  saveProgramToStorage(initial);
  return initial;
}

export function saveProgramToStorage(store: ProgramStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...store,
      totalWeeks: TOTAL_WEEKS,
      lastUpdated: new Date().toISOString(),
    }));
  } catch (err) {
    console.error('LocalStorage kaydetme hatası:', err);
  }
}
