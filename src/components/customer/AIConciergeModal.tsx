import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Send, ArrowRight, Check, AlertCircle, ShoppingBag } from 'lucide-react';
import { MenuItem } from '../../types';

interface ConciergeRecommendation {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  matchReason: string;
}

export const AIConciergeModal: React.FC = () => {
  const {
    isAIConciergeOpen,
    setIsAIConciergeOpen,
    aiConciergeInitialQuery,
    menuItems,
    addToCart,
    customerName,
    aiRules,
    showToast,
  } = useApp();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<ConciergeRecommendation[]>([]);
  const [isGroceryIntent, setIsGroceryIntent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleChips = [
    'Spicy jollof with goat meat under ₦4,500',
    'Yoruba food near me: Amala and ewedu',
    'I need spaghetti, noodles and vegetable oil',
    'Comforting swallow and native soup for dinner',
    'Light meal or grill after workout'
  ];

  useEffect(() => {
    if (isAIConciergeOpen && aiConciergeInitialQuery) {
      setPrompt(aiConciergeInitialQuery);
      handleExecuteQuery(aiConciergeInitialQuery);
    } else if (isAIConciergeOpen && !replyMessage) {
      setPrompt('');
      setRecommendations([]);
      setReplyMessage(null);
    }
  }, [isAIConciergeOpen, aiConciergeInitialQuery]);

  if (!isAIConciergeOpen) return null;

  const handleExecuteQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const activeRuleTexts = aiRules.filter((r) => r.isActive).map((r) => r.text);
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText.trim(),
          customerName,
          activeRules: activeRuleTexts,
        }),
      });
      const data = await res.json();
      setReplyMessage(data.reply || `Here are verified dishes for you, ${customerName}:`);
      setRecommendations(data.recommendations || []);
      setIsGroceryIntent(!!data.isGroceryIntent);
    } catch (err) {
      console.error('AI Concierge error:', err);
      // Fallback
      setReplyMessage(`Oya ${customerName}, here are top culinary recommendations from verified Chopwize kitchens:`);
      const fallback = menuItems.slice(0, 3).map((m) => ({
        id: m.id,
        name: m.name,
        restaurant: m.restaurantName,
        price: m.price,
        matchReason: `Prepared fresh at ${m.restaurantName} (₦${m.price.toLocaleString()}).`,
      }));
      setRecommendations(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chip: string) => {
    setPrompt(chip);
    handleExecuteQuery(chip);
  };

  const handleAddRecommendation = (rec: ConciergeRecommendation) => {
    const originalItem = menuItems.find((m) => m.id === rec.id) || {
      id: rec.id,
      restaurantId: 'rest-terra',
      restaurantName: rec.restaurant,
      name: rec.name,
      description: rec.matchReason,
      price: rec.price,
      category: 'Specials',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      spiceLevel: 'Medium' as const,
      prepTimeMinutes: 20,
      dietary: [],
      allergens: [],
    };

    addToCart(originalItem as MenuItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-[#EAE5E9] max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-labelledby="concierge-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE5E9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF3F9] text-[#30102F] flex items-center justify-center border border-[#30102F]/15">
              <Sparkles className="w-5 h-5 text-[#CBB477]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="concierge-dialog-title" className="font-heading font-bold text-lg sm:text-xl text-[#242124]">
                  AI Food Concierge
                </h2>
                <span className="text-[10px] font-bold text-[#30102F] bg-[#FAF3F9] px-2 py-0.5 rounded-md border border-[#30102F]/20">
                  Grounded Catalog
                </span>
              </div>
              <p className="text-xs text-[#716B71]">
                Tell us what you're craving, your budget, or spice tolerance
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAIConciergeOpen(false)}
            className="p-2 text-[#716B71] hover:text-[#242124] rounded-lg hover:bg-[#FAF8F4] transition-colors"
            aria-label="Close concierge"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Suggestion Chips */}
          <div>
            <p className="text-xs font-semibold text-[#716B71] mb-2">
              Popular food inquiries in your area:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sampleChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="text-xs py-1.5 px-3 rounded-lg bg-[#FAF8F4] hover:bg-[#FAF3F9] text-[#242124] hover:text-[#30102F] border border-[#EAE5E9] hover:border-[#30102F]/30 transition-colors text-left"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="p-6 rounded-2xl bg-[#FAF8F4] border border-[#EAE5E9] flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 border-2 border-[#30102F] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm font-semibold text-[#30102F]">Consulting verified kitchen menus...</p>
              <p className="text-xs text-[#716B71] mt-1">Filtering spice levels, availability & delivery radiuses</p>
            </div>
          )}

          {/* Reply message */}
          {!loading && replyMessage && (
            <div className="p-4 rounded-xl bg-[#FAF3F9] border border-[#30102F]/15 text-sm text-[#242124] font-medium leading-relaxed">
              {replyMessage}
            </div>
          )}

          {/* Recommendations List */}
          {!loading && recommendations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#716B71]">
                Top Verified Matches ({recommendations.length})
              </h3>
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-[#EAE5E9] bg-white hover:border-[#30102F]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-[#242124]">
                        {rec.name}
                      </span>
                    </div>
                    <p className="text-xs text-[#716B71] mt-0.5 font-medium">
                      {rec.restaurant} · <span className="text-[#30102F] font-bold">₦{rec.price.toLocaleString()}</span>
                    </p>
                    <p className="text-xs text-[#242124]/80 mt-1 italic">
                      "{rec.matchReason}"
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddRecommendation(rec)}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#30102F] hover:bg-[#220b22] text-white text-xs font-semibold transition-colors shrink-0"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#CBB477]" />
                    <span>Add to Tray</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty state hint */}
          {!loading && !replyMessage && (
            <div className="text-center py-8 text-[#716B71]">
              <Sparkles className="w-8 h-8 mx-auto text-[#CBB477] mb-2 opacity-80" />
              <p className="text-sm font-semibold text-[#242124]">Ask Chopwize anything about food</p>
              <p className="text-xs mt-1 max-w-sm mx-auto">
                E.g. "Find high-protein meals under ₦4,000", or "I need fish pepper soup for a cold evening".
              </p>
            </div>
          )}
        </div>

        {/* Input Composer */}
        <div className="pt-3 border-t border-[#EAE5E9]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteQuery(prompt);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What are you in the mood for? (e.g. egusi and pounded yam)"
              className="flex-1 px-4 py-3 rounded-xl border border-[#EAE5E9] text-sm focus:outline-none focus:ring-2 focus:ring-[#30102F] bg-[#FAF8F4]"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-5 py-3 rounded-xl bg-[#30102F] hover:bg-[#220b22] text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-40 transition-colors"
            >
              <span>Search</span>
              <Send className="w-4 h-4 text-[#CBB477]" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
