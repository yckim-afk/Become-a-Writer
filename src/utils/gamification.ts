export function getXpRequiredForLevel(level: number): number {
  // Smooth RPG level scaling
  if (level <= 1) return 50;
  return Math.floor(40 + Math.pow(level, 1.6) * 15);
}

export function getWriterTitle(level: number): { title: string; badge: string; description: string; color: string } {
  if (level < 3) {
    return {
      title: '원고지 견습생',
      badge: '🌱',
      description: '글쓰기의 첫걸음을 뗀 초심자',
      color: 'from-amber-500 to-amber-700',
    };
  } else if (level < 5) {
    return {
      title: '잉크병 초심자',
      badge: '✒️',
      description: '자신만의 문체를 탐색하는 창작자',
      color: 'from-emerald-500 to-teal-700',
    };
  } else if (level < 8) {
    return {
      title: '단편 스토리텔러',
      badge: '📜',
      description: '완결의 기쁨을 알아가는 이야기꾼',
      color: 'from-blue-500 to-indigo-700',
    };
  } else if (level < 12) {
    return {
      title: '정기 연재 작가',
      badge: '📖',
      description: '꾸준한 습관으로 독자를 사로잡는 작가',
      color: 'from-violet-500 to-purple-700',
    };
  } else if (level < 18) {
    return {
      title: '필력의 마술사',
      badge: '✨',
      description: '문장 하나로 독자의 심금을 울리는 필력가',
      color: 'from-pink-500 to-rose-700',
    };
  } else if (level < 25) {
    return {
      title: '베스트셀러 작가',
      badge: '🏆',
      description: '세상의 주목을 받는 화제의 인기 작가',
      color: 'from-amber-400 to-yellow-600',
    };
  } else if (level < 35) {
    return {
      title: '문학의 거장',
      badge: '👑',
      description: '후대 작가들의 귀감이 되는 거장',
      color: 'from-indigo-600 to-slate-900',
    };
  } else {
    return {
      title: '불멸의 대문호',
      badge: '🌌',
      description: '역사에 이름을 남긴 위대한 대문호',
      color: 'from-fuchsia-600 to-amber-600',
    };
  }
}

// 100% Offline Web Audio sound synthesizer for instant joyful feedback
export function playSound(type: 'quest_complete' | 'level_up' | 'buy' | 'use_item' | 'coin') {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = ctx.currentTime;

    if (type === 'coin') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'quest_complete') {
      // Pleasant rising arpeggio (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.2, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.3);
      });
    } else if (type === 'level_up') {
      // Grand fanfare (C5, G5, C6, E6, G6)
      const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.6);
      });
    } else if (type === 'buy') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.setValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'use_item') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch {
    // Audio might be muted or blocked by browser policy until interaction
  }
}

export interface InspirationPrompt {
  id: string;
  category: '인물' | '사건/반전' | '세계관' | '대사' | '감각/분위기';
  title: string;
  prompt: string;
  guide: string;
}

export const INSPIRATION_PROMPTS: InspirationPrompt[] = [
  {
    id: 'p-1',
    category: '인물',
    title: '모순적인 결함을 가진 조력자',
    prompt: '주인공에게 가장 헌신적이지만, 절대로 타인에게 털어놓을 수 없는 치명적인 거짓말을 품고 있는 조력자.',
    guide: '그는 왜 거짓말을 해야만 했을까요? 이 비밀이 밝혀지면 주인공과의 관계는 어떻게 변할까요?',
  },
  {
    id: 'p-2',
    category: '사건/반전',
    title: '잘못 배달된 편지/물건',
    prompt: '주인공의 문 앞에 전혀 모르는 발신인으로부터 피 묻은 열쇠와 암호화된 짧은 메모가 도착한다.',
    guide: '주인공은 이것을 경찰에 넘길까요, 아니면 호기심에 직접 열쇠의 주인을 찾아 나설까요?',
  },
  {
    id: 'p-3',
    category: '대사',
    title: '차가운 진심의 대사',
    prompt: '"내가 널 살려둔 건 자비 때문이 아니야. 네가 가장 아끼는 것이 무너지는 걸 두 눈으로 보게 하기 위해서지."',
    guide: '이 말을 던진 인물과 들은 인물 사이엔 과거 어떤 원한이나 비극이 얽혀 있을까요?',
  },
  {
    id: 'p-4',
    category: '세계관',
    title: '침묵이 화폐인 도시',
    prompt: '말 한마디를 할 때마다 세금이 부과되는 도시. 사람들은 손짓과 표정, 비밀 수신호로만 소통한다.',
    guide: '이 도시에서 가장 부유한 자는 누구이며, 가장 위험한 반역자는 어떤 말을 외칠까요?',
  },
  {
    id: 'p-5',
    category: '감각/분위기',
    title: '비 내리는 새벽의 정거장',
    prompt: '새벽 3시 40분, 마지막 버스가 끊긴 시골 정류장에 비에 젖은 채 우두커니 서 있는 두 남녀.',
    guide: '차가운 빗소리와 젖은 아스팔트 냄새, 가로등 불빛 아래서 흐르는 어색한 긴장감을 묘사해 보세요.',
  },
  {
    id: 'p-6',
    category: '인물',
    title: '기억을 잃어버린 악역',
    prompt: '세계를 혼란에 빠뜨린 악당이 모든 기억을 잃고 자신이 착한 시골 빵집 청년인 줄 알고 살아간다.',
    guide: '그를 추적해 온 영웅은 복수를 할 수 있을까요, 아니면 지켜볼까요?',
  },
  {
    id: 'p-7',
    category: '사건/반전',
    title: '결정적 순간의 배신',
    prompt: '모든 계획이 완벽하게 맞아떨어진 마지막 순간, 가장 신뢰하던 인물이 문을 밖에서 잠가버린다.',
    guide: '그의 배신은 야망 때문이었을까요, 아니면 주인공을 살리기 위한 선택이었을까요?',
  },
  {
    id: 'p-8',
    category: '세계관',
    title: '꿈을 공유하는 약물',
    prompt: '특정 향수를 뿌리고 잠들면 같은 꿈속 광장에서 만날 수 있는 사회.',
    guide: '꿈속에서의 범죄는 현실에서 처벌받을 수 있을까요?',
  },
  {
    id: 'p-9',
    category: '대사',
    title: '끝을 알리는 마지막 인사',
    prompt: '"다음 생이 있다면, 그때는 서로 이름을 묻지 않는 사이로 만나요."',
    guide: '이 대사가 나오는 상황의 슬픔과 애틋함을 전후 맥락으로 채워보세요.',
  },
  {
    id: 'p-10',
    category: '사건/반전',
    title: '예언의 기막힌 빗나감',
    prompt: '절대 틀리지 않던 예언자의 예언이 빗나갔다. 알고 보니 예언자가 착각한 게 아니라 세상의 규칙 자체가 바뀐 것.',
    guide: '예언을 맹신하고 준비하던 권력자들은 어떻게 혼란에 빠질까요?',
  },
];
