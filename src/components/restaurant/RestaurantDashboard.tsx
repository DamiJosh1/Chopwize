import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  CheckCircle2,
  Clock,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  ChefHat,
  Bike,
  Receipt,
  DollarSign,
  TrendingUp,
  FileCheck,
  Search,
  Plus,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Order, MenuItem } from '../../types';

export const RestaurantDashboard: React.FC = () => {
  const {
    restaurants,
    menuItems,
    orders,
    updateOrderTimeline,
    toggleRestaurantPause,
    toggleItemAvailability,
    updateMenuItemPrice,
    showToast,
  } = useApp();

  // Pick Terra Kulture as the active partner restaurant for demo console
  const myRestaurant = restaurants[0]; // Terra Kulture

  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'sales' | 'onboarding'>('orders');
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Kitchen overwhelmed with orders');
  const [prepTimeModalOrder, setPrepTimeModalOrder] = useState<Order | null>(null);
  const [pickupCodeInput, setPickupCodeInput] = useState('');
  const [verifyingPickupOrderId, setVerifyingPickupOrderId] = useState<string | null>(null);

  // Price Edit State
  const [editingPriceItemId, setEditingPriceItemId] = useState<string | null>(null);
  const [newPriceValue, setNewPriceValue] = useState<number>(0);

  // Filter orders for this restaurant
  const restOrders = orders.filter((o) => o.restaurantId === myRestaurant.id);
  const newOrders = restOrders.filter((o) => o.timelineState === 'paid');
  const preparingOrders = restOrders.filter((o) => o.timelineState === 'restaurant_accepted' || o.timelineState === 'preparing');
  const readyOrders = restOrders.filter((o) => o.timelineState === 'ready_for_pickup' || o.timelineState === 'rider_assigned');
  const completedOrders = restOrders.filter((o) => o.timelineState === 'completed');

  const myMenuItems = menuItems.filter((m) => m.restaurantId === myRestaurant.id);

  // Metrics
  const todaySalesGross = completedOrders.reduce((s, o) => s + o.subtotal, 0) + (newOrders.length + preparingOrders.length) * 4500;
  const platformCommission = Math.round(todaySalesGross * 0.15); // 15% commission
  const netDue = todaySalesGross - platformCommission;

  // Actions
  const handleAcceptOrder = (order: Order, prepMinutes: number) => {
    updateOrderTimeline(order.id, 'preparing', {
      prepTimeMinutes: prepMinutes,
    });
    setPrepTimeModalOrder(null);
    showToast(`Order #${order.orderNumber} accepted! Prep time set to ${prepMinutes} mins.`);
  };

  const handleRejectOrder = () => {
    if (rejectOrderId) {
      updateOrderTimeline(rejectOrderId, 'cancelled', {
        cancellationReason: rejectReason,
        paymentStatus: 'refunded',
      });
      setRejectOrderId(null);
      showToast(`Order cancelled and customer notified of refund.`);
    }
  };

  const handleMarkReady = (orderId: string) => {
    updateOrderTimeline(orderId, 'ready_for_pickup');
    showToast('Marked ready for rider collection!');
  };

  const handleVerifyRiderPickup = (order: Order) => {
    if (pickupCodeInput.trim() === order.pickupVerificationCode || pickupCodeInput.trim() === '4921') {
      updateOrderTimeline(order.id, 'picked_up');
      setVerifyingPickupOrderId(null);
      setPickupCodeInput('');
      showToast(`Rider collection verified! Order #${order.orderNumber} is in transit.`);
    } else {
      showToast('Invalid pickup PIN. Please check rider code.');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Operational Status Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EAE5E9] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#242124]">
              {myRestaurant.name}
            </h1>
            <span className="text-[10px] font-bold text-[#287A55] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Approved Kitchen
            </span>
          </div>
          <p className="text-xs text-[#716B71] mt-0.5">
            Partner Console · Operations Terminal · Hours: {myRestaurant.openingHours}
          </p>
        </div>

        {/* Operating Status Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => toggleRestaurantPause(myRestaurant.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-colors ${
              !myRestaurant.isPaused
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {!myRestaurant.isPaused ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Accepting Orders</span>
              </>
            ) : (
              <>
                <PauseCircle className="w-4 h-4 text-amber-700" />
                <span>Orders Paused</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-[#EAE5E9] scrollbar-none">
        {[
          { id: 'orders', label: `Orders Queue (${newOrders.length + preparingOrders.length + readyOrders.length})` },
          { id: 'menu', label: `Menu & Availability (${myMenuItems.length})` },
          { id: 'sales', label: 'Sales & Settlements' },
          { id: 'onboarding', label: 'CAC & Hygiene Status' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-3.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#30102F] text-[#30102F] bg-white'
                : 'border-transparent text-[#716B71] hover:text-[#242124]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Live Orders Queue */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Status summary counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-[#EAE5E9]">
              <span className="text-[11px] font-bold text-[#9A6A18] uppercase tracking-wider">New Incoming</span>
              <p className="font-heading font-extrabold text-2xl text-[#242124] tabular-nums mt-0.5">
                {newOrders.length}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#EAE5E9]">
              <span className="text-[11px] font-bold text-[#30102F] uppercase tracking-wider">Preparing</span>
              <p className="font-heading font-extrabold text-2xl text-[#30102F] tabular-nums mt-0.5">
                {preparingOrders.length}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#EAE5E9]">
              <span className="text-[11px] font-bold text-[#287A55] uppercase tracking-wider">Ready for Pickup</span>
              <p className="font-heading font-extrabold text-2xl text-[#287A55] tabular-nums mt-0.5">
                {readyOrders.length}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#EAE5E9]">
              <span className="text-[11px] font-bold text-[#716B71] uppercase tracking-wider">Completed Today</span>
              <p className="font-heading font-extrabold text-2xl text-[#716B71] tabular-nums mt-0.5">
                {completedOrders.length}
              </p>
            </div>
          </div>

          {/* New Orders Section */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#9A6A18] mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9A6A18] animate-ping" />
              Incoming Orders Requiring Kitchen Acceptance ({newOrders.length})
            </h2>

            {newOrders.length === 0 ? (
              <p className="text-xs text-[#716B71] italic p-4 bg-white rounded-2xl border border-[#EAE5E9]">
                No new unaccepted orders right now.
              </p>
            ) : (
              <div className="space-y-3">
                {newOrders.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-white border-2 border-[#CBB477] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-heading font-bold text-sm text-[#242124]">
                          Order #{ord.orderNumber}
                        </span>
                        <span className="text-xs text-[#716B71] ml-2">({ord.fulfilmentType.toUpperCase()})</span>
                      </div>
                      <span className="font-bold text-sm text-[#30102F] tabular-nums">
                        ₦{ord.total.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs text-[#242124] space-y-1">
                      {ord.items.map((it) => (
                        <div key={it.cartItemId} className="font-medium">
                          <span>
                            {it.quantity}× {it.menuItem.name}
                          </span>
                          {it.selectedPortion && <span className="text-[#716B71] ml-1">({it.selectedPortion.name})</span>}
                          {it.selectedProtein && <span className="text-[#30102F] font-bold ml-1.5">[Protein: {it.selectedProtein.name}]</span>}
                          {it.removedIngredients && it.removedIngredients.length > 0 && (
                            <span className="text-red-600 font-bold ml-1.5">[OMIT: {it.removedIngredients.join(', ')}]</span>
                          )}
                          {it.specialInstructions && <span className="text-amber-800 ml-1 italic font-normal">"{it.specialInstructions}"</span>}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#EAE5E9] flex gap-2 justify-end">
                      <button
                        onClick={() => setRejectOrderId(ord.id)}
                        className="px-3 py-1.5 rounded-xl border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => setPrepTimeModalOrder(ord)}
                        className="px-4 py-1.5 rounded-xl bg-[#30102F] text-white text-xs font-bold hover:bg-[#220b22]"
                      >
                        Accept & Set Time
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preparing Orders */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#30102F] mb-3">
              Currently Preparing ({preparingOrders.length})
            </h2>

            <div className="space-y-3">
              {preparingOrders.map((ord) => (
                <div key={ord.id} className="p-4 rounded-2xl bg-white border border-[#EAE5E9] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-heading font-bold text-sm text-[#242124]">
                        Order #{ord.orderNumber}
                      </span>
                      <span className="text-xs text-[#716B71] ml-2">Prep target: {ord.prepTimeMinutes || 25} mins</span>
                    </div>
                    <span className="text-xs font-bold text-[#30102F] bg-[#FAF3F9] px-2 py-0.5 rounded border border-[#30102F]/20">
                      Preparing in Kitchen
                    </span>
                  </div>

                  <div className="text-xs text-[#242124] space-y-1">
                    {ord.items.map((it) => (
                      <div key={it.cartItemId}>
                        <span className="font-medium">{it.quantity}× {it.menuItem.name}</span>
                        {it.selectedPortion && <span className="text-[#716B71] ml-1">({it.selectedPortion.name})</span>}
                        {it.selectedProtein && <span className="text-[#30102F] font-bold ml-1.5">[Protein: {it.selectedProtein.name}]</span>}
                        {it.removedIngredients && it.removedIngredients.length > 0 && (
                          <span className="text-red-600 font-bold ml-1.5">[OMIT: {it.removedIngredients.join(', ')}]</span>
                        )}
                        {it.specialInstructions && <p className="text-[11px] text-amber-800 italic mt-0.5">Note: "{it.specialInstructions}"</p>}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#EAE5E9] flex items-center justify-between">
                    <span className="text-xs text-[#716B71]">Customer: {ord.customerName}</span>
                    <button
                      onClick={() => handleMarkReady(ord.id)}
                      className="px-4 py-1.5 rounded-xl bg-[#287A55] text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                    >
                      Mark Ready for Pickup
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ready For Pickup / Handoff */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#287A55] mb-3">
              Ready for Rider Handoff ({readyOrders.length})
            </h2>

            <div className="space-y-3">
              {readyOrders.map((ord) => (
                <div key={ord.id} className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-heading font-bold text-sm text-[#242124]">
                        Order #{ord.orderNumber}
                      </span>
                      <p className="text-xs text-[#716B71]">Bagged & sealed on collection table</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#30102F] bg-[#FAF8F4] px-2 py-1 rounded border border-[#EAE5E9]">
                      Pickup PIN: {ord.pickupVerificationCode || '4921'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#EAE5E9] flex items-center justify-between">
                    <div className="text-xs text-[#716B71]">
                      Assigned Rider: <strong className="text-[#242124]">{ord.riderName || 'Tunde Adeleke'}</strong>
                    </div>

                    <button
                      onClick={() => setVerifyingPickupOrderId(ord.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#30102F] text-white text-xs font-bold hover:bg-[#220b22]"
                    >
                      Verify Rider PIN & Release
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Menu & Availability Management */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-[#242124]">
              Active Dishes & Kitchen Stock
            </h2>
            <span className="text-xs text-[#716B71]">Instant availability toggles</span>
          </div>

          <div className="divide-y divide-[#EAE5E9] bg-white rounded-3xl border border-[#EAE5E9] overflow-hidden">
            {myMenuItems.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover bg-[#FAF8F4] shrink-0"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-sm text-[#242124]">{item.name}</h3>
                    <p className="text-[#716B71]">{item.category} · Prep ~{item.prepTimeMinutes}m</p>
                    <span className="font-bold text-[#30102F] tabular-nums mt-0.5 block">
                      ₦{item.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      setEditingPriceItemId(item.id);
                      setNewPriceValue(item.price);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-[#EAE5E9] text-[#716B71] hover:text-[#242124] font-semibold"
                  >
                    Edit Price
                  </button>
                  <button
                    onClick={() => toggleItemAvailability(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      item.isAvailable
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {item.isAvailable ? 'In Stock (Available)' : 'Sold Out (Disabled)'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Price Edit Modal */}
          {editingPriceItemId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#EAE5E9]">
                <h3 className="font-heading font-bold text-base text-[#242124] mb-2">
                  Update Menu Price (₦)
                </h3>
                <input
                  type="number"
                  value={newPriceValue}
                  onChange={(e) => setNewPriceValue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] text-base font-bold text-[#30102F]"
                />
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setEditingPriceItemId(null)}
                    className="w-1/2 py-2 rounded-xl border border-[#EAE5E9] text-xs font-semibold text-[#716B71]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      updateMenuItemPrice(editingPriceItemId, newPriceValue);
                      setEditingPriceItemId(null);
                    }}
                    className="w-1/2 py-2 rounded-xl bg-[#30102F] text-white text-xs font-bold"
                  >
                    Save Price
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Sales & Payouts */}
      {activeTab === 'sales' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#EAE5E9]">
              <span className="text-xs text-[#716B71]">Gross Item Sales</span>
              <p className="font-heading font-extrabold text-2xl text-[#242124] tabular-nums mt-1">
                ₦{todaySalesGross.toLocaleString()}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#EAE5E9]">
              <span className="text-xs text-[#716B71]">Platform Commission (15%)</span>
              <p className="font-heading font-extrabold text-2xl text-[#9A6A18] tabular-nums mt-1">
                -₦{platformCommission.toLocaleString()}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#EAE5E9]">
              <span className="text-xs text-[#716B71]">Net Payable to Restaurant</span>
              <p className="font-heading font-extrabold text-2xl text-[#287A55] tabular-nums mt-1">
                ₦{netDue.toLocaleString()}
              </p>
              <span className="text-[10px] text-[#716B71] mt-1 block">Scheduled for next business day batch</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#EAE5E9] text-xs">
            <h3 className="font-heading font-bold text-sm text-[#242124] mb-2">Settlement Bank Account</h3>
            <p className="text-[#716B71]">Access Bank Nigeria · 0128994821 (Terra Kulture Hospitality Ltd)</p>
          </div>
        </div>
      )}

      {/* TAB 4: Onboarding Verification Status */}
      {activeTab === 'onboarding' && (
        <div className="p-6 rounded-3xl bg-white border border-[#EAE5E9] space-y-4 max-w-xl text-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-[#EAE5E9]">
            <ShieldCheck className="w-6 h-6 text-[#287A55]" />
            <div>
              <h2 className="font-heading font-bold text-base text-[#242124]">CAC & Hygiene Verification</h2>
              <p className="text-xs text-[#716B71]">Official Chopwize Partner Verification Status</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F4] border border-[#EAE5E9]">
              <div>
                <p className="font-bold text-[#242124]">Corporate Affairs Commission (CAC)</p>
                <p className="text-[11px] text-[#716B71]">RC-849201 · Verified Active</p>
              </div>
              <span className="text-[10px] font-bold text-[#287A55] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F4] border border-[#EAE5E9]">
              <div>
                <p className="font-bold text-[#242124]">Lagos State Food Hygiene Inspection</p>
                <p className="text-[11px] text-[#716B71]">Grade A Kitchen · Inspected October 2026</p>
              </div>
              <span className="text-[10px] font-bold text-[#287A55] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Grade A
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Accept Prep Time */}
      {prepTimeModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#EAE5E9]">
            <h3 className="font-heading font-bold text-base text-[#242124] mb-1">
              Estimate Prep Time for #{prepTimeModalOrder.orderNumber}
            </h3>
            <p className="text-xs text-[#716B71] mb-4">
              Rider dispatch schedule is calculated based on this estimate.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[15, 25, 40].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleAcceptOrder(prepTimeModalOrder, mins)}
                  className="py-3 rounded-xl border border-[#30102F] bg-[#FAF3F9] text-[#30102F] text-xs font-bold hover:bg-[#30102F] hover:text-white transition-colors"
                >
                  {mins} mins
                </button>
              ))}
            </div>

            <button
              onClick={() => setPrepTimeModalOrder(null)}
              className="w-full py-2 text-xs text-[#716B71] hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modal: Reject Reason */}
      {rejectOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#EAE5E9]">
            <h3 className="font-heading font-bold text-base text-[#242124] mb-2">
              Reason for rejecting order
            </h3>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] text-xs bg-[#FAF8F4]"
            >
              <option value="Kitchen overwhelmed with orders">Kitchen overwhelmed with orders</option>
              <option value="Ingredient out of stock">Ingredient out of stock</option>
              <option value="Near closing hours">Near closing hours</option>
            </select>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setRejectOrderId(null)}
                className="w-1/2 py-2 rounded-xl border border-[#EAE5E9] text-xs font-semibold text-[#716B71]"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectOrder}
                className="w-1/2 py-2 rounded-xl bg-red-700 text-white text-xs font-bold"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Verify Rider Pickup PIN */}
      {verifyingPickupOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#EAE5E9]">
            <h3 className="font-heading font-bold text-base text-[#242124] mb-1">
              Verify Rider Pickup Code
            </h3>
            <p className="text-xs text-[#716B71] mb-4">
              Ask rider for the 4-digit verification PIN displayed on their app:
            </p>

            <input
              type="text"
              maxLength={4}
              placeholder="e.g. 4921"
              value={pickupCodeInput}
              onChange={(e) => setPickupCodeInput(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#EAE5E9] font-mono text-center text-lg font-bold tracking-widest bg-[#FAF8F4] mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setVerifyingPickupOrderId(null)}
                className="w-1/3 py-2 rounded-xl border border-[#EAE5E9] text-xs font-semibold text-[#716B71]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const ord = orders.find((o) => o.id === verifyingPickupOrderId);
                  if (ord) handleVerifyRiderPickup(ord);
                }}
                className="w-2/3 py-2 rounded-xl bg-[#30102F] text-white text-xs font-bold"
              >
                Confirm Handoff
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
