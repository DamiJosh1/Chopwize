import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  Clock,
  Bike,
  Store,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  MessageCircle,
  Star,
  MapPin,
  ShieldCheck,
  AlertCircle,
  X,
} from 'lucide-react';
import { Order, OrderTimelineState } from '../../types';

export const OrdersView: React.FC = () => {
  const {
    orders,
    reorder,
    submitOrderRating,
    createSupportTicket,
    showToast,
    setCustomerTab,
  } = useApp();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingRest, setRatingRest] = useState(5);
  const [ratingRider, setRatingRider] = useState(5);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportCategory, setSupportCategory] = useState('delivery_issue');
  const [supportDescription, setSupportDescription] = useState('');

  const activeOrders = orders.filter(
    (o) => o.timelineState !== 'completed' && o.timelineState !== 'cancelled'
  );
  const pastOrders = orders.filter(
    (o) => o.timelineState === 'completed' || o.timelineState === 'cancelled'
  );

  const timelineSteps: { key: OrderTimelineState; label: string; desc: string }[] = [
    { key: 'paid', label: 'Order Submitted', desc: 'Payment authorized & dispatched to kitchen' },
    { key: 'restaurant_accepted', label: 'Kitchen Accepted', desc: 'Chef confirmed order and preparation time' },
    { key: 'preparing', label: 'Preparing Meal', desc: 'Dishes simmering fresh with native seasoning' },
    { key: 'ready_for_pickup', label: 'Ready for Pickup', desc: 'Sealed & bagged for rider handoff' },
    { key: 'rider_assigned', label: 'Rider Assigned', desc: 'Chopwize partner rider en route to restaurant' },
    { key: 'picked_up', label: 'Picked Up & In Transit', desc: 'Rider is on the way to your delivery address' },
    { key: 'completed', label: 'Delivered / Completed', desc: 'Safely delivered to customer' },
  ];

  const getStepStatus = (stepKey: OrderTimelineState, currentTimeline: OrderTimelineState) => {
    const orderIndex = timelineSteps.findIndex((s) => s.key === currentTimeline);
    const thisIndex = timelineSteps.findIndex((s) => s.key === stepKey);
    if (thisIndex < orderIndex) return 'completed';
    if (thisIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  const handleRatingSubmit = () => {
    if (selectedOrder) {
      submitOrderRating(selectedOrder.id, ratingRest, ratingRider);
      setIsRatingModalOpen(false);
    }
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportDescription.trim() || !selectedOrder) return;
    createSupportTicket({
      orderId: selectedOrder.id,
      category: supportCategory,
      subject: `Order #${selectedOrder.orderNumber} inquiry`,
      description: supportDescription.trim(),
    });
    setIsSupportModalOpen(false);
    setSupportDescription('');
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Page Header */}
      <div>
        <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#242124]">
          My Orders & Live Timeline
        </h1>
        <p className="text-xs text-[#716B71] mt-0.5">
          Real-time updates confirmed directly by restaurant kitchens and riders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-[#EAE5E9]">
          <Receipt className="w-12 h-12 mx-auto text-[#CBB477] mb-3 opacity-60" />
          <h2 className="font-heading font-bold text-base text-[#242124]">No orders placed yet</h2>
          <p className="text-xs text-[#716B71] mt-1 max-w-sm mx-auto">
            Discover verified Nigerian restaurants in your area and enjoy hot meals.
          </p>
          <button
            onClick={() => setCustomerTab('explore')}
            className="mt-4 px-4 py-2 rounded-xl bg-[#30102F] text-white text-xs font-semibold"
          >
            Explore Menu Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Orders Selector List */}
          <div className="lg:col-span-5 space-y-4">
            {/* Active Orders Section */}
            {activeOrders.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#30102F] mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#287A55]" />
                  Active In-Progress Orders ({activeOrders.length})
                </h2>
                <div className="space-y-2.5">
                  {activeOrders.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#30102F] bg-white shadow-sm ring-1 ring-[#30102F]'
                            : 'border-[#EAE5E9] bg-white hover:border-[#30102F]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-heading font-bold text-sm text-[#242124]">
                            Order #{order.orderNumber}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF3F9] text-[#30102F] border border-[#30102F]/20">
                            {order.timelineState.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#716B71]">{order.restaurantName}</p>
                        <div className="mt-2 pt-2 border-t border-[#EAE5E9] flex items-center justify-between text-xs">
                          <span className="text-[#716B71]">{order.placedAt}</span>
                          <span className="font-bold text-[#30102F] tabular-nums">₦{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past Orders Section */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#716B71] mb-2">
                Order History ({pastOrders.length})
              </h2>
              <div className="space-y-2.5">
                {pastOrders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#30102F] bg-white shadow-sm ring-1 ring-[#30102F]'
                          : 'border-[#EAE5E9] bg-white hover:border-[#30102F]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-heading font-bold text-sm text-[#242124]">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-[10px] font-bold text-[#287A55] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Completed
                        </span>
                      </div>
                      <p className="text-xs text-[#716B71]">{order.restaurantName}</p>
                      <div className="mt-2 pt-2 border-t border-[#EAE5E9] flex items-center justify-between text-xs">
                        <span className="text-[#716B71]">{order.placedAt}</span>
                        <span className="font-bold text-[#30102F] tabular-nums">₦{order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Order Detail & Timeline */}
          {selectedOrder && (
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EAE5E9] p-5 sm:p-6 shadow-xs space-y-6">
              
              {/* Top Summary Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAE5E9]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading font-extrabold text-lg text-[#242124]">
                      Order #{selectedOrder.orderNumber}
                    </h2>
                    <span className="text-[10px] font-bold bg-[#FAF3F9] text-[#30102F] px-2 py-0.5 rounded-md border border-[#30102F]/20">
                      Paid · {selectedOrder.fulfilmentType.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-[#716B71] mt-0.5">
                    Placed at {selectedOrder.restaurantName} · {selectedOrder.placedAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => reorder(selectedOrder)}
                    className="px-3 py-1.5 rounded-xl border border-[#EAE5E9] hover:bg-[#FAF8F4] text-xs font-semibold text-[#242124] flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#716B71]" />
                    <span>Reorder</span>
                  </button>
                  <button
                    onClick={() => setIsSupportModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl border border-[#EAE5E9] hover:bg-[#FAF8F4] text-xs font-semibold text-[#716B71] flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Get Help</span>
                  </button>
                </div>
              </div>

              {/* Live Timeline Display */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-bold text-sm text-[#242124]">
                    Fulfillment Progress
                  </h3>
                  <span className="text-[10px] text-[#716B71]">
                    Server-confirmed status
                  </span>
                </div>

                <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#EAE5E9]">
                  {timelineSteps.map((step) => {
                    const status = getStepStatus(step.key, selectedOrder.timelineState);
                    return (
                      <div key={step.key} className="relative flex items-start gap-4 pl-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                            status === 'completed'
                              ? 'bg-[#287A55] text-white'
                              : status === 'current'
                              ? 'bg-[#30102F] text-white ring-4 ring-[#30102F]/15'
                              : 'bg-white border-2 border-[#EAE5E9] text-[#716B71]'
                          }`}
                        >
                          {status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-current" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-bold ${
                              status === 'current'
                                ? 'text-[#30102F]'
                                : status === 'completed'
                                ? 'text-[#242124]'
                                : 'text-[#716B71]'
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[11px] text-[#716B71] mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rider & Pickup Verification Details */}
              {selectedOrder.fulfilmentType === 'delivery' && selectedOrder.riderName && (
                <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EAE5E9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#30102F] text-white flex items-center justify-center">
                      <Bike className="w-5 h-5 text-[#CBB477]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#242124]">
                        Assigned Rider: {selectedOrder.riderName}
                      </p>
                      <p className="text-[11px] text-[#716B71]">
                        Phone: {selectedOrder.riderPhone || '+234 812 888 4123'}
                      </p>
                    </div>
                  </div>

                  {selectedOrder.deliveryVerificationCode && (
                    <div className="text-right">
                      <span className="text-[10px] text-[#716B71] block">
                        Share with rider on arrival:
                      </span>
                      <span className="font-mono font-extrabold text-sm text-[#30102F] bg-white px-2 py-0.5 rounded border border-[#EAE5E9]">
                        PIN: {selectedOrder.deliveryVerificationCode}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Delivery Address */}
              <div className="p-3.5 rounded-xl border border-[#EAE5E9] bg-white text-xs flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#30102F] shrink-0" />
                <div className="truncate">
                  <span className="font-semibold text-[#242124]">Destination: </span>
                  <span className="text-[#716B71]">{selectedOrder.deliveryAddress}</span>
                </div>
              </div>

              {/* Itemized Receipt */}
              <div>
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#716B71] mb-2">
                  Itemized Order Receipt
                </h3>
                <div className="space-y-2 border-b border-[#EAE5E9] pb-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.cartItemId} className="flex justify-between text-xs">
                      <div>
                        <span className="font-semibold text-[#242124]">
                          {item.quantity}× {item.menuItem.name}
                        </span>
                        {item.selectedPortion && (
                          <span className="text-[11px] text-[#716B71] ml-1">
                            ({item.selectedPortion.name})
                          </span>
                        )}
                        {item.selectedProtein && (
                          <p className="text-[10px] text-[#30102F] font-medium">
                            Protein: {item.selectedProtein.name}
                          </p>
                        )}
                        {item.selectedAddOns.length > 0 && (
                          <p className="text-[10px] text-[#716B71]">
                            + {item.selectedAddOns.map((a) => a.name).join(', ')}
                          </p>
                        )}
                        {item.removedIngredients && item.removedIngredients.length > 0 && (
                          <p className="text-[10px] text-red-600">
                            Omit: {item.removedIngredients.map((i) => `No ${i}`).join(', ')}
                          </p>
                        )}
                        {item.specialInstructions && (
                          <p className="text-[10px] italic text-[#242124]/70">
                            Note: "{item.specialInstructions}"
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-[#242124] tabular-nums">
                        ₦{item.lineTotal.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Total */}
                <div className="pt-3 space-y-1 text-xs text-[#716B71]">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="tabular-nums">₦{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="tabular-nums">₦{selectedOrder.deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span className="tabular-nums">₦{selectedOrder.serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-[#EAE5E9] flex justify-between font-extrabold text-sm text-[#30102F]">
                    <span>Total Paid</span>
                    <span className="tabular-nums">₦{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Rate & Review Button for Completed Orders */}
              {selectedOrder.timelineState === 'completed' && (
                <div className="pt-2">
                  <button
                    onClick={() => setIsRatingModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-[#FAF3F9] hover:bg-[#30102F] text-[#30102F] hover:text-white border border-[#30102F]/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Star className="w-4 h-4 text-[#CBB477]" />
                    <span>Rate Kitchen & Rider</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* Rating Modal */}
      {isRatingModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#EAE5E9]">
            <h3 className="font-heading font-bold text-base text-[#242124] mb-1">
              Rate Order #{selectedOrder.orderNumber}
            </h3>
            <p className="text-xs text-[#716B71] mb-4">
              Help us maintain food quality and reliable delivery.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#242124] mb-1">
                  Food Quality ({selectedOrder.restaurantName}):
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatingRest(star)}
                      className="p-1 text-[#CBB477]"
                    >
                      <Star className={`w-6 h-6 ${star <= ratingRest ? 'fill-[#CBB477]' : 'text-[#EAE5E9]'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242124] mb-1">
                  Rider Delivery Experience:
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatingRider(star)}
                      className="p-1 text-[#CBB477]"
                    >
                      <Star className={`w-6 h-6 ${star <= ratingRider ? 'fill-[#CBB477]' : 'text-[#EAE5E9]'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setIsRatingModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-[#EAE5E9] text-xs font-semibold text-[#716B71]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRatingSubmit}
                  className="w-1/2 py-2.5 rounded-xl bg-[#30102F] text-white text-xs font-bold"
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Case Modal */}
      {isSupportModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#EAE5E9]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E9] mb-4">
              <h3 className="font-heading font-bold text-base text-[#242124]">
                Report Issue on #{selectedOrder.orderNumber}
              </h3>
              <button onClick={() => setIsSupportModalOpen(false)}>
                <X className="w-4 h-4 text-[#716B71]" />
              </button>
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#242124] mb-1">
                  Issue Category
                </label>
                <select
                  value={supportCategory}
                  onChange={(e) => setSupportCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] bg-white text-[#242124]"
                >
                  <option value="delivery_delay">Delivery delay or rider issue</option>
                  <option value="missing_item">Missing or wrong menu item</option>
                  <option value="food_packaging">Food spilled or poor packaging</option>
                  <option value="payment_dispute">Payment or charge inquiry</option>
                  <option value="other">Other question</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#242124] mb-1">
                  Explain what happened:
                </label>
                <textarea
                  rows={3}
                  required
                  value={supportDescription}
                  onChange={(e) => setSupportDescription(e.target.value)}
                  placeholder="Provide details so our operations desk can assist immediately..."
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] bg-[#FAF8F4] resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsSupportModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-[#EAE5E9] text-xs font-semibold text-[#716B71]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-[#30102F] text-white text-xs font-bold"
                >
                  Open Support Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
