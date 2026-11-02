import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  Clock,
  ShieldCheck,
  Plus,
  ShoppingCart,
  Store,
  ArrowRight,
  Check,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { MenuItem, MarketProduct } from '../../types';

export const ExploreView: React.FC = () => {
  const {
    restaurants,
    menuItems,
    setSelectedRestaurantId,
    addToCart,
    marketProducts,
    groceryStores,
    addGroceryToCart,
    setIsGroceryCartOpen,
    showToast,
  } = useApp();

  const [activeSegment, setActiveSegment] = useState<'all_meals' | 'market_groceries' | 'indigenous' | 'restaurants'>('all_meals');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCulture, setSelectedCulture] = useState<string>('all');
  const [selectedGroceryCategory, setSelectedGroceryCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(10000);

  // Grocery unit selector modal
  const [unitSelectProduct, setUnitSelectProduct] = useState<MarketProduct | null>(null);
  const [selectedUnitName, setSelectedUnitName] = useState<string>('');
  const [selectedQty, setSelectedQty] = useState<number>(1);

  const groceryCategories = [
    'all',
    'Pasta & Noodles',
    'Grains & Rice',
    'Flour & Swallow',
    'Canned Foods',
    'Oils & Seasoning',
    'Dairy & Drinks',
  ];

  // Filtered Dishes
  const filteredDishes = useMemo(() => {
    return menuItems.filter((dish) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = (dish.name + ' ' + dish.description + ' ' + dish.restaurantName + ' ' + dish.category + ' ' + (dish.foodCulture || '')).toLowerCase();
        if (!text.includes(q)) return false;
      }
      if (selectedCulture !== 'all' && dish.foodCulture !== selectedCulture) return false;
      if (dish.price > maxPrice) return false;
      return true;
    });
  }, [menuItems, searchQuery, selectedCulture, maxPrice]);

  // Filtered Grocery Products
  const filteredGroceries = useMemo(() => {
    return marketProducts.filter((prod) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = (prod.name + ' ' + prod.brand + ' ' + prod.category + ' ' + prod.description).toLowerCase();
        if (!text.includes(q)) return false;
      }
      if (selectedGroceryCategory !== 'all' && prod.category !== selectedGroceryCategory) return false;
      return true;
    });
  }, [marketProducts, searchQuery, selectedGroceryCategory]);

  const handleOpenUnitModal = (prod: MarketProduct) => {
    setUnitSelectProduct(prod);
    setSelectedUnitName(prod.availableUnits[0]?.unitName || prod.packSize);
    setSelectedQty(1);
  };

  const handleConfirmAddGrocery = () => {
    if (!unitSelectProduct) return;
    addGroceryToCart(unitSelectProduct, selectedUnitName, selectedQty);
    setUnitSelectProduct(null);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Search and Segment Navigation */}
      <div className="space-y-3">
        {/* Search Field */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#716B71] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prepared dishes, indigenous recipes, or Chopwize Market groceries..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#EAE5E9] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#30102F]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#716B71] hover:text-[#242124]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Section Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[#EAE5E9]">
          {[
            { id: 'all_meals', label: `Prepared Meals (${filteredDishes.length})` },
            { id: 'market_groceries', label: `Chopwize Market (${filteredGroceries.length})` },
            { id: 'indigenous', label: 'Indigenous Food Cultures' },
            { id: 'restaurants', label: `Verified Kitchens (${restaurants.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSegment(tab.id as any)}
              className={`py-2 px-3.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 whitespace-nowrap ${
                activeSegment === tab.id
                  ? 'border-[#30102F] text-[#30102F] bg-white'
                  : 'border-transparent text-[#716B71] hover:text-[#242124]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SEGMENT 1: PREPARED MEALS */}
      {activeSegment === 'all_meals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-[#242124]">
              Direct Menu Browsing
            </h2>
            <span className="text-xs text-[#716B71]">No AI required</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className="p-4 rounded-2xl bg-white border border-[#EAE5E9] hover:border-[#30102F]/30 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="flex gap-3 mb-3">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover bg-[#FAF8F4] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-sm text-[#242124] truncate">
                      {dish.name}
                    </h3>
                    <button
                      onClick={() => setSelectedRestaurantId(dish.restaurantId)}
                      className="text-[11px] text-[#716B71] hover:text-[#30102F] hover:underline block truncate mt-0.5 text-left"
                    >
                      {dish.restaurantName}
                    </button>
                    <p className="text-xs text-[#242124]/75 mt-1 line-clamp-2">
                      {dish.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EAE5E9]">
                  <span className="font-bold text-sm text-[#30102F] tabular-nums">
                    ₦{dish.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(dish)}
                    className="px-3 py-1.5 rounded-xl bg-[#30102F] hover:bg-[#220b22] text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#CBB477]" />
                    <span>Add to Tray</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEGMENT 2: CHOPWIZE MARKET GROCERIES (Section 9) */}
      {activeSegment === 'market_groceries' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#287A55]" />
                <h2 className="font-heading font-bold text-sm text-emerald-950">
                  Chopwize Market · Non-Perishable Groceries
                </h2>
              </div>
              <p className="text-xs text-emerald-900/80 mt-0.5">
                Shelf-stable pantry essentials fulfilled from verified retail supermarkets with single-store consolidation.
              </p>
            </div>
            <button
              onClick={() => setIsGroceryCartOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#287A55] text-white text-xs font-bold hover:bg-emerald-800 shrink-0"
            >
              View Basket
            </button>
          </div>

          {/* Grocery Categories */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {groceryCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedGroceryCategory(cat)}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors ${
                  selectedGroceryCategory === cat
                    ? 'bg-[#287A55] text-white border-[#287A55]'
                    : 'bg-white text-[#716B71] hover:text-[#242124] border-[#EAE5E9]'
                }`}
              >
                {cat === 'all' ? 'All Groceries' : cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroceries.map((prod) => (
              <div
                key={prod.id}
                className="p-4 rounded-2xl bg-white border border-[#EAE5E9] hover:border-[#287A55]/40 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="flex gap-3 mb-3">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover bg-[#FAF8F4] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#716B71] uppercase">{prod.brand}</span>
                    <h3 className="font-heading font-bold text-xs sm:text-sm text-[#242124] truncate">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-[#287A55] font-semibold mt-0.5">
                      {prod.packSize}
                    </p>
                    <p className="text-[11px] text-[#716B71] line-clamp-1 mt-0.5">
                      {prod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EAE5E9] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#716B71] block">From</span>
                    <span className="font-bold text-sm text-[#287A55] tabular-nums">
                      ₦{prod.basePrice.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenUnitModal(prod)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-[#287A55] text-[#287A55] hover:text-white border border-emerald-200 text-xs font-semibold transition-colors"
                  >
                    Select Unit & Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEGMENT 3: INDIGENOUS FOOD CULTURES (Section 8) */}
      {activeSegment === 'indigenous' && (
        <div className="space-y-5">
          <div>
            <h2 className="font-heading font-bold text-base text-[#242124]">
              Explore by Nigerian Heritage & Culture
            </h2>
            <p className="text-xs text-[#716B71]">
              Browse authentic indigenous delicacies prepared by certified traditional kitchens
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['all', 'Yoruba', 'Igbo', 'Hausa', 'Efik/Ibibio'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCulture(c)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap ${
                  selectedCulture === c
                    ? 'bg-[#30102F] text-white border-[#30102F]'
                    : 'bg-white text-[#716B71] hover:text-[#242124] border-[#EAE5E9]'
                }`}
              >
                {c === 'all' ? 'All Cultures' : `${c} Kitchen`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDishes
              .filter((d) => d.foodCulture && d.foodCulture !== 'General Nigerian')
              .map((dish) => (
                <div
                  key={dish.id}
                  className="p-4 rounded-2xl bg-white border border-[#EAE5E9] hover:border-[#30102F]/30 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="flex gap-3 mb-2">
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-xl object-cover bg-[#FAF8F4] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#9A6A18] uppercase tracking-wider bg-[#FDFBF7] px-1.5 py-0.5 rounded border border-[#CBB477]/30 inline-block mb-1">
                        {dish.foodCulture}
                      </span>
                      <h3 className="font-heading font-bold text-sm text-[#242124] truncate">
                        {dish.name}
                      </h3>
                      <p className="text-[11px] text-[#716B71] truncate">{dish.restaurantName}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#242124]/75 mb-3 line-clamp-2">{dish.description}</p>
                  <div className="pt-2 border-t border-[#EAE5E9] flex items-center justify-between">
                    <span className="font-bold text-sm text-[#30102F] tabular-nums">
                      ₦{dish.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => addToCart(dish)}
                      className="px-3 py-1.5 rounded-xl bg-[#30102F] text-white text-xs font-semibold hover:bg-[#220b22]"
                    >
                      Add to Tray
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SEGMENT 4: RESTAURANTS */}
      {activeSegment === 'restaurants' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              onClick={() => setSelectedRestaurantId(rest.id)}
              className="cursor-pointer rounded-2xl bg-white border border-[#EAE5E9] overflow-hidden hover:border-[#30102F]/30 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="h-40 relative bg-[#FAF8F4]">
                <img
                  src={rest.coverImage}
                  alt={rest.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/95 px-2 py-0.5 rounded-lg text-xs font-bold text-[#242124] flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 text-[#CBB477] fill-[#CBB477]" />
                  <span>{rest.rating}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-bold text-base text-[#242124]">
                  {rest.name}
                </h3>
                <p className="text-xs text-[#716B71] mt-0.5">{rest.cuisine} · {rest.area}</p>
                <div className="mt-3 pt-2 border-t border-[#EAE5E9] flex items-center justify-between text-xs text-[#716B71]">
                  <span>{rest.deliveryTimeMin}–{rest.deliveryTimeMax} mins</span>
                  <span className="font-semibold text-[#242124]">Min ₦{rest.minOrder.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unit Selection Modal for Market Groceries (Section 9: Different buying quantities) */}
      {unitSelectProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#EAE5E9]">
            <div className="flex items-start justify-between pb-3 border-b border-[#EAE5E9]">
              <div>
                <span className="text-[10px] font-bold text-[#716B71] uppercase">{unitSelectProduct.brand}</span>
                <h3 className="font-heading font-bold text-base text-[#242124]">{unitSelectProduct.name}</h3>
              </div>
              <button onClick={() => setUnitSelectProduct(null)}>
                <X className="w-5 h-5 text-[#716B71]" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#242124] mb-2">
                  Select Purchase Unit / Pack Size:
                </label>
                <div className="space-y-1.5">
                  {unitSelectProduct.availableUnits.map((u) => (
                    <button
                      key={u.unitName}
                      onClick={() => setSelectedUnitName(u.unitName)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                        selectedUnitName === u.unitName
                          ? 'border-[#287A55] bg-emerald-50 text-[#287A55] font-bold'
                          : 'border-[#EAE5E9] bg-white text-[#242124]'
                      }`}
                    >
                      <span>{u.unitName}</span>
                      <span className="font-mono">₦{u.price.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#242124] mb-1">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                    className="p-2 rounded-lg border border-[#EAE5E9]"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm min-w-[20px] text-center">{selectedQty}</span>
                  <button
                    onClick={() => setSelectedQty(selectedQty + 1)}
                    className="p-2 rounded-lg border border-[#EAE5E9]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE5E9]">
              <button
                onClick={handleConfirmAddGrocery}
                className="w-full py-3 rounded-xl bg-[#287A55] hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
              >
                Add to Grocery Basket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
