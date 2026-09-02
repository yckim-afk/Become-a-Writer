import React, { useState } from 'react';
import {
  ShoppingBag,
  Package,
  History,
  ShieldCheck,
  Sparkles,
  Zap,
  Coffee,
  Search as SearchIcon,
  Flame,
  BookOpen,
  Plus,
  Coins,
  Check,
  X,
  Trash2,
  Edit2,
  HelpCircle,
  Clock
} from 'lucide-react';
import { ShopItem, InventoryItem, ItemUsageLog, ShopItemCategory } from '../types';

interface ShopViewProps {
  userGold: number;
  exemptionCount: number;
  shopItems: ShopItem[];
  inventory: InventoryItem[];
  usageLogs: ItemUsageLog[];
  onBuyItem: (item: ShopItem) => void;
  onUseItem: (invItem: InventoryItem) => void;
  onAddShopItem: (item: Omit<ShopItem, 'id'>) => void;
  onEditShopItem: (item: ShopItem) => void;
  onDeleteShopItem: (itemId: string) => void;
  onTriggerInspiration: () => void;
  onTriggerSprint: () => void;
  onTriggerPomodoro: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  userGold,
  exemptionCount,
  shopItems,
  inventory,
  usageLogs,
  onBuyItem,
  onUseItem,
  onAddShopItem,
  onEditShopItem,
  onDeleteShopItem,
  onTriggerInspiration,
  onTriggerSprint,
  onTriggerPomodoro,
}) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'inventory' | 'history'>('shop');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState(20);
  const [formCategory, setFormCategory] = useState<ShopItemCategory>('creative');
  const [formEffect, setFormEffect] = useState<'exemption' | 'inspiration' | 'sprint' | 'pomodoro' | 'custom'>('custom');
  const [formCustomDetail, setFormCustomDetail] = useState('');

  // Proofreading tips helper modal
  const [isProofreadModalOpen, setIsProofreadModalOpen] = useState(false);

  // Render Icon helper
  const renderItemIcon = (iconName: string, size = 20) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck size={size} className="text-emerald-600" />;
      case 'Sparkles':
        return <Sparkles size={size} className="text-amber-500" />;
      case 'Zap':
        return <Zap size={size} className="text-amber-600" />;
      case 'Coffee':
        return <Coffee size={size} className="text-amber-800" />;
      case 'Search':
        return <SearchIcon size={size} className="text-blue-600" />;
      case 'Flame':
        return <Flame size={size} className="text-rose-500" />;
      case 'BookOpen':
        return <BookOpen size={size} className="text-indigo-600" />;
      default:
        return <ShoppingBag size={size} className="text-amber-600" />;
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormDesc('');
    setFormPrice(20);
    setFormCategory('custom');
    setFormEffect('custom');
    setFormCustomDetail('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: ShopItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDesc(item.description);
    setFormPrice(item.price);
    setFormCategory(item.category);
    setFormEffect(item.effectType || 'custom');
    setFormCustomDetail(item.customEffectDetail || '');
    setIsAddModalOpen(true);
  };

  const handleSubmitItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    let icon = 'ShoppingBag';
    if (formEffect === 'exemption') icon = 'ShieldCheck';
    else if (formEffect === 'inspiration') icon = 'Sparkles';
    else if (formEffect === 'sprint') icon = 'Zap';
    else if (formEffect === 'pomodoro') icon = 'Coffee';

    if (editingItem) {
      onEditShopItem({
        ...editingItem,
        name: formName.trim(),
        description: formDesc.trim(),
        price: formPrice,
        category: formCategory,
        icon,
        isExemptionPass: formEffect === 'exemption',
        effectType: formEffect,
        customEffectDetail: formCustomDetail.trim(),
      });
    } else {
      onAddShopItem({
        name: formName.trim(),
        description: formDesc.trim(),
        price: formPrice,
        category: formCategory,
        icon,
        isExemptionPass: formEffect === 'exemption',
        effectType: formEffect,
        customEffectDetail: formCustomDetail.trim(),
      });
    }
    setIsAddModalOpen(false);
  };

  const handleUseInventory = (inv: InventoryItem) => {
    if (inv.quantity <= 0) return;

    if (inv.effectType === 'inspiration') {
      onUseItem(inv);
      onTriggerInspiration();
    } else if (inv.effectType === 'sprint') {
      onUseItem(inv);
      onTriggerSprint();
    } else if (inv.effectType === 'pomodoro') {
      onUseItem(inv);
      onTriggerPomodoro();
    } else if (inv.name.includes('돋보기') || inv.name.includes('퇴고')) {
      onUseItem(inv);
      setIsProofreadModalOpen(true);
    } else {
      onUseItem(inv);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF9] border border-[#E8E0D2] rounded-3xl p-5 sm:p-6 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A1715] tracking-tight">
            작가의 만물상점 & 보관함
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            골드로 결석권과 창작 지원 아이템을 구매하고 활용하세요.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* User Currency Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-300 rounded-2xl text-amber-950 font-black text-sm shadow-2xs">
            <Coins size={18} className="text-amber-600 fill-amber-400" />
            <span>{userGold.toLocaleString()}</span>
            <span className="text-xs text-amber-700 font-semibold">G 보유</span>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 transition"
          >
            <Plus size={15} />
            새 아이템 등록
          </button>
        </div>
      </div>

      {/* Sub Navigation: Shop vs Inventory vs Usage History */}
      <div className="flex items-center gap-2 p-1.5 bg-[#FFFDF9] border border-[#E8E0D2] rounded-2xl shadow-2xs">
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'shop'
              ? 'bg-[#2C2825] text-white shadow-2xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ShoppingBag size={16} />
          아이템 상점
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'inventory'
              ? 'bg-[#2C2825] text-white shadow-2xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Package size={16} />
          내 보관함 ({inventory.reduce((acc, i) => acc + i.quantity, 0)})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'history'
              ? 'bg-[#2C2825] text-white shadow-2xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <History size={16} />
          사용 이력 ({usageLogs.length})
        </button>
      </div>

      {/* TAB 1: SHOP ITEMS */}
      {activeTab === 'shop' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shopItems.map((item) => {
            const canAfford = userGold >= item.price;
            return (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E8E0D2] hover:border-amber-300 shadow-2xs transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
                        {renderItemIcon(item.icon, 20)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-sm sm:text-base text-[#1A1715]">
                            {item.name}
                          </h3>
                          {item.isExemptionPass && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                              필수 방어
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400 font-medium">
                          {item.category === 'special'
                            ? '스페셜'
                            : item.category === 'creative'
                            ? '창작 지원'
                            : item.category === 'consumable'
                            ? '집필 소모품'
                            : '커스텀'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 text-stone-400 hover:text-stone-700 rounded-lg transition"
                        title="아이템 수정"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`'${item.name}' 아이템을 상점에서 삭제하시겠습니까?`)) {
                            onDeleteShopItem(item.id);
                          }
                        }}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded-lg transition"
                        title="아이템 삭제"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-serif-kr">
                    {item.description}
                  </p>

                  {item.customEffectDetail && (
                    <div className="mt-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200/60 text-[11px] text-stone-500">
                      💡 <strong>효과:</strong> {item.customEffectDetail}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#EFE8DC]">
                  <div className="flex items-center gap-1 font-extrabold text-sm text-amber-950">
                    <Coins size={16} className="text-amber-600 fill-amber-400" />
                    <span>{item.price} Gold</span>
                  </div>

                  <button
                    onClick={() => onBuyItem(item)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 flex items-center gap-1.5 shadow-2xs ${
                      canAfford
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag size={14} />
                    {canAfford ? '구매하기' : '골드 부족'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Quick Highlight of Exemption Pass */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl border border-emerald-300">
                <ShieldCheck size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-emerald-950">
                    황금 결석권 (스트릭 보호권)
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-200 text-emerald-950 rounded-full text-xs font-black">
                    {exemptionCount}개 보유 중
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  하루 동안 데일리 퀘스트를 완료하지 못했을 때 스트릭이 끊기는 것을 방어합니다.
                </p>
              </div>
            </div>

            <div className="text-xs text-emerald-900 bg-white/70 px-3.5 py-2 rounded-xl border border-emerald-200 shrink-0 font-medium">
              ⚙️ 자정 체크 시 자동 방어 활성화됨
            </div>
          </div>

          {/* Owned Inventory List */}
          {inventory.length === 0 ? (
            <div className="bg-[#FFFDF9] border border-dashed border-[#E8E0D2] rounded-3xl p-12 text-center text-stone-500 space-y-2">
              <Package size={28} className="mx-auto text-amber-500/70" />
              <p className="font-bold text-sm text-[#1A1715]">보관함이 비어 있습니다.</p>
              <p className="text-xs text-stone-400">상점에서 필요한 창작 아이템을 골드로 장만해 보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inventory.map((inv) => (
                <div
                  key={inv.id}
                  className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E8E0D2] shadow-2xs flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
                        {renderItemIcon(inv.icon, 20)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-[#1A1715]">
                          {inv.name}
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5">{inv.description}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs rounded-xl shrink-0">
                      x{inv.quantity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#EFE8DC]">
                    <span className="text-[11px] text-stone-400">
                      구매일: {inv.boughtAt ? inv.boughtAt.slice(0, 10) : '최근'}
                    </span>

                    <button
                      onClick={() => handleUseInventory(inv)}
                      disabled={inv.quantity <= 0}
                      className="px-4 py-2 bg-[#2C2825] hover:bg-[#1A1715] text-white rounded-xl text-xs font-bold transition active:scale-95 shadow-2xs disabled:opacity-40"
                    >
                      사용하기 (1개 소모)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USAGE HISTORY LOGS */}
      {activeTab === 'history' && (
        <div className="bg-[#FFFDF9] border border-[#E8E0D2] rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#1A1715]">아이템 사용 내역</h3>
            <span className="text-xs text-stone-500">총 {usageLogs.length}건</span>
          </div>

          {usageLogs.length === 0 ? (
            <p className="text-center py-8 text-xs text-stone-400">
              아직 사용한 아이템 기록이 없습니다.
            </p>
          ) : (
            <div className="space-y-2.5">
              {usageLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1A1715]">{log.itemName}</span>
                    <span className="text-stone-600">· {log.effectSummary}</span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400 shrink-0">
                    {new Date(log.usedAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Shop Item Modal */}
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
              {editingItem ? '상점 아이템 수정' : '새 창작 아이템 등록'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              글쓰기 동기부여를 위한 나만의 아이템을 상점에 추가하세요.
            </p>

            <form onSubmit={handleSubmitItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">아이템 이름 *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="예: 자정의 백색소음 라디오, 마감 연장 쿠폰 등"
                  className="w-full px-3.5 py-2.5 bg-[#F8F6F0] border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">아이템 설명 *</label>
                <textarea
                  rows={2}
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="아이템의 분위기와 기능을 적어주세요."
                  className="w-full px-3.5 py-2.5 bg-[#F8F6F0] border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">가격 (Gold) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2 bg-[#F8F6F0] border border-stone-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">연동 기능 효과</label>
                  <select
                    value={formEffect}
                    onChange={(e) => setFormEffect(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-[#F8F6F0] border border-stone-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="custom">자유 커스텀 효과</option>
                    <option value="exemption">스트릭 결석 방패 (결석권)</option>
                    <option value="inspiration">영감 카드 뽑기 모달 연동</option>
                    <option value="sprint">5분 폭풍 질주 타이머 연동</option>
                    <option value="pomodoro">25분 뽀모도로 타이머 연동</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">효과 세부 메모 (선택)</label>
                <input
                  type="text"
                  value={formCustomDetail}
                  onChange={(e) => setFormCustomDetail(e.target.value)}
                  placeholder="예: 30분 산책 후 아이디어 메모하기"
                  className="w-full px-3.5 py-2 bg-[#F8F6F0] border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                >
                  아이템 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proofreading Tips Guide Modal */}
      {isProofreadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border border-[#E8E0D2] w-full max-w-lg rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsProofreadModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
                <SearchIcon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#1A1715]">퇴고의 황금 돋보기 가이드</h3>
                <p className="text-xs text-stone-500">원고의 품격을 높이는 5대 퇴고 원칙</p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#2C2825] font-serif-kr leading-relaxed max-h-[60vh] overflow-y-auto touch-scroll pr-1">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <strong className="text-amber-900 block mb-1">1. 부사·형용사 30% 덜어내기</strong>
                <p className="text-stone-600">
                  '매우', '정말로', '엄청나게' 같은 막연한 강조 부사를 지우고, 행동과 구체적 묘사로 대체해 보세요.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <strong className="text-amber-900 block mb-1">2. 소리 내어 낭독하기</strong>
                <p className="text-stone-600">
                  문장이 혀끝에서 걸리거나 숨이 차다면 문장이 너무 길다는 신호입니다. 마침표를 찍어 두 문장으로 쪼개세요.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <strong className="text-amber-900 block mb-1">3. 피동형 및 '~적/~의' 줄이기</strong>
                <p className="text-stone-600">
                  '보여진다', '생각되어진다' 대신 능동형 '본다', '생각한다'를 쓰면 문장에 단단한 힘이 실립니다.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <strong className="text-amber-900 block mb-1">4. 대사의 구어체 점검</strong>
                <p className="text-stone-600">
                  등장인물이 설명조로 말하고 있지 않은지 확인하세요. 인물의 숨겨진 감정은 침묵과 시선 처리에 있습니다.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsProofreadModalOpen(false)}
              className="w-full mt-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition"
            >
              확인 완료 (원고 다듬으러 가기)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
