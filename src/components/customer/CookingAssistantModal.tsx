import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChefHat, X, Clock, Users, ArrowRight, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { MenuItem } from '../../types';

interface GeneratedRecipe {
  title: string;
  cookingTime: number;
  servings: number;
  ingredientsUsed: string[];
  missingIngredients: string[];
  steps: string[];
  matchingChopwizeItem?: {
    id: string;
    name: string;
    restaurant: string;
    price: number;
  };
}

export const CookingAssistantModal: React.FC = () => {
  const {
    isCookingAssistantOpen,
    setIsCookingAssistantOpen,
    menuItems,
    addToCart,
    showToast,
  } = useApp();

  const [ingredients, setIngredients] = useState('');
  const [timeMinutes, setTimeMinutes] = useState(30);
  const [mealType, setMealType] = useState('Dinner');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<GeneratedRecipe[]>([]);

  if (!isCookingAssistantOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/ai/cooking-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: ingredients.trim(),
          timeMinutes,
          mealType,
        }),
      });
      const data = await res.json();
      setRecipes(data.recipes || []);
    } catch (err) {
      console.error('Cooking Assistant error:', err);
      showToast('Loaded offline culinary suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAlternative = (match: NonNullable<GeneratedRecipe['matchingChopwizeItem']>) => {
    const item = menuItems.find((m) => m.id === match.id) || menuItems[0];
    addToCart(item);
    setIsCookingAssistantOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#EAE5E9] max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-labelledby="cooking-dialog-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE5E9]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF3F9] text-[#30102F]">
              <ChefHat className="w-5 h-5 text-[#CBB477]" />
            </div>
            <div>
              <h2 id="cooking-dialog-title" className="font-heading font-bold text-lg text-[#242124]">
                Home Cooking Assistant
              </h2>
              <p className="text-xs text-[#716B71]">Turn available ingredients into authentic Nigerian dishes</p>
            </div>
          </div>
          <button
            onClick={() => setIsCookingAssistantOpen(false)}
            className="p-2 text-[#716B71] hover:text-[#242124] rounded-lg hover:bg-[#FAF8F4] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Input Form */}
          <form onSubmit={handleGenerate} className="space-y-3 bg-[#FAF8F4] p-4 rounded-xl border border-[#EAE5E9]">
            <div>
              <label className="block text-xs font-bold text-[#242124] mb-1">
                Ingredients you have at home:
              </label>
              <textarea
                rows={2}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g. Yam, eggs, red onions, groundnut oil, tomatoes, dry pepper"
                className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] text-xs focus:outline-none focus:ring-2 focus:ring-[#30102F] bg-white resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#716B71] mb-1">
                  Time Available (Mins)
                </label>
                <select
                  value={timeMinutes}
                  onChange={(e) => setTimeMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] text-xs bg-white text-[#242124] focus:outline-none focus:ring-2 focus:ring-[#30102F]"
                >
                  <option value={15}>15 mins (Quick fix)</option>
                  <option value={30}>30 mins (Standard meal)</option>
                  <option value={45}>45 mins (Simmered soup)</option>
                  <option value={60}>60+ mins (Elaborate pot)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#716B71] mb-1">
                  Meal Type
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] text-xs bg-white text-[#242124] focus:outline-none focus:ring-2 focus:ring-[#30102F]"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Light Snack">Light Snack</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !ingredients.trim()}
              className="w-full py-2.5 rounded-xl bg-[#30102F] hover:bg-[#220b22] text-white text-xs font-bold transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#CBB477]" />
              <span>{loading ? 'Designing recipes...' : 'Suggest Home Recipes'}</span>
            </button>
          </form>

          {/* Results Display */}
          {recipes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#716B71]">
                Culinary Suggestions
              </h3>
              {recipes.map((recipe, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-[#EAE5E9] bg-white shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#242124]">
                        {recipe.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-[#716B71] mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#30102F]" />
                          {recipe.cookingTime} mins
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-[#30102F]" />
                          {recipe.servings} serving(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Steps */}
                  <div>
                    <p className="text-[11px] font-bold text-[#716B71] uppercase mb-1">Preparation Steps:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-[#242124] leading-relaxed">
                      {recipe.steps.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Missing ingredients */}
                  {recipe.missingIngredients?.length > 0 && (
                    <div className="text-xs text-[#9A6A18] bg-[#FDFBF7] p-2.5 rounded-lg border border-[#CBB477]/30">
                      <strong>Missing items to check:</strong> {recipe.missingIngredients.join(', ')}
                    </div>
                  )}

                  {/* Order restaurant alternative option if available */}
                  {recipe.matchingChopwizeItem && (
                    <div className="pt-2 border-t border-[#EAE5E9] flex items-center justify-between gap-2">
                      <div className="text-xs">
                        <span className="text-[#716B71]">Rather not cook? </span>
                        <span className="font-semibold text-[#242124]">
                          {recipe.matchingChopwizeItem.name}
                        </span>
                        <span className="text-[#30102F] font-bold ml-1">
                          ₦{recipe.matchingChopwizeItem.price.toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleOrderAlternative(recipe.matchingChopwizeItem!)}
                        className="py-1.5 px-3 rounded-lg bg-[#FAF3F9] text-[#30102F] hover:bg-[#30102F] hover:text-white text-xs font-semibold border border-[#30102F]/20 transition-colors flex items-center gap-1 shrink-0"
                      >
                        <ShoppingBag className="w-3 h-3 text-[#CBB477]" />
                        <span>Order This</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
