export type QuestGrade = 'A' | 'B' | 'C';

export interface RewardSettings {
  A: { xp: number; gold: number };
  B: { xp: number; gold: number };
  C: { xp: number; gold: number };
}

export interface UserProfile {
  name: string;
  penName: string;
  level: number;
  xp: number;
  gold: number;
  streak: number;
  maxStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  lastDailyResetDate: string; // YYYY-MM-DD
  exemptionPassCount: number; // 결석권 / 면제권 보유 수량
  totalQuestsCompleted: number;
  totalWordsWritten: number;
  createdAt: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  grade: QuestGrade;
  category: string; // e.g. '캐릭터', '서사', '작가'
  isDaily: boolean;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color or hex
  description?: string;
}

export type ShopItemCategory = 'special' | 'consumable' | 'creative' | 'custom';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: ShopItemCategory;
  isExemptionPass?: boolean; // 결석권 여부
  effectType?: 'exemption' | 'inspiration' | 'sprint' | 'pomodoro' | 'custom';
  customEffectDetail?: string;
}

export interface InventoryItem {
  id: string;
  itemId: string;
  name: string;
  description: string;
  icon: string;
  quantity: number;
  boughtAt: string;
  effectType?: string;
}

export interface ItemUsageLog {
  id: string;
  itemId: string;
  itemName: string;
  usedAt: string;
  effectSummary: string;
}

export type IdeaTag = '캐릭터' | '플롯' | '세계관' | '대사' | '기타' | string;

export interface Idea {
  id: string;
  title: string;
  content: string;
  tag: IdeaTag;
  storyId?: string | null; // connected story ID
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  id: string;
  order: number;
  title: string;
  summary: string;
  status: 'planned' | 'drafting' | 'completed';
  wordCount?: number;
  notes?: string;
}

export type StoryStatus = '구상 중' | '시놉시스 완성' | '집필 중' | '퇴고 중' | '완결';

export interface Story {
  id: string;
  title: string;
  logline: string;
  synopsis: string;
  status: StoryStatus;
  genre?: string;
  episodes: Episode[];
  targetWordCount?: number;
  currentWordCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppConfig {
  streakPenaltyType: 'reset' | 'decrease';
  autoUseExemption: boolean;
  soundEnabled: boolean;
}

export interface AppData {
  version: string;
  profile: UserProfile;
  rewardSettings: RewardSettings;
  quests: Quest[];
  categories: Category[];
  shopItems: ShopItem[];
  inventory: InventoryItem[];
  usageLogs: ItemUsageLog[];
  ideas: Idea[];
  stories: Story[];
  config: AppConfig;
}
