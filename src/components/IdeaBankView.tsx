import React, { useState } from 'react';
import {
  Lightbulb,
  Plus,
  Search,
  Tag,
  Link,
  Trash2,
  Edit2,
  Sparkles,
  BookOpen,
  Filter,
  X,
  Copy,
  Check
} from 'lucide-react';
import { Idea, IdeaTag, Story } from '../types';

interface IdeaBankViewProps {
  ideas: Idea[];
  stories: Story[];
  onAddIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditIdea: (idea: Idea) => void;
  onDeleteIdea: (ideaId: string) => void;
  onOpenAddStoryWithIdea?: (idea: Idea) => void;
}

const DEFAULT_TAGS: IdeaTag[] = ['캐릭터', '플롯', '세계관', '대사', '기타'];

const COLOR_PRESETS = [
  { name: '노랑', hex: '#FEF3C7', border: 'border-amber-200' },
  { name: '파랑', hex: '#E0E7FF', border: 'border-indigo-200' },
  { name: '초록', hex: '#DCFCE7', border: 'border-emerald-200' },
  { name: '분홍', hex: '#FCE7F3', border: 'border-pink-200' },
  { name: '보라', hex: '#F3E8FF', border: 'border-purple-200' },
  { name: '기본', hex: '#FFFDF9', border: 'border-[#E8E0D2]' },
];

export const IdeaBankView: React.FC<IdeaBankViewProps> = ({
  ideas,
  stories,
  onAddIdea,
  onEditIdea,
  onDeleteIdea,
  onOpenAddStoryWithIdea,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedStoryFilter, setSelectedStoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formTag, setFormTag] = useState<IdeaTag>('캐릭터');
  const [formStoryId, setFormStoryId] = useState<string>('');
  const [formColor, setFormColor] = useState('#FEF3C7');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingIdea(null);
    setFormTitle('');
    setFormContent('');
    setFormTag('캐릭터');
    setFormStoryId('');
    setFormColor('#FEF3C7');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (idea: Idea) => {
    setEditingIdea(idea);
    setFormTitle(idea.title);
    setFormContent(idea.content);
    setFormTag(idea.tag);
    setFormStoryId(idea.storyId || '');
    setFormColor(idea.color || '#FFFDF9');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() && !formContent.trim()) return;

    const title = formTitle.trim() || formContent.slice(0, 20);

    if (editingIdea) {
      onEditIdea({
        ...editingIdea,
        title,
        content: formContent.trim(),
        tag: formTag,
        storyId: formStoryId ? formStoryId : null,
        color: formColor,
        updatedAt: new Date().toISOString(),
      });
    } else {
      onAddIdea({
        title,
        content: formContent.trim(),
        tag: formTag,
        storyId: formStoryId ? formStoryId : null,
        color: formColor,
      });
    }
    setIsModalOpen(false);
  };

  const handleCopy = (idea: Idea) => {
    navigator.clipboard.writeText(`${idea.title}\n\n${idea.content}`);
    setCopiedId(idea.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter ideas
  const filteredIdeas = ideas.filter((item) => {
    if (selectedTag !== 'all' && item.tag !== selectedTag) return false;
    if (selectedStoryFilter === 'unassigned' && item.storyId) return false;
    if (selectedStoryFilter !== 'all' && selectedStoryFilter !== 'unassigned' && item.storyId !== selectedStoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF9] border border-[#E8E0D2] rounded-3xl p-5 sm:p-6 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A1715] tracking-tight">
            아이디어뱅크 (창작 소재함)
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            인물 설정, 명대사, 세계관 규칙, 플롯 트릭 등 스쳐 지나가는 영감을 기록하세요.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 shrink-0"
        >
          <Plus size={16} />
          새 아이디어 기록
        </button>
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
            placeholder="아이디어 제목, 내용, 태그 검색..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#F8F6F0] border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Tag Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll py-0.5">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedTag === 'all'
                  ? 'bg-[#2C2825] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              전체 태그 ({ideas.length})
            </button>
            {DEFAULT_TAGS.map((t) => {
              const count = ideas.filter((i) => i.tag === t).length;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedTag(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedTag === t
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  #{t} ({count})
                </button>
              );
            })}
          </div>

          {/* Story Project Link Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter size={13} className="text-stone-400" />
            <select
              value={selectedStoryFilter}
              onChange={(e) => setSelectedStoryFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700"
            >
              <option value="all">모든 이야기 연결</option>
              <option value="unassigned">미연결 보관 아이디어만</option>
              {stories.map((st) => (
                <option key={st.id} value={st.id}>
                  연결: {st.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Idea Cards Masonry Grid */}
      {filteredIdeas.length === 0 ? (
        <div className="bg-[#FFFDF9] border border-dashed border-[#E8E0D2] rounded-3xl p-12 text-center text-stone-500 space-y-2">
          <Lightbulb size={28} className="mx-auto text-amber-500/70" />
          <p className="font-bold text-sm text-[#1A1715]">해당 조건의 아이디어가 없습니다.</p>
          <p className="text-xs text-stone-400">새로운 반전이나 대사를 한 줄 기록해 보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea) => {
            const linkedStory = stories.find((s) => s.id === idea.storyId);
            return (
              <div
                key={idea.id}
                style={{ backgroundColor: idea.color || '#FFFDF9' }}
                className="p-5 rounded-3xl border border-[#E8E0D2] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-3 group relative"
              >
                <div>
                  {/* Top tags & story connection */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="px-2.5 py-0.5 bg-white/80 backdrop-blur-2xs border border-black/5 rounded-full text-xs font-extrabold text-[#1A1715] shadow-2xs">
                      #{idea.tag}
                    </span>

                    {linkedStory ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-900 bg-indigo-100/90 border border-indigo-200 px-2 py-0.5 rounded-md truncate max-w-[130px]">
                        <BookOpen size={10} />
                        <span className="truncate">{linkedStory.title}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400 font-medium">자유 보관</span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-[#1A1715] leading-snug mb-1.5 font-serif-kr">
                    {idea.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#38332E] font-serif-kr leading-relaxed whitespace-pre-line">
                    {idea.content}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-400">
                    {idea.createdAt ? idea.createdAt.slice(0, 10) : ''}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(idea)}
                      className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-white/80 rounded-lg transition"
                      title="복사"
                    >
                      {copiedId === idea.id ? (
                        <Check size={14} className="text-emerald-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(idea)}
                      className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-white/80 rounded-lg transition"
                      title="수정"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`'${idea.title}' 아이디어를 삭제하시겠습니까?`)) {
                          onDeleteIdea(idea.id);
                        }
                      }}
                      className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-white/80 rounded-lg transition"
                      title="삭제"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Idea Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border border-[#E8E0D2] w-full max-w-lg rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-[#1A1715] mb-1">
              {editingIdea ? '아이디어 수정' : '새 창작 아이디어 기록'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              인물의 대사나 설정, 반전 플롯을 자유롭게 적어보세요.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  아이디어 제목
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="예: 빗속의 비밀 요원 대화"
                  className="w-full px-3.5 py-2.5 bg-[#F8F6F0] border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 font-serif-kr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  내용 / 대사 / 설정 메모 *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="떠오른 아이디어 내용을 자유롭게 적어주세요..."
                  className="w-full px-3.5 py-2.5 bg-[#F8F6F0] border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 font-serif-kr resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Tag */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">태그 분류</label>
                  <select
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value as IdeaTag)}
                    className="w-full px-3 py-2 bg-[#F8F6F0] border border-stone-200 rounded-xl text-xs font-bold"
                  >
                    {DEFAULT_TAGS.map((t) => (
                      <option key={t} value={t}>
                        #{t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Story Link */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    이야기 프로젝트 연결
                  </label>
                  <select
                    value={formStoryId}
                    onChange={(e) => setFormStoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F6F0] border border-stone-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="">미연결 (자유 보관)</option>
                    {stories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Color Preset */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  카드 테마 색상
                </label>
                <div className="flex items-center gap-2">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setFormColor(c.hex)}
                      style={{ backgroundColor: c.hex }}
                      className={`w-7 h-7 rounded-full border ${c.border} transition-all ${
                        formColor === c.hex ? 'ring-2 ring-amber-600 scale-110' : ''
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-sm"
                >
                  아이디어 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
