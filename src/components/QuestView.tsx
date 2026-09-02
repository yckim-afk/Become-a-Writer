import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  SlidersHorizontal,
  FolderPlus,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  Layers,
  Search,
  Check,
  X
} from 'lucide-react';
import { Quest, QuestGrade, Category, RewardSettings } from '../types';

interface QuestViewProps {
  quests: Quest[];
  categories: Category[];
  rewardSettings: RewardSettings;
  onCompleteQuest: (questId: string) => void;
  onAddQuest: (quest: Omit<Quest, 'id' | 'createdAt'>) => void;
  onEditQuest: (quest: Quest) => void;
  onDeleteQuest: (questId: string) => void;
  onUpdateRewardSettings: (settings: RewardSettings) => void;
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const QuestView: React.FC<QuestViewProps> = ({
  quests,
  categories,
  rewardSettings,
  onCompleteQuest,
  onAddQuest,
  onEditQuest,
  onDeleteQuest,
  onUpdateRewardSettings,
  onAddCategory,
  onDeleteCategory,
}) => {
  // Filters
  const [filterType, setFilterType] = useState<'all' | 'daily' | 'nondaily'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Form State for Add/Edit Quest
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formGrade, setFormGrade] = useState<QuestGrade>('B');
  const [formCategory, setFormCategory] = useState('작가');
  const [formIsDaily, setFormIsDaily] = useState(true);

  // Form State for Reward Settings
  const [rewardA, setRewardA] = useState(rewardSettings.A);
  const [rewardB, setRewardB] = useState(rewardSettings.B);
  const [rewardC, setRewardC] = useState(rewardSettings.C);

  // Form State for New Category
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingQuest(null);
    setFormTitle('');
    setFormDesc('');
    setFormGrade('B');
    setFormCategory(categories[0]?.name || '작가');
    setFormIsDaily(true);
    setIsAddModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (q: Quest) => {
    setEditingQuest(q);
    setFormTitle(q.title);
    setFormDesc(q.description);
    setFormGrade(q.grade);
    setFormCategory(q.category);
    setFormIsDaily(q.isDaily);
    setIsAddModalOpen(true);
  };

  // Submit Add/Edit
  const handleSubmitQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingQuest) {
      onEditQuest({
        ...editingQuest,
        title: formTitle.trim(),
        description: formDesc.trim(),
        grade: formGrade,
        category: formCategory,
        isDaily: formIsDaily,
      });
    } else {
      onAddQuest({
        title: formTitle.trim(),
        description: formDesc.trim(),
        grade: formGrade,
        category: formCategory,
        isDaily: formIsDaily,
        completed: false,
      });
    }
    setIsAddModalOpen(false);
  };

  // Save Reward Settings
  const handleSaveRewardSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRewardSettings({
      A: rewardA,
      B: rewardB,
      C: rewardC,
    });
    setIsRewardModalOpen(false);
  };

  // Add Category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const colors = [
      'bg-amber-100 text-amber-800 border-amber-300',
      'bg-indigo-100 text-indigo-800 border-indigo-300',
      'bg-emerald-100 text-emerald-800 border-emerald-300',
      'bg-rose-100 text-rose-800 border-rose-300',
      'bg-purple-100 text-purple-800 border-purple-300',
    ];
    onAddCategory({
      id: 'cat-' + Date.now(),
      name: newCatName.trim(),
      description: newCatDesc.trim(),
      color: colors[categories.length % colors.length],
    });
    setNewCatName('');
    setNewCatDesc('');
  };

  // Filtered quests
  const filteredQuests = quests.filter((q) => {
    if (filterType === 'daily' && !q.isDaily) return false;
    if (filterType === 'nondaily' && q.isDaily) return false;
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;
    if (statusFilter === 'active' && q.completed) return false;
    if (statusFilter === 'completed' && !q.completed) return false;
    if (searchQuery.trim()) {
      const match =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.category.toLowerCase().includes(searchQuery.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF9] border border-[#E8E0D2] rounded-3xl p-5 sm:p-6 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A1715] tracking-tight">
            집필 퀘스트 관리
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            등급별(A/B/C) 자동 보상과 데일리 루틴으로 작가 캐릭터를 성장시키세요.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Grade Reward Setting button */}
          <button
            onClick={() => {
              setRewardA(rewardSettings.A);
              setRewardB(rewardSettings.B);
              setRewardC(rewardSettings.C);
              setIsRewardModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 transition"
          >
            <SlidersHorizontal size={14} />
            등급별 보상 설정
          </button>

          {/* Category Setting button */}
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 transition"
          >
            <FolderPlus size={14} />
            카테고리 관리
          </button>

          {/* Add Quest button */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 min-h-[40px]"
          >
            <Plus size={16} />
            새 퀘스트 추가
          </button>
        </div>
      </div>

      {/* Grade Rewards Quick Indicator Bar */}
      <div className="grid grid-cols-3 gap-3">
        {(['A', 'B', 'C'] as QuestGrade[]).map((g) => {
          const r = rewardSettings[g];
          return (
            <div
              key={g}
              className={`p-3 rounded-2xl border text-center transition-all ${
                g === 'A'
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                  : g === 'B'
                  ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
                  : 'bg-stone-100/80 border-stone-300 text-stone-800'
              }`}
            >
              <div className="flex items-center justify-center gap-1 font-bold text-xs">
                <span>{g}등급 보상</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold mt-0.5">
                +{r.xp} XP / +{r.gold} G
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFDF9] border border-[#E8E0D2] rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="퀘스트 제목, 내용 또는 카테고리 검색..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#F8F6F0] border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Daily vs Non-Daily */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterType === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilterType('daily')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                filterType === 'daily' ? 'bg-rose-500 text-white shadow-2xs' : 'text-stone-600'
              }`}
            >
              <Calendar size={12} /> 데일리
            </button>
            <button
              onClick={() => setFilterType('nondaily')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                filterType === 'nondaily' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-stone-600'
              }`}
            >
              <Layers size={12} /> 도전 과제
            </button>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll py-0.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === 'all'
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              모든 분류
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat.name
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2 py-1 rounded-lg ${statusFilter === 'all' ? 'font-bold text-amber-900 underline' : 'text-stone-500'}`}
            >
              전체 ({quests.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2 py-1 rounded-lg ${statusFilter === 'active' ? 'font-bold text-amber-900 underline' : 'text-stone-500'}`}
            >
              진행 중
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-2 py-1 rounded-lg ${statusFilter === 'completed' ? 'font-bold text-amber-900 underline' : 'text-stone-500'}`}
            >
              완료됨
            </button>
          </div>
        </div>
      </div>

      {/* Quests List */}
      <div className="space-y-3">
        {filteredQuests.length === 0 ? (
          <div className="bg-[#FFFDF9] border border-dashed border-[#E8E0D2] rounded-3xl p-12 text-center text-stone-500 space-y-2">
            <Sparkles size={28} className="mx-auto text-amber-500/70" />
            <p className="font-bold text-sm text-[#1A1715]">해당 조건의 퀘스트가 없습니다.</p>
            <p className="text-xs text-stone-400">새 퀘스트를 추가해 창작 루틴을 만들어보세요!</p>
          </div>
        ) : (
          filteredQuests.map((quest) => {
            const reward = rewardSettings[quest.grade] || { xp: 15, gold: 7 };
            return (
              <div
                key={quest.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  quest.completed
                    ? 'bg-stone-50/70 border-stone-200 opacity-60'
                    : 'bg-[#FFFDF9] border-[#E8E0D2] hover:border-amber-300 shadow-2xs'
                }`}
              >
                {/* Left info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => onCompleteQuest(quest.id)}
                    className="mt-0.5 shrink-0 text-stone-400 hover:text-amber-600 transition"
                    title={quest.completed ? '완료 취소 또는 재완료' : '완료하기'}
                  >
                    {quest.completed ? (
                      <CheckCircle2 size={24} className="text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle size={24} className="hover:stroke-amber-600" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-md ${
                          quest.grade === 'A'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : quest.grade === 'B'
                            ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {quest.grade}등급
                      </span>

                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                        {quest.category}
                      </span>

                      {quest.isDaily ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <Calendar size={11} /> 데일리 (매일 반복)
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-500">
                          단발성 과제
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-base font-bold text-[#1A1715] leading-snug ${
                        quest.completed ? 'line-through text-stone-400' : ''
                      }`}
                    >
                      {quest.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed whitespace-pre-line">
                      {quest.description}
                    </p>
                  </div>
                </div>

                {/* Right Rewards & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="text-xs font-extrabold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80">
                    +{reward.xp} XP / +{reward.gold} Gold
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(quest)}
                      className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
                      title="수정"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`'${quest.title}' 퀘스트를 삭제하시겠습니까?`)) {
                          onDeleteQuest(quest.id);
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="삭제"
                    >
                      <Trash2 size={15} />
                    </button>

                    <button
                      onClick={() => onCompleteQuest(quest.id)}
                      disabled={quest.completed}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                        quest.completed
                          ? 'bg-stone-200 text-stone-500 cursor-default'
                          : 'bg-amber-600 hover:bg-amber-700 text-white shadow-2xs'
                      }`}
                    >
                      {quest.completed ? '완료됨' : '완료하기'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Quest Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border border-[#E8E0D2] w-full max-w-lg rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-[#1A1715] mb-1">
              {editingQuest ? '퀘스트 수정하기' : '새 집필 퀘스트 만들기'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              보상은 등급(A/B/C)에 따라 일괄 자동 책정됩니다.
            </p>

            <form onSubmit={handleSubmitQuest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  퀘스트 제목 *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="예: 오늘 500자 이상 자유 집필하기"
                  className="w-full px-3.5 py-2.5 bg-[#F8F6F0] border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  상세 설명 / 실천 가이드
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="예: 원고지 약 2.5매 분량. 아무것도 없는 백지보다 낙서가 낫습니다."
                  className="w-full px-3.5 py-2.5 bg-[#F8F6F0] border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 resize-none"
                />
              </div>

              {/* Grade Selection with Live Reward Preview */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  퀘스트 등급 (자동 보상 책정)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['A', 'B', 'C'] as QuestGrade[]).map((g) => {
                    const rew = rewardSettings[g];
                    const isSelected = formGrade === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormGrade(g)}
                        className={`p-3 rounded-2xl border text-center transition ${
                          isSelected
                            ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold ring-2 ring-amber-400'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <span className="text-sm font-black block">{g}등급</span>
                        <span className="text-[11px] text-amber-800 font-semibold block mt-0.5">
                          +{rew.xp} XP / +{rew.gold} G
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category & Daily Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    카테고리 분류
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F6F0] border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    반복 주기 (데일리 여부)
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormIsDaily(!formIsDaily)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                      formIsDaily
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    <Calendar size={15} />
                    {formIsDaily ? '매일 반복 (데일리 퀘스트)' : '일회성 (도전 과제)'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-sm transition"
                >
                  {editingQuest ? '수정 완료' : '퀘스트 저장'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Reward Settings Modal */}
      {isRewardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border border-[#E8E0D2] w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsRewardModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-[#1A1715] mb-1">등급별 보상 일괄 설정</h3>
            <p className="text-xs text-stone-500 mb-4">
              등급별 수치를 변경하면 해당 등급의 모든 퀘스트에 일괄 반영됩니다.
            </p>

            <form onSubmit={handleSaveRewardSettings} className="space-y-4">
              {/* A Grade */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl">
                <span className="font-extrabold text-xs text-amber-950 block mb-2">
                  👑 A등급 (높은 난이도/핵심 과제)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                      획득 XP
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={rewardA.xp}
                      onChange={(e) => setRewardA({ ...rewardA, xp: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                      획득 Gold
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={rewardA.gold}
                      onChange={(e) => setRewardA({ ...rewardA, gold: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* B Grade */}
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
                <span className="font-extrabold text-xs text-indigo-950 block mb-2">
                  📜 B등급 (중간 난이도/정기 과제)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-indigo-900 mb-1">
                      획득 XP
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={rewardB.xp}
                      onChange={(e) => setRewardB({ ...rewardB, xp: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 bg-white border border-indigo-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-indigo-900 mb-1">
                      획득 Gold
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={rewardB.gold}
                      onChange={(e) => setRewardB({ ...rewardB, gold: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 bg-white border border-indigo-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* C Grade */}
              <div className="p-3.5 bg-stone-100/70 border border-stone-300 rounded-2xl">
                <span className="font-extrabold text-xs text-stone-900 block mb-2">
                  🌱 C등급 (낮은 난이도/간단 루틴)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      획득 XP
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={rewardC.xp}
                      onChange={(e) => setRewardC({ ...rewardC, xp: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      획득 Gold
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={rewardC.gold}
                      onChange={(e) => setRewardC({ ...rewardC, gold: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsRewardModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                >
                  보상 설정 적용
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border border-[#E8E0D2] w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-[#1A1715] mb-1">퀘스트 카테고리 관리</h3>
            <p className="text-xs text-stone-500 mb-4">
              글쓰기 분야별로 카테고리를 추가하고 자유롭게 분류하세요.
            </p>

            {/* Current Categories List */}
            <div className="space-y-2 mb-5 max-h-48 overflow-y-auto touch-scroll pr-1">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-xs text-[#1A1715]">{cat.name}</span>
                    {cat.description && (
                      <p className="text-[11px] text-stone-500 mt-0.5">{cat.description}</p>
                    )}
                  </div>
                  {categories.length > 1 && (
                    <button
                      onClick={() => onDeleteCategory(cat.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded-lg"
                      title="삭제"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Category Form */}
            <form onSubmit={handleCreateCategory} className="space-y-3 pt-3 border-t border-stone-200">
              <span className="font-bold text-xs text-stone-800 block">+ 새 카테고리 등록</span>
              <div>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="카테고리 이름 (예: 세계관, 시장조사 등)"
                  className="w-full px-3 py-2 bg-[#F8F6F0] border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="설명 (선택 사항)"
                  className="w-full px-3 py-2 bg-[#F8F6F0] border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                카테고리 추가하기
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
