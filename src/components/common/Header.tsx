import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppRole } from '../../types';
import {
  MapPin,
  ShoppingBag,
  Sparkles,
  ChevronDown,
  Store,
  Bike,
  ShieldCheck,
  User,
  Compass,
  Receipt,
  CalendarDays,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    customerTab,
    setCustomerTab,
    selectedLocation,
    setIsLocationModalOpen,
    cart,
    setIsCartOpen,
    openAIConciergeWithQuery,
  } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#EAE5E9] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          
          {/* Brand & Location */}
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <button
              onClick={() => {
                setRole('customer');
                setCustomerTab('home');
              }}
              className="text-left group focus:outline-none"
            >
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-[#30102F]">
                  CHOPWIZE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#CBB477]" />
              </div>
              <p className="hidden sm:block text-[10px] tracking-wider font-semibold text-[#716B71] uppercase">
                Intelligent Food Decisions
              </p>
            </button>

            {/* Location Selector (Customer role) */}
            {role === 'customer' && (
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-[#242124] hover:text-[#30102F] bg-[#FAF8F4] hover:bg-[#FAF3F9] px-2.5 py-1.5 rounded-xl border border-[#EAE5E9] transition-colors max-w-[150px] sm:max-w-[210px] truncate"
                title="Change delivery location"
              >
                <MapPin className="w-3.5 h-3.5 text-[#30102F] shrink-0" />
                <span className="truncate">{selectedLocation}</span>
                <ChevronDown className="w-3 h-3 text-[#716B71] shrink-0" />
              </button>
            )}
          </div>

          {/* Desktop Customer Navigation */}
          {role === 'customer' && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#716B71]">
              <button
                onClick={() => setCustomerTab('home')}
                className={`transition-colors pb-0.5 ${
                  customerTab === 'home'
                    ? 'text-[#30102F] font-semibold border-b-2 border-[#30102F]'
                    : 'hover:text-[#242124]'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCustomerTab('discover')}
                className={`flex items-center gap-1.5 transition-colors pb-0.5 ${
                  customerTab === 'discover'
                    ? 'text-[#30102F] font-semibold border-b-2 border-[#30102F]'
                    : 'hover:text-[#242124]'
                }`}
              >
                <Compass className="w-4 h-4" />
                Discover
              </button>
              <button
                onClick={() => setCustomerTab('orders')}
                className={`flex items-center gap-1.5 transition-colors pb-0.5 ${
                  customerTab === 'orders'
                    ? 'text-[#30102F] font-semibold border-b-2 border-[#30102F]'
                    : 'hover:text-[#242124]'
                }`}
              >
                <Receipt className="w-4 h-4" />
                Orders
              </button>
              <button
                onClick={() => setCustomerTab('plans')}
                className={`flex items-center gap-1.5 transition-colors pb-0.5 ${
                  customerTab === 'plans'
                    ? 'text-[#30102F] font-semibold border-b-2 border-[#30102F]'
                    : 'hover:text-[#242124]'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                Plans & Budget
              </button>
              <button
                onClick={() => openAIConciergeWithQuery('What do you recommend for lunch today?')}
                className="flex items-center gap-1.5 text-[#30102F] bg-[#FAF3F9] hover:bg-[#F3E7F2] px-3 py-1.5 rounded-xl border border-[#30102F]/15 font-semibold text-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#CBB477]" />
                AI Concierge
              </button>
            </nav>
          )}

          {/* Right Area: Role Switcher & Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Demo Environment Badge */}
            <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-[#FAF3F9] text-[#30102F] border border-[#30102F]/20">
              Demo Mode
            </span>

            {/* Role Switcher Dropdown */}
            <div className="relative group">
              <label htmlFor="role-select" className="sr-only">Switch App Role</label>
              <select
                id="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value as AppRole)}
                className="appearance-none bg-[#FAF8F4] hover:bg-[#FAF3F9] border border-[#EAE5E9] text-xs font-semibold text-[#30102F] py-2 pl-7 pr-7 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#30102F]"
              >
                <option value="customer">Role: Customer</option>
                <option value="restaurant">Role: Restaurant Partner</option>
                <option value="rider">Role: Rider Partner</option>
                <option value="admin">Role: Operations Admin</option>
              </select>
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#30102F]">
                {role === 'customer' && <User className="w-3.5 h-3.5" />}
                {role === 'restaurant' && <Store className="w-3.5 h-3.5" />}
                {role === 'rider' && <Bike className="w-3.5 h-3.5" />}
                {role === 'admin' && <ShieldCheck className="w-3.5 h-3.5" />}
              </div>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#716B71]" />
            </div>

            {/* Cart Trigger (Customer role only) */}
            {role === 'customer' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl text-[#30102F] bg-[#FAF8F4] hover:bg-[#FAF3F9] border border-[#EAE5E9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#30102F] min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={`View food tray with ${totalCartCount} items`}
              >
                <ShoppingBag className="w-5 h-5 text-[#30102F]" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#30102F] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm tabular-nums">
                    {totalCartCount}
                  </span>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
