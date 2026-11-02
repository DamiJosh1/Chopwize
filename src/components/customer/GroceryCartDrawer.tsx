import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingCart,
  X,
  Trash2,
  Plus,
  Minus,
  Store,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Truck,
} from 'lucide-react';

export const GroceryCartDrawer: React.FC = () => {
  const {
    isGroceryCartOpen,
    setIsGroceryCartOpen,
    groceryCart,
    updateGroceryQuantity,
    removeGroceryItem,
    clearGroceryCart,
    grocerySubtotal,
    groceryConsolidations,
    selectedGroceryStoreId,
    setSelectedGroceryStoreId,
    selectedLocation,
    checkoutGroceryOrder,
  } = useApp();

  const [fulfilment, setFulfilment] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState(selectedLocation);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isGroceryCartOpen) return null;

  const currentConsolidation = groceryConsolidations.find((c) => c.storeId === selectedGroceryStoreId) || groceryConsolidations[0];
  const deliveryFee = fulfilment === 'delivery' ? (currentConsolidation?.deliveryFee || 1100) : 0;
  const finalTotal = (currentConsolidation?.subtotal || grocerySubtotal) + deliveryFee + 250;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      checkoutGroceryOrder(fulfilment, address);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-labelledby="grocery-drawer-title"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE5E9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#287A55]" />
            <h2 id="grocery-drawer-title" className="font-heading font-bold text-lg text-[#242124]">
              Chopwize Market Basket
            </h2>
            {groceryCart.length > 0 && (
              <span className="text-xs font-semibold text-[#716B71]">
                ({groceryCart.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
            )}
          </div>
          <button
            onClick={() => setIsGroceryCartOpen(false)}
            className="p-2 text-[#716B71] hover:text-[#242124] rounded-lg hover:bg-[#FAF8F4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {groceryCart.length === 0 ? (
            <div className="py-16 text-center text-[#716B71]">
              <ShoppingCart className="w-12 h-12 mx-auto text-[#CBB477] mb-3 opacity-60" />
              <h3 className="font-heading font-bold text-base text-[#242124]">Your grocery basket is empty</h3>
              <p className="text-xs mt-1 max-w-xs mx-auto">
                Stock up on shelf-stable noodles, rice, beans, tomato paste, cooking oils and pantry staples.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#716B71]">
                    Pantry Items ({groceryCart.length})
                  </span>
                  <button
                    onClick={clearGroceryCart}
                    className="text-[11px] text-red-600 hover:underline"
                  >
                    Clear Basket
                  </button>
                </div>

                {groceryCart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-[#EAE5E9] bg-white flex gap-3 shadow-xs"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover bg-[#FAF8F4] shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-heading font-bold text-xs text-[#242124] truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeGroceryItem(item.id)}
                            className="text-[#716B71] hover:text-red-600 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-[#716B71]">
                          Unit: <strong className="text-[#242124]">{item.selectedUnit}</strong> ({item.product.brand})
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#287A55] tabular-nums">
                          ₦{item.lineTotal.toLocaleString()}
                        </span>

                        <div className="flex items-center gap-2 bg-[#FAF8F4] rounded-lg border border-[#EAE5E9] px-2 py-0.5">
                          <button
                            onClick={() => updateGroceryQuantity(item.id, -1)}
                            className="text-[#716B71] hover:text-[#242124]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#242124] tabular-nums min-w-[12px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateGroceryQuantity(item.id, 1)}
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

              {/* STORE CONSOLIDATION LOGIC (Section 10 Requirement) */}
              <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EAE5E9] space-y-3">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#287A55]" />
                  <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#242124]">
                    Store Consolidation & Single-Trip Dispatch
                  </h3>
                </div>
                <p className="text-[11px] text-[#716B71] leading-relaxed">
                  To prevent riders from driving to 5 different stores, Chopwize matches your basket against full-inventory supermarkets:
                </p>

                <div className="space-y-2">
                  {groceryConsolidations.map((c) => {
                    const isSelected = selectedGroceryStoreId === c.storeId;
                    return (
                      <div
                        key={c.storeId}
                        onClick={() => setSelectedGroceryStoreId(c.storeId)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#287A55] bg-white ring-1 ring-[#287A55]'
                            : 'border-[#EAE5E9] bg-white hover:border-[#287A55]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#242124]">{c.storeName}</span>
                          <span className="text-[11px] font-bold text-[#287A55]">
                            {c.itemsAvailable} of {c.totalItems} Available
                          </span>
                        </div>

                        {c.isFullMatch ? (
                          <span className="inline-block text-[10px] text-[#287A55] font-semibold mt-1">
                            ✓ 100% items available in 1 single pickup
                          </span>
                        ) : (
                          <span className="inline-block text-[10px] text-[#9A6A18] mt-1">
                            Missing: {c.missingItemNames.join(', ')}
                          </span>
                        )}

                        <div className="mt-2 pt-1.5 border-t border-[#EAE5E9] flex items-center justify-between text-[11px]">
                          <span className="text-[#716B71]">Delivery: ₦{c.deliveryFee.toLocaleString()}</span>
                          <span className="font-bold text-[#30102F] tabular-nums">
                            Total: ₦{c.totalCost.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fulfilment & Delivery Address */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#242124] mb-1.5">
                    Fulfilment Option
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setFulfilment('delivery')}
                      className={`py-2 px-3 rounded-xl border text-center transition-colors ${
                        fulfilment === 'delivery'
                          ? 'border-[#287A55] bg-emerald-50 text-[#287A55]'
                          : 'border-[#EAE5E9] bg-white text-[#716B71]'
                      }`}
                    >
                      Rider Delivery (+₦{deliveryFee.toLocaleString()})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfilment('pickup')}
                      className={`py-2 px-3 rounded-xl border text-center transition-colors ${
                        fulfilment === 'pickup'
                          ? 'border-[#287A55] bg-emerald-50 text-[#287A55]'
                          : 'border-[#EAE5E9] bg-white text-[#716B71]'
                      }`}
                    >
                      Store Collection (Free)
                    </button>
                  </div>
                </div>

                {fulfilment === 'delivery' && (
                  <div>
                    <label className="block text-xs font-bold text-[#242124] mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] text-xs bg-[#FAF8F4]"
                    />
                  </div>
                )}
              </div>

              {/* Final Breakdown */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F4] border border-[#EAE5E9] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#716B71]">
                  <span>Items Subtotal</span>
                  <span className="tabular-nums font-semibold text-[#242124]">
                    ₦{(currentConsolidation?.subtotal || grocerySubtotal).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#716B71]">
                  <span>Store Delivery Fee</span>
                  <span className="tabular-nums font-semibold text-[#242124]">
                    ₦{deliveryFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#716B71]">
                  <span>Platform Fee</span>
                  <span className="tabular-nums font-semibold text-[#242124]">
                    ₦250
                  </span>
                </div>
                <div className="pt-2 border-t border-[#EAE5E9] flex justify-between font-bold text-sm text-[#287A55]">
                  <span>Grand Total</span>
                  <span className="tabular-nums">₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Checkout Button */}
        {groceryCart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#EAE5E9] bg-white">
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#287A55] hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-between transition-colors shadow-sm disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Dispatching...' : 'Place Consolidated Grocery Order'}</span>
              <div className="flex items-center gap-1.5">
                <span className="tabular-nums">₦{finalTotal.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
