import React from 'react';
import { Sparkles, Flame, Shield, Coins, Settings, Download } from 'lucide-react';
import { UserProfile } from '../types';
import { getXpRequiredForLevel, getWriterTitle } from '../utils/gamification';

interface HeaderProps {
  profile: UserProfile;
  onOpenSettings: () => void;
  onExportSingleHtml: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenSettings,
  onExportSingleHtml,
}) => {
  const reqXp = getXpRequiredForLevel(profile.level);
  const xpPercent = Math.min(100, Math.max(0, Math.round((profile.xp / reqXp) * 100)));
  const titleInfo = getWriterTitle(profile.level);

  return (
    <header className="bg-[#FFFDF9] border border-[#E8E0D2] rounded-3xl p-4 sm:p-6 shadow-xs mb-6 transition-all">
      {/* Top row: Profile & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Avatar & Title info */}
        <div className="flex items-center gap-3.5">
          <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${titleInfo.color} text-white flex items-center justify-center text-2xl sm:text-3xl shadow-md shrink-0 ring-4 ring-amber-100`}>
            {titleInfo.badge}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1715] tracking-tight">
                {profile.penName || '별빛 작가'}
              </h1>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                <span>Lv.{profile.level}</span>
                <span>{titleInfo.title}</span>
              </div>
            </div>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              {titleInfo.description} · 누적 집필: {profile.totalWordsWritten.toLocaleString()}자
            </p>
          </div>
        </div>

        {/* Right: Currency & Badges & Settings */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Gold Counter */}
          <div className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-b from-amber-50 to-amber-100/70 border border-amber-300/80 rounded-2xl text-amber-950 font-extrabold text-sm shadow-2xs">
            <Coins size={17} className="text-amber-600 fill-amber-400" />
            <span>{profile.gold.toLocaleString()}</span>
            <span className="text-xs font-semibold text-amber-700 ml-0.5">G</span>
          </div>

          {/* Streak Flame */}
          <div
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-b from-rose-50 to-rose-100/70 border border-rose-300/80 rounded-2xl text-rose-950 font-extrabold text-sm shadow-2xs"
            title={`연속 달성: ${profile.streak}일 (최고: ${profile.maxStreak}일)`}
          >
            <Flame size={17} className="text-rose-500 fill-rose-400 animate-pulse" />
            <span>{profile.streak}일</span>
            <span className="text-[11px] font-semibold text-rose-700">연속</span>
          </div>

          {/* Exemption Pass (결석권) */}
          <div
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 font-bold text-xs shadow-2xs"
            title="미완료 시 스트릭 초기화를 1회 방어해주는 결석권 보유 수량"
          >
            <Shield size={15} className="text-emerald-600 fill-emerald-200" />
            <span>결석권</span>
            <span className="px-1.5 py-0.5 bg-emerald-200 text-emerald-950 rounded-md text-[11px] font-extrabold">
              {profile.exemptionPassCount || 0}
            </span>
          </div>

          {/* Quick Offline HTML Download */}
          <button
            onClick={onExportSingleHtml}
            className="p-2 sm:px-3 sm:py-2 flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-2xl text-stone-700 text-xs font-semibold transition active:scale-95 shadow-2xs"
            title="아이패드/PC 오프라인 실행용 단일 HTML 파일로 저장"
          >
            <Download size={15} />
            <span className="hidden sm:inline">HTML 저장</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-2xl text-stone-700 transition active:scale-95 shadow-2xs"
            title="설정 및 보상/데이터 관리"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Bottom row: XP Progress Bar */}
      <div className="mt-4 pt-3 border-t border-[#EFE8DC]">
        <div className="flex justify-between items-center text-xs font-semibold text-stone-600 mb-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-600" />
            <span>작가 경험치 (XP)</span>
          </div>
          <span className="font-mono text-stone-700">
            {profile.xp} / {reqXp} XP ({xpPercent}%)
          </span>
        </div>
        <div className="w-full h-3 bg-[#EFE9DF] rounded-full overflow-hidden p-0.5 border border-amber-200/50">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
};
