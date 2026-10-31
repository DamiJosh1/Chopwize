import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarDays,
  Wallet,
  Users,
  Gift,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Share2,
  ShoppingBag,
} from 'lucide-react';
import { MealTimetableEntry } from '../../types';

export const PlansView: React.FC = () => {
  const {
    budget,
    addBudgetExpense,
    updateMonthlyBudget,
    timetable,
    addTimetableEntry,
    removeTimetableEntry,
    setTimetable,
    menuItems,
    addToCart,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'timetable' | 'budget' | 'group' | 'gift' | 'subscriptions'
  >('timetable');

  // Timetable Form
  const [newDay, setNewDay] = useState<MealTimetableEntry['day']>('Monday');
  const [newSlot, setNewSlot] = useState<MealTimetableEntry['mealSlot']>('Lunch');
  const [newDish, setNewDish] = useState('');
  const [newServings, setNewServings] = useState(2);
  const [isGeneratingAITable, setIsGeneratingAITable] = useState(false);

  // Budget Form
  const [isEditingBudgetCap, setIsEditingBudgetCap] = useState(false);
  const [budgetCapInput, setBudgetCapInput] = useState(budget.monthlyBudget);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<'groceries' | 'external_dining'>('groceries');

  // Group Order State
  const [groupLinkCopied, setGroupLinkCopied] = useState(false);
  const [groupParticipants, setGroupParticipants] = useState([
    { name: 'Amina Bello (Host)', item: 'Signature Party Jollof with Goat Meat', price: 4200 },
    { name: 'Kelechi Nwosu', item: 'Native Asun Fried Rice with Crisp Pepper', price: 4600 },
    { name: 'Folake Adeyemi', item: 'Catfish Pepper Soup with Yam', price: 4900 },
  ]);

  // Food Gift Form
  const [giftRecipient, setGiftRecipient] = useState('');
  const [giftPhone, setGiftPhone] = useState('');
  const [giftAddress, setGiftAddress] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [selectedGiftDishId, setSelectedGiftDishId] = useState('m1');

  // AI Timetable Generator
  const handleGenerateAIMealPlan = async () => {
    setIsGeneratingAITable(true);
    try {
      const res = await fetch('/api/ai/meal-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weeklyBudget: 35000,
          householdSize: 2,
        }),
      });
      const data = await res.json();
      if (data.timetable && Array.isArray(data.timetable)) {
        const generated: MealTimetableEntry[] = [];
        data.timetable.forEach((item: any, idx: number) => {
          generated.push({
            id: `tt-gen-${Date.now()}-${idx}-b`,
            day: item.day,
            mealSlot: 'Breakfast',
            dishName: item.breakfast,
            servings: 2,
            time: '08:00 AM',
          });
          generated.push({
            id: `tt-gen-${Date.now()}-${idx}-l`,
            day: item.day,
            mealSlot: 'Lunch',
            dishName: item.lunch,
            servings: 2,
            time: '01:30 PM',
          });
          generated.push({
            id: `tt-gen-${Date.now()}-${idx}-d`,
            day: item.day,
            mealSlot: 'Dinner',
            dishName: item.dinner,
            servings: 2,
            time: '07:30 PM',
          });
        });
        setTimetable(generated);
        showToast('Generated 7-day Nigerian meal schedule!');
      }
    } catch (err) {
      console.error(err);
      showToast('Loaded standard Nigerian meal timetable');
    } finally {
      setIsGeneratingAITable(false);
    }
  };

  const handleAddManualMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.trim()) return;
    addTimetableEntry({
      day: newDay,
      mealSlot: newSlot,
      dishName: newDish.trim(),
      servings: newServings,
    });
    setNewDish('');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(expenseAmount);
    if (!expenseTitle.trim() || isNaN(amt) || amt <= 0) return;
    addBudgetExpense(expenseTitle.trim(), amt, expenseCategory);
    setExpenseTitle('');
    setExpenseAmount('');
    showToast('Recorded food expense');
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

  const remainingBudget = budget.monthlyBudget - budget.recordedSpending;
  const budgetPercentUsed = Math.min(100, Math.round((budget.recordedSpending / budget.monthlyBudget) * 100));

  const handleGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftRecipient.trim() || !giftPhone.trim() || !giftAddress.trim()) return;
    const dish = menuItems.find((m) => m.id === selectedGiftDishId) || menuItems[0];
    addToCart(dish);
    showToast(`Food gift prepared for ${giftRecipient}! Proceed to checkout to send.`);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#242124]">
          Plans, Budget & Convenience
        </h1>
        <p className="text-xs text-[#716B71] mt-0.5">
          Schedule weekly home & bukka meals, manage food spending, and organize office trays
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-[#EAE5E9] scrollbar-none">
        {[
          { id: 'timetable', label: 'Meal Timetable', icon: CalendarDays },
          { id: 'budget', label: 'Food Budget Planner', icon: Wallet },
          { id: 'group', label: 'Group / Office Order', icon: Users },
          { id: 'gift', label: 'Send Food Gift', icon: Gift },
          { id: 'subscriptions', label: 'Weekly Meal Plans', icon: CheckCircle2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold rounded-t-xl transition-colors whitespace-nowrap border-b-2 ${
                isActive
                  ? 'border-[#30102F] text-[#30102F] bg-white'
                  : 'border-transparent text-[#716B71] hover:text-[#242124]'
              }`}
            >
              <Icon className="w-4 h-4 text-[#CBB477]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Meal Timetable */}
      {activeTab === 'timetable' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF3F9] p-4 rounded-2xl border border-[#30102F]/15">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#CBB477]" />
                <h3 className="font-heading font-bold text-sm text-[#30102F]">
                  Weekly Balanced Nigerian Menu Planner
                </h3>
              </div>
              <p className="text-xs text-[#716B71] mt-0.5">
                Stops daily decision fatigue. Auto-generates staple dishes tailored to your taste.
              </p>
            </div>
            <button
              onClick={handleGenerateAIMealPlan}
              disabled={isGeneratingAITable}
              className="px-4 py-2 rounded-xl bg-[#30102F] hover:bg-[#220b22] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#CBB477]" />
              <span>{isGeneratingAITable ? 'Planning week...' : 'Auto-Generate with AI'}</span>
            </button>
          </div>

          {/* Add Meal Entry Form */}
          <form onSubmit={handleAddManualMeal} className="p-4 rounded-2xl bg-white border border-[#EAE5E9] shadow-xs space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#716B71]">
              Add Meal Slot to Schedule
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <select
                value={newDay}
                onChange={(e) => setNewDay(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-[#EAE5E9] text-xs bg-[#FAF8F4] text-[#242124]"
              >
                {daysOfWeek.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-[#EAE5E9] text-xs bg-[#FAF8F4] text-[#242124]"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>

              <input
                type="text"
                required
                placeholder="Dish name (e.g. Asaro / Yam Porridge)"
                value={newDish}
                onChange={(e) => setNewDish(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#EAE5E9] text-xs bg-white text-[#242124] focus:outline-none focus:ring-2 focus:ring-[#30102F]"
              />

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#30102F] text-white text-xs font-bold hover:bg-[#220b22] flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save to Plan</span>
              </button>
            </div>
          </form>

          {/* Weekly Schedule View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {daysOfWeek.map((day) => {
              const dayMeals = timetable.filter((t) => t.day === day);
              return (
                <div key={day} className="rounded-2xl bg-white border border-[#EAE5E9] p-4 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAE5E9] mb-3">
                    <span className="font-heading font-bold text-sm text-[#30102F]">{day}</span>
                    <span className="text-[11px] text-[#716B71]">{dayMeals.length} slots</span>
                  </div>

                  {dayMeals.length === 0 ? (
                    <p className="text-xs text-[#716B71]/70 italic py-4 text-center">No meals planned</p>
                  ) : (
                    <div className="space-y-2">
                      {dayMeals.map((meal) => (
                        <div key={meal.id} className="p-2.5 rounded-xl bg-[#FAF8F4] border border-[#EAE5E9] flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#9A6A18] tracking-wider block">
                              {meal.mealSlot} {meal.time ? `· ${meal.time}` : ''}
                            </span>
                            <p className="text-xs font-semibold text-[#242124] mt-0.5">{meal.dishName}</p>
                            <span className="text-[10px] text-[#716B71]">Serves {meal.servings}</span>
                          </div>
                          <button
                            onClick={() => removeTimetableEntry(meal.id)}
                            className="text-[#716B71] hover:text-red-600 p-1"
                            title="Remove from plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Food Budget Planner */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#EAE5E9] shadow-xs">
              <span className="text-xs font-semibold text-[#716B71]">Monthly Food Budget</span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="font-heading font-extrabold text-2xl text-[#30102F] tabular-nums">
                  ₦{budget.monthlyBudget.toLocaleString()}
                </span>
                <button
                  onClick={() => setIsEditingBudgetCap(!isEditingBudgetCap)}
                  className="text-xs text-[#30102F] underline hover:font-bold"
                >
                  Edit
                </button>
              </div>
              {isEditingBudgetCap && (
                <div className="mt-2 flex gap-1.5">
                  <input
                    type="number"
                    value={budgetCapInput}
                    onChange={(e) => setBudgetCapInput(Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border rounded-lg bg-[#FAF8F4]"
                  />
                  <button
                    onClick={() => {
                      updateMonthlyBudget(budgetCapInput);
                      setIsEditingBudgetCap(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#30102F] text-white text-xs font-semibold"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EAE5E9] shadow-xs">
              <span className="text-xs font-semibold text-[#716B71]">Total Spending Recorded</span>
              <p className="font-heading font-extrabold text-2xl text-[#242124] tabular-nums mt-1">
                ₦{budget.recordedSpending.toLocaleString()}
              </p>
              <div className="w-full bg-[#EAE5E9] h-2 rounded-full mt-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    budgetPercentUsed > 90 ? 'bg-[#B33B43]' : 'bg-[#287A55]'
                  }`}
                  style={{ width: `${budgetPercentUsed}%` }}
                />
              </div>
              <span className="text-[10px] text-[#716B71] mt-1 block">
                {budgetPercentUsed}% of monthly target spent
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EAE5E9] shadow-xs">
              <span className="text-xs font-semibold text-[#716B71]">Estimated Remaining</span>
              <p className={`font-heading font-extrabold text-2xl tabular-nums mt-1 ${remainingBudget < 10000 ? 'text-[#B33B43]' : 'text-[#287A55]'}`}>
                ₦{remainingBudget.toLocaleString()}
              </p>
              <span className="text-[10px] text-[#716B71] mt-1 block">
                Pacing guide: ~₦{(Math.max(0, remainingBudget) / 14).toFixed(0)} / day for balance of month
              </span>
            </div>
          </div>

          {/* Breakdown Split: Home Cooking vs Chopwize / Dining */}
          <div className="p-4 rounded-2xl bg-white border border-[#EAE5E9] flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
            <div>
              <span className="text-xs text-[#716B71]">Market & Home Groceries</span>
              <p className="font-bold text-base text-[#242124] tabular-nums mt-0.5">
                ₦{budget.homeCookingSpending.toLocaleString()}
              </p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-[#EAE5E9]" />
            <div>
              <span className="text-xs text-[#716B71]">Chopwize & Restaurant Orders</span>
              <p className="font-bold text-base text-[#30102F] tabular-nums mt-0.5">
                ₦{budget.restaurantSpending.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Manual Expense Logger */}
          <form onSubmit={handleAddExpense} className="p-4 rounded-2xl bg-white border border-[#EAE5E9] space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#716B71]">
              Log External Grocery / Market Purchase
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                required
                placeholder="Item / Store (e.g. Mile 12 Market peppers)"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#EAE5E9] text-xs bg-white text-[#242124]"
              />
              <input
                type="number"
                required
                placeholder="Amount in ₦ (e.g. 8500)"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#EAE5E9] text-xs bg-white text-[#242124]"
              />
              <select
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-[#EAE5E9] text-xs bg-[#FAF8F4] text-[#242124]"
              >
                <option value="groceries">Groceries / Market</option>
                <option value="external_dining">Other Dining</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#30102F] text-white text-xs font-bold hover:bg-[#220b22]"
              >
                Log Expense
              </button>
            </div>
          </form>

          {/* Expense Log Table */}
          <div className="rounded-2xl bg-white border border-[#EAE5E9] p-4">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#716B71] mb-3">
              Recent Food Expenses Log
            </h4>
            <div className="divide-y divide-[#EAE5E9]">
              {budget.expenses.map((exp) => (
                <div key={exp.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#242124]">{exp.title}</span>
                    <span className="text-[10px] text-[#716B71] block">{exp.date} · {exp.category.toUpperCase()}</span>
                  </div>
                  <span className="font-bold text-[#242124] tabular-nums">₦{exp.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Group Order */}
      {activeTab === 'group' && (
        <div className="space-y-5 max-w-2xl bg-white rounded-3xl border border-[#EAE5E9] p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF3F9] text-[#30102F] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-[#CBB477]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-[#242124]">
                Office & Group Lunch Order
              </h3>
              <p className="text-xs text-[#716B71] mt-0.5">
                Host orders from one restaurant; colleagues choose their own meals before cutoff. One payment, packaged individually.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#EAE5E9] flex items-center justify-between">
            <div className="text-xs">
              <span className="text-[#716B71]">Group Order Link: </span>
              <span className="font-mono font-bold text-[#30102F]">chopwize.ng/group/CW-OFFICE-882</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText('https://chopwize.ng/group/CW-OFFICE-882');
                setGroupLinkCopied(true);
                setTimeout(() => setGroupLinkCopied(false), 2000);
              }}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#EAE5E9] text-xs font-semibold text-[#30102F] hover:bg-[#FAF3F9] flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{groupLinkCopied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Participant selections */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#716B71] mb-2">
              Joined Participants ({groupParticipants.length})
            </h4>
            <div className="space-y-2">
              {groupParticipants.map((part, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-[#EAE5E9] bg-white flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[#242124]">{part.name}</span>
                    <p className="text-[11px] text-[#716B71] mt-0.5">{part.item}</p>
                  </div>
                  <span className="font-bold text-[#30102F] tabular-nums">₦{part.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#EAE5E9] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#716B71]">Combined Group Total:</span>
              <p className="font-heading font-extrabold text-lg text-[#30102F] tabular-nums">
                ₦{groupParticipants.reduce((s, p) => s + p.price, 0).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => {
                showToast('Group order combined into tray for host checkout');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#30102F] text-white text-xs font-bold hover:bg-[#220b22]"
            >
              Lock Order & Checkout
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Food Gifting */}
      {activeTab === 'gift' && (
        <form onSubmit={handleGiftSubmit} className="space-y-4 max-w-xl bg-white rounded-3xl border border-[#EAE5E9] p-6 text-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-[#EAE5E9]">
            <div className="p-2.5 rounded-xl bg-[#FAF3F9] text-[#30102F]">
              <Gift className="w-5 h-5 text-[#CBB477]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#242124]">Send a Warm Nigerian Food Gift</h3>
              <p className="text-xs text-[#716B71]">Send hot pepper soup or party jollof with a personal note</p>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#242124] mb-1">Select Gift Meal:</label>
            <select
              value={selectedGiftDishId}
              onChange={(e) => setSelectedGiftDishId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] bg-[#FAF8F4]"
            >
              {menuItems.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.restaurantName} (₦{m.price.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#242124] mb-1">Recipient Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. Tolani"
                value={giftRecipient}
                onChange={(e) => setGiftRecipient(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#242124] mb-1">Recipient Phone:</label>
              <input
                type="tel"
                required
                placeholder="+234 800 000 0000"
                value={giftPhone}
                onChange={(e) => setGiftPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#242124] mb-1">Recipient Address:</label>
            <input
              type="text"
              required
              placeholder="Full delivery address for recipient"
              value={giftAddress}
              onChange={(e) => setGiftAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#242124] mb-1">Personal Gift Message:</label>
            <textarea
              rows={2}
              placeholder="e.g. Happy birthday bro! Enjoy this fresh meal from Terra Kulture!"
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#30102F] text-white text-xs font-bold hover:bg-[#220b22] flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4 text-[#CBB477]" />
            <span>Prepare Gift & Add to Tray</span>
          </button>
        </form>
      )}

      {/* TAB 5: Gated Subscriptions UI */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4 max-w-2xl bg-white rounded-3xl border border-[#EAE5E9] p-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE5E9]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A6A18] bg-[#FDFBF7] px-2 py-0.5 rounded border border-[#CBB477]/30">
                Partner-Managed Subscription
              </span>
              <h3 className="font-heading font-bold text-base text-[#242124] mt-1">
                Lekki Executive Weekly Lunch Pass (5 Meals)
              </h3>
            </div>
            <span className="font-heading font-extrabold text-lg text-[#30102F] tabular-nums">
              ₦18,500 <span className="text-xs font-normal text-[#716B71]">/ week</span>
            </span>
          </div>

          <div className="space-y-2 text-xs text-[#242124]">
            <p className="text-[#716B71]">
              Pre-booked hot lunches delivered to your office desk Monday through Friday between 12:30 PM – 1:15 PM from verified partner kitchens.
            </p>
            <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#EAE5E9] space-y-1 text-[11px] text-[#716B71]">
              <p>• <strong>Included meals:</strong> 5 standard rice or swallow dishes</p>
              <p>• <strong>Redemption rules:</strong> 1 meal per business day</p>
              <p>• <strong>Pause or skip:</strong> Allowed up to 8:00 AM on the day of delivery</p>
              <p>• <strong>Cancellation:</strong> Refund for unredeemed meals within 7 days</p>
            </div>
          </div>

          <button
            onClick={() => showToast('Subscription request submitted to partner kitchen')}
            className="w-full py-3 rounded-xl bg-[#30102F] text-white text-xs font-bold hover:bg-[#220b22]"
          >
            Subscribe to Weekly Lunch Pass
          </button>
        </div>
      )}

    </div>
  );
};
