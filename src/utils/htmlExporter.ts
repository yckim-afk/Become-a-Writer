import { AppData } from '../types';

export function exportSingleHtmlFile(currentData: AppData): void {
  const jsonState = JSON.stringify(currentData).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

  const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>작가 되기 (Become a Writer) - 오프라인 에디션</title>
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="theme-color" content="#F8F6F0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-tap-highlight-color: transparent;
      background-color: #F8F6F0;
      color: #2C2825;
    }
    .font-serif-kr { font-family: 'Gowun Batang', 'Batang', serif; }
    .touch-scroll { -webkit-overflow-scrolling: touch; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(140, 120, 100, 0.25); border-radius: 9999px; }
  </style>
</head>
<body class="min-h-screen pb-24 selection:bg-amber-200">
  <div id="app" class="max-w-4xl mx-auto px-4 py-6">
    <!-- Rendered App -->
  </div>

  <script>
    // Embedded Initial Data
    const INITIAL_DATA = ${jsonState};
    const STORAGE_KEY = 'writer_rpg_app_data_v1';

    function getStoredData() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch(e){}
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
      return INITIAL_DATA;
    }

    let appData = getStoredData();

    function saveData() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
      } catch(e){}
    }

    // Direct Single-file Runner Notice
    window.addEventListener('DOMContentLoaded', () => {
      renderApp();
    });

    let currentTab = 'dashboard';

    function setTab(tab) {
      currentTab = tab;
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function getXpRequired(level) {
      if (level <= 1) return 50;
      return Math.floor(40 + Math.pow(level, 1.6) * 15);
    }

    function getWriterTitle(level) {
      if (level < 3) return { title: '원고지 견습생', badge: '🌱' };
      if (level < 5) return { title: '잉크병 초심자', badge: '✒️' };
      if (level < 8) return { title: '단편 스토리텔러', badge: '📜' };
      if (level < 12) return { title: '정기 연재 작가', badge: '📖' };
      if (level < 18) return { title: '필력의 마술사', badge: '✨' };
      if (level < 25) return { title: '베스트셀러 작가', badge: '🏆' };
      if (level < 35) return { title: '문학의 거장', badge: '👑' };
      return { title: '불멸의 대문호', badge: '🌌' };
    }

    function completeQuest(id) {
      const q = appData.quests.find(item => item.id === id);
      if (!q || q.completed) return;

      const reward = appData.rewardSettings[q.grade] || { xp: 15, gold: 7 };
      q.completed = true;
      q.completedAt = new Date().toISOString();

      appData.profile.xp += reward.xp;
      appData.profile.gold += reward.gold;
      appData.profile.totalQuestsCompleted += 1;

      // Level up check
      let req = getXpRequired(appData.profile.level);
      let leveledUp = false;
      while (appData.profile.xp >= req) {
        appData.profile.xp -= req;
        appData.profile.level += 1;
        leveledUp = true;
        req = getXpRequired(appData.profile.level);
      }

      if (q.isDaily) {
        const today = new Date().toISOString().slice(0, 10);
        if (appData.profile.lastActiveDate !== today) {
          appData.profile.streak += 1;
          if (appData.profile.streak > appData.profile.maxStreak) {
            appData.profile.maxStreak = appData.profile.streak;
          }
          appData.profile.lastActiveDate = today;
        }
      }

      saveData();
      renderApp();
      if (leveledUp) {
        alert('🎉 축하합니다! 레벨 ' + appData.profile.level + '로 승급하셨습니다! [' + getWriterTitle(appData.profile.level).title + ']');
      }
    }

    function buyItem(id) {
      const item = appData.shopItems.find(i => i.id === id);
      if (!item) return;
      if (appData.profile.gold < item.price) {
        alert('골드가 부족합니다! 퀘스트를 완료해 골드를 모아보세요.');
        return;
      }

      appData.profile.gold -= item.price;
      if (item.isExemptionPass) {
        appData.profile.exemptionPassCount = (appData.profile.exemptionPassCount || 0) + 1;
      }

      const existing = appData.inventory.find(inv => inv.itemId === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        appData.inventory.push({
          id: 'inv-' + Date.now(),
          itemId: item.id,
          name: item.name,
          description: item.description,
          icon: item.icon,
          quantity: 1,
          boughtAt: new Date().toISOString(),
          effectType: item.effectType
        });
      }

      saveData();
      renderApp();
      alert('🛍️ [' + item.name + '] 아이템을 구매했습니다! 보관함에서 확인하실 수 있습니다.');
    }

    function addIdeaPrompt() {
      const title = prompt('아이디어 제목:');
      if (!title) return;
      const content = prompt('아이디어 내용:');
      if (!content) return;
      const tag = prompt('태그 선택 (캐릭터/플롯/세계관/대사/기타):', '캐릭터') || '기타';

      appData.ideas.unshift({
        id: 'idea-' + Date.now(),
        title,
        content,
        tag,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      saveData();
      renderApp();
    }

    function addStoryPrompt() {
      const title = prompt('이야기 제목:');
      if (!title) return;
      const logline = prompt('한 줄 로그라인:') || '';
      const synopsis = prompt('전체 줄거리:') || '';

      appData.stories.unshift({
        id: 'story-' + Date.now(),
        title,
        logline,
        synopsis,
        status: '구상 중',
        episodes: [
          { id: 'ep-1', order: 1, title: '제1화', summary: '첫 만남과 발단', status: 'planned' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      saveData();
      renderApp();
    }

    function renderApp() {
      const root = document.getElementById('app');
      const reqXp = getXpRequired(appData.profile.level);
      const pct = Math.min(100, Math.round((appData.profile.xp / reqXp) * 100));
      const titleInfo = getWriterTitle(appData.profile.level);

      let html = \`
        <!-- Header -->
        <header class="bg-[#FFFDF9] border border-[#EBE4D8] rounded-2xl p-4 md:p-6 shadow-sm mb-6">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-sm">
                \${titleInfo.badge}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-xl font-bold text-[#1A1715]">\${appData.profile.penName || '별빛 작가'}</h1>
                  <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                    Lv.\${appData.profile.level} \${titleInfo.title}
                  </span>
                </div>
                <p class="text-xs text-[#7A7268] mt-0.5">매일 쓰는 문장이 위대한 책이 됩니다.</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold text-sm">
                <span>🪙</span>
                <span>\${appData.profile.gold.toLocaleString()} G</span>
              </div>
              <div class="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 font-bold text-sm">
                <span>🔥</span>
                <span>\${appData.profile.streak}일 연속</span>
              </div>
              <div class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-semibold text-xs">
                <span>🛡️ 결석권</span>
                <span class="font-bold">\${appData.profile.exemptionPassCount || 0}개</span>
              </div>
            </div>
          </div>

          <!-- XP Bar -->
          <div>
            <div class="flex justify-between text-xs font-medium text-[#7A7268] mb-1.5">
              <span>경험치 (XP)</span>
              <span>\${appData.profile.xp} / \${reqXp} XP (\${pct}%)</span>
            </div>
            <div class="w-full h-3 bg-[#EFE9DF] rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300" style="width: \${pct}%"></div>
            </div>
          </div>
        </header>

        <!-- Navigation Tabs -->
        <nav class="flex overflow-x-auto gap-2 mb-6 pb-1">
          <button onclick="setTab('dashboard')" class="px-4 py-2.5 rounded-xl font-medium text-sm transition \${currentTab === 'dashboard' ? 'bg-[#2C2825] text-white shadow-sm' : 'bg-white border border-[#EBE4D8] text-[#5A5248]'}">🏠 대시보드</button>
          <button onclick="setTab('quests')" class="px-4 py-2.5 rounded-xl font-medium text-sm transition \${currentTab === 'quests' ? 'bg-[#2C2825] text-white shadow-sm' : 'bg-white border border-[#EBE4D8] text-[#5A5248]'}">📜 퀘스트</button>
          <button onclick="setTab('shop')" class="px-4 py-2.5 rounded-xl font-medium text-sm transition \${currentTab === 'shop' ? 'bg-[#2C2825] text-white shadow-sm' : 'bg-white border border-[#EBE4D8] text-[#5A5248]'}">🛍️ 상점 & 보관함</button>
          <button onclick="setTab('ideas')" class="px-4 py-2.5 rounded-xl font-medium text-sm transition \${currentTab === 'ideas' ? 'bg-[#2C2825] text-white shadow-sm' : 'bg-white border border-[#EBE4D8] text-[#5A5248]'}">💡 아이디어뱅크</button>
          <button onclick="setTab('stories')" class="px-4 py-2.5 rounded-xl font-medium text-sm transition \${currentTab === 'stories' ? 'bg-[#2C2825] text-white shadow-sm' : 'bg-white border border-[#EBE4D8] text-[#5A5248]'}">📚 이야기 라이브러리</button>
        </nav>
      \`;

      if (currentTab === 'dashboard') {
        const dailyQuests = appData.quests.filter(q => q.isDaily);
        const completedDaily = dailyQuests.filter(q => q.completed).length;

        html += \`
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white border border-[#EBE4D8] rounded-2xl p-5 shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-base font-bold text-[#1A1715]">📅 오늘의 데일리 퀘스트</h2>
                <span class="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-800 rounded-lg">\${completedDaily}/\${dailyQuests.length} 달성</span>
              </div>
              <div class="space-y-3">
                \${dailyQuests.map(q => {
                  const rew = appData.rewardSettings[q.grade] || { xp: 15, gold: 7 };
                  return \`
                    <div class="p-3.5 rounded-xl border \${q.completed ? 'bg-stone-50 border-stone-200 opacity-70' : 'bg-[#FFFDF9] border-[#EBE4D8]'} flex items-center justify-between gap-3">
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="text-xs px-1.5 py-0.5 rounded font-bold \${q.grade === 'A' ? 'bg-amber-100 text-amber-800' : q.grade === 'B' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-800'}">\${q.grade}등급</span>
                          <span class="text-xs text-[#7A7268]">[\${q.category}]</span>
                          <h4 class="font-semibold text-sm \${q.completed ? 'line-through text-stone-500' : 'text-[#1A1715]'}">\${q.title}</h4>
                        </div>
                        <p class="text-xs text-[#7A7268] mt-1">\${q.description}</p>
                        <div class="text-xs text-amber-700 font-medium mt-1">+ \${rew.xp} XP, + \${rew.gold} G</div>
                      </div>
                      <button onclick="completeQuest('\${q.id}')" \${q.completed ? 'disabled' : ''} class="shrink-0 px-3 py-2 rounded-xl text-xs font-bold \${q.completed ? 'bg-emerald-100 text-emerald-800 cursor-default' : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'}">
                        \${q.completed ? '완료됨 ✓' : '완료하기'}
                      </button>
                    </div>
                  \`;
                }).join('')}
              </div>
            </div>

            <div class="space-y-6">
              <div class="bg-gradient-to-br from-amber-50 to-stone-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
                <h3 class="font-bold text-sm text-amber-950 mb-2">🔥 스트릭 관리 및 작가 성장</h3>
                <p class="text-xs text-amber-900 leading-relaxed mb-3">
                  매일 퀘스트를 완료하면 연속 집필 스트릭이 증가합니다. 바쁜 날에는 상점에서 <strong>황금 결석권</strong>을 구매해 두면 스트릭 초기화를 안전하게 방어할 수 있습니다.
                </p>
                <div class="flex items-center justify-between pt-2 border-t border-amber-200 text-xs">
                  <span class="text-amber-800">최대 연속 달성: <strong>\${appData.profile.maxStreak}일</strong></span>
                  <span class="text-amber-800">총 완료 퀘스트: <strong>\${appData.profile.totalQuestsCompleted}개</strong></span>
                </div>
              </div>

              <div class="bg-white border border-[#EBE4D8] rounded-2xl p-5 shadow-sm">
                <h3 class="font-bold text-sm text-[#1A1715] mb-3">⚡ 빠른 창작 액션</h3>
                <div class="grid grid-cols-2 gap-3">
                  <button onclick="addIdeaPrompt()" class="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left text-xs font-semibold text-amber-900">
                    💡 새 아이디어 기록
                  </button>
                  <button onclick="addStoryPrompt()" class="p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-left text-xs font-semibold text-indigo-900">
                    📚 새 이야기 구상
                  </button>
                </div>
              </div>
            </div>
          </div>
        \`;
      } else if (currentTab === 'quests') {
        html += \`
          <div class="bg-white border border-[#EBE4D8] rounded-2xl p-5 shadow-sm mb-6">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 class="text-lg font-bold text-[#1A1715]">전체 퀘스트 관리</h2>
                <p class="text-xs text-[#7A7268]">A등급(+30XP/15G), B등급(+15XP/7G), C등급(+7XP/3G)</p>
              </div>
            </div>
            <div class="space-y-3">
              \${appData.quests.map(q => {
                const rew = appData.rewardSettings[q.grade] || { xp: 15, gold: 7 };
                return \`
                  <div class="p-4 rounded-xl border \${q.completed ? 'bg-stone-50 border-stone-200' : 'bg-[#FFFDF9] border-[#EBE4D8]'} flex items-center justify-between gap-3">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-xs px-2 py-0.5 rounded font-bold \${q.grade === 'A' ? 'bg-amber-100 text-amber-800' : q.grade === 'B' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-800'}">\${q.grade}등급</span>
                        <span class="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700">\${q.category}</span>
                        \${q.isDaily ? '<span class="text-xs px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold">매일 반복</span>' : '<span class="text-xs px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">일회성</span>'}
                        <h4 class="font-bold text-sm text-[#1A1715] \${q.completed ? 'line-through text-stone-400' : ''}">\${q.title}</h4>
                      </div>
                      <p class="text-xs text-[#7A7268] mt-1">\${q.description}</p>
                      <div class="text-xs text-amber-700 font-semibold mt-1.5">+ \${rew.xp} XP / + \${rew.gold} Gold</div>
                    </div>
                    <button onclick="completeQuest('\${q.id}')" \${q.completed ? 'disabled' : ''} class="shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold \${q.completed ? 'bg-stone-200 text-stone-500' : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'}">
                      \${q.completed ? '완료됨' : '완료하기'}
                    </button>
                  </div>
                \`;
              }).join('')}
            </div>
          </div>
        \`;
      } else if (currentTab === 'shop') {
        html += \`
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white border border-[#EBE4D8] rounded-2xl p-5 shadow-sm">
              <h2 class="text-lg font-bold text-[#1A1715] mb-4">🛍️ 작가의 비밀 상점</h2>
              <div class="space-y-4">
                \${appData.shopItems.map(item => \`
                  <div class="p-4 rounded-xl border border-[#EBE4D8] bg-[#FFFDF9] flex items-center justify-between gap-3">
                    <div>
                      <h4 class="font-bold text-sm text-[#1A1715]">\${item.name}</h4>
                      <p class="text-xs text-[#7A7268] mt-1">\${item.description}</p>
                      <div class="text-xs font-bold text-amber-700 mt-2">🪙 \${item.price} Gold</div>
                    </div>
                    <button onclick="buyItem('\${item.id}')" class="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm">
                      구매하기
                    </button>
                  </div>
                \`).join('')}
              </div>
            </div>

            <div class="bg-white border border-[#EBE4D8] rounded-2xl p-5 shadow-sm">
              <h2 class="text-lg font-bold text-[#1A1715] mb-4">🎒 내 보관함</h2>
              \${appData.inventory.length === 0 ? '<p class="text-xs text-[#7A7268]">보유한 아이템이 없습니다.</p>' : \`
                <div class="space-y-3">
                  \${appData.inventory.map(inv => \`
                    <div class="p-3.5 rounded-xl border border-[#EBE4D8] bg-stone-50 flex items-center justify-between">
                      <div>
                        <h4 class="font-bold text-sm text-[#1A1715]">\${inv.name}</h4>
                        <p class="text-xs text-[#7A7268]">\${inv.description}</p>
                      </div>
                      <span class="px-3 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold">\${inv.quantity}개 보유</span>
                    </div>
                  \`).join('')}
                </div>
              \`}
            </div>
          </div>
        \`;
      } else if (currentTab === 'ideas') {
        html += \`
          <div class="bg-white border border-[#EBE4D8] rounded-2xl p-5 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-[#1A1715]">💡 아이디어뱅크</h2>
              <button onclick="addIdeaPrompt()" class="px-4 py-2 bg-[#2C2825] text-white rounded-xl text-xs font-bold shadow-sm">
                + 새 아이디어
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              \${appData.ideas.map(idea => \`
                <div class="p-4 rounded-xl border border-[#EBE4D8] bg-[#FFFDF9] shadow-sm">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">\${idea.tag}</span>
                    <span class="text-xs text-[#7A7268]">\${idea.createdAt.slice(0,10)}</span>
                  </div>
                  <h4 class="font-bold text-sm text-[#1A1715] mb-1">\${idea.title}</h4>
                  <p class="text-xs text-[#5A5248] whitespace-pre-line leading-relaxed">\${idea.content}</p>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
      } else if (currentTab === 'stories') {
        html += \`
          <div class="bg-white border border-[#EBE4D8] rounded-2xl p-5 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-[#1A1715]">📚 이야기 라이브러리</h2>
              <button onclick="addStoryPrompt()" class="px-4 py-2 bg-[#2C2825] text-white rounded-xl text-xs font-bold shadow-sm">
                + 새 이야기 추가
              </button>
            </div>
            <div class="space-y-6">
              \${appData.stories.map(story => \`
                <div class="p-5 rounded-2xl border border-[#EBE4D8] bg-[#FFFDF9] shadow-sm">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 font-bold">\${story.status}</span>
                    <span class="text-xs text-[#7A7268]">\${story.genre || '장르 미지정'}</span>
                  </div>
                  <h3 class="text-base font-bold text-[#1A1715] mb-1">\${story.title}</h3>
                  <p class="text-xs text-amber-900 font-medium mb-3 italic">"\${story.logline}"</p>
                  <div class="bg-stone-50 p-3 rounded-xl text-xs text-[#5A5248] leading-relaxed mb-4 whitespace-pre-line">
                    \${story.synopsis}
                  </div>
                  <div>
                    <h5 class="text-xs font-bold text-[#1A1715] mb-2">화별 플롯 메모 (\${story.episodes.length}화)</h5>
                    <div class="space-y-2">
                      \${story.episodes.map(ep => \`
                        <div class="p-2.5 bg-white border border-[#EBE4D8] rounded-lg text-xs flex items-center justify-between">
                          <div>
                            <strong class="text-[#1A1715]">\${ep.title}</strong>: \${ep.summary}
                          </div>
                          <span class="text-xs text-stone-500">\${ep.status === 'completed' ? '완고 ✓' : ep.status === 'drafting' ? '집필 중' : '구상'}</span>
                        </div>
                      \`).join('')}
                    </div>
                  </div>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
      }

      root.innerHTML = html;
    }
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `writer_rpg_app_${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
