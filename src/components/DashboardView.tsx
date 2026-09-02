import React from 'react';
import {
  CheckCircle2,
  Circle,
  Flame,
  Sparkles,
  Zap,
  Coffee,
  Plus,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { AppData, Quest } from '../types';
import { getWriterTitle } from '../utils/gamification';

interface DashboardViewProps {
  data: AppData;
  onCompleteQuest: (questId: string) => void;
  onNavigate: (tab: 'dashboard' | 'quests' | 'shop' | 'ideas' | 'stories') => void;
  onOpenInspirationModal: () => void;
  onOpenFocusSprint: (mode: 'sprint' | 'pomodoro') => void;
  onOpenAddIdeaModal: () => void;
  onOpenAddStoryModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  onCompleteQuest,
  onNavigate,
  onOpenInspirationModal,
  onOpenFocusSprint,
  onOpenAddIdeaModal,
  onOpenAddStoryModal,
}) => {
  const dailyQuests = data.quests.filter((q) => q.isDaily);
  const completedDailyCount = dailyQuests.filter((q) => q.completed).length;
  const progressPercent = dailyQuests.length > 0 ? Math.round((completedDailyCount / dailyQuests.length) * 100) : 0;
  const titleInfo = getWriterTitle(data.profile.level);
  const activeStory = data.stories[0]; // Primary active story

  return (
    <div className="space-y-6">
      {/* Motivational Banner / Desk Overview */}
      <div className="bg-gradient-to-r from-[#2C2825] via-[#3D3732] to-[#2C2825] text-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{titleInfo.badge}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {titleInfo.title}의 서재
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif-kr font-bold tracking-tight text-[#FDFBF7]">
              "한 줄을 쓰는 순간, 백지는 이미 세계가 된다."
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-serif-kr">
              오늘의 데일리 퀘스트를 완료하고 연속 집필 기록을 이어가세요.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenInspirationModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-extrabold text-xs sm:text-sm rounded-xl transition active:scale-95 shadow-md"
            >
              <Sparkles size={16} />
              영감 카드 뽑기
            </button>
            <button
              onClick={() => onOpenFocusSprint('sprint')}
              className="flex items-center gap-2 px-4 py-2.5 bg-stone-700/80 hover:bg-stone-700 text-stone-100 font-semibold text-xs sm:text-sm rounded-xl border border-stone-600 transition active:scale-95"
            >
              <Zap size={16} className="text-amber-400" />
              5분 집중 질주
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Daily Quests (Left) + Streak & Tools (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Today's Daily Quests (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFDF9] border border-[#E8E0D2] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFE8DC]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#1A1715]">
                    오늘의 데일리 루틴 퀘스트
                  </h3>
                  <p className="text-xs text-stone-500">매일 자정에 초기화되는 핵심 집필 루틴</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-xl">
                  {completedDailyCount} / {dailyQuests.length} 완료 ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Quest items */}
            {dailyQuests.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-sm">
                등록된 데일리 퀘스트가 없습니다. [퀘스트] 탭에서 추가해 보세요!
              </div>
            ) : (
              <div className="space-y-3">
                {dailyQuests.map((quest: Quest) => {
                  const reward = data.rewardSettings[quest.grade] || { xp: 15, gold: 7 };
                  return (
                    <div
                      key={quest.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                        quest.completed
                          ? 'bg-stone-50/80 border-stone-200 opacity-60'
                          : 'bg-white hover:bg-amber-50/30 border-[#E8E0D2] shadow-2xs'
                      }`}
                    >
                      <button
                        onClick={() => !quest.completed && onCompleteQuest(quest.id)}
                        disabled={quest.completed}
                        className="mt-0.5 shrink-0 text-stone-400 hover:text-amber-600 transition"
                      >
                        {quest.completed ? (
                          <CheckCircle2 size={22} className="text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle size={22} className="hover:stroke-amber-600" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span
                            className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                              quest.grade === 'A'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : quest.grade === 'B'
                                ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                                : 'bg-stone-100 text-stone-700 border border-stone-200'
                            }`}
                          >
                            {quest.grade}등급
                          </span>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                            {quest.category}
                          </span>
                        </div>
                        <h4
                          className={`text-sm font-bold text-[#1A1715] leading-snug ${
                            quest.completed ? 'line-through text-stone-400' : ''
                          }`}
                        >
                          {quest.title}
                        </h4>
                        <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                          {quest.description}
                        </p>
                      </div>

                      <div className="shrink-0 text-right flex flex-col items-end gap-1">
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60">
                          +{reward.xp} XP / +{reward.gold} G
                        </span>
                        {!quest.completed && (
                          <button
                            onClick={() => onCompleteQuest(quest.id)}
                            className="text-xs font-bold text-amber-700 hover:text-amber-900 underline py-1 px-2"
                          >
                            완료하기
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#EFE8DC] flex justify-between items-center text-xs">
            <span className="text-stone-500">모든 퀘스트를 보고 편집하려면:</span>
            <button
              onClick={() => onNavigate('quests')}
              className="flex items-center gap-1 font-bold text-amber-800 hover:text-amber-950 transition"
            >
              퀘스트 전체보기 <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Col: Streak & Creative Hub (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Streak & Protection Card */}
          <div className="bg-[#FFFDF9] border border-[#E8E0D2] rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                  <Flame size={20} className="fill-rose-400" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-[#1A1715]">연속 집필 스트릭</h4>
                  <p className="text-xs text-stone-500">작가의 가장 강력한 무기는 매일의 지속성</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-rose-600 font-mono">
                  {data.profile.streak}
                </span>
                <span className="text-xs text-stone-600 font-bold ml-1">일째</span>
              </div>
            </div>

            {/* Streak Shield Status */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
                <div className="text-xs text-emerald-950">
                  <p className="font-bold">보유 결석권: {data.profile.exemptionPassCount || 0}개</p>
                  <p className="text-[11px] text-emerald-800">
                    미완료일 발생 시 스트릭을 {data.profile.exemptionPassCount || 0}회 방어할 수 있습니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('shop')}
                className="shrink-0 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
              >
                상점 충전
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 text-center">
                <span className="text-[11px] text-stone-500 block font-medium">최고 연속 달성</span>
                <strong className="text-base font-extrabold text-stone-800">
                  {data.profile.maxStreak}일
                </strong>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 text-center">
                <span className="text-[11px] text-stone-500 block font-medium">총 완료 퀘스트</span>
                <strong className="text-base font-extrabold text-stone-800">
                  {data.profile.totalQuestsCompleted}개
                </strong>
              </div>
            </div>
          </div>

          {/* Quick Writing Launchers */}
          <div className="bg-[#FFFDF9] border border-[#E8E0D2] rounded-3xl p-5 sm:p-6 shadow-2xs space-y-3">
            <h4 className="font-bold text-sm text-[#1A1715] flex items-center gap-2">
              <Zap size={16} className="text-amber-600" />
              빠른 집필 도구함
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onOpenFocusSprint('pomodoro')}
                className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-left transition active:scale-95 flex flex-col justify-between"
              >
                <div className="p-1.5 bg-amber-200/70 text-amber-900 rounded-lg w-fit mb-2">
                  <Coffee size={16} />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-amber-950">25분 뽀모도로</h5>
                  <p className="text-[11px] text-amber-800 mt-0.5">에스프레소 몰입 세션</p>
                </div>
              </button>

              <button
                onClick={onOpenAddIdeaModal}
                className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 text-left transition active:scale-95 flex flex-col justify-between"
              >
                <div className="p-1.5 bg-indigo-200/70 text-indigo-900 rounded-lg w-fit mb-2">
                  <Plus size={16} />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-indigo-950">아이디어 조각</h5>
                  <p className="text-[11px] text-indigo-800 mt-0.5">순간의 대사/플롯 메모</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Story Spotlight Card */}
      {activeStory && (
        <div className="bg-[#FFFDF9] border border-[#E8E0D2] rounded-3xl p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-100 text-indigo-800 rounded-xl">
                <BookOpen size={18} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-indigo-800 uppercase">
                  진행 중인 이야기 프로젝트
                </span>
                <h3 className="font-bold text-base sm:text-lg text-[#1A1715]">
                  {activeStory.title}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">
                {activeStory.status}
              </span>
              <button
                onClick={() => onNavigate('stories')}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition"
              >
                원고 보기
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 font-serif-kr italic mb-3">
            "{activeStory.logline}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {activeStory.episodes.slice(0, 3).map((ep) => (
              <div
                key={ep.id}
                className="p-3 bg-stone-50/80 rounded-2xl border border-stone-200/70 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-[#1A1715] font-bold">{ep.title}</strong>
                  <span className="text-[10px] text-stone-500 font-semibold">
                    {ep.status === 'completed' ? '완고 ✓' : ep.status === 'drafting' ? '집필 중' : '구상'}
                  </span>
                </div>
                <p className="text-stone-500 line-clamp-2 leading-relaxed">{ep.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
