import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Compass, Receipt, UserRound } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { customerTab, setCustomerTab, orders, groceryCart } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.timelineState !== 'completed' && o.timelineState !== 'cancelled'
  ).length;

  const tabs: Array<{
    id: 'home' | 'explore' | 'orders' | 'profile';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'home', label: 'Home & AI', icon: Home },
    { id: 'explore', label: 'Explore & Market', icon: Compass, badge: groceryCart.length > 0 ? groceryCart.length : undefined },
    { id: 'orders', label: 'Orders', icon: Receipt, badge: activeOrdersCount },
    { id: 'profile', label: 'Food Memory', icon: UserRound },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#EAE5E9] pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = customerTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCustomerTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors relative ${
                isActive ? 'text-[#30102F]' : 'text-[#716B71] hover:text-[#242124]'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-[#30102F]' : 'text-[#716B71]'
                  }`}
                />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 bg-[#30102F] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums border border-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium tracking-tight ${
                  isActive ? 'font-bold text-[#30102F]' : 'text-[#716B71]'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-[#CBB477] rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
