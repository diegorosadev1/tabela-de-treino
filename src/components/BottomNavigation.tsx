import React from 'react';
import { Home, Dumbbell, BarChart3 } from 'lucide-react';

export type NavTab = 'home' | 'workout' | 'progress';

interface BottomNavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  completedExercisesCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
  completedExercisesCount = 0,
}) => {
  const tabs = [
    {
      id: 'home' as NavTab,
      label: 'Início',
      icon: Home,
    },
    {
      id: 'workout' as NavTab,
      label: 'Treinos',
      icon: Dumbbell,
      badge: completedExercisesCount > 0 ? `${completedExercisesCount}/6` : undefined,
    },
    {
      id: 'progress' as NavTab,
      label: 'Progresso',
      icon: BarChart3,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-lg safe-bottom md:hidden">
      <div className="grid grid-cols-3 h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center relative py-1 transition-all active:scale-95 ${
                isActive ? 'text-rose-600 font-semibold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-4 px-1.5 py-0.2 bg-stone-200 text-stone-700 text-[9px] rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] tracking-tight mt-1 ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 bg-rose-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
