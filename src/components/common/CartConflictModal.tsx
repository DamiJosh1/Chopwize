import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, Store } from 'lucide-react';

export const CartConflictModal: React.FC = () => {
  const { cartConflict, resolveCartConflict, cartRestaurant } = useApp();

  if (!cartConflict.isOpen || !cartConflict.newItem) return null;

  const currentRestName = cartRestaurant?.name || 'another restaurant';
  const newRestName = cartConflict.newItem.item.restaurantName;
  const newDishName = cartConflict.newItem.item.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#EAE5E9] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-labelledby="conflict-dialog-title"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-[#FAF3F9] text-[#30102F] shrink-0">
            <AlertCircle className="w-6 h-6 text-[#30102F]" />
          </div>
          <div>
            <h2 id="conflict-dialog-title" className="font-heading font-bold text-lg text-[#242124]">
              Start a new tray?
            </h2>
            <p className="text-xs text-[#716B71] mt-1 leading-relaxed">
              Your tray currently contains dishes from <strong className="text-[#242124]">{currentRestName}</strong>. To ensure food arrives fresh and piping hot, each order is fulfilled by one restaurant at a time.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAF8F4] border border-[#EAE5E9] mb-6 flex items-center gap-3">
          <Store className="w-4 h-4 text-[#CBB477] shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-[#242124]">New selection: {newDishName}</p>
            <p className="text-[#716B71]">From {newRestName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => resolveCartConflict(false)}
            className="w-full py-2.5 px-3 rounded-xl border border-[#EAE5E9] bg-white hover:bg-[#FAF8F4] text-xs font-semibold text-[#242124] transition-colors"
          >
            Keep Current Tray
          </button>
          <button
            onClick={() => resolveCartConflict(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#30102F] hover:bg-[#220b22] text-white text-xs font-semibold transition-colors"
          >
            Clear & Add New Dish
          </button>
        </div>
      </div>
    </div>
  );
};
