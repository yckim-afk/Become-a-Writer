import React from 'react';
import { LayoutDashboard, CheckSquare, ShoppingBag, Lightbulb, BookOpen } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'quests' | 'shop' | 'ideas' | 'stories';

interface NavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  pendingDailyCount: number;
  inventoryCount: number;
  ideasCount: number;
  storiesCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  pendingDailyCount,
  inventoryCount,
  ideasCount,
  storiesCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: '대시보드',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'quests' as ActiveTab,
      label: '퀘스트',
      icon: CheckSquare,
      badge: pendingDailyCount > 0 ? `${pendingDailyCount}` : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'shop' as ActiveTab,
      label: '상점 & 보관함',
      icon: ShoppingBag,
      badge: inventoryCount > 0 ? `${inventoryCount}` : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'ideas' as ActiveTab,
      label: '아이디어뱅크',
      icon: Lightbulb,
      badge: ideasCount > 0 ? `${ideasCount}` : null,
      badgeColor: 'bg-stone-200 text-stone-700',
    },
    {
      id: 'stories' as ActiveTab,
      label: '이야기 라이브러리',
      icon: BookOpen,
      badge: storiesCount > 0 ? `${storiesCount}` : null,
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
  ];

  return (
    <>
      {/* Desktop / iPad Top Tabs */}
      <nav className="hidden sm:flex items-center gap-2 p-1.5 bg-[#FFFDF9] border border-[#E8E0D2] rounded-2xl mb-6 shadow-2xs overflow-x-auto touch-scroll">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-150 min-h-[44px] select-none ${
                isActive
                  ? 'bg-[#2C2825] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-amber-400' : 'text-stone-500'} />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                    isActive ? 'bg-amber-500 text-stone-900' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile / Small iPad Bottom Sticky Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-[#E8E0D2] pb-safe shadow-lg">
        <div className="flex items-center justify-around py-1 px-2 max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition min-h-[48px] min-w-[56px] relative select-none ${
                  isActive ? 'text-amber-700 font-bold' : 'text-stone-500'
                }`}
              >
                <div className="relative">
                  <Icon size={20} className={isActive ? 'text-amber-600' : 'text-stone-400'} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 text-[10px] w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-0.5">{item.label}</span>
                {isActive && (
                  <span className="w-1 h-1 bg-amber-600 rounded-full mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
