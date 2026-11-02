import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Star,
  Clock,
  ShieldCheck,
  MapPin,
  Search,
  Plus,
  Share2,
  Heart,
  AlertCircle,
  X,
  ShoppingBag,
  Check,
} from 'lucide-react';
import { MenuItem, MenuItemAddOn, MenuItemPortion } from '../../types';

export const RestaurantView: React.FC = () => {
  const {
    restaurants,
    menuItems,
    selectedRestaurantId,
    setSelectedRestaurantId,
    addToCart,
    showToast,
  } = useApp();

  const restaurant = restaurants.find((r) => r.id === selectedRestaurantId);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [menuSearch, setMenuSearch] = useState('');
  const [fulfilmentMode, setFulfilmentMode] = useState<'delivery' | 'pickup'>('delivery');
  const [isFavorited, setIsFavorited] = useState(false);

  // Item customization modal
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedPortion, setSelectedPortion] = useState<MenuItemPortion | undefined>();
  const [selectedAddOns, setSelectedAddOns] = useState<MenuItemAddOn[]>([]);
  const [selectedProtein, setSelectedProtein] = useState<{ name: string; priceDelta: number } | undefined>();
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [specialNote, setSpecialNote] = useState('');

  if (!restaurant) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm font-semibold text-[#242124]">Restaurant not found</p>
        <button
          onClick={() => setSelectedRestaurantId(null)}
          className="mt-4 px-4 py-2 rounded-xl bg-[#30102F] text-white text-xs font-semibold"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  const restaurantDishes = menuItems.filter((m) => m.restaurantId === restaurant.id);

  const categories = ['All', ...restaurant.categories];

  const filteredDishes = restaurantDishes.filter((dish) => {
    if (activeCategory !== 'All' && dish.category !== activeCategory) return false;
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      return (
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenCustomize = (dish: MenuItem) => {
    setCustomizingItem(dish);
    setSelectedPortion(dish.portionOptions ? dish.portionOptions[0] : undefined);
    setSelectedProtein(dish.availableProteins && dish.availableProteins.length > 0 ? dish.availableProteins[0] : undefined);
    setSelectedAddOns([]);
    setRemovedIngredients([]);
    setSpecialNote('');
  };

  const toggleAddOn = (addon: MenuItemAddOn) => {
    setSelectedAddOns((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const toggleRemovedIngredient = (ing: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]
    );
  };

  const handleConfirmAddToCart = () => {
    if (!customizingItem) return;
    addToCart(
      customizingItem,
      selectedPortion,
      selectedAddOns,
      selectedProtein,
      removedIngredients,
      specialNote
    );
    setCustomizingItem(null);
  };

  const calculatedModalPrice = customizingItem
    ? customizingItem.price +
      (selectedPortion ? selectedPortion.priceDelta : 0) +
      (selectedProtein ? selectedProtein.priceDelta : 0) +
      selectedAddOns.reduce((s, a) => s + a.price, 0)
    : 0;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top back & actions button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedRestaurantId(null)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#716B71] hover:text-[#242124] px-3 py-1.5 rounded-xl border border-[#EAE5E9] bg-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to restaurants</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsFavorited(!isFavorited);
              showToast(isFavorited ? 'Removed from favorites' : 'Saved to favorites');
            }}
            className={`p-2 rounded-xl border transition-colors ${
              isFavorited
                ? 'bg-[#FAF3F9] text-[#30102F] border-[#30102F]/30'
                : 'bg-white text-[#716B71] hover:text-[#242124] border-[#EAE5E9]'
            }`}
            aria-label="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#30102F]' : ''}`} />
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              showToast('Restaurant link copied to clipboard');
            }}
            className="p-2 rounded-xl border border-[#EAE5E9] bg-white text-[#716B71] hover:text-[#242124] transition-colors"
            aria-label="Share restaurant"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Restaurant Header Card */}
      <div className="rounded-3xl bg-white border border-[#EAE5E9] overflow-hidden shadow-xs">
        {/* Cover image banner */}
        <div className="h-48 sm:h-64 relative bg-[#FAF8F4]">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight">
              {restaurant.name}
            </h1>
            <p className="text-white/80 text-xs sm:text-sm mt-0.5">{restaurant.tagline}</p>
          </div>
        </div>

        {/* Info Strip */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#716B71]">
              <div className="flex items-center gap-1 font-bold text-[#242124]">
                <Star className="w-4 h-4 text-[#CBB477] fill-[#CBB477]" />
                <span>{restaurant.rating}</span>
                <span className="font-normal text-[#716B71]">({restaurant.reviewCount} verified reviews)</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#30102F]" />
                <span>{restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} mins prep & transit</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#30102F]" />
                <span>{restaurant.area}</span>
              </div>
            </div>

            {/* Fulfilment Mode Toggle */}
            <div className="flex items-center gap-1 bg-[#FAF8F4] p-1 rounded-xl border border-[#EAE5E9]">
              <button
                onClick={() => setFulfilmentMode('delivery')}
                disabled={!restaurant.supportsDelivery}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  fulfilmentMode === 'delivery'
                    ? 'bg-[#30102F] text-white'
                    : 'text-[#716B71] hover:text-[#242124]'
                }`}
              >
                Delivery (₦{restaurant.deliveryFee.toLocaleString()})
              </button>
              <button
                onClick={() => setFulfilmentMode('pickup')}
                disabled={!restaurant.supportsPickup}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  fulfilmentMode === 'pickup'
                    ? 'bg-[#30102F] text-white'
                    : 'text-[#716B71] hover:text-[#242124]'
                }`}
              >
                Pickup (Free)
              </button>
            </div>
          </div>

          {/* Verified standards assurance */}
          <div className="p-3 rounded-xl bg-[#FAF3F9] border border-[#30102F]/15 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#287A55] shrink-0" />
              <span className="font-semibold text-[#242124]">
                {restaurant.verified.verificationText}
              </span>
              <span className="text-[#716B71]">· Inspected {restaurant.verified.inspectedDate}</span>
            </div>
            <span className="text-[11px] font-bold text-[#287A55] bg-white px-2 py-0.5 rounded-md border border-[#287A55]/20">
              Approved
            </span>
          </div>
        </div>
      </div>

      {/* Menu Filter & Search Bar */}
      <div className="sticky top-16 z-20 bg-[#FAF8F4]/90 backdrop-blur-md pt-2 pb-2">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Menu Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#716B71] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder="Search dishes on this menu..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#EAE5E9] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#30102F]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors shrink-0 ${
                  activeCategory === cat
                    ? 'bg-[#30102F] text-white border-[#30102F]'
                    : 'bg-white text-[#716B71] hover:text-[#242124] border-[#EAE5E9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDishes.map((dish) => (
          <div
            key={dish.id}
            className={`p-4 rounded-2xl bg-white border border-[#EAE5E9] hover:border-[#30102F]/30 hover:shadow-xs transition-all flex justify-between gap-4 ${
              !dish.isAvailable ? 'opacity-60 pointer-events-none' : ''
            }`}
          >
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-sm text-[#242124]">
                    {dish.name}
                  </h3>
                  {dish.isPopular && (
                    <span className="text-[10px] font-bold text-[#9A6A18] bg-[#FDFBF7] px-1.5 py-0.5 rounded border border-[#CBB477]/30">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#242124]/75 mt-1 leading-relaxed">
                  {dish.description}
                </p>
                {dish.allergens.length > 0 && (
                  <p className="text-[11px] text-red-600 mt-1">
                    Allergen warning: {dish.allergens.join(', ')}
                  </p>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-sm text-[#30102F] tabular-nums">
                  ₦{dish.price.toLocaleString()}
                </span>
                
                {dish.portionOptions || dish.addOns ? (
                  <button
                    onClick={() => handleOpenCustomize(dish)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FAF3F9] hover:bg-[#30102F] text-[#30102F] hover:text-white border border-[#30102F]/20 text-xs font-semibold transition-colors"
                  >
                    Customise & Add
                  </button>
                ) : (
                  <button
                    onClick={() => addToCart(dish)}
                    className="p-2 rounded-xl bg-[#30102F] hover:bg-[#220b22] text-white transition-colors"
                    aria-label={`Add ${dish.name} to tray`}
                  >
                    <Plus className="w-4 h-4 text-[#CBB477]" />
                  </button>
                )}
              </div>
            </div>

            <img
              src={dish.imageUrl}
              alt={dish.name}
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-xl object-cover bg-[#FAF8F4] shrink-0"
            />
          </div>
        ))}
      </div>

      {/* Item Customization Modal */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#EAE5E9] max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-labelledby="dish-customize-title"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E9]">
              <div>
                <h3 id="dish-customize-title" className="font-heading font-bold text-base text-[#242124]">
                  {customizingItem.name}
                </h3>
                <p className="text-xs text-[#716B71]">Choose your portions and native sides</p>
              </div>
              <button
                onClick={() => setCustomizingItem(null)}
                className="p-2 text-[#716B71] hover:text-[#242124] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {/* Choice of Protein */}
              {customizingItem.availableProteins && customizingItem.availableProteins.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-[#242124]">
                      Select Protein (Choice of 1):
                    </label>
                    <span className="text-[10px] text-[#CBB477] font-bold uppercase tracking-wider bg-[#30102F] px-1.5 py-0.5 rounded">
                      Required
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {customizingItem.availableProteins.map((protein) => {
                      const isSelected = selectedProtein?.name === protein.name;
                      return (
                        <button
                          key={protein.name}
                          type="button"
                          onClick={() => setSelectedProtein(protein)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-colors ${
                            isSelected
                              ? 'border-[#30102F] bg-[#FAF3F9] text-[#30102F] font-bold'
                              : 'border-[#EAE5E9] bg-white text-[#242124]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#30102F]' : 'border-[#716B71]'}`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-[#30102F]" />}
                            </div>
                            <span>{protein.name}</span>
                          </div>
                          <span>
                            {protein.priceDelta > 0
                              ? `+₦${protein.priceDelta.toLocaleString()}`
                              : 'Included'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Portions / Swallow options */}
              {customizingItem.portionOptions && (
                <div>
                  <label className="block text-xs font-bold text-[#242124] mb-2">
                    Choice of Portion / Swallow:
                  </label>
                  <div className="space-y-1.5">
                    {customizingItem.portionOptions.map((portion) => (
                      <button
                        key={portion.name}
                        onClick={() => setSelectedPortion(portion)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-colors ${
                          selectedPortion?.name === portion.name
                            ? 'border-[#30102F] bg-[#FAF3F9] text-[#30102F] font-bold'
                            : 'border-[#EAE5E9] bg-white text-[#242124]'
                        }`}
                      >
                        <span>{portion.name}</span>
                        <span>
                          {portion.priceDelta > 0
                            ? `+₦${portion.priceDelta.toLocaleString()}`
                            : portion.priceDelta < 0
                            ? `-₦${Math.abs(portion.priceDelta).toLocaleString()}`
                            : 'Included'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Add-ons */}
              {customizingItem.addOns && (
                <div>
                  <label className="block text-xs font-bold text-[#242124] mb-2">
                    Optional Add-ons:
                  </label>
                  <div className="space-y-1.5">
                    {customizingItem.addOns.map((addon) => {
                      const isChecked = selectedAddOns.some((a) => a.id === addon.id);
                      return (
                        <button
                          key={addon.id}
                          onClick={() => toggleAddOn(addon)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                            isChecked
                              ? 'border-[#30102F] bg-[#FAF3F9] text-[#30102F] font-bold'
                              : 'border-[#EAE5E9] bg-white text-[#242124]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-[#30102F] border-[#30102F] text-white' : 'border-[#EAE5E9]'}`}>
                              {isChecked && <Check className="w-3 h-3" />}
                            </div>
                            <span>{addon.name}</span>
                          </div>
                          <span>+₦{addon.price.toLocaleString()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Removable Ingredients */}
              {customizingItem.removableIngredients && customizingItem.removableIngredients.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#242124]">
                      Omit Ingredients (Custom Kitchen Prep):
                    </label>
                    <span className="text-[10px] text-[#716B71]">Optional</span>
                  </div>
                  <p className="text-[11px] text-[#716B71] mb-2">
                    Select any ingredients you would like our kitchen to leave out of your dish.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {customizingItem.removableIngredients.map((ing) => {
                      const isOmitted = removedIngredients.includes(ing);
                      return (
                        <button
                          key={ing}
                          type="button"
                          onClick={() => toggleRemovedIngredient(ing)}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-colors ${
                            isOmitted
                              ? 'border-red-400 bg-red-50 text-red-700 font-semibold'
                              : 'border-[#EAE5E9] bg-white text-[#242124]'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${isOmitted ? 'bg-red-600 border-red-600 text-white' : 'border-[#716B71]'}`}>
                            {isOmitted && <X className="w-2.5 h-2.5" />}
                          </div>
                          <span className="truncate">No {ing}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-bold text-[#242124] mb-1">
                  Special Kitchen Note (optional):
                </label>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="e.g. Extra pepper on the side, well fried"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] text-xs bg-[#FAF8F4] focus:outline-none focus:ring-2 focus:ring-[#30102F]"
                />
              </div>
            </div>

            {/* Bottom Add CTA */}
            <div className="pt-3 border-t border-[#EAE5E9]">
              <button
                onClick={handleConfirmAddToCart}
                className="w-full py-3 rounded-xl bg-[#30102F] hover:bg-[#220b22] text-white text-xs font-bold flex items-center justify-between px-4 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#CBB477]" />
                  <span>Add to Tray</span>
                </div>
                <span className="tabular-nums">₦{calculatedModalPrice.toLocaleString()}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
