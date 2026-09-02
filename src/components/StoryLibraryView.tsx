import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  ArrowLeft,
  Edit3,
  Trash2,
  FileText,
  Lightbulb,
  CheckCircle2,
  Clock,
  Download,
  X,
  PlusCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Story, Episode, StoryStatus, Idea } from '../types';

interface StoryLibraryViewProps {
  stories: Story[];
  ideas: Idea[];
  onAddStory: (story: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditStory: (story: Story) => void;
  onDeleteStory: (storyId: string) => void;
  onAddIdeaForStory: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const STATUS_LIST: StoryStatus[] = ['구상 중', '시놉시스 완성', '집필 중', '퇴고 중', '완결'];

export const StoryLibraryView: React.FC<StoryLibraryViewProps> = ({
  stories,
  ideas,
  onAddStory,
  onEditStory,
  onDeleteStory,
  onAddIdeaForStory,
}) => {
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  // Story Create / Edit Modal
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);

  // Form State for Story
  const [formTitle, setFormTitle] = useState('');
  const [formLogline, setFormLogline] = useState('');
  const [formSynopsis, setFormSynopsis] = useState('');
  const [formStatus, setFormStatus] = useState<StoryStatus>('집필 중');
  const [formGenre, setFormGenre] = useState('판타지 / 드라마');
  const [formTargetWords, setFormTargetWords] = useState(30000);

  // Episode Add Modal inside selected story
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [epTitle, setEpTitle] = useState('');
  const [epSummary, setEpSummary] = useState('');
  const [epStatus, setEpStatus] = useState<'planned' | 'drafting' | 'completed'>('planned');
  const [epNotes, setEpNotes] = useState('');

  // Quick Idea Add Modal for selected story
  const [isQuickIdeaModalOpen, setIsQuickIdeaModalOpen] = useState(false);
  const [quickIdeaTitle, setQuickIdeaTitle] = useState('');
  const [quickIdeaContent, setQuickIdeaContent] = useState('');
  const [quickIdeaTag, setQuickIdeaTag] = useState('플롯');

  const selectedStory = stories.find((s) => s.id === selectedStoryId);
  const linkedIdeas = selectedStory ? ideas.filter((i) => i.storyId === selectedStory.id) : [];

  const handleOpenAddStory = () => {
    setEditingStory(null);
    setFormTitle('');
    setFormLogline('');
    setFormSynopsis('');
    setFormStatus('구상 중');
    setFormGenre('장르 미지정');
    setFormTargetWords(30000);
    setIsStoryModalOpen(true);
  };

  const handleOpenEditStory = (story: Story) => {
    setEditingStory(story);
    setFormTitle(story.title);
    setFormLogline(story.logline);
    setFormSynopsis(story.synopsis);
    setFormStatus(story.status);
    setFormGenre(story.genre || '');
    setFormTargetWords(story.targetWordCount || 30000);
    setIsStoryModalOpen(true);
  };

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingStory) {
      onEditStory({
        ...editingStory,
        title: formTitle.trim(),
        logline: formLogline.trim(),
        synopsis: formSynopsis.trim(),
        status: formStatus,
        genre: formGenre.trim(),
        targetWordCount: formTargetWords,
        updatedAt: new Date().toISOString(),
      });
    } else {
      onAddStory({
        title: formTitle.trim(),
        logline: formLogline.trim(),
        synopsis: formSynopsis.trim(),
        status: formStatus,
        genre: formGenre.trim(),
        episodes: [
          {
            id: 'ep-1',
            order: 1,
            title: '제1화',
            summary: '발단 및 주인공 등장',
            status: 'planned',
          },
        ],
        targetWordCount: formTargetWords,
        currentWordCount: 0,
      });
    }
    setIsStoryModalOpen(false);
  };

  // Episode Add / Delete handlers
  const handleAddEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStory || !epTitle.trim()) return;

    const newEp: Episode = {
      id: 'ep-' + Date.now(),
      order: selectedStory.episodes.length + 1,
      title: epTitle.trim(),
      summary: epSummary.trim(),
      status: epStatus,
      notes: epNotes.trim(),
    };

    const updated = {
      ...selectedStory,
      episodes: [...selectedStory.episodes, newEp],
      updatedAt: new Date().toISOString(),
    };

    onEditStory(updated);
    setIsEpisodeModalOpen(false);
    setEpTitle('');
    setEpSummary('');
    setEpNotes('');
  };

  const handleDeleteEpisode = (epId: string) => {
    if (!selectedStory) return;
    if (confirm('이 화차 메모를 삭제하시겠습니까?')) {
      const updatedEpisodes = selectedStory.episodes.filter((e) => e.id !== epId);
      onEditStory({
        ...selectedStory,
        episodes: updatedEpisodes,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleToggleEpisodeStatus = (ep: Episode) => {
    if (!selectedStory) return;
    const nextStatus =
      ep.status === 'planned' ? 'drafting' : ep.status === 'drafting' ? 'completed' : 'planned';
    const updatedEpisodes = selectedStory.episodes.map((e) =>
      e.id === ep.id ? { ...e, status: nextStatus } : e
    );
    onEditStory({
      ...selectedStory,
      episodes: updatedEpisodes,
      updatedAt: new Date().toISOString(),
    });
  };

  // Quick Idea Add for current story
  const handleQuickAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStory || !quickIdeaTitle.trim()) return;

    onAddIdeaForStory({
      title: quickIdeaTitle.trim(),
      content: quickIdeaContent.trim(),
      tag: quickIdeaTag,
      storyId: selectedStory.id,
      color: '#E0E7FF',
    });

    setIsQuickIdeaModalOpen(false);
    setQuickIdeaTitle('');
    setQuickIdeaContent('');
  };

  // Export Story to Markdown/TXT
  const handleExportStory = (story: Story) => {
    let md = `# ${story.title}\n\n`;
    md += `**상태:** ${story.status} | **장르:** ${story.genre || '미지정'}\n`;
    md += `**한 줄 로그라인:** ${story.logline}\n\n`;
    md += `## 전체 시놉시스\n\n${story.synopsis}\n\n`;
    md += `## 화별 플롯 메모 (${story.episodes.length}화)\n\n`;
    story.episodes.forEach((ep) => {
      md += `### ${ep.title} [${ep.status === 'completed' ? '완고' : ep.status === 'drafting' ? '집필 중' : '구상'}]\n`;
      md += `${ep.summary}\n`;
      if (ep.notes) md += `*메모: ${ep.notes}*\n`;
      md += `\n`;
    });

    if (linkedIdeas.length > 0) {
      md += `## 연결된 아이디어 조각들\n\n`;
      linkedIdeas.forEach((idea) => {
        md += `- **[#${idea.tag}] ${idea.title}**: ${idea.content}\n`;
      });
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title}_원고기획안.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. STORY DETAIL VIEW (If a story is selected) */}
      {selectedStory ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Back button & top bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFFDF9] border border-[#E8E0D2] rounded-3xl p-5 shadow-2xs">
            <button
              onClick={() => setSelectedStoryId(null)}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-700 hover:text-stone-950 px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
            >
              <ArrowLeft size={16} />
              이야기 목록으로 돌아가기
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExportStory(selectedStory)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 transition"
                title="마크다운 문서로 다운로드"
              >
                <Download size={14} />
                기획안 내보내기
              </button>
              <button
                onClick={() => handleOpenEditStory(selectedStory)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 transition"
              >
                <Edit3 size={14} />
                이야기 설정 수정
              </button>
            </div>
          </div>

          {/* Story Main Info Card */}
          <div className="bg-[#FFFDF9] border border-[#E8E0D2] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#EFE8DC]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-950 rounded-full text-xs font-black">
                    {selectedStory.status}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    {selectedStory.genre || '장르 미지정'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3436] font-serif-kr tracking-tight">
                  {selectedStory.title}
                </h1>
              </div>
            </div>

            {/* Logline */}
            <div className="p-4 bg-orange-50/80 border border-orange-200 rounded-2xl">
              <span className="text-xs font-extrabold text-orange-950 block mb-1">
                📌 한 줄 로그라인 (Core Hook)
              </span>
              <p className="text-sm sm:text-base font-serif-kr text-[#2D3436] font-medium leading-relaxed italic">
                "{selectedStory.logline || '로그라인을 입력해 보세요.'}"
              </p>
            </div>

            {/* Full Synopsis */}
            <div>
              <span className="text-xs font-extrabold text-stone-700 block mb-2">
                📖 전체 줄거리 & 시놉시스
              </span>
              <div className="p-5 bg-[#F9F6F2] border border-stone-200/80 rounded-2xl text-xs sm:text-sm text-[#2D3436] font-serif-kr leading-relaxed whitespace-pre-line">
                {selectedStory.synopsis || '줄거리를 작성해 보세요.'}
              </div>
            </div>
          </div>

          {/* 2. Episode / Chapter Flow Manager */}
          <div className="bg-[#FFFDF9] border border-[#E8E0D2] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-[#2D3436]">
                  화(에피소드)별 전개 플롯 ({selectedStory.episodes.length}화)
                </h3>
                <p className="text-xs text-stone-500">
                  각 화의 사건과 복선, 핵심 장면을 리스트 형태로 관리합니다.
                </p>
              </div>

              <button
                onClick={() => setIsEpisodeModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-2xs transition active:scale-95"
              >
                <Plus size={15} />
                화차 추가
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {selectedStory.episodes.map((ep, idx) => (
                <div
                  key={ep.id}
                  className="p-4 rounded-2xl bg-white border border-[#E8E0D2] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleEpisodeStatus(ep)}
                      className="mt-0.5 shrink-0"
                      title="상태 전환 (구상 -> 집필 -> 완고)"
                    >
                      {ep.status === 'completed' ? (
                        <CheckCircle2 size={20} className="text-emerald-600 fill-emerald-100" />
                      ) : ep.status === 'drafting' ? (
                        <Clock size={20} className="text-orange-600 fill-orange-100" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-stone-300 flex items-center justify-center text-[10px] font-bold text-stone-400">
                          {idx + 1}
                        </div>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <strong className="text-sm font-bold text-[#2D3436]">{ep.title}</strong>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                            ep.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-900'
                              : ep.status === 'drafting'
                              ? 'bg-orange-100 text-orange-950'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {ep.status === 'completed' ? '완고 ✓' : ep.status === 'drafting' ? '집필 중' : '구상 단계'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 font-serif-kr leading-relaxed">
                        {ep.summary}
                      </p>
                      {ep.notes && (
                        <p className="text-[11px] text-orange-900 bg-orange-50/70 p-1.5 rounded-lg mt-1.5">
                          💡 메모: {ep.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <button
                      onClick={() => handleDeleteEpisode(ep.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition"
                      title="화차 삭제"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Linked Ideas from Idea Bank */}
          <div className="bg-[#FFFDF9] border border-[#E8E0D2] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-[#2D3436] flex items-center gap-2">
                  <Lightbulb size={18} className="text-orange-500" />
                  연결된 아이디어 조각 ({linkedIdeas.length})
                </h3>
                <p className="text-xs text-stone-500">
                  아이디어뱅크에서 이 작품에 태깅된 아이디어들만 모아봅니다.
                </p>
              </div>

              <button
                onClick={() => setIsQuickIdeaModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-2xs transition active:scale-95"
              >
                <Plus size={15} />이 이야기에 아이디어 추가
              </button>
            </div>

            {linkedIdeas.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl text-xs text-stone-400">
                아직 이 이야기에 연결된 아이디어가 없습니다. 위 버튼을 눌러 인물 설정이나 대사를
                추가해보세요!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {linkedIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    style={{ backgroundColor: idea.color || '#FFFDF9' }}
                    className="p-4 rounded-2xl border border-[#E8E0D2] shadow-2xs text-xs flex flex-col justify-between gap-2"
                  >
                    <div>
                      <span className="px-2 py-0.5 bg-white/80 rounded-full font-bold text-[10px] text-stone-800">
                        #{idea.tag}
                      </span>
                      <h4 className="font-bold text-sm text-[#1A1715] mt-1.5 font-serif-kr">
                        {idea.title}
                      </h4>
                      <p className="text-stone-600 font-serif-kr mt-1 whitespace-pre-line leading-relaxed">
                        {idea.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 2. STORY LIST VIEW */
        <div className="space-y-6">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF9] border border-[#E8E0D2] rounded-3xl p-5 sm:p-6 shadow-2xs">
            <div>
              <h2 className="text-xl font-extrabold text-[#2D3436] tracking-tight">
                이야기 라이브러리 (프로젝트 보관소)
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                여러 편의 장편/단편 소설을 독립된 프로젝트로 체계적으로 집필하세요.
              </p>
            </div>

            <button
              onClick={handleOpenAddStory}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 shrink-0"
            >
              <Plus size={16} />새 이야기 프로젝트 만들기
            </button>
          </div>

          {/* Story Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {stories.map((story) => {
              const countLinked = ideas.filter((i) => i.storyId === story.id).length;
              return (
                <div
                  key={story.id}
                  className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E8E0D2] hover:border-orange-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-5 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 bg-orange-100 text-orange-950 rounded-full text-xs font-extrabold">
                        {story.status}
                      </span>
                      <span className="text-xs text-stone-400 font-medium">{story.genre}</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-[#2D3436] font-serif-kr leading-snug mb-2 group-hover:text-orange-950 transition">
                      {story.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 font-serif-kr leading-relaxed italic line-clamp-2 mb-3">
                      "{story.logline || '한 줄 로그라인이 없습니다.'}"
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pt-2 border-t border-[#EFE8DC]">
                      <span className="flex items-center gap-1">
                        <FileText size={13} className="text-stone-400" />
                        총 {story.episodes.length}화 구성
                      </span>
                      <span className="flex items-center gap-1">
                        <Lightbulb size={13} className="text-orange-500" />
                        아이디어 {countLinked}개
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#EFE8DC]">
                    <button
                      onClick={() => {
                        if (confirm(`'${story.title}' 이야기를 삭제하시겠습니까?`)) {
                          onDeleteStory(story.id);
                        }
                      }}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-xl transition"
                      title="삭제"
                    >
                      <Trash2 size={16} />
                    </button>

                    <button
                      onClick={() => setSelectedStoryId(story.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#2D3436] hover:bg-[#1A1E20] text-white rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition active:scale-95"
                    >
                      집필실 들어가기
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Story Modal */}
      {isStoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border border-[#E8E0D2] w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto touch-scroll animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsStoryModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-[#2D3436] mb-1">
              {editingStory ? '이야기 프로젝트 수정' : '새 이야기 프로젝트 생성'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              독립된 이야기 공간을 만들고 시놉시스와 화별 전개를 기획하세요.
            </p>

            <form onSubmit={handleSubmitStory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">작품 제목 *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="예: 망각의 서점과 잃어버린 페이지"
                  className="w-full px-3.5 py-2.5 bg-[#F9F6F2] border border-stone-200 rounded-xl text-sm font-serif-kr focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  한 줄 로그라인 (Core Hook)
                </label>
                <input
                  type="text"
                  value={formLogline}
                  onChange={(e) => setFormLogline(e.target.value)}
                  placeholder="예: 기억을 지우는 서점과 잃어버린 기억을 찾는 소년의 이야기"
                  className="w-full px-3.5 py-2 bg-[#F9F6F2] border border-stone-200 rounded-xl text-xs sm:text-sm font-serif-kr focus:outline-hidden focus:ring-2 focus:ring-orange-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  전체 줄거리 & 시놉시스
                </label>
                <textarea
                  rows={5}
                  value={formSynopsis}
                  onChange={(e) => setFormSynopsis(e.target.value)}
                  placeholder="기-승-전-결 흐름이나 세계관 핵심 설정을 자유롭게 적어주세요..."
                  className="w-full px-3.5 py-2.5 bg-[#F9F6F2] border border-stone-200 rounded-xl text-xs sm:text-sm font-serif-kr focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">진행 상태</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as StoryStatus)}
                    className="w-full px-3 py-2 bg-[#F9F6F2] border border-stone-200 rounded-xl text-xs font-bold"
                  >
                    {STATUS_LIST.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">장르</label>
                  <input
                    type="text"
                    value={formGenre}
                    onChange={(e) => setFormGenre(e.target.value)}
                    placeholder="예: 판타지, SF, 로맨스"
                    className="w-full px-3 py-2 bg-[#F9F6F2] border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsStoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold shadow-sm"
                >
                  이야기 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Episode Add Modal */}
      {isEpisodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border border-[#E8E0D2] w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsEpisodeModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-[#2D3436] mb-1">화차(에피소드) 추가</h3>
            <p className="text-xs text-stone-500 mb-4">각 화에서 일어날 주요 사건을 요약합니다.</p>

            <form onSubmit={handleAddEpisode} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">화차 제목 *</label>
                <input
                  type="text"
                  required
                  value={epTitle}
                  onChange={(e) => setEpTitle(e.target.value)}
                  placeholder={`제${(selectedStory?.episodes.length || 0) + 1}화: 제목`}
                  className="w-full px-3 py-2 bg-[#F9F6F2] border border-stone-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  사건 전개 요약 *
                </label>
                <textarea
                  rows={3}
                  required
                  value={epSummary}
                  onChange={(e) => setEpSummary(e.target.value)}
                  placeholder="이 화에서 전개되는 핵심 갈등이나 장면..."
                  className="w-full px-3 py-2 bg-[#F9F6F2] border border-stone-200 rounded-xl text-xs font-serif-kr resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  집필 상태 & 복선 메모
                </label>
                <select
                  value={epStatus}
                  onChange={(e) => setEpStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#F9F6F2] border border-stone-200 rounded-xl text-xs mb-2 font-bold"
                >
                  <option value="planned">구상 단계</option>
                  <option value="drafting">집필 진행 중</option>
                  <option value="completed">초고 완고 완료</option>
                </select>
                <input
                  type="text"
                  value={epNotes}
                  onChange={(e) => setEpNotes(e.target.value)}
                  placeholder="주의할 복선이나 묘사 팁 메모"
                  className="w-full px-3 py-2 bg-[#F9F6F2] border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsEpisodeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm"
                >
                  화차 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Idea Add Modal for Current Story */}
      {isQuickIdeaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border border-[#E8E0D2] w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsQuickIdeaModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-[#2D3436] mb-1">
              [{selectedStory?.title}] 아이디어 추가
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              이 작품에 바로 연결되는 인물, 대사, 플롯 조각을 기록합니다.
            </p>

            <form onSubmit={handleQuickAddIdea} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  아이디어 제목 *
                </label>
                <input
                  type="text"
                  required
                  value={quickIdeaTitle}
                  onChange={(e) => setQuickIdeaTitle(e.target.value)}
                  placeholder="예: 주인공과 조력자의 갈등 대사"
                  className="w-full px-3 py-2 bg-[#F9F6F2] border border-stone-200 rounded-xl text-xs font-bold font-serif-kr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">내용 *</label>
                <textarea
                  rows={3}
                  required
                  value={quickIdeaContent}
                  onChange={(e) => setQuickIdeaContent(e.target.value)}
                  placeholder="아이디어 내용을 적어주세요..."
                  className="w-full px-3 py-2 bg-[#F9F6F2] border border-stone-200 rounded-xl text-xs font-serif-kr resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">태그</label>
                <select
                  value={quickIdeaTag}
                  onChange={(e) => setQuickIdeaTag(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F9F6F2] border border-stone-200 rounded-xl text-xs font-bold"
                >
                  <option value="캐릭터">#캐릭터</option>
                  <option value="플롯">#플롯</option>
                  <option value="세계관">#세계관</option>
                  <option value="대사">#대사</option>
                  <option value="기타">#기타</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsQuickIdeaModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm"
                >
                  이야기에 연결 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
