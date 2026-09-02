import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Copy, Check, Save } from 'lucide-react';
import { playSound } from '../../utils/gamification';
import { Idea } from '../../types';

interface FocusSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'sprint' | 'pomodoro'; // sprint = 5min, pomodoro = 25min
  onSaveToIdeaBank: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onAddWordsWritten?: (count: number) => void;
}

export const FocusSprintModal: React.FC<FocusSprintModalProps> = ({
  isOpen,
  onClose,
  mode,
  onSaveToIdeaBank,
  onAddWordsWritten,
}) => {
  const initialSeconds = mode === 'sprint' ? 5 * 60 : 25 * 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(mode === 'sprint' ? 5 * 60 : 25 * 60);
      setIsActive(true);
      setText('');
      setCopied(false);
      setSaved(false);
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen, mode]);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      playSound('level_up');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialSeconds);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAsIdea = () => {
    if (!text.trim()) return;
    onSaveToIdeaBank({
      title: mode === 'sprint' ? `[5분 질주 집필] ${new Date().toLocaleDateString()}` : `[집중 집필] ${new Date().toLocaleDateString()}`,
      content: text,
      tag: '플롯',
      storyId: null,
      color: '#DCFCE7',
    });
    if (onAddWordsWritten && charCount > 0) {
      onAddWordsWritten(charCount);
    }
    setSaved(true);
    playSound('buy');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] border border-[#E8E0D2] w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition"
        >
          <X size={20} />
        </button>

        {/* Header with Timer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 pr-10">
          <div>
            <h3 className="font-bold text-lg text-[#2D3436]">
              {mode === 'sprint' ? '⚡ 5분 폭풍 자유 집필 (슬럼프 탈출)' : '☕ 25분 몰입 글쓰기 (에스프레소 세션)'}
            </h3>
            <p className="text-xs text-stone-500">
              {mode === 'sprint'
                ? '오타나 문법을 신경 쓰지 마세요. 머릿속 생각을 멈추지 않고 타이핑하세요.'
                : '잡념을 끄고 오직 눈앞의 문장에만 몰입하는 시간입니다.'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-stone-100 px-3.5 py-1.5 rounded-2xl border border-stone-200">
            <span className={`font-mono text-xl font-extrabold ${timeLeft <= 30 && isActive ? 'text-rose-600 animate-pulse' : 'text-[#2D3436]'}`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleTimer}
                className={`p-1.5 rounded-lg text-white transition ${isActive ? 'bg-orange-500' : 'bg-emerald-600'}`}
                title={isActive ? '일시정지' : '시작'}
              >
                {isActive ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button
                onClick={resetTimer}
                className="p-1.5 rounded-lg bg-stone-200 text-stone-600 hover:bg-stone-300 transition"
                title="초기화"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Writing Pad */}
        <div className="flex-1 my-4 flex flex-col">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              mode === 'sprint'
                ? '머릿속에 떠오르는 인물의 대사, 상황, 혹은 감정을 마구 적어 내려가세요...'
                : '원고 집필을 시작하세요...'
            }
            className="w-full flex-1 min-h-[260px] p-4 bg-[#F9F6F2] rounded-2xl border border-stone-200 font-serif-kr text-base leading-relaxed text-[#2D3436] focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 resize-none"
          />
          <div className="flex justify-between items-center text-xs text-stone-500 mt-2 px-1">
            <span>
              글자수(공백포함): <strong className="text-orange-900 font-bold">{charCount.toLocaleString()}자</strong> (약 {wordCount}단어)
            </span>
            {timeLeft === 0 && (
              <span className="text-emerald-700 font-bold animate-bounce">
                🎉 시간 종료! 훌륭하게 세션을 마쳤습니다.
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200">
          <button
            onClick={handleCopy}
            disabled={!text.trim()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold disabled:opacity-40 transition"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            {copied ? '복사 완료!' : '텍스트 복사'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAsIdea}
              disabled={!text.trim() || saved}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition ${
                saved
                  ? 'bg-emerald-100 text-emerald-800 cursor-default'
                  : 'bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-40'
              }`}
            >
              {saved ? <Check size={14} /> : <Save size={14} />}
              {saved ? '아이디어뱅크 저장됨' : '아이디어뱅크에 저장'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold transition"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
