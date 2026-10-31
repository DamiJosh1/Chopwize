import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Search,
  Dices,
  ChefHat,
  Star,
  Clock,
  ShieldCheck,
  ArrowRight,
  Plus,
  Flame,
  Check,
} from 'lucide-react';
import { MenuItem, Restaurant } from '../../types';

export const HomeView: React.FC = () => {
  const {
    restaurants,
    menuItems,
    setSelectedRestaurantId,
    addToCart,
    openAIConciergeWithQuery,
    setIsSurpriseMeOpen,
    setIsCookingAssistantOpen,
    setCustomerTab,
    selectedLocation,
    setIsLocationModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moodChips = [
    { label: 'Comfort food', query: 'comforting swallow and native soup' },
    { label: 'Something spicy', query: 'spicy asun and pepper soup' },
    { label: 'Light meal', query: 'light grilled fish and healthy sides' },
    { label: 'Grilled food', query: 'charcoal grilled suya and chicken' },
    { label: 'Sweet treat', query: 'puff puff and sweet pastries' },
    { label: 'Local favourites', query: 'authentic lagos bukka specialties' },
    { label: 'Quick lunch', query: 'quick office lunch under 30 mins' },
    { label: 'Budget-friendly', query: 'affordable meals under ₦3,500' },
  ];

  const categories = [
    { id: 'rice', name: 'Rice Dishes', icon: '🍚', count: '12+ dishes' },
    { id: 'swallow', name: 'Swallows & Soups', icon: '🍲', count: '18+ dishes' },
    { id: 'grills', name: 'Grills & Suya', icon: '🍢', count: '9+ dishes' },
    { id: 'breakfast', name: 'Breakfast & Street', icon: '🍳', count: '7+ dishes' },
    { id: 'snacks', name: 'Snacks & Chops', icon: '🥟', count: '11+ dishes' },
    { id: 'drinks', name: 'Drinks & Zobo', icon: '🥤', count: '8+ refreshers' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    openAIConciergeWithQuery(searchQuery.trim());
  };

  const handleMoodClick = (chip: { label: string; query: string }) => {
    if (selectedMood === chip.label) {
      setSelectedMood(null);
    } else {
      setSelectedMood(chip.label);
      openAIConciergeWithQuery(chip.query);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      
      {/* Editorial Food Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#30102F] to-[#1c081b] text-white p-6 sm:p-10 lg:p-12 shadow-sm border border-[#30102F]/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-xs mb-4 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-[#CBB477]" />
            <span>Intelligent Nigerian Food Decisions</span>
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-3">
            Good food starts with a <span className="text-[#CBB477]">better decision</span>.
          </h1>
          <p className="text-white/80 text-sm sm:text-base mb-6 max-w-lg leading-relaxed font-normal">
            Discover verified native soups, smoky party jollof, tender charcoal grills and plan your daily meals across Lagos & Abuja.
          </p>

          {/* AI Search Prompt Form */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-[#716B71] absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you in the mood for? (e.g. spicy goat meat jollof under ₦4k)"
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white text-[#242124] text-sm focus:outline-none focus:ring-2 focus:ring-[#CBB477] placeholder:text-[#716B71] shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 rounded-xl bg-[#30102F] hover:bg-[#220b22] text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Find</span>
                <Sparkles className="w-3.5 h-3.5 text-[#CBB477]" />
              </button>
            </div>
          </form>

          {/* Location reassurance */}
          <div className="mt-4 flex items-center gap-2 text-xs text-white/70">
            <span>Delivering fresh to:</span>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="text-[#CBB477] font-semibold underline underline-offset-2 hover:text-white transition-colors"
            >
              {selectedLocation}
            </button>
          </div>
        </div>

        {/* Decorative subtle backdrop accent */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none hidden lg:block bg-radial from-[#CBB477]/40 to-transparent" />
      </section>

      {/* Mood & Craving Chips */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-bold text-sm sm:text-base text-[#242124]">
            What's your craving today?
          </h2>
          <span className="text-xs text-[#716B71]">Search intents</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {moodChips.map((chip) => {
            const isSelected = selectedMood === chip.label;
            return (
              <button
                key={chip.label}
                onClick={() => handleMoodClick(chip)}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-[#30102F] text-white border-[#30102F] shadow-xs'
                    : 'bg-white text-[#242124] hover:bg-[#FAF3F9] border-[#EAE5E9]'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Decision Support Feature Cards: Surprise Me & Home Cooking */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Surprise Me Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#EAE5E9] shadow-xs flex items-start justify-between gap-4">
          <div>
            <div className="w-9 h-9 rounded-xl bg-[#FAF3F9] text-[#30102F] flex items-center justify-center mb-3">
              <Dices className="w-5 h-5 text-[#CBB477]" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#242124]">
              Surprise Me
            </h3>
            <p className="text-xs text-[#716B71] mt-1 mb-4 leading-relaxed">
              Tired of deciding? Set your budget and spice preference, and we'll pick a vetted dish from open partner kitchens.
            </p>
            <button
              onClick={() => setIsSurpriseMeOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#FAF8F4] hover:bg-[#FAF3F9] text-[#30102F] border border-[#30102F]/20 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Roll Food Dice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Cooking Assistant Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#EAE5E9] shadow-xs flex items-start justify-between gap-4">
          <div>
            <div className="w-9 h-9 rounded-xl bg-[#FAF3F9] text-[#30102F] flex items-center justify-center mb-3">
              <ChefHat className="w-5 h-5 text-[#CBB477]" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#242124]">
              Cooking Assistant
            </h3>
            <p className="text-xs text-[#716B71] mt-1 mb-4 leading-relaxed">
              Have yam, palm oil, or peppers at home? Enter what's in your pantry for instant recipes or restaurant alternatives.
            </p>
            <button
              onClick={() => setIsCookingAssistantOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#FAF8F4] hover:bg-[#FAF3F9] text-[#30102F] border border-[#30102F]/20 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Suggest Recipes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Nigerian Restaurants */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading font-bold text-lg sm:text-xl text-[#242124]">
              Nearby Verified Kitchens
            </h2>
            <p className="text-xs text-[#716B71]">
              Inspected hygiene standards, CAC registered, and fresh preparation
            </p>
          </div>
          <button
            onClick={() => setCustomerTab('discover')}
            className="text-xs font-bold text-[#30102F] hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              onClick={() => setSelectedRestaurantId(rest.id)}
              className="group cursor-pointer rounded-2xl bg-white border border-[#EAE5E9] overflow-hidden hover:border-[#30102F]/30 hover:shadow-md transition-all flex flex-col"
            >
              {/* Cover Image */}
              <div className="relative h-44 bg-[#FAF8F4] overflow-hidden">
                <img
                  src={rest.coverImage}
                  alt={rest.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#242124] shadow-xs backdrop-blur-xs">
                  <Star className="w-3.5 h-3.5 text-[#CBB477] fill-[#CBB477]" />
                  <span>{rest.rating}</span>
                  <span className="text-[#716B71]">({rest.reviewCount})</span>
                </div>
                {rest.isPaused && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                      Kitchen Busy / Paused
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="font-heading font-bold text-base text-[#242124] group-hover:text-[#30102F] transition-colors">
                      {rest.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#716B71] line-clamp-1">{rest.tagline}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EAE5E9] flex items-center justify-between text-xs text-[#716B71]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#30102F]" />
                    <span>{rest.deliveryTimeMin}–{rest.deliveryTimeMax} mins</span>
                  </div>
                  <div className="font-medium text-[#242124]">
                    Delivery: ₦{rest.deliveryFee.toLocaleString()}
                  </div>
                </div>

                {/* Verified badge */}
                <div className="mt-2 text-[10px] text-[#287A55] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#287A55]" />
                  <span>{rest.verified.verificationText}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Authentic Dishes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading font-bold text-lg sm:text-xl text-[#242124]">
              Top Food Selections
            </h2>
            <p className="text-xs text-[#716B71]">
              Customer favourites cooked to order with authentic spices
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-[#EAE5E9] hover:border-[#30102F]/30 hover:shadow-sm transition-all flex gap-3.5"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 bg-[#FAF8F4]"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading font-bold text-sm text-[#242124] line-clamp-1">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#716B71]">{item.restaurantName}</p>
                  <p className="text-xs text-[#242124]/80 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-sm text-[#30102F] tabular-nums">
                    ₦{item.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="p-2 rounded-xl bg-[#FAF3F9] hover:bg-[#30102F] text-[#30102F] hover:text-white transition-colors"
                    aria-label={`Add ${item.name} to tray`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
