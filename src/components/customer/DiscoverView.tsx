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
  AlertTriangle,
  Check,
} from 'lucide-react';
import { MenuItem, Restaurant } from '../../types';

export const DiscoverView: React.FC = () => {
  const {
    restaurants,
    menuItems,
    setSelectedRestaurantId,
    addToCart,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'dishes' | 'restaurants'>('dishes');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Filter states
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [filterFulfilment, setFilterFulfilment] = useState<'all' | 'delivery' | 'pickup'>('all');
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(8000);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  const allCategories = [
    'all',
    'Rice Dishes',
    'Swallows & Soups',
    'Grills & Suya',
    'Breakfast & Street',
    'Snacks & Small Chops',
    'Drinks & Refreshers',
  ];

  const commonAllergens = ['Shellfish', 'Peanuts', 'Fish', 'Wheat', 'Crustaceans'];
  const dietaryOptions = ['Halal', 'Gluten-Free', 'Vegetarian', 'Vegan', 'Pescatarian'];

  const toggleAllergen = (item: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const toggleDietary = (item: string) => {
    setSelectedDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const resetFilters = () => {
    setFilterOpenNow(false);
    setFilterFulfilment('all');
    setFilterMaxPrice(8000);
    setFilterCategory('all');
    setSelectedAllergens([]);
    setSelectedDietary([]);
    showToast('Filters cleared');
  };

  const activeFilterCount =
    (filterOpenNow ? 1 : 0) +
    (filterFulfilment !== 'all' ? 1 : 0) +
    (filterMaxPrice < 8000 ? 1 : 0) +
    (filterCategory !== 'all' ? 1 : 0) +
    selectedAllergens.length +
    selectedDietary.length;

  // Filtered Dishes
  const filteredDishes = useMemo(() => {
    return menuItems.filter((dish) => {
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = (dish.name + ' ' + dish.description + ' ' + dish.restaurantName + ' ' + dish.category).toLowerCase();
        if (!text.includes(q)) return false;
      }

      // Price
      if (dish.price > filterMaxPrice) return false;

      // Category
      if (filterCategory !== 'all' && dish.category !== filterCategory) return false;

      // Hard allergy filter (must NOT contain any selected allergen)
      if (selectedAllergens.length > 0) {
        const hasAllergen = selectedAllergens.some((all) => dish.allergens.includes(all));
        if (hasAllergen) return false;
      }

      // Dietary filter
      if (selectedDietary.length > 0) {
        const matchesAllDietary = selectedDietary.every((d) => dish.dietary.includes(d));
        if (!matchesAllDietary) return false;
      }

      // Restaurant status
      const rest = restaurants.find((r) => r.id === dish.restaurantId);
      if (filterOpenNow && (!rest?.isOpen || rest?.isPaused)) return false;
      if (filterFulfilment === 'delivery' && !rest?.supportsDelivery) return false;
      if (filterFulfilment === 'pickup' && !rest?.supportsPickup) return false;

      return true;
    });
  }, [menuItems, restaurants, searchQuery, filterMaxPrice, filterCategory, selectedAllergens, selectedDietary, filterOpenNow, filterFulfilment]);

  // Filtered Restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = (r.name + ' ' + r.cuisine + ' ' + r.area + ' ' + r.categories.join(' ')).toLowerCase();
        if (!text.includes(q)) return false;
      }

      if (filterOpenNow && (!r.isOpen || r.isPaused)) return false;
      if (filterFulfilment === 'delivery' && !r.supportsDelivery) return false;
      if (filterFulfilment === 'pickup' && !r.supportsPickup) return false;

      if (filterCategory !== 'all' && !r.categories.includes(filterCategory)) return false;

      return true;
    });
  }, [restaurants, searchQuery, filterOpenNow, filterFulfilment, filterCategory]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#716B71] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish, restaurant, or cuisine (e.g. jollof, egusi, fish)..."
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

        {/* View Switcher (Dishes vs Restaurants) */}
        <div className="flex items-center gap-1 bg-[#FAF8F4] p-1 rounded-xl border border-[#EAE5E9] shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveView('dishes')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeView === 'dishes'
                ? 'bg-[#30102F] text-white'
                : 'text-[#716B71] hover:text-[#242124]'
            }`}
          >
            Dishes ({filteredDishes.length})
          </button>
          <button
            onClick={() => setActiveView('restaurants')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeView === 'restaurants'
                ? 'bg-[#30102F] text-white'
                : 'text-[#716B71] hover:text-[#242124]'
            }`}
          >
            Kitchens ({filteredRestaurants.length})
          </button>
        </div>

        {/* Filter Trigger Button */}
        <button
          onClick={() => setIsFilterSheetOpen(true)}
          className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors shrink-0 ${
            activeFilterCount > 0
              ? 'border-[#30102F] bg-[#FAF3F9] text-[#30102F]'
              : 'border-[#EAE5E9] bg-white text-[#242124] hover:bg-[#FAF8F4]'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#30102F] text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Applied Filters Removable Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-[#716B71]">Active filters:</span>
          {filterOpenNow && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF3F9] text-xs font-semibold text-[#30102F] border border-[#30102F]/20">
              Open Now
              <button onClick={() => setFilterOpenNow(false)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filterFulfilment !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF3F9] text-xs font-semibold text-[#30102F] border border-[#30102F]/20 capitalize">
              {filterFulfilment} only
              <button onClick={() => setFilterFulfilment('all')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filterCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF3F9] text-xs font-semibold text-[#30102F] border border-[#30102F]/20">
              {filterCategory}
              <button onClick={() => setFilterCategory('all')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedAllergens.map((alg) => (
            <span key={alg} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-xs font-semibold text-red-700 border border-red-200">
              No {alg}
              <button onClick={() => toggleAllergen(alg)}><X className="w-3 h-3" /></button>
            </span>
          ))}
          <button
            onClick={resetFilters}
            className="text-xs text-[#716B71] underline hover:text-[#242124] ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Categories quick horizontal strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors ${
              filterCategory === cat
                ? 'bg-[#30102F] text-white border-[#30102F]'
                : 'bg-white text-[#716B71] hover:text-[#242124] border-[#EAE5E9]'
            }`}
          >
            {cat === 'all' ? 'All Dishes' : cat}
          </button>
        ))}
      </div>

      {/* Main Results Display */}
      {activeView === 'dishes' ? (
        <div>
          {filteredDishes.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-[#EAE5E9]">
              <AlertTriangle className="w-8 h-8 text-[#9A6A18] mx-auto mb-2" />
              <p className="font-heading font-bold text-base text-[#242124]">
                No verified dishes found
              </p>
              <p className="text-xs text-[#716B71] mt-1 max-w-sm mx-auto">
                Try widening your price range, removing strict allergen filters, or searching for other staples.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-[#30102F] text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="p-4 rounded-2xl bg-white border border-[#EAE5E9] hover:border-[#30102F]/30 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="flex gap-3.5 mb-3">
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-xl object-cover shrink-0 bg-[#FAF8F4]"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-sm text-[#242124] truncate">
                        {dish.name}
                      </h3>
                      <button
                        onClick={() => setSelectedRestaurantId(dish.restaurantId)}
                        className="text-[11px] text-[#716B71] hover:text-[#30102F] hover:underline text-left truncate block mt-0.5"
                      >
                        {dish.restaurantName}
                      </button>
                      <p className="text-xs text-[#242124]/75 mt-1 line-clamp-2">
                        {dish.description}
                      </p>
                    </div>
                  </div>

                  {/* Badges: Spice, dietary & allergens */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#716B71] mb-3">
                    <span className="font-semibold text-[#9A6A18] bg-[#FDFBF7] px-2 py-0.5 rounded border border-[#CBB477]/30">
                      {dish.spiceLevel} Spice
                    </span>
                    {dish.allergens.length > 0 && (
                      <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-medium">
                        Contains {dish.allergens.join(', ')}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#EAE5E9] flex items-center justify-between">
                    <span className="font-bold text-base text-[#30102F] tabular-nums">
                      ₦{dish.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => addToCart(dish)}
                      className="px-3 py-1.5 rounded-xl bg-[#30102F] hover:bg-[#220b22] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#CBB477]" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Restaurants View */
        <div>
          {filteredRestaurants.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-[#EAE5E9]">
              <AlertTriangle className="w-8 h-8 text-[#9A6A18] mx-auto mb-2" />
              <p className="font-heading font-bold text-base text-[#242124]">
                No restaurants found
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-[#30102F] text-white text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRestaurants.map((rest) => (
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
        </div>
      )}

      {/* Filter Bottom Sheet / Modal */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#EAE5E9] max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-labelledby="filter-dialog-title"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E9]">
              <h2 id="filter-dialog-title" className="font-heading font-bold text-lg text-[#242124]">
                Filters & Restrictions
              </h2>
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                className="p-2 text-[#716B71] hover:text-[#242124] rounded-lg hover:bg-[#FAF8F4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
              {/* Operating status & Fulfilment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#242124] mb-1.5">
                    Operating Hours
                  </label>
                  <button
                    onClick={() => setFilterOpenNow(!filterOpenNow)}
                    className={`w-full py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-colors ${
                      filterOpenNow
                        ? 'border-[#30102F] bg-[#FAF3F9] text-[#30102F]'
                        : 'border-[#EAE5E9] bg-white text-[#716B71]'
                    }`}
                  >
                    Open Now Only
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#242124] mb-1.5">
                    Fulfilment Mode
                  </label>
                  <select
                    value={filterFulfilment}
                    onChange={(e) => setFilterFulfilment(e.target.value as any)}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-xl border border-[#EAE5E9] bg-white text-[#242124] focus:outline-none focus:ring-2 focus:ring-[#30102F]"
                  >
                    <option value="all">All Modes</option>
                    <option value="delivery">Delivery only</option>
                    <option value="pickup">Pickup only</option>
                  </select>
                </div>
              </div>

              {/* Price range budget slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#242124]">
                    Maximum Price (₦)
                  </label>
                  <span className="text-xs font-bold text-[#30102F] tabular-nums">
                    Up to ₦{filterMaxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="12000"
                  step="500"
                  value={filterMaxPrice}
                  onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#30102F]"
                />
                <div className="flex justify-between text-[10px] text-[#716B71] mt-1">
                  <span>₦1,500</span>
                  <span>₦6,000</span>
                  <span>₦12,000</span>
                </div>
              </div>

              {/* ALLERGY HARD RESTRICTION (Critical per Section 12.2) */}
              <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-bold text-red-900">
                    Allergy Hard Exclusions
                  </span>
                </div>
                <p className="text-[11px] text-red-800/80 mb-2 leading-relaxed">
                  Strictly exclude meals containing selected ingredients.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {commonAllergens.map((alg) => {
                    const isSelected = selectedAllergens.includes(alg);
                    return (
                      <button
                        key={alg}
                        onClick={() => toggleAllergen(alg)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors ${
                          isSelected
                            ? 'bg-red-700 text-white border-red-700'
                            : 'bg-white text-red-900 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        {isSelected ? `Excluded: ${alg}` : `Exclude ${alg}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dietary Choices */}
              <div>
                <label className="block text-xs font-bold text-[#242124] mb-2">
                  Dietary Preferences
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {dietaryOptions.map((opt) => {
                    const isSelected = selectedDietary.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleDietary(opt)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                          isSelected
                            ? 'bg-[#30102F] text-white border-[#30102F]'
                            : 'bg-white text-[#716B71] hover:text-[#242124] border-[#EAE5E9]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-[#EAE5E9] flex gap-3">
              <button
                onClick={resetFilters}
                className="w-1/3 py-2.5 rounded-xl border border-[#EAE5E9] text-xs font-semibold text-[#716B71] hover:bg-[#FAF8F4]"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                className="w-2/3 py-2.5 rounded-xl bg-[#30102F] text-white text-xs font-bold hover:bg-[#220b22]"
              >
                Apply Filters ({filteredDishes.length} matches)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
