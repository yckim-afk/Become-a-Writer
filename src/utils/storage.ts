import { AppData, Quest, ShopItem, Idea, Story, Category, ItemUsageLog } from '../types';

const STORAGE_KEY = 'writer_rpg_app_data_v1';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-character', name: '캐릭터', color: 'bg-amber-100 text-amber-800 border-amber-300', description: '인물 설정, 감정선, 대사' },
  { id: 'cat-narrative', name: '서사', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', description: '플롯, 복선, 사건 전개' },
  { id: 'cat-writer', name: '작가', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', description: '글쓰기 습관, 분량 달성, 퇴고' },
];

export const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'item-pass-streak',
    name: '황금 결석권 (스트릭 면제권)',
    description: '하루치 데일리 퀘스트를 완료하지 못해도 스트릭(연속 달성일)이 초기화되지 않도록 막아주는 든든한 방패입니다.',
    price: 35,
    icon: 'ShieldCheck',
    category: 'special',
    isExemptionPass: true,
    effectType: 'exemption',
    customEffectDetail: '데일리 미완료 시 자동/수동으로 소모되어 스트릭을 보호합니다.',
  },
  {
    id: 'item-inspiration-card',
    name: '영감의 깃펜 (영감 카드 뽑기)',
    description: '막막한 순간, 예상치 못한 인물 관계, 파격적인 반전, 감각적인 묘사 등 50여 가지 창작 영감 카드를 1장 뽑습니다.',
    price: 15,
    icon: 'Sparkles',
    category: 'creative',
    effectType: 'inspiration',
    customEffectDetail: '사용 시 대화형 영감 뽑기 모달이 열려 즉시 아이디어뱅크에 저장할 수 있습니다.',
  },
  {
    id: 'item-slump-booster',
    name: '슬럼프 탈출권 (5분 질주)',
    description: '생각을 멈추고 5분 동안 오직 타이핑에만 몰입하는 폭풍 자유 집필 세션을 시작합니다.',
    price: 12,
    icon: 'Zap',
    category: 'consumable',
    effectType: 'sprint',
    customEffectDetail: '5분간 실시간 글자수 측정과 몰입형 타이핑 패드를 제공합니다.',
  },
  {
    id: 'item-espresso-potion',
    name: '심야의 에스프레소 (25분 몰입)',
    description: '집중력이 흐려질 때 마시는 향긋한 커피. 25분 뽀모도로 글쓰기 타이머로 최고의 집중 상태를 만듭니다.',
    price: 10,
    icon: 'Coffee',
    category: 'consumable',
    effectType: 'pomodoro',
    customEffectDetail: '25분 타이머 작동 및 차분한 집중 인터페이스 제공.',
  },
  {
    id: 'item-proofread-lens',
    name: '퇴고의 황금 돋보기',
    description: '군더더기 수식어를 쳐내고 문장의 호흡을 점검하는 작가 전용 퇴고 루틴 체크리스트를 실행합니다.',
    price: 15,
    icon: 'Search',
    category: 'creative',
    effectType: 'custom',
    customEffectDetail: '퇴고 5대 원칙 및 점검 팁 가이드를 제공합니다.',
  },
  {
    id: 'item-deadline-charm',
    name: '마감 요정의 부적',
    description: '마감의 중압감을 글쓰기의 전율로 바꾸어주는 전설의 부적. 지닌 자에게 신들린 타자 속도를 선사합니다.',
    price: 25,
    icon: 'Flame',
    category: 'special',
    effectType: 'custom',
    customEffectDetail: '창작 의지를 북돋우는 특별 응원 문구와 긍정 에너지 부여.',
  },
  {
    id: 'item-tarot-climax',
    name: '클라이맥스 각성서',
    description: '스토리가 늘어질 때 주인공을 궁지로 몰고 갈등을 극대화하는 위기 조성 트리거를 획득합니다.',
    price: 20,
    icon: 'BookOpen',
    category: 'creative',
    effectType: 'inspiration',
    customEffectDetail: '갈등과 위기 심화 전용 영감 카드를 뽑습니다.',
  },
];

export const DEFAULT_QUESTS: Quest[] = [
  {
    id: 'q-daily-1',
    title: '오늘의 목표 분량 500자 집필하기',
    description: '원고지 약 2.5매 분량. 아무것도 없는 백지보다 한 줄의 낙서가 위대합니다.',
    grade: 'B',
    category: '작가',
    isDaily: true,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-daily-2',
    title: '등장인물 감정선 & 대사 한 줄 기록',
    description: '인물의 입버릇이나 숨겨둔 진심을 대사 한 줄로 메모해 보세요.',
    grade: 'C',
    category: '캐릭터',
    isDaily: true,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-daily-3',
    title: '오늘 쓴 문장 3개 가다듬기 (퇴고)',
    description: '불필요한 조사를 덜어내고 문장의 리듬감을 느껴봅니다.',
    grade: 'C',
    category: '작가',
    isDaily: true,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-daily-4',
    title: '새로운 사건의 복선 1가지 구상하기',
    description: '나중에 터뜨릴 작은 단서나 복선을 장면에 심어두세요.',
    grade: 'B',
    category: '서사',
    isDaily: true,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-nondaily-1',
    title: '작품 핵심 시놉시스 & 로그라인 완성',
    description: '누가, 무엇을 위해, 어떤 난관에 맞서는가? 1줄 로그라인과 기승전결 줄거리를 정리합니다.',
    grade: 'A',
    category: '서사',
    isDaily: false,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-nondaily-2',
    title: '주요 등장인물 3인 프로필 작성',
    description: '이름, 나이, 외모, 가장 두려워하는 것, 절대 포기할 수 없는 욕망을 설계합니다.',
    grade: 'B',
    category: '캐릭터',
    isDaily: false,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-nondaily-3',
    title: '단편 또는 1화 원고 완고하기',
    description: '시작이 반입니다! 첫 에피소드를 마침표까지 완성해 보세요.',
    grade: 'A',
    category: '작가',
    isDaily: false,
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_STORIES: Story[] = [
  {
    id: 'story-sample-1',
    title: '망각의 서점과 잃어버린 페이지',
    logline: '지우고 싶은 기억을 책으로 맡기면 새로운 행복을 준다는 신비한 서점에서 시작되는 이야기.',
    synopsis: '안개 낀 골목 끝자락에만 나타나는 고서점. 손님들은 고통스러운 기억을 바쳐 평온을 얻지만, 서점의 견습 점원 유진은 버려진 기억들 속에서 자신의 잊혀진 과거에 대한 충격적인 단서를 발견하게 된다.',
    status: '집필 중',
    genre: '판타지 / 드라마',
    episodes: [
      {
        id: 'ep-1',
        order: 1,
        title: '제1화: 안개 너머의 고서점',
        summary: '주인공 유진이 비밀스러운 서점의 면접을 보고 첫 손님을 맞이하는 날.',
        status: 'completed',
        wordCount: 3200,
        notes: '서점 특유의 오래된 종이 냄새와 푸른 등불 묘사에 신경 쓸 것.',
      },
      {
        id: 'ep-2',
        order: 2,
        title: '제2화: 기억을 담는 양장본',
        summary: '서점 주인이 기억을 책으로 제본하는 의식을 시연하고, 손님의 눈물이 책장에 스며든다.',
        status: 'drafting',
        wordCount: 1500,
        notes: '금기 규칙: 타인의 기억 책을 허락 없이 펼쳐보지 말 것.',
      },
      {
        id: 'ep-3',
        order: 3,
        title: '제3화: 찢겨진 붉은 서고',
        summary: '유진이 자신의 이름이 적힌 낡은 일기장을 지하 서고에서 우연히 목격한다.',
        status: 'planned',
        wordCount: 0,
        notes: '클라이맥스로 향하는 반전 복선 배치.',
      },
    ],
    targetWordCount: 30000,
    currentWordCount: 4700,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_IDEAS: Idea[] = [
  {
    id: 'idea-1',
    title: '서점 주인 "엘리야"의 성격 및 습관',
    content: '늘 낡은 회중시계를 만지작거리며 3분 늦게 차를 우려 마신다. 사람의 눈을 볼 때 그 사람의 가장 슬픈 기억이 활자 형태로 비쳐 보인다고 함.',
    tag: '캐릭터',
    storyId: 'story-sample-1',
    color: '#FEF3C7',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'idea-2',
    title: '기억 도서관의 핵심 세계관 규칙',
    content: '1. 기억을 책으로 묶는 순간 원본 기억은 본인에게서 사라진다.\n2. 누군가 그 책을 끝까지 읽으면, 맡겼던 주인의 감정이 읽는 이에게 전이된다.\n3. 책을 태우면 기억은 영원히 소멸한다.',
    tag: '세계관',
    storyId: 'story-sample-1',
    color: '#E0E7FF',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'idea-3',
    title: '갈등 대사: 유진과 손님의 대립',
    content: '"그 기억이 아무리 아파도 나를 만든 조각이에요! 그걸 지워버리면 남은 난 누구죠?"\n"안락한 백지로 사는 게 고통스러운 완성작보다 나을 때도 있는 법이란다."',
    tag: '대사',
    storyId: 'story-sample-1',
    color: '#FEE2E2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'idea-4',
    title: '시간 역전 트릭 메모 (차기작용)',
    content: '시계가 거꾸로 돌아가는 마을. 사람들은 늙어가는 게 아니라 점차 젊어지며 마지막엔 탄생의 빛 속으로 사라진다.',
    tag: '플롯',
    storyId: null,
    color: '#DCFCE7',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createInitialAppData(): AppData {
  const today = getTodayDateString();
  return {
    version: '1.0.0',
    profile: {
      name: '신진 작가',
      penName: '별빛서재',
      level: 1,
      xp: 0,
      gold: 50, // Starter gold so user can experience shop
      streak: 1,
      maxStreak: 1,
      lastActiveDate: today,
      lastDailyResetDate: today,
      exemptionPassCount: 1, // Give 1 starter exemption pass!
      totalQuestsCompleted: 0,
      totalWordsWritten: 4700,
      createdAt: new Date().toISOString(),
    },
    rewardSettings: {
      A: { xp: 30, gold: 15 },
      B: { xp: 15, gold: 7 },
      C: { xp: 7, gold: 3 },
    },
    quests: DEFAULT_QUESTS,
    categories: DEFAULT_CATEGORIES,
    shopItems: DEFAULT_SHOP_ITEMS,
    inventory: [
      {
        id: 'inv-starter-1',
        itemId: 'item-pass-streak',
        name: '황금 결석권 (스트릭 면제권)',
        description: '하루치 데일리 퀘스트 미완료 패널티를 1회 막아주는 시작 선물입니다.',
        icon: 'ShieldCheck',
        quantity: 1,
        boughtAt: new Date().toISOString(),
        effectType: 'exemption',
      },
      {
        id: 'inv-starter-2',
        itemId: 'item-inspiration-card',
        name: '영감의 깃펜 (영감 카드 뽑기)',
        description: '시작 축하 보너스로 지급된 1회 무료 영감 카드 뽑기권입니다.',
        icon: 'Sparkles',
        quantity: 2,
        boughtAt: new Date().toISOString(),
        effectType: 'inspiration',
      }
    ],
    usageLogs: [
      {
        id: 'log-welcome',
        itemId: 'system',
        itemName: '작가 되기 시작 기념 선물',
        usedAt: new Date().toISOString(),
        effectSummary: '황금 결석권 1개와 영감 카드 뽑기권 2개가 보관함에 지급되었습니다.',
      }
    ],
    ideas: DEFAULT_IDEAS,
    stories: DEFAULT_STORIES,
    config: {
      streakPenaltyType: 'reset',
      autoUseExemption: true,
      soundEnabled: true,
    },
  };
}

export function loadAppData(): { data: AppData; streakMessage?: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialAppData();
      saveAppData(initial);
      return { data: initial };
    }

    const parsed: AppData = JSON.parse(raw);
    // Ensure all critical arrays/fields exist
    if (!parsed.rewardSettings) {
      parsed.rewardSettings = { A: { xp: 30, gold: 15 }, B: { xp: 15, gold: 7 }, C: { xp: 7, gold: 3 } };
    }
    if (!parsed.categories || parsed.categories.length === 0) {
      parsed.categories = DEFAULT_CATEGORIES;
    }
    if (!parsed.shopItems || parsed.shopItems.length === 0) {
      parsed.shopItems = DEFAULT_SHOP_ITEMS;
    }
    if (!parsed.inventory) parsed.inventory = [];
    if (!parsed.usageLogs) parsed.usageLogs = [];
    if (!parsed.ideas) parsed.ideas = [];
    if (!parsed.stories) parsed.stories = [];
    if (!parsed.config) {
      parsed.config = { streakPenaltyType: 'reset', autoUseExemption: true, soundEnabled: true };
    }

    // Process daily reset & streak checks
    const { updatedData, streakMessage } = processDailyCheck(parsed);
    saveAppData(updatedData);
    return { data: updatedData, streakMessage };
  } catch (err) {
    console.error('Failed to load app data from localStorage:', err);
    const fallback = createInitialAppData();
    return { data: fallback };
  }
}

export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save app data:', err);
  }
}

export function processDailyCheck(data: AppData): { updatedData: AppData; streakMessage?: string } {
  const today = getTodayDateString();
  const lastReset = data.profile.lastDailyResetDate || data.profile.lastActiveDate;

  if (lastReset === today) {
    // Already checked today
    return { updatedData: data };
  }

  let streakMessage: string | undefined;
  const yesterday = getYesterdayDateString();

  // Check if there was an active streak that might break
  const hadDailyQuests = data.quests.some(q => q.isDaily);
  const completedAnyYesterday = data.profile.lastActiveDate === yesterday;

  if (lastReset !== today && lastReset !== yesterday && data.profile.streak > 0) {
    // Missed at least one whole day without activity
    if (data.profile.exemptionPassCount > 0 && data.config.autoUseExemption) {
      // Auto-use exemption pass
      data.profile.exemptionPassCount -= 1;
      
      // Update inventory item quantity
      const passInv = data.inventory.find(i => i.effectType === 'exemption' || i.name.includes('결석권') || i.name.includes('면제권'));
      if (passInv) {
        passInv.quantity = Math.max(0, passInv.quantity - 1);
      }

      const log: ItemUsageLog = {
        id: 'log-' + Date.now(),
        itemId: 'item-pass-streak',
        itemName: '황금 결석권 (스트릭 면제권)',
        usedAt: new Date().toISOString(),
        effectSummary: `미접속일(${lastReset}~${yesterday}) 스트릭 초기화 방어 성공! (남은 결석권: ${data.profile.exemptionPassCount}개)`,
      };
      data.usageLogs.unshift(log);
      streakMessage = `🛡️ 결석권(면제권)이 자동으로 사용되어 연속 달성일(${data.profile.streak}일)이 안전하게 보호되었습니다!`;
    } else {
      // Streak broken
      const oldStreak = data.profile.streak;
      if (data.config.streakPenaltyType === 'decrease') {
        data.profile.streak = Math.max(0, data.profile.streak - 1);
      } else {
        data.profile.streak = 0;
      }
      streakMessage = `⚠️ 데일리 퀘스트를 완료하지 못해 연속 달성일(기존 ${oldStreak}일)이 ${data.profile.streak}일로 조정되었습니다. 오늘 다시 시작해 보세요!`;
    }
  }

  // Reset all daily quests
  data.quests = data.quests.map(q => {
    if (q.isDaily) {
      return { ...q, completed: false, completedAt: undefined };
    }
    return q;
  });

  data.profile.lastDailyResetDate = today;
  return { updatedData: data, streakMessage };
}
