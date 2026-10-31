import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Store,
  ShieldCheck,
  CreditCard,
  Building2,
  Wallet,
  Banknote,
  CheckCircle2,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartRestaurant,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartServiceFee,
    cartTotal,
    selectedLocation,
    placeOrder,
  } = useApp();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [fulfilmentType, setFulfilmentType] = useState<'delivery' | 'pickup'>('delivery');
  const [contactName, setContactName] = useState('Amina Bello');
  const [contactPhone, setContactPhone] = useState('+234 803 555 1290');
  const [deliveryAddress, setDeliveryAddress] = useState(selectedLocation);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'paystack_card' | 'bank_transfer' | 'chopwize_wallet' | 'cash_on_delivery'
  >('paystack_card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (!isCartOpen) return null;

  const currentDeliveryFee = fulfilmentType === 'delivery' ? cartDeliveryFee : 0;
  const grandTotal = cartSubtotal + currentDeliveryFee + cartServiceFee;

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    // Realistic payment verification simulation (1.2s delay)
    setTimeout(() => {
      placeOrder({
        fulfilmentType,
        deliveryAddress: fulfilmentType === 'delivery' ? deliveryAddress : (cartRestaurant?.address || 'Pickup at Restaurant Counter'),
        contactName,
        contactPhone,
        paymentMethod,
        notes: deliveryNotes,
      });
      setIsProcessingPayment(false);
      setIsCheckingOut(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-labelledby="cart-drawer-title"
      >
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE5E9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#30102F]" />
            <h2 id="cart-drawer-title" className="font-heading font-bold text-lg text-[#242124]">
              {isCheckingOut ? 'Checkout & Pay' : 'Your Food Tray'}
            </h2>
            {cart.length > 0 && !isCheckingOut && (
              <span className="text-xs font-semibold text-[#716B71]">
                ({cart.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setIsCheckingOut(false);
            }}
            className="p-2 text-[#716B71] hover:text-[#242124] rounded-lg hover:bg-[#FAF8F4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center text-[#716B71]">
              <ShoppingBag className="w-12 h-12 mx-auto text-[#CBB477] mb-3 opacity-60" />
              <h3 className="font-heading font-bold text-base text-[#242124]">Your tray is empty</h3>
              <p className="text-xs mt-1 max-w-xs mx-auto">
                Explore popular dishes from verified restaurants around you.
              </p>
            </div>
          ) : !isCheckingOut ? (
            /* Standard Tray Review */
            <div className="space-y-4">
              {/* Restaurant indicator */}
              <div className="p-3 rounded-xl bg-[#FAF3F9] border border-[#30102F]/15 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Store className="w-4 h-4 text-[#30102F] shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#242124] truncate">{cartRestaurant?.name}</p>
                    <p className="text-[10px] text-[#716B71] truncate">{cartRestaurant?.area}</p>
                  </div>
                </div>
                <button
                  onClick={clearCart}
                  className="text-[11px] text-red-600 hover:underline shrink-0"
                >
                  Clear Tray
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 rounded-xl border border-[#EAE5E9] bg-white flex gap-3 shadow-xs"
                  >
                    <img
                      src={item.menuItem.imageUrl}
                      alt={item.menuItem.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover bg-[#FAF8F4] shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-heading font-bold text-xs text-[#242124] truncate">
                            {item.menuItem.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-[#716B71] hover:text-red-600 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.selectedPortion && (
                          <p className="text-[11px] text-[#716B71]">
                            Portion: {item.selectedPortion.name}
                          </p>
                        )}
                        {item.selectedAddOns.length > 0 && (
                          <p className="text-[10px] text-[#716B71]">
                            Add-ons: {item.selectedAddOns.map((a) => a.name).join(', ')}
                          </p>
                        )}
                        {item.specialInstructions && (
                          <p className="text-[10px] italic text-[#242124]/70">
                            Note: "{item.specialInstructions}"
                          </p>
                        )}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#30102F] tabular-nums">
                          ₦{item.lineTotal.toLocaleString()}
                        </span>

                        {/* Stepper */}
                        <div className="flex items-center gap-2 bg-[#FAF8F4] rounded-lg border border-[#EAE5E9] px-2 py-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, -1)}
                            className="text-[#716B71] hover:text-[#242124]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#242124] tabular-nums min-w-[12px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, 1)}
                            className="text-[#716B71] hover:text-[#242124]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#EAE5E9] space-y-2 text-xs">
                <div className="flex justify-between text-[#716B71]">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-[#242124] tabular-nums">
                    ₦{cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#716B71]">
                  <span>Estimated Delivery Fee</span>
                  <span className="font-semibold text-[#242124] tabular-nums">
                    ₦{cartDeliveryFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#716B71]">
                  <span>Platform Service Fee</span>
                  <span className="font-semibold text-[#242124] tabular-nums">
                    ₦{cartServiceFee.toLocaleString()}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#EAE5E9] flex justify-between font-bold text-sm text-[#30102F]">
                  <span>Estimated Total</span>
                  <span className="tabular-nums">₦{cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form id="checkout-form" onSubmit={handleExecutePayment} className="space-y-4 text-xs">
              {/* Fulfilment Toggle */}
              <div>
                <label className="block font-bold text-[#242124] mb-1.5">
                  Fulfilment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFulfilmentType('delivery')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-colors ${
                      fulfilmentType === 'delivery'
                        ? 'border-[#30102F] bg-[#FAF3F9] text-[#30102F]'
                        : 'border-[#EAE5E9] bg-white text-[#716B71]'
                    }`}
                  >
                    Rider Delivery (+₦{cartDeliveryFee.toLocaleString()})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFulfilmentType('pickup')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-colors ${
                      fulfilmentType === 'pickup'
                        ? 'border-[#30102F] bg-[#FAF3F9] text-[#30102F]'
                        : 'border-[#EAE5E9] bg-white text-[#716B71]'
                    }`}
                  >
                    Self Pickup (₦0 Free)
                  </button>
                </div>
              </div>

              {/* Delivery / Pickup address */}
              {fulfilmentType === 'delivery' ? (
                <div>
                  <label className="block font-bold text-[#242124] mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] bg-[#FAF8F4] focus:outline-none focus:ring-2 focus:ring-[#30102F]"
                  />
                  <input
                    type="text"
                    placeholder="Apartment, flat, gate code, or delivery instructions"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 rounded-xl border border-[#EAE5E9] bg-white focus:outline-none focus:ring-2 focus:ring-[#30102F]"
                  />
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#EAE5E9]">
                  <p className="font-bold text-[#242124]">Collection Counter:</p>
                  <p className="text-[#716B71] mt-0.5">{cartRestaurant?.address}</p>
                  <p className="text-[10px] text-[#287A55] font-semibold mt-1">
                    Ready in 20–30 mins. Present your Order Code at the pickup desk.
                  </p>
                </div>
              )}

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#242124] mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] bg-[#FAF8F4] focus:outline-none focus:ring-2 focus:ring-[#30102F]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#242124] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] bg-[#FAF8F4] focus:outline-none focus:ring-2 focus:ring-[#30102F]"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-[#242124]">
                    Select Payment Method
                  </label>
                  <span className="text-[10px] text-[#9A6A18] font-bold bg-[#FDFBF7] px-1.5 py-0.5 rounded border border-[#CBB477]/30">
                    Simulated Demo Gateway
                  </span>
                </div>

                <div className="space-y-1.5">
                  {[
                    { id: 'paystack_card', name: 'Paystack Card / Apple Pay', icon: CreditCard, subtitle: 'Instant online authorization' },
                    { id: 'bank_transfer', name: 'Instant Bank Transfer', icon: Building2, subtitle: 'Direct Nigerian bank transfer' },
                    { id: 'chopwize_wallet', name: 'Chopwize Wallet', icon: Wallet, subtitle: 'Balance: ₦45,000' },
                    { id: 'cash_on_delivery', name: 'Pay on Delivery / Pickup', icon: Banknote, subtitle: 'Cash or POS on handoff' }
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-colors ${
                          isSelected
                            ? 'border-[#30102F] bg-[#FAF3F9]'
                            : 'border-[#EAE5E9] bg-white hover:bg-[#FAF8F4]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#30102F]' : 'text-[#716B71]'}`} />
                          <div>
                            <p className={`font-semibold ${isSelected ? 'text-[#30102F]' : 'text-[#242124]'}`}>
                              {method.name}
                            </p>
                            <p className="text-[10px] text-[#716B71]">{method.subtitle}</p>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#30102F]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Final itemized check */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F4] border border-[#EAE5E9] space-y-1.5">
                <div className="flex justify-between text-[#716B71]">
                  <span>Subtotal</span>
                  <span className="tabular-nums">₦{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#716B71]">
                  <span>Delivery ({fulfilmentType})</span>
                  <span className="tabular-nums">₦{currentDeliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#716B71]">
                  <span>Platform Fee</span>
                  <span className="tabular-nums">₦{cartServiceFee.toLocaleString()}</span>
                </div>
                <div className="pt-1.5 border-t border-[#EAE5E9] flex justify-between font-bold text-sm text-[#30102F]">
                  <span>Final Payment</span>
                  <span className="tabular-nums">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Bottom Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#EAE5E9] bg-white">
            {!isCheckingOut ? (
              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3.5 px-4 rounded-xl bg-[#30102F] hover:bg-[#220b22] text-white text-xs font-bold flex items-center justify-between transition-colors shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <div className="flex items-center gap-1.5">
                  <span className="tabular-nums">₦{cartTotal.toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4 text-[#CBB477]" />
                </div>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  disabled={isProcessingPayment}
                  className="w-1/3 py-3 px-3 rounded-xl border border-[#EAE5E9] text-xs font-semibold text-[#716B71] hover:bg-[#FAF8F4]"
                >
                  Edit Tray
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isProcessingPayment}
                  className="w-2/3 py-3 px-4 rounded-xl bg-[#30102F] hover:bg-[#220b22] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing...</span>
                    </div>
                  ) : (
                    <span>Confirm & Pay ₦{grandTotal.toLocaleString()}</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
