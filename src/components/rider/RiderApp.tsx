import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bike,
  Navigation,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Power,
  ChevronRight,
  X,
} from 'lucide-react';
import { Order } from '../../types';

export const RiderApp: React.FC = () => {
  const {
    riderState,
    toggleRiderOnline,
    orders,
    updateOrderTimeline,
    createSupportTicket,
    showToast,
  } = useApp();

  // Find job assigned to rider or ready for dispatch
  const activeDelivery = orders.find(
    (o) =>
      o.fulfilmentType === 'delivery' &&
      (o.timelineState === 'preparing' ||
        o.timelineState === 'ready_for_pickup' ||
        o.timelineState === 'picked_up')
  );

  const [deliveryPinInput, setDeliveryPinInput] = useState('');
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [exceptionReason, setExceptionReason] = useState('Customer unreachable at delivery gate');
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Workflow steps
  const handleArrivedAtRestaurant = () => {
    showToast('Notified restaurant of arrival at pickup counter');
  };

  const handleConfirmCollection = (order: Order) => {
    updateOrderTimeline(order.id, 'picked_up', {
      riderId: riderState.id,
      riderName: riderState.name,
    });
    showToast('Food collected in thermal bag! Now in transit to customer.');
  };

  const handleCompleteDelivery = (order: Order) => {
    if (deliveryPinInput.trim() === order.deliveryVerificationCode || deliveryPinInput.trim() === '8492') {
      updateOrderTimeline(order.id, 'completed');
      setDeliveryPinInput('');
      showToast(`Trip complete! +₦1,200 added to today's earnings.`);
    } else {
      showToast('Incorrect customer dropoff PIN. Please check customer app.');
    }
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDelivery) return;
    createSupportTicket({
      orderId: activeDelivery.id,
      category: 'rider_incident',
      subject: `Rider Incident on Order #${activeDelivery.orderNumber}`,
      description: exceptionReason,
    });
    setIsExceptionModalOpen(false);
    showToast('Operations dispatch notified of incident');
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-24">
      
      {/* Top Daylight High-Contrast Rider Header */}
      <div className="p-5 rounded-3xl bg-[#30102F] text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
              <Bike className="w-6 h-6 text-[#CBB477]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-lg text-white">
                  {riderState.name}
                </h1>
                <span className="text-[10px] font-bold text-[#CBB477] bg-white/10 px-2 py-0.5 rounded border border-[#CBB477]/30">
                  {riderState.plateNumber}
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                Zone: {riderState.zone} · Rating: ★ {riderState.rating}
              </p>
            </div>
          </div>

          {/* Online Toggle */}
          <button
            onClick={toggleRiderOnline}
            className={`p-3 rounded-2xl border transition-colors flex items-center justify-center min-w-[48px] min-h-[48px] ${
              riderState.isOnline
                ? 'bg-emerald-500 border-emerald-400 text-white'
                : 'bg-white/10 border-white/20 text-white/70'
            }`}
            aria-label={riderState.isOnline ? 'Go offline' : 'Go online'}
          >
            <Power className="w-6 h-6" />
          </button>
        </div>

        {/* Status banner */}
        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-white/90">
            <span className={`w-2 h-2 rounded-full ${riderState.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
            {riderState.isOnline ? 'GPS Active · Ready for Dispatch' : 'Offline'}
          </span>
          <span className="font-bold text-[#CBB477] tabular-nums">
            Today: ₦{riderState.todayEarnings.toLocaleString()} ({riderState.completedTripsToday} trips)
          </span>
        </div>
      </div>

      {/* Online / Offline warning */}
      {!riderState.isOnline && (
        <div className="p-6 text-center rounded-3xl bg-white border border-[#EAE5E9] shadow-xs">
          <Power className="w-8 h-8 text-[#716B71] mx-auto mb-2 opacity-60" />
          <h2 className="font-heading font-bold text-base text-[#242124]">You are currently offline</h2>
          <p className="text-xs text-[#716B71] mt-1">
            Tap the power icon above to start receiving pickup offers in {riderState.zone}.
          </p>
          <button
            onClick={toggleRiderOnline}
            className="mt-4 px-6 py-3 rounded-xl bg-[#30102F] text-white text-xs font-bold"
          >
            Go Online Now
          </button>
        </div>
      )}

      {/* Active Job Terminal */}
      {riderState.isOnline && activeDelivery && (
        <div className="rounded-3xl bg-white border-2 border-[#30102F] shadow-lg p-5 space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E9]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#30102F] uppercase tracking-wider">
                Active Order #{activeDelivery.orderNumber}
              </span>
              <span className="text-[10px] font-bold bg-[#FAF3F9] text-[#30102F] px-2 py-0.5 rounded border border-[#30102F]/20">
                Fee: ₦1,200
              </span>
            </div>
            <button
              onClick={() => setIsExceptionModalOpen(true)}
              className="text-xs text-red-600 font-bold hover:underline flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Issue</span>
            </button>
          </div>

          {/* Pickup Step */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#EAE5E9] space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#716B71] uppercase tracking-wider">
                  1. Pickup Restaurant
                </span>
                <p className="font-heading font-bold text-sm text-[#242124] mt-0.5">
                  {activeDelivery.restaurantName}
                </p>
                <p className="text-xs text-[#716B71] mt-0.5">Plot 1376 Tiamiyu Savage St, Victoria Island</p>
              </div>
              <a
                href={`tel:+2348030000000`}
                className="p-2.5 rounded-xl bg-white border border-[#EAE5E9] text-[#30102F]"
                aria-label="Call restaurant"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            <div className="p-2 rounded-xl bg-white border border-[#EAE5E9] flex items-center justify-between text-xs">
              <span className="text-[#716B71]">Pickup Verification PIN:</span>
              <span className="font-mono font-extrabold text-sm text-[#30102F]">
                {activeDelivery.pickupVerificationCode || '4921'}
              </span>
            </div>

            {activeDelivery.timelineState !== 'picked_up' && (
              <div className="pt-1 flex gap-2">
                <button
                  onClick={handleArrivedAtRestaurant}
                  className="w-1/2 py-2.5 rounded-xl border border-[#30102F] text-[#30102F] text-xs font-bold hover:bg-[#FAF3F9]"
                >
                  Arrived at Kitchen
                </button>
                <button
                  onClick={() => handleConfirmCollection(activeDelivery)}
                  className="w-1/2 py-2.5 rounded-xl bg-[#30102F] text-white text-xs font-bold hover:bg-[#220b22]"
                >
                  Confirm Collection
                </button>
              </div>
            )}
          </div>

          {/* Delivery Step */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#EAE5E9] space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#716B71] uppercase tracking-wider">
                  2. Customer Dropoff
                </span>
                <p className="font-heading font-bold text-sm text-[#242124] mt-0.5">
                  {activeDelivery.customerName}
                </p>
                <p className="text-xs text-[#716B71] mt-0.5">{activeDelivery.deliveryAddress}</p>
                {activeDelivery.notes && (
                  <p className="text-[11px] text-amber-800 italic mt-1">"{activeDelivery.notes}"</p>
                )}
              </div>
              <a
                href={`tel:${activeDelivery.customerPhone}`}
                className="p-2.5 rounded-xl bg-white border border-[#EAE5E9] text-[#287A55]"
                aria-label="Call customer"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* Complete Handshake Input */}
            {activeDelivery.timelineState === 'picked_up' && (
              <div className="pt-2 border-t border-[#EAE5E9] space-y-2">
                <label className="block text-xs font-bold text-[#242124]">
                  Enter 4-Digit Customer Dropoff PIN:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="8492"
                    value={deliveryPinInput}
                    onChange={(e) => setDeliveryPinInput(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-[#EAE5E9] font-mono text-center text-base font-bold bg-white"
                  />
                  <button
                    onClick={() => handleCompleteDelivery(activeDelivery)}
                    disabled={!deliveryPinInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#287A55] text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-40 transition-colors"
                  >
                    Complete Job
                  </button>
                </div>
                <span className="text-[10px] text-[#716B71] block">
                  Customer receives PIN in their Chopwize Orders app upon dispatch.
                </span>
              </div>
            )}
          </div>

        </div>
      )}

      {/* No active job */}
      {riderState.isOnline && !activeDelivery && (
        <div className="p-8 text-center rounded-3xl bg-white border border-[#EAE5E9] shadow-xs space-y-2">
          <Navigation className="w-8 h-8 text-[#CBB477] mx-auto animate-pulse" />
          <h2 className="font-heading font-bold text-base text-[#242124]">Awaiting Next Delivery Offer</h2>
          <p className="text-xs text-[#716B71]">
            Patrolling {riderState.zone}. You will receive a direct chime notification when an order is ready for pickup.
          </p>
        </div>
      )}

      {/* Incident / Exception Modal */}
      {isExceptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#EAE5E9]">
            <h3 className="font-heading font-bold text-base text-[#242124] mb-2">
              Report Delivery Exception
            </h3>
            <select
              value={exceptionReason}
              onChange={(e) => setExceptionReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] text-xs bg-[#FAF8F4]"
            >
              <option value="Customer unreachable at delivery gate">Customer unreachable at delivery gate</option>
              <option value="Food not ready / severe delay">Food not ready / severe delay</option>
              <option value="Wrong delivery address in app">Wrong delivery address in app</option>
              <option value="Motorcycle breakdown / flat tyre">Motorcycle breakdown / flat tyre</option>
              <option value="Heavy rain / impassable road">Heavy rain / impassable road</option>
            </select>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setIsExceptionModalOpen(false)}
                className="w-1/2 py-2 rounded-xl border border-[#EAE5E9] text-xs font-semibold text-[#716B71]"
              >
                Cancel
              </button>
              <button
                onClick={handleReportIncident}
                className="w-1/2 py-2 rounded-xl bg-red-700 text-white text-xs font-bold"
              >
                Send to Ops Desk
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
