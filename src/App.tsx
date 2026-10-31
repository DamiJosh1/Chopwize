import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { LocationModal } from './components/common/LocationModal';
import { CartConflictModal } from './components/common/CartConflictModal';
import { Toast } from './components/common/Toast';
import { HomeView } from './components/customer/HomeView';
import { DiscoverView } from './components/customer/DiscoverView';
import { RestaurantView } from './components/customer/RestaurantView';
import { OrdersView } from './components/customer/OrdersView';
import { PlansView } from './components/customer/PlansView';
import { ProfileView } from './components/customer/ProfileView';
import { CartDrawer } from './components/customer/CartDrawer';
import { AIConciergeModal } from './components/customer/AIConciergeModal';
import { SurpriseMeModal } from './components/customer/SurpriseMeModal';
import { CookingAssistantModal } from './components/customer/CookingAssistantModal';
import { RestaurantDashboard } from './components/restaurant/RestaurantDashboard';
import { RiderApp } from './components/rider/RiderApp';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainContent: React.FC = () => {
  const { role, customerTab, selectedRestaurantId } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#242124]">
      {/* Universal Header */}
      <Header />

      {/* Main Working View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {role === 'customer' && (
          <>
            {selectedRestaurantId ? (
              <RestaurantView />
            ) : (
              <>
                {customerTab === 'home' && <HomeView />}
                {customerTab === 'discover' && <DiscoverView />}
                {customerTab === 'orders' && <OrdersView />}
                {customerTab === 'plans' && <PlansView />}
                {customerTab === 'profile' && <ProfileView />}
              </>
            )}
            {/* Mobile Bottom Navigation for Customer Role */}
            <BottomNav />
          </>
        )}

        {role === 'restaurant' && <RestaurantDashboard />}
        {role === 'rider' && <RiderApp />}
        {role === 'admin' && <AdminDashboard />}
      </main>

      {/* Shared Modals and Overlays */}
      <LocationModal />
      <CartConflictModal />
      <CartDrawer />
      <AIConciergeModal />
      <SurpriseMeModal />
      <CookingAssistantModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
