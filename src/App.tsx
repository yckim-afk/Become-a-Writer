import React, { useState, useEffect } from 'react';
import {
  loadAppData,
  saveAppData,
  createInitialAppData,
  getTodayDateString,
} from './utils/storage';
import {
  getXpRequiredForLevel,
  getWriterTitle,
  playSound,
} from './utils/gamification';
import { exportSingleHtmlFile } from './utils/htmlExporter';
import {
  AppData,
  Quest,
  Category,
  ShopItem,
  InventoryItem,
  Idea,
  Story,
  RewardSettings,
  ItemUsageLog,
} from './types';

import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { QuestView } from './components/QuestView';
import { ShopView } from './components/ShopView';
import { IdeaBankView } from './components/IdeaBankView';
import { StoryLibraryView } from './components/StoryLibraryView';
import { SettingsModal } from './components/SettingsModal';
import { InspirationDrawModal } from './components/InteractiveModals/InspirationDrawModal';
import { FocusSprintModal } from './components/InteractiveModals/FocusSprintModal';
import { Confetti } from './components/Confetti';
import { Sparkles, Coins, Flame, Award, X, Check } from 'lucide-react';

export default function App() {
  const [appData, setAppData] = useState<AppData>(() => {
    const { data } = loadAppData();
    return data;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [dailyStreakNotice, setDailyStreakNotice] = useState<string | null>(null);

  // Modals & Overlay state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInspirationModalOpen, setIsInspirationModalOpen] = useState(false);
  const [focusSprintState, setFocusSprintState] = useState<{
    isOpen: boolean;
    mode: 'sprint' | 'pomodoro';
  }>({ isOpen: false, mode: 'sprint' });

  // Celebration & Toast State
  const [showConfetti, setShowConfetti] = useState(false);
  const [levelUpModal, setLevelUpModal] = useState<{
    show: boolean;
    newLevel: number;
    newTitle: string;
  } | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    xp: number;
    gold: number;
  } | null>(null);

  // Load data & check streak message on first mount
  useEffect(() => {
    const { streakMessage } = loadAppData();
    if (streakMessage) {
      setDailyStreakNotice(streakMessage);
    }
  }, []);

  // Save to LocalStorage on changes
  const updateData = (updater: (prev: AppData) => AppData) => {
    setAppData((prev) => {
      const next = updater(prev);
      saveAppData(next);
      return next;
    });
  };

  // 1. QUEST COMPLETION & LEVEL UP LOGIC
  const handleCompleteQuest = (questId: string) => {
    const quest = appData.quests.find((q) => q.id === questId);
    if (!quest || quest.completed) return;

    const reward = appData.rewardSettings[quest.grade] || { xp: 15, gold: 7 };
    const today = getTodayDateString();

    let newXp = appData.profile.xp + reward.xp;
    let newGold = appData.profile.gold + reward.gold;
    let newLevel = appData.profile.level;
    let totalCompleted = appData.profile.totalQuestsCompleted + 1;
    let newStreak = appData.profile.streak;
    let maxStreak = appData.profile.maxStreak;
    let leveledUp = false;

    // Daily streak update
    if (quest.isDaily) {
      if (appData.profile.lastActiveDate !== today) {
        newStreak = appData.profile.streak + 1;
        if (newStreak > maxStreak) maxStreak = newStreak;
      }
    }

    // Level up calculation curve
    let reqXp = getXpRequiredForLevel(newLevel);
    while (newXp >= reqXp) {
      newXp -= reqXp;
      newLevel += 1;
      leveledUp = true;
      reqXp = getXpRequiredForLevel(newLevel);
    }

    // Play sounds & trigger visual rewards
    if (leveledUp) {
      playSound('level_up');
      setShowConfetti(true);
      const titleObj = getWriterTitle(newLevel);
      setLevelUpModal({
        show: true,
        newLevel,
        newTitle: titleObj.title,
      });
    } else {
      playSound('quest_complete');
    }

    // Trigger toast
    setToast({
      show: true,
      title: quest.title,
      xp: reward.xp,
      gold: reward.gold,
    });
    setTimeout(() => setToast(null), 3000);

    updateData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        xp: newXp,
        gold: newGold,
        level: newLevel,
        streak: newStreak,
        maxStreak: maxStreak,
        totalQuestsCompleted: totalCompleted,
        lastActiveDate: today,
      },
      quests: prev.quests.map((q) =>
        q.id === questId ? { ...q, completed: true, completedAt: new Date().toISOString() } : q
      ),
    }));
  };

  // 2. QUEST CRUD
  const handleAddQuest = (newQuest: Omit<Quest, 'id' | 'createdAt'>) => {
    const quest: Quest = {
      ...newQuest,
      id: 'q-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    updateData((prev) => ({
      ...prev,
      quests: [quest, ...prev.quests],
    }));
  };

  const handleEditQuest = (updated: Quest) => {
    updateData((prev) => ({
      ...prev,
      quests: prev.quests.map((q) => (q.id === updated.id ? updated : q)),
    }));
  };

  const handleDeleteQuest = (questId: string) => {
    updateData((prev) => ({
      ...prev,
      quests: prev.quests.filter((q) => q.id !== questId),
    }));
  };

  // 3. CATEGORIES CRUD
  const handleAddCategory = (cat: Category) => {
    updateData((prev) => ({
      ...prev,
      categories: [...prev.categories, cat],
    }));
  };

  const handleDeleteCategory = (catId: string) => {
    updateData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== catId),
    }));
  };

  // 4. REWARD SETTINGS UPDATE
  const handleUpdateRewardSettings = (newRewards: RewardSettings) => {
    updateData((prev) => ({
      ...prev,
      rewardSettings: newRewards,
    }));
  };

  // 5. SHOP & INVENTORY
  const handleBuyItem = (item: ShopItem) => {
    if (appData.profile.gold < item.price) {
      alert('골드가 부족합니다! 퀘스트를 완수하여 골드를 획득하세요.');
      return;
    }

    playSound('buy');

    updateData((prev) => {
      const newGold = prev.profile.gold - item.price;
      const isPass = item.isExemptionPass;
      const newExemptionCount = isPass
        ? (prev.profile.exemptionPassCount || 0) + 1
        : prev.profile.exemptionPassCount;

      const existingInv = prev.inventory.find((i) => i.itemId === item.id);
      let updatedInv: InventoryItem[];

      if (existingInv) {
        updatedInv = prev.inventory.map((i) =>
          i.itemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        const newInv: InventoryItem = {
          id: 'inv-' + Date.now(),
          itemId: item.id,
          name: item.name,
          description: item.description,
          icon: item.icon,
          quantity: 1,
          boughtAt: new Date().toISOString(),
          effectType: item.effectType,
        };
        updatedInv = [newInv, ...prev.inventory];
      }

      return {
        ...prev,
        profile: {
          ...prev.profile,
          gold: newGold,
          exemptionPassCount: newExemptionCount,
        },
        inventory: updatedInv,
      };
    });
  };

  const handleUseInventoryItem = (invItem: InventoryItem) => {
    playSound('use_item');

    updateData((prev) => {
      const updatedInv = prev.inventory
        .map((i) => (i.id === invItem.id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0);

      const log: ItemUsageLog = {
        id: 'log-' + Date.now(),
        itemId: invItem.itemId,
        itemName: invItem.name,
        usedAt: new Date().toISOString(),
        effectSummary: `${invItem.name} 1개를 사용했습니다.`,
      };

      let newExemption = prev.profile.exemptionPassCount;
      if (invItem.effectType === 'exemption' || invItem.name.includes('결석권')) {
        newExemption = Math.max(0, newExemption - 1);
      }

      return {
        ...prev,
        profile: {
          ...prev.profile,
          exemptionPassCount: newExemption,
        },
        inventory: updatedInv,
        usageLogs: [log, ...prev.usageLogs],
      };
    });
  };

  const handleAddShopItem = (item: Omit<ShopItem, 'id'>) => {
    const newItem: ShopItem = {
      ...item,
      id: 'shop-' + Date.now(),
    };
    updateData((prev) => ({
      ...prev,
      shopItems: [...prev.shopItems, newItem],
    }));
  };

  const handleEditShopItem = (item: ShopItem) => {
    updateData((prev) => ({
      ...prev,
      shopItems: prev.shopItems.map((i) => (i.id === item.id ? item : i)),
    }));
  };

  const handleDeleteShopItem = (itemId: string) => {
    updateData((prev) => ({
      ...prev,
      shopItems: prev.shopItems.filter((i) => i.id !== itemId),
    }));
  };

  // 6. IDEAS CRUD
  const handleAddIdea = (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newIdea: Idea = {
      ...idea,
      id: 'idea-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updateData((prev) => ({
      ...prev,
      ideas: [newIdea, ...prev.ideas],
    }));
  };

  const handleEditIdea = (idea: Idea) => {
    updateData((prev) => ({
      ...prev,
      ideas: prev.ideas.map((i) => (i.id === idea.id ? idea : i)),
    }));
  };

  const handleDeleteIdea = (ideaId: string) => {
    updateData((prev) => ({
      ...prev,
      ideas: prev.ideas.filter((i) => i.id !== ideaId),
    }));
  };

  // 7. STORIES CRUD
  const handleAddStory = (story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStory: Story = {
      ...story,
      id: 'story-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updateData((prev) => ({
      ...prev,
      stories: [newStory, ...prev.stories],
    }));
  };

  const handleEditStory = (story: Story) => {
    updateData((prev) => ({
      ...prev,
      stories: prev.stories.map((s) => (s.id === story.id ? story : s)),
    }));
  };

  const handleDeleteStory = (storyId: string) => {
    updateData((prev) => ({
      ...prev,
      stories: prev.stories.filter((s) => s.id !== storyId),
      // Clean up story references in ideas
      ideas: prev.ideas.map((i) => (i.storyId === storyId ? { ...i, storyId: null } : i)),
    }));
  };

  // 8. PROFILE & CONFIG
  const handleUpdateProfile = (name: string, penName: string) => {
    updateData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        name,
        penName,
      },
    }));
  };

  const handleUpdateConfig = (config: AppData['config']) => {
    updateData((prev) => ({
      ...prev,
      config,
    }));
  };

  const handleAddWordsWritten = (count: number) => {
    updateData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        totalWordsWritten: (prev.profile.totalWordsWritten || 0) + count,
      },
    }));
  };

  // 9. BACKUP & EXPORT
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `writer_rpg_backup_${getTodayDateString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (imported: AppData) => {
    updateData(() => imported);
  };

  const handleExportSingleHtml = () => {
    exportSingleHtmlFile(appData);
  };

  const handleResetData = () => {
    const initial = createInitialAppData();
    updateData(() => initial);
    alert('모든 데이터가 기본 예시 상태로 초기화되었습니다.');
  };

  const pendingDailyCount = appData.quests.filter((q) => q.isDaily && !q.completed).length;
  const inventoryTotalCount = appData.inventory.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F9F6F2] text-[#2D3436] font-sans pb-24 sm:pb-12 pt-safe">
      {/* Confetti celebration */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        {/* Daily Streak Notice (if triggered on date change) */}
        {dailyStreakNotice && (
          <div className="mb-4 p-4 rounded-3xl bg-orange-100/90 border border-orange-300 text-orange-950 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-xs animate-in slide-in-from-top duration-300">
            <span>{dailyStreakNotice}</span>
            <button
              onClick={() => setDailyStreakNotice(null)}
              className="p-1 text-orange-800 hover:text-orange-950 rounded-xl shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Global Character Header */}
        <Header
          profile={appData.profile}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onExportSingleHtml={handleExportSingleHtml}
        />

        {/* Navigation Tabs */}
        <Navigation
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          pendingDailyCount={pendingDailyCount}
          inventoryCount={inventoryTotalCount}
          ideasCount={appData.ideas.length}
          storiesCount={appData.stories.length}
        />

        {/* Active Tab View */}
        <main className="transition-all duration-200">
          {activeTab === 'dashboard' && (
            <DashboardView
              data={appData}
              onCompleteQuest={handleCompleteQuest}
              onNavigate={setActiveTab}
              onOpenInspirationModal={() => setIsInspirationModalOpen(true)}
              onOpenFocusSprint={(mode) => setFocusSprintState({ isOpen: true, mode })}
              onOpenAddIdeaModal={() => setActiveTab('ideas')}
              onOpenAddStoryModal={() => setActiveTab('stories')}
            />
          )}

          {activeTab === 'quests' && (
            <QuestView
              quests={appData.quests}
              categories={appData.categories}
              rewardSettings={appData.rewardSettings}
              onCompleteQuest={handleCompleteQuest}
              onAddQuest={handleAddQuest}
              onEditQuest={handleEditQuest}
              onDeleteQuest={handleDeleteQuest}
              onUpdateRewardSettings={handleUpdateRewardSettings}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {activeTab === 'shop' && (
            <ShopView
              userGold={appData.profile.gold}
              exemptionCount={appData.profile.exemptionPassCount || 0}
              shopItems={appData.shopItems}
              inventory={appData.inventory}
              usageLogs={appData.usageLogs}
              onBuyItem={handleBuyItem}
              onUseItem={handleUseInventoryItem}
              onAddShopItem={handleAddShopItem}
              onEditShopItem={handleEditShopItem}
              onDeleteShopItem={handleDeleteShopItem}
              onTriggerInspiration={() => setIsInspirationModalOpen(true)}
              onTriggerSprint={() => setFocusSprintState({ isOpen: true, mode: 'sprint' })}
              onTriggerPomodoro={() => setFocusSprintState({ isOpen: true, mode: 'pomodoro' })}
            />
          )}

          {activeTab === 'ideas' && (
            <IdeaBankView
              ideas={appData.ideas}
              stories={appData.stories}
              onAddIdea={handleAddIdea}
              onEditIdea={handleEditIdea}
              onDeleteIdea={handleDeleteIdea}
              onOpenAddStoryWithIdea={(idea) => {
                setActiveTab('stories');
              }}
            />
          )}

          {activeTab === 'stories' && (
            <StoryLibraryView
              stories={appData.stories}
              ideas={appData.ideas}
              onAddStory={handleAddStory}
              onEditStory={handleEditStory}
              onDeleteStory={handleDeleteStory}
              onAddIdeaForStory={handleAddIdea}
            />
          )}
        </main>
      </div>

      {/* Floating Quest Reward Toast */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-[#2D3436] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-orange-400/40 animate-in slide-in-from-bottom duration-200">
          <div className="p-2 bg-orange-500 text-white rounded-xl font-bold">
            <Check size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-orange-300">퀘스트 완수!</div>
            <div className="text-xs text-stone-300 truncate max-w-[200px]">{toast.title}</div>
          </div>
          <div className="text-xs font-extrabold text-orange-400 bg-stone-800 px-2 py-1 rounded-lg shrink-0">
            +{toast.xp} XP / +{toast.gold} G
          </div>
        </div>
      )}

      {/* Grand Level Up Modal */}
      {levelUpModal?.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border border-orange-300 w-full max-w-sm rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4 animate-in zoom-in-90 duration-300">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-4xl shadow-lg ring-8 ring-orange-100">
              <Award size={44} />
            </div>

            <div>
              <span className="text-xs font-black uppercase text-orange-600 tracking-widest block">
                LEVEL UP!
              </span>
              <h3 className="text-2xl font-black text-[#2D3436] mt-1 font-serif-kr">
                레벨 {levelUpModal.newLevel} 달성!
              </h3>
              <p className="text-sm font-bold text-orange-900 mt-1 bg-orange-100 py-1 px-3 rounded-full inline-block">
                새로운 칭호: [{levelUpModal.newTitle}]
              </p>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-serif-kr">
              꾸준한 창작으로 작가로서 한 단계 더 도약하셨습니다. 당신의 다음 이야기가 세상을 밝힐 것입니다!
            </p>

            <button
              onClick={() => setLevelUpModal(null)}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-sm rounded-2xl shadow-md transition active:scale-95"
            >
              집필 계속하기
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        appData={appData}
        onUpdateProfile={handleUpdateProfile}
        onUpdateRewardSettings={handleUpdateRewardSettings}
        onUpdateConfig={handleUpdateConfig}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onExportSingleHtml={handleExportSingleHtml}
        onResetData={handleResetData}
      />

      {/* Interactive Inspiration Modal */}
      <InspirationDrawModal
        isOpen={isInspirationModalOpen}
        onClose={() => setIsInspirationModalOpen(false)}
        onSaveToIdeaBank={handleAddIdea}
      />

      {/* Interactive Focus Sprint Modal */}
      <FocusSprintModal
        isOpen={focusSprintState.isOpen}
        onClose={() => setFocusSprintState({ isOpen: false, mode: 'sprint' })}
        mode={focusSprintState.mode}
        onSaveToIdeaBank={handleAddIdea}
        onAddWordsWritten={handleAddWordsWritten}
      />
    </div>
  );
}
