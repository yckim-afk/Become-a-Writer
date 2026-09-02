import React, { useState } from 'react';
import { Sparkles, X, Plus, Shuffle, Check } from 'lucide-react';
import { INSPIRATION_PROMPTS, InspirationPrompt, playSound } from '../../utils/gamification';
import { Idea } from '../../types';

interface InspirationDrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveToIdeaBank: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const InspirationDrawModal: React.FC<InspirationDrawModalProps> = ({
  isOpen,
  onClose,
  onSaveToIdeaBank,
}) => {
  const [currentPrompt, setCurrentPrompt] = useState<InspirationPrompt>(() => {
    return INSPIRATION_PROMPTS[Math.floor(Math.random() * INSPIRATION_PROMPTS.length)];
  });
  const [isFlipping, setIsFlipping] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const drawNewCard = () => {
    setIsFlipping(true);
    playSound('coin');
    setTimeout(() => {
      let next: InspirationPrompt;
      do {
        next = INSPIRATION_PROMPTS[Math.floor(Math.random() * INSPIRATION_PROMPTS.length)];
      } while (next.id === currentPrompt.id && INSPIRATION_PROMPTS.length > 1);

      setCurrentPrompt(next);
      setIsFlipping(false);
      setSaved(false);
    }, 250);
  };

  const handleSave = () => {
    let tag = '기타';
    if (currentPrompt.category === '인물') tag = '캐릭터';
    else if (currentPrompt.category === '사건/반전') tag = '플롯';
    else if (currentPrompt.category === '세계관') tag = '세계관';
    else if (currentPrompt.category === '대사') tag = '대사';

    onSaveToIdeaBank({
      title: `[영감] ${currentPrompt.title}`,
      content: `${currentPrompt.prompt}\n\n💡 질문 & 길잡이:\n${currentPrompt.guide}`,
      tag,
      storyId: null,
      color: '#FEF3C7',
    });
    setSaved(true);
    playSound('buy');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] border border-[#E8E0D2] w-full max-w-lg rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-orange-100 text-orange-800 rounded-xl">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#2D3436]">영감 카드 뽑기</h3>
            <p className="text-xs text-stone-500">막막한 순간 작가의 상상력을 자극하는 스토리 트리거</p>
          </div>
        </div>

        {/* Tarot Card View */}
        <div
          className={`min-h-[220px] rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col justify-between ${
            isFlipping
              ? 'scale-95 opacity-50 bg-stone-100 border-stone-200'
              : 'bg-gradient-to-br from-orange-50/80 via-white to-amber-50/60 border-orange-300 shadow-md'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 bg-orange-100 text-orange-950 rounded-lg text-xs font-bold">
                카테고리: {currentPrompt.category}
              </span>
              <span className="text-xs font-mono text-orange-600 font-semibold">Prompt #{currentPrompt.id.replace('p-', '')}</span>
            </div>

            <h4 className="font-serif-kr text-lg font-bold text-[#2D3436] mb-2 leading-snug">
              {currentPrompt.title}
            </h4>
            <p className="text-sm text-[#2D3436] leading-relaxed font-serif-kr whitespace-pre-line">
              "{currentPrompt.prompt}"
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-orange-200 text-xs text-stone-600 bg-white/70 p-2.5 rounded-xl">
            <span className="font-semibold text-orange-900">✍️ 발상 팁: </span>
            {currentPrompt.guide}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={drawNewCard}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-sm transition active:scale-95"
          >
            <Shuffle size={16} />
            다른 카드 뽑기
          </button>

          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm shadow-sm transition active:scale-95 ${
              saved
                ? 'bg-emerald-100 text-emerald-800 cursor-default'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {saved ? (
              <>
                <Check size={16} />
                아이디어뱅크에 저장됨!
              </>
            ) : (
              <>
                <Plus size={16} />
                아이디어뱅크에 담기
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
