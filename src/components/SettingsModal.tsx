import React, { useState, useRef } from 'react';
import {
  X,
  User,
  SlidersHorizontal,
  Flame,
  Download,
  Upload,
  RotateCcw,
  FileCode,
  ShieldCheck,
  Check,
  AlertTriangle
} from 'lucide-react';
import { AppData, RewardSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appData: AppData;
  onUpdateProfile: (name: string, penName: string) => void;
  onUpdateRewardSettings: (settings: RewardSettings) => void;
  onUpdateConfig: (config: AppData['config']) => void;
  onExportJson: () => void;
  onImportJson: (imported: AppData) => void;
  onExportSingleHtml: () => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  appData,
  onUpdateProfile,
  onUpdateRewardSettings,
  onUpdateConfig,
  onExportJson,
  onImportJson,
  onExportSingleHtml,
  onResetData,
}) => {
  const [penName, setPenName] = useState(appData.profile.penName || '별빛 작가');
  const [userName, setUserName] = useState(appData.profile.name || '신진 작가');

  // Reward settings
  const [rewardA, setRewardA] = useState(appData.rewardSettings.A);
  const [rewardB, setRewardB] = useState(appData.rewardSettings.B);
  const [rewardC, setRewardC] = useState(appData.rewardSettings.C);

  // Config settings
  const [streakPenalty, setStreakPenalty] = useState<'reset' | 'decrease'>(
    appData.config.streakPenaltyType || 'reset'
  );
  const [autoExemption, setAutoExemption] = useState(
    appData.config.autoUseExemption ?? true
  );

  const [savedNotice, setSavedNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(userName.trim(), penName.trim());
    onUpdateRewardSettings({ A: rewardA, B: rewardB, C: rewardC });
    onUpdateConfig({
      ...appData.config,
      streakPenaltyType: streakPenalty,
      autoUseExemption: autoExemption,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.profile && parsed.quests) {
          onImportJson(parsed);
          alert('데이터 복원이 완료되었습니다!');
          onClose();
        } else {
          alert('유효하지 않은 백업 데이터 파일입니다.');
        }
      } catch {
        alert('JSON 파일을 파싱하는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] border border-[#E8E0D2] w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto touch-scroll animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-extrabold text-[#2D3436] mb-1">환경 설정 및 데이터 관리</h3>
        <p className="text-xs text-stone-500 mb-6">
          필명, 등급별 보상, 스트릭 규칙을 커스텀하고 안전하게 백업하세요.
        </p>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* 1. Profile section */}
          <div className="p-4 bg-[#F9F6F2] rounded-2xl border border-stone-200 space-y-3">
            <h4 className="font-extrabold text-xs text-[#2D3436] flex items-center gap-1.5">
              <User size={15} className="text-orange-500" />
              작가 프로필 설정
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  작가 필명 (앱 표시명)
                </label>
                <input
                  type="text"
                  required
                  value={penName}
                  onChange={(e) => setPenName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  사용자 본명/닉네임
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* 2. Grade Reward Configuration */}
          <div className="p-4 bg-[#F9F6F2] rounded-2xl border border-stone-200 space-y-3">
            <h4 className="font-extrabold text-xs text-[#2D3436] flex items-center gap-1.5">
              <SlidersHorizontal size={15} className="text-orange-500" />
              등급별(A/B/C) 기본 보상 일괄 설정
            </h4>

            <div className="grid grid-cols-3 gap-2 text-center">
              {/* A */}
              <div className="p-2.5 bg-orange-50 rounded-xl border border-orange-200">
                <span className="font-extrabold text-xs text-orange-950 block mb-1">A등급</span>
                <input
                  type="number"
                  min="1"
                  value={rewardA.xp}
                  onChange={(e) => setRewardA({ ...rewardA, xp: parseInt(e.target.value) || 0 })}
                  className="w-full text-center px-1 py-1 bg-white border border-orange-300 rounded-lg text-xs font-bold mb-1"
                  title="XP"
                />
                <span className="text-[10px] text-orange-950 block font-semibold">XP</span>
                <input
                  type="number"
                  min="0"
                  value={rewardA.gold}
                  onChange={(e) => setRewardA({ ...rewardA, gold: parseInt(e.target.value) || 0 })}
                  className="w-full text-center px-1 py-1 bg-white border border-orange-300 rounded-lg text-xs font-bold mt-1"
                  title="Gold"
                />
                <span className="text-[10px] text-orange-950 block font-semibold">Gold</span>
              </div>

              {/* B */}
              <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200">
                <span className="font-extrabold text-xs text-blue-950 block mb-1">B등급</span>
                <input
                  type="number"
                  min="1"
                  value={rewardB.xp}
                  onChange={(e) => setRewardB({ ...rewardB, xp: parseInt(e.target.value) || 0 })}
                  className="w-full text-center px-1 py-1 bg-white border border-blue-300 rounded-lg text-xs font-bold mb-1"
                  title="XP"
                />
                <span className="text-[10px] text-blue-900 block font-semibold">XP</span>
                <input
                  type="number"
                  min="0"
                  value={rewardB.gold}
                  onChange={(e) => setRewardB({ ...rewardB, gold: parseInt(e.target.value) || 0 })}
                  className="w-full text-center px-1 py-1 bg-white border border-blue-300 rounded-lg text-xs font-bold mt-1"
                  title="Gold"
                />
                <span className="text-[10px] text-blue-900 block font-semibold">Gold</span>
              </div>

              {/* C */}
              <div className="p-2.5 bg-stone-100 rounded-xl border border-stone-300">
                <span className="font-extrabold text-xs text-stone-900 block mb-1">C등급</span>
                <input
                  type="number"
                  min="1"
                  value={rewardC.xp}
                  onChange={(e) => setRewardC({ ...rewardC, xp: parseInt(e.target.value) || 0 })}
                  className="w-full text-center px-1 py-1 bg-white border border-stone-400 rounded-lg text-xs font-bold mb-1"
                  title="XP"
                />
                <span className="text-[10px] text-stone-700 block font-semibold">XP</span>
                <input
                  type="number"
                  min="0"
                  value={rewardC.gold}
                  onChange={(e) => setRewardC({ ...rewardC, gold: parseInt(e.target.value) || 0 })}
                  className="w-full text-center px-1 py-1 bg-white border border-stone-400 rounded-lg text-xs font-bold mt-1"
                  title="Gold"
                />
                <span className="text-[10px] text-stone-700 block font-semibold">Gold</span>
              </div>
            </div>
          </div>

          {/* 3. Streak Rules & Exemption Shield */}
          <div className="p-4 bg-[#F9F6F2] rounded-2xl border border-stone-200 space-y-3">
            <h4 className="font-extrabold text-xs text-[#2D3436] flex items-center gap-1.5">
              <Flame size={15} className="text-rose-500" />
              스트릭 패널티 및 결석권 동작 설정
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-700 font-semibold">미완료일 발생 시 스트릭 페널티</span>
                <select
                  value={streakPenalty}
                  onChange={(e) => setStreakPenalty(e.target.value as any)}
                  className="px-2.5 py-1 bg-white border border-stone-300 rounded-lg font-bold"
                >
                  <option value="reset">0일로 완전 초기화</option>
                  <option value="decrease">1일만 차감</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-stone-700 font-semibold block">
                    보유 결석권 자동 사용
                  </span>
                  <span className="text-[11px] text-stone-500">
                    미접속/미완료일 감지 시 보유 결석권을 1개 소모해 스트릭 보호
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoExemption}
                  onChange={(e) => setAutoExemption(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Save Profile button */}
          <div className="flex items-center justify-between">
            {savedNotice ? (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <Check size={14} /> 설정이 성공적으로 저장되었습니다!
              </span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition"
            >
              설정 저장
            </button>
          </div>
        </form>

        {/* 4. Standalone HTML Export & Backup */}
        <div className="mt-6 pt-6 border-t border-stone-200 space-y-3">
          <h4 className="font-extrabold text-xs text-[#2D3436] flex items-center gap-1.5">
            <Download size={15} className="text-blue-500" />
            데이터 백업 및 독립 실행 파일 내보내기
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Download Standalone Single HTML */}
            <button
              onClick={onExportSingleHtml}
              className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl text-left font-bold text-xs shadow-xs transition active:scale-95 flex items-center gap-2.5"
            >
              <FileCode size={20} className="shrink-0" />
              <div>
                <span>단일 HTML 파일 다운로드</span>
                <p className="text-[10px] font-normal text-orange-100 mt-0.5">
                  아이패드(사파리)/PC에서 인터넷 없이 로컬 실행
                </p>
              </div>
            </button>

            {/* JSON Backup Export */}
            <button
              onClick={onExportJson}
              className="p-3 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 rounded-2xl text-left font-bold text-xs transition active:scale-95 flex items-center gap-2.5"
            >
              <Download size={20} className="shrink-0 text-stone-600" />
              <div>
                <span>JSON 데이터 내보내기</span>
                <p className="text-[10px] font-normal text-stone-500 mt-0.5">
                  퀘스트, 아이디어, 이야기 전체 백업
                </p>
              </div>
            </button>
          </div>

          {/* JSON Backup Import */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5 transition"
            >
              <Upload size={14} />
              JSON 데이터 복원 (가져오기)
            </button>

            <button
              onClick={() => {
                if (
                  confirm(
                    '모든 데이터를 초기 상태(예시 퀘스트 및 샘플 작품)로 초기화하시겠습니까? 현재 작성 중인 데이터가 삭제됩니다.'
                  )
                ) {
                  onResetData();
                  onClose();
                }
              }}
              className="py-2 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
            >
              <RotateCcw size={14} />
              데이터 초기화
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
