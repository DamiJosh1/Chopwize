import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Search,
  Mic,
  Dices,
  ChefHat,
  Star,
  Clock,
  ShieldCheck,
  ArrowRight,
  Plus,
  ShoppingCart,
  CalendarDays,
  Bell,
  Gift,
  Check,
  X,
} from 'lucide-react';
import { MenuItem } from '../../types';

export const HomeView: React.FC = () => {
  const {
    customerName,
    restaurants,
    menuItems,
    setSelectedRestaurantId,
    addToCart,
    openAIConciergeWithQuery,
    setIsSurpriseMeOpen,
    setIsCookingAssistantOpen,
    setCustomerTab,
    selectedLocation,
    mealReminders,
    handleReminderAction,
    surpriseConfig,
    respondToSurpriseInvitation,
    showToast,
  } = useApp();

  const [aiPrompt, setAiPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);

  const quickPrompts = [
    { label: 'Find food under ₦4,000', query: 'Find authentic meals under ₦4,000' },
    { label: 'What can I cook?', action: 'cook' },
    { label: 'Plan my meals', action: 'plan' },
    { label: 'Shop for groceries', action: 'market' },
    { label: 'Yoruba indigenous food', query: 'Authentic Yoruba food around me' },
    { label: 'Something spicy for lunch', query: 'Spicy pepper soup or jollof' },
  ];

  const indigenousCultures = [
    { culture: 'Yoruba', desc: 'Amala, Abula (Ewedu & Gbegiri), Ofada Rice & Ayamase', sampleDishId: 'm-amala' },
    { culture: 'Igbo', desc: 'Oha Soup, Ofe Nsala, Abacha, Pounded Yam', sampleDishId: 'm-oha' },
    { culture: 'Hausa', desc: 'Tuwo Shinkafa, Miyan Kuka, Spiced Masa & Suya', sampleDishId: 'm-tuwo' },
    { culture: 'Efik/Ibibio', desc: 'Calabar Afang Soup, Edikang Ikong & Periwinkles', sampleDishId: 'm-afang' },
  ];

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    openAIConciergeWithQuery(aiPrompt.trim());
  };

  // Voice Input (Section 12: Voice-to-Text)
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-NG'; // Nigerian English locale
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Listening... Speak your food craving in Nigerian English');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setAiPrompt(transcript);
        setIsListening(false);
        showToast(`Heard: "${transcript}". Edit or tap Ask to search.`);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setAiPrompt('Find me spicy party jollof with goat meat under 4000 naira');
        showToast('Voice simulated: "Find me spicy party jollof with goat meat under 4000 naira"');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      // Clean fallback simulation
      setAiPrompt('Find me spicy party jollof with goat meat under 4000 naira');
      showToast('Voice simulated: "Find me spicy party jollof with goat meat under 4000 naira"');
    }
  };

  const activeReminder = mealReminders.find((r) => r.status === 'pending');

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Chopwize AI Central Opening Hero (Section 2 & 4) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#30102F] via-[#240b23] to-[#170616] text-white p-6 sm:p-9 border border-[#30102F]/60 shadow-md">
        <div className="relative z-10 max-w-2xl space-y-4">
          
          {/* Status Header */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 text-[#CBB477] flex items-center justify-center border border-white/15">
              <Sparkles className="w-4 h-4 text-[#CBB477]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-sm sm:text-base text-white tracking-tight">
                  Chopwize AI
                </h1>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-white/10 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-[11px] text-white/70">Your intelligent Nigerian food companion</p>
            </div>
          </div>

          {/* Assistant Greeting */}
          <div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
              What are you eating today, <span className="text-[#CBB477]">{customerName}</span>?
            </h2>
            <p className="text-white/80 text-xs sm:text-sm mt-1 leading-relaxed">
              Tell me what you're craving, what ingredients you have at home, or how much you want to spend.
            </p>
          </div>

          {/* AI Search & Voice Input Form */}
          <form onSubmit={handlePromptSubmit} className="relative pt-1">
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-white/20 p-1">
              <Search className="w-4 h-4 text-[#716B71] ml-3 shrink-0 pointer-events-none" />
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask Chopwize AI anything... (e.g. food under ₦4,000, what to cook)"
                className="w-full px-3 py-3 text-xs sm:text-sm text-[#242124] focus:outline-none placeholder:text-[#716B71]"
              />

              {/* Voice-to-Text Button (Section 12) */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2.5 rounded-xl border transition-colors shrink-0 mr-1.5 ${
                  isListening
                    ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
                    : 'bg-[#FAF8F4] border-[#EAE5E9] text-[#716B71] hover:text-[#30102F]'
                }`}
                title="Voice Input (Speech to text)"
                aria-label="Speak your food request"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#30102F] hover:bg-[#220b22] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Ask AI</span>
                <Sparkles className="w-3.5 h-3.5 text-[#CBB477]" />
              </button>
            </div>
          </form>

          {/* Quick AI Prompts */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {quickPrompts.map((qp) => (
              <button
                key={qp.label}
                onClick={() => {
                  if (qp.action === 'cook') setIsCookingAssistantOpen(true);
                  else if (qp.action === 'plan') setCustomerTab('profile');
                  else if (qp.action === 'market') setCustomerTab('explore');
                  else if (qp.query) openAIConciergeWithQuery(qp.query);
                }}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
              >
                {qp.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 2. Smart Meal Reminder Banner (Section 7) */}
      {activeReminder && (
        <section className="p-4 sm:p-5 rounded-2xl bg-[#FAF3F9] border border-[#30102F]/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#30102F] text-white shrink-0 mt-0.5">
              <Bell className="w-5 h-5 text-[#CBB477]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A6A18] bg-white px-2 py-0.5 rounded border border-[#CBB477]/30">
                  {activeReminder.time} Smart Reminder
                </span>
                <h3 className="font-heading font-bold text-sm text-[#242124]">
                  {activeReminder.title}
                </h3>
              </div>
              <p className="text-xs text-[#716B71] mt-1 leading-relaxed">
                {activeReminder.message} Planned: <strong className="text-[#242124]">{activeReminder.plannedMeal}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => handleReminderAction(activeReminder.id, 'order')}
              className="px-3.5 py-2 rounded-xl bg-[#30102F] text-white text-xs font-bold hover:bg-[#220b22] transition-colors"
            >
              Order Now
            </button>
            <button
              onClick={() => handleReminderAction(activeReminder.id, 'snooze')}
              className="px-3 py-2 rounded-xl border border-[#EAE5E9] bg-white text-xs font-semibold text-[#716B71] hover:bg-[#FAF8F4]"
            >
              Snooze 15m
            </button>
            <button
              onClick={() => handleReminderAction(activeReminder.id, 'dismiss')}
              className="p-2 text-[#716B71] hover:text-[#242124]"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* 3. Surprise Delivery Invitation (Section 13: Requires explicit consent, no auto charge) */}
      {surpriseConfig.isEnabled && surpriseConfig.activeInvitation?.status === 'pending' && (
        <section className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-600 text-white shrink-0 mt-0.5">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                  Surprise Delivery Programme
                </span>
                <h3 className="font-heading font-bold text-sm text-amber-950">
                  A little food surprise invitation!
                </h3>
              </div>
              <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                We found something delicious from {surpriseConfig.activeInvitation.restaurantName} fitting your preferences. Are you available to receive this meal?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => respondToSurpriseInvitation('decline')}
              className="px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-semibold text-amber-900 hover:bg-amber-100"
            >
              Not Today (No charge)
            </button>
            <button
              onClick={() => respondToSurpriseInvitation('accept')}
              className="px-3.5 py-2 rounded-xl bg-[#30102F] text-white text-xs font-bold hover:bg-[#220b22]"
            >
              I'm Interested (View ₦{surpriseConfig.activeInvitation.total.toLocaleString()})
            </button>
          </div>
        </section>
      )}

      {/* 4. Indigenous Food Discovery Showcase (Section 8) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#242124]">
              Indigenous Nigerian Food Cultures
            </h2>
            <p className="text-xs text-[#716B71]">
              Genuinely available dishes from Yoruba, Igbo, Hausa and Calabar heritage kitchens
            </p>
          </div>
          <button
            onClick={() => setCustomerTab('explore')}
            className="text-xs font-bold text-[#30102F] hover:underline flex items-center gap-1"
          >
            <span>Explore all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {indigenousCultures.map((item) => (
            <div
              key={item.culture}
              onClick={() => openAIConciergeWithQuery(`Show me authentic ${item.culture} food`)}
              className="p-4 rounded-2xl bg-white border border-[#EAE5E9] hover:border-[#30102F]/40 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A6A18] bg-[#FDFBF7] px-2 py-0.5 rounded border border-[#CBB477]/30 inline-block mb-1">
                  {item.culture} Kitchen
                </span>
                <h3 className="font-heading font-bold text-sm text-[#242124] mt-1">
                  {item.culture} Specialties
                </h3>
                <p className="text-xs text-[#716B71] mt-1 line-clamp-2">
                  {item.desc}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#EAE5E9] flex items-center justify-between text-xs font-bold text-[#30102F]">
                <span>Discover dishes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Recommended Prepared Meals (Section 2) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#242124]">
              Recommended for {customerName}
            </h2>
            <p className="text-xs text-[#716B71]">
              Prepared fresh to order based on your Food Memory and spice preferences
            </p>
          </div>
          <button
            onClick={() => setCustomerTab('explore')}
            className="text-xs font-bold text-[#30102F] hover:underline"
          >
            View Full Menu
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-[#EAE5E9] hover:border-[#30102F]/30 hover:shadow-xs transition-all flex gap-3.5"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl object-cover shrink-0 bg-[#FAF8F4]"
              />
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-[#242124] truncate">
                    {item.name}
                  </h3>
                  <button
                    onClick={() => setSelectedRestaurantId(item.restaurantId)}
                    className="text-[11px] text-[#716B71] hover:text-[#30102F] hover:underline block truncate mt-0.5"
                  >
                    {item.restaurantName}
                  </button>
                  <p className="text-[11px] text-[#242124]/75 mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-[#30102F] tabular-nums">
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

      {/* 6. Chopwize Market & Decision Support Tools */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Chopwize Market banner */}
        <div
          onClick={() => setCustomerTab('explore')}
          className="p-5 rounded-2xl bg-white border border-[#EAE5E9] hover:border-[#287A55]/40 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#287A55] flex items-center justify-center mb-3">
              <ShoppingCart className="w-5 h-5 text-[#287A55]" />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#242124]">
              Chopwize Market
            </h3>
            <p className="text-xs text-[#716B71] mt-1 leading-relaxed">
              Shop shelf-stable groceries with single-store consolidation. Spaghetti, noodles, rice, and cooking oils.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#EAE5E9] flex items-center justify-between text-xs font-bold text-[#287A55]">
            <span>Open Market</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Cooking Assistant */}
        <div
          onClick={() => setIsCookingAssistantOpen(true)}
          className="p-5 rounded-2xl bg-white border border-[#EAE5E9] hover:border-[#30102F]/40 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-[#FAF3F9] text-[#30102F] flex items-center justify-center mb-3">
              <ChefHat className="w-5 h-5 text-[#CBB477]" />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#242124]">
              Cooking Assistant
            </h3>
            <p className="text-xs text-[#716B71] mt-1 leading-relaxed">
              Have rice, pepper, or yam at home? Suggest Nigerian recipes and get missing items from the Market.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#EAE5E9] flex items-center justify-between text-xs font-bold text-[#30102F]">
            <span>Check Recipes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Surprise Me Dice */}
        <div
          onClick={() => setIsSurpriseMeOpen(true)}
          className="p-5 rounded-2xl bg-white border border-[#EAE5E9] hover:border-[#30102F]/40 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-[#FAF3F9] text-[#30102F] flex items-center justify-center mb-3">
              <Dices className="w-5 h-5 text-[#CBB477]" />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#242124]">
              Instant Surprise Me
            </h3>
            <p className="text-xs text-[#716B71] mt-1 leading-relaxed">
              Can't decide? Set budget and spice tolerance to roll verified meal recommendations instantly.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#EAE5E9] flex items-center justify-between text-xs font-bold text-[#30102F]">
            <span>Roll Meal Dice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </section>

    </div>
  );
};
