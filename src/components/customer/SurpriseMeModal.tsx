import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Dices, X, RefreshCw, ShoppingBag, Check } from 'lucide-react';
import { MenuItem } from '../../types';

export const SurpriseMeModal: React.FC = () => {
  const { isSurpriseMeOpen, setIsSurpriseMeOpen, menuItems, addToCart } = useApp();

  const [budgetCap, setBudgetCap] = useState<number>(5000);
  const [fulfilment, setFulfilment] = useState<'delivery' | 'pickup'>('delivery');
  const [spice, setSpice] = useState<'Any' | 'Mild' | 'Medium' | 'Spicy'>('Any');
  const [dietary, setDietary] = useState<string>('Any');
  const [selectedResult, setSelectedResult] = useState<MenuItem | null>(null);

  if (!isSurpriseMeOpen) return null;

  const handleSpinSurprise = () => {
    let eligible = menuItems.filter((item) => {
      if (!item.isAvailable) return false;
      if (budgetCap && item.price > budgetCap) return false;
      if (spice !== 'Any' && item.spiceLevel !== spice) return false;
      if (dietary !== 'Any' && !item.dietary.includes(dietary)) return false;
      return true;
    });

    if (eligible.length === 0) {
      eligible = menuItems.filter((i) => i.isAvailable);
    }

    // Pick random item
    const picked = eligible[Math.floor(Math.random() * eligible.length)];
    setSelectedResult(picked);
  };

  const handleGetThis = () => {
    if (selectedResult) {
      addToCart(selectedResult);
      setIsSurpriseMeOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#EAE5E9] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-labelledby="surprise-dialog-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE5E9]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF3F9] text-[#30102F]">
              <Dices className="w-5 h-5 text-[#CBB477]" />
            </div>
            <div>
              <h2 id="surprise-dialog-title" className="font-heading font-bold text-lg text-[#242124]">
                Surprise Me
              </h2>
              <p className="text-xs text-[#716B71]">Can't decide? Let Chopwize pick a verified dish</p>
            </div>
          </div>
          <button
            onClick={() => setIsSurpriseMeOpen(false)}
            className="p-2 text-[#716B71] hover:text-[#242124] rounded-lg hover:bg-[#FAF8F4] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form controls */}
        <div className="py-4 space-y-4">
          {/* Budget */}
          <div>
            <label className="block text-xs font-bold text-[#242124] mb-1.5">
              Maximum Budget (₦)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[2500, 4000, 6000, 10000].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudgetCap(b)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-colors ${
                    budgetCap === b
                      ? 'border-[#30102F] bg-[#30102F] text-white'
                      : 'border-[#EAE5E9] bg-white text-[#242124] hover:bg-[#FAF8F4]'
                  }`}
                >
                  ₦{b.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Spice Level */}
          <div>
            <label className="block text-xs font-bold text-[#242124] mb-1.5">
              Spice Preference
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {['Any', 'Mild', 'Medium', 'Spicy'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpice(s as any)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-colors ${
                    spice === s
                      ? 'border-[#30102F] bg-[#FAF3F9] text-[#30102F]'
                      : 'border-[#EAE5E9] bg-white text-[#716B71] hover:text-[#242124]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Fulfilment */}
          <div>
            <label className="block text-xs font-bold text-[#242124] mb-1.5">
              Fulfilment
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFulfilment('delivery')}
                className={`py-2 text-xs font-semibold rounded-xl border text-center transition-colors ${
                  fulfilment === 'delivery'
                    ? 'border-[#30102F] bg-[#FAF3F9] text-[#30102F]'
                    : 'border-[#EAE5E9] bg-white text-[#716B71]'
                }`}
              >
                Delivery
              </button>
              <button
                type="button"
                onClick={() => setFulfilment('pickup')}
                className={`py-2 text-xs font-semibold rounded-xl border text-center transition-colors ${
                  fulfilment === 'pickup'
                    ? 'border-[#30102F] bg-[#FAF3F9] text-[#30102F]'
                    : 'border-[#EAE5E9] bg-white text-[#716B71]'
                }`}
              >
                Pickup
              </button>
            </div>
          </div>

          {/* Selected result card */}
          {selectedResult && (
            <div className="p-4 rounded-xl border-2 border-[#CBB477] bg-[#FDFBF7] animate-in fade-in duration-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A6A18] block mb-1">
                Your Curated Match
              </span>
              <h3 className="font-heading font-bold text-sm text-[#242124]">
                {selectedResult.name}
              </h3>
              <p className="text-xs text-[#716B71] mt-0.5">
                {selectedResult.restaurantName} · <span className="text-[#30102F] font-bold">₦{selectedResult.price.toLocaleString()}</span>
              </p>
              <p className="text-xs text-[#242124]/80 mt-2 line-clamp-2">
                {selectedResult.description}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#EAE5E9] flex gap-2">
          {!selectedResult ? (
            <button
              onClick={handleSpinSurprise}
              className="w-full py-3 px-4 rounded-xl bg-[#30102F] hover:bg-[#220b22] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Dices className="w-4 h-4 text-[#CBB477]" />
              <span>Roll the Dice</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleSpinSurprise}
                className="flex-1 py-3 px-3 rounded-xl border border-[#EAE5E9] bg-white hover:bg-[#FAF8F4] text-xs font-semibold text-[#242124] flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#716B71]" />
                <span>Try Another</span>
              </button>
              <button
                onClick={handleGetThis}
                className="flex-1 py-3 px-3 rounded-xl bg-[#30102F] hover:bg-[#220b22] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#CBB477]" />
                <span>Get This</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
