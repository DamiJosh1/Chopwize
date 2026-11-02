import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserRound,
  Brain,
  Sliders,
  CalendarDays,
  Gift,
  MapPin,
  ShieldCheck,
  Plus,
  Trash2,
  Check,
  Pause,
  Play,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AIRule } from '../../types';

export const ProfileView: React.FC = () => {
  const {
    customerName,
    setCustomerName,
    selectedLocation,
    tickets,
    aiRules,
    addAIRule,
    toggleAIRule,
    deleteAIRule,
    foodMemories,
    confirmFoodMemory,
    deleteFoodMemory,
    surpriseConfig,
    updateSurpriseConfig,
    showToast,
  } = useApp();

  const [activeProfileTab, setActiveProfileTab] = useState<
    'memory' | 'rules' | 'surprise_delivery' | 'addresses' | 'support'
  >('memory');

  // New Rule Form
  const [newRuleText, setNewRuleText] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<AIRule['category']>('budget');
  const [newRuleIsPermanent, setNewRuleIsPermanent] = useState(true);

  // Address State
  const [savedAddresses, setSavedAddresses] = useState([
    { id: '1', label: 'Home', address: 'Flat 4B, 18 Bisola Durosinmi Etti Drive, Lekki Phase 1, Lagos' },
    { id: '2', label: 'Office', address: 'Victoria Island Office, 12 Adeola Odeku St, Lagos' },
  ]);
  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrText, setNewAddrText] = useState('');
  const [isAddingAddr, setIsAddingAddr] = useState(false);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleText.trim()) return;
    addAIRule(newRuleText.trim(), newRuleCategory, newRuleIsPermanent);
    setNewRuleText('');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLabel.trim() || !newAddrText.trim()) return;
    setSavedAddresses((prev) => [
      ...prev,
      { id: Date.now().toString(), label: newAddrLabel.trim(), address: newAddrText.trim() },
    ]);
    setNewAddrLabel('');
    setNewAddrText('');
    setIsAddingAddr(false);
    showToast('Saved address to profile');
  };

  return (
    <div className="space-y-6 max-w-4xl pb-20">
      
      {/* Profile Header */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAE5E9] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#30102F] text-[#CBB477] flex items-center justify-center font-heading font-extrabold text-2xl shadow-xs">
            {customerName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-xl text-[#242124]">
                {customerName} Bello
              </h1>
              <span className="text-[10px] font-bold text-[#287A55] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active Food Memory
              </span>
            </div>
            <p className="text-xs text-[#716B71] mt-0.5">
              +234 803 555 1290 · {selectedLocation}
            </p>
          </div>
        </div>

        <div className="text-xs text-[#716B71]">
          <span>AI Personality: </span>
          <strong className="text-[#30102F]">Playful, Caring & Nigerian Familiar</strong>
        </div>
      </div>

      {/* Profile Section Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-[#EAE5E9] scrollbar-none text-xs font-bold">
        {[
          { id: 'memory', label: `Food Memory (${foodMemories.length})`, icon: Brain },
          { id: 'rules', label: `Customer AI Rules (${aiRules.length})`, icon: Sliders },
          { id: 'surprise_delivery', label: 'Surprise Delivery Programme', icon: Gift },
          { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
          { id: 'support', label: `Support & Trust (${tickets.length})`, icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeProfileTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveProfileTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 rounded-t-xl transition-colors border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-[#30102F] text-[#30102F] bg-white font-extrabold'
                  : 'border-transparent text-[#716B71] hover:text-[#242124]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-[#CBB477]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: FOOD MEMORY (Section 6) */}
      {activeProfileTab === 'memory' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#FAF3F9] border border-[#30102F]/15 flex items-start gap-3">
            <Brain className="w-5 h-5 text-[#30102F] shrink-0 mt-0.5" />
            <div className="text-xs text-[#242124] leading-relaxed">
              <strong className="font-heading font-bold text-[#30102F] block mb-0.5">
                Transparent Food Memory Architecture
              </strong>
              Chopwize distinguishes between confirmed preferences, past transaction activity, and inferred eating patterns. You have full control to confirm or remove any stored memory.
            </div>
          </div>

          <div className="divide-y divide-[#EAE5E9] bg-white rounded-3xl border border-[#EAE5E9] overflow-hidden">
            {foodMemories.map((mem) => (
              <div key={mem.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-[#242124]">{mem.label}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        mem.confirmedByCustomer
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {mem.confirmedByCustomer ? 'Confirmed Preference' : 'Inferred Pattern'}
                    </span>
                  </div>
                  <p className="text-[#716B71] mt-0.5">{mem.detail}</p>
                  <span className="text-[10px] text-[#716B71]/70 mt-1 block">{mem.dateObserved}</span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {!mem.confirmedByCustomer && (
                    <button
                      onClick={() => confirmFoodMemory(mem.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#30102F] text-white text-xs font-semibold hover:bg-[#220b22]"
                    >
                      Confirm Memory
                    </button>
                  )}
                  <button
                    onClick={() => deleteFoodMemory(mem.id)}
                    className="p-1.5 rounded-lg text-[#716B71] hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove Memory"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMER-DEFINED AI RULES (Section 5) */}
      {activeProfileTab === 'rules' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#EAE5E9] space-y-3">
            <h3 className="font-heading font-bold text-sm text-[#242124]">
              Teach Chopwize AI How to Behave
            </h3>
            <p className="text-xs text-[#716B71] leading-relaxed">
              Define permanent or temporary rules (e.g. price limits, ingredient dislikes, cuisine preferences, cart safeguards).
            </p>

            <form onSubmit={handleAddRule} className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
              <input
                type="text"
                required
                placeholder="e.g. Never recommend food above ₦5,000, or Avoid onions"
                value={newRuleText}
                onChange={(e) => setNewRuleText(e.target.value)}
                className="sm:col-span-6 px-3 py-2 rounded-xl border border-[#EAE5E9] bg-[#FAF8F4]"
              />

              <select
                value={newRuleCategory}
                onChange={(e) => setNewRuleCategory(e.target.value as any)}
                className="sm:col-span-3 px-3 py-2 rounded-xl border border-[#EAE5E9] bg-[#FAF8F4]"
              >
                <option value="budget">Budget Cap Rule</option>
                <option value="ingredient">Ingredient Avoidance</option>
                <option value="cuisine">Cuisine Priority</option>
                <option value="cart_guard">Cart Protection</option>
                <option value="store_preference">Store Consolidation</option>
              </select>

              <button
                type="submit"
                className="sm:col-span-3 px-4 py-2 rounded-xl bg-[#30102F] text-white font-bold hover:bg-[#220b22] flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#CBB477]" />
                <span>Teach Rule</span>
              </button>
            </form>
          </div>

          {/* Active Rules List */}
          <div className="divide-y divide-[#EAE5E9] bg-white rounded-3xl border border-[#EAE5E9] overflow-hidden">
            {aiRules.map((rule) => (
              <div key={rule.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#242124]">{rule.text}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${rule.isActive ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                      {rule.isActive ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#716B71]">
                    {rule.isPermanent ? 'Permanent Rule' : 'Temporary'} · Category: {rule.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAIRule(rule.id)}
                    className="p-1.5 rounded-lg border border-[#EAE5E9] hover:bg-[#FAF8F4] text-[#716B71]"
                    title={rule.isActive ? 'Pause Rule' : 'Resume Rule'}
                  >
                    {rule.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => deleteAIRule(rule.id)}
                    className="p-1.5 text-[#716B71] hover:text-red-600"
                    title="Delete Rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CHOPWIZE SURPRISE DELIVERY (Section 13: Strict Consent Protection) */}
      {activeProfileTab === 'surprise_delivery' && (
        <div className="space-y-4 max-w-xl bg-white rounded-3xl border border-[#EAE5E9] p-6 text-xs">
          <div className="flex items-start gap-3 pb-3 border-b border-[#EAE5E9]">
            <div className="p-2.5 rounded-xl bg-[#FAF3F9] text-[#30102F]">
              <Gift className="w-5 h-5 text-[#CBB477]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#242124]">
                Chopwize Surprise Delivery Programme
              </h3>
              <p className="text-xs text-[#716B71]">
                Receive periodic curated surprise meal invitations. Zero automatic charges.
              </p>
            </div>
          </div>

          {/* Explicit Opt-in Toggle */}
          <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EAE5E9] flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-[#242124]">Enable Surprise Invitations</span>
              <p className="text-[#716B71] text-[11px] mt-0.5">
                Must be explicitly enabled. Invitations require your live confirmation before any payment.
              </p>
            </div>
            <button
              onClick={() => updateSurpriseConfig({ isEnabled: !surpriseConfig.isEnabled })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                surpriseConfig.isEnabled
                  ? 'bg-[#287A55] text-white'
                  : 'bg-white border border-[#EAE5E9] text-[#716B71]'
              }`}
            >
              {surpriseConfig.isEnabled ? 'Opted In' : 'Disabled'}
            </button>
          </div>

          {surpriseConfig.isEnabled && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#242124] mb-1">Invitation Frequency:</label>
                  <select
                    value={surpriseConfig.frequency}
                    onChange={(e) => updateSurpriseConfig({ frequency: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] bg-[#FAF8F4]"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="twice_monthly">Twice Monthly</option>
                    <option value="monthly">Monthly</option>
                    <option value="occasionally">Occasionally</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#242124] mb-1">Max Budget Cap (₦):</label>
                  <input
                    type="number"
                    value={surpriseConfig.maxBudget}
                    onChange={(e) => updateSurpriseConfig({ maxBudget: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] bg-[#FAF8F4]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#242124] mb-1">Preferred Delivery Address:</label>
                <input
                  type="text"
                  value={surpriseConfig.preferredAddress}
                  onChange={(e) => updateSurpriseConfig({ preferredAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] bg-[#FAF8F4]"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-[11px] leading-relaxed">
                <strong>Non-negotiable Payment Protection:</strong> Declining or ignoring a surprise invitation never creates an order or triggers a charge. You must always review the meal details and approve payment explicitly.
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SAVED ADDRESSES */}
      {activeProfileTab === 'addresses' && (
        <div className="space-y-4 bg-white rounded-3xl border border-[#EAE5E9] p-6 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-[#242124]">Saved Delivery Hubs</h3>
            <button
              onClick={() => setIsAddingAddr(!isAddingAddr)}
              className="text-xs font-bold text-[#30102F] hover:underline"
            >
              + Add Address
            </button>
          </div>

          {isAddingAddr && (
            <form onSubmit={handleAddAddress} className="p-4 rounded-xl bg-[#FAF8F4] border border-[#EAE5E9] space-y-2">
              <input
                type="text"
                required
                placeholder="Label (e.g. Work Studio, Mum's Place)"
                value={newAddrLabel}
                onChange={(e) => setNewAddrLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#EAE5E9] bg-white"
              />
              <input
                type="text"
                required
                placeholder="Street address & Lagos/Abuja district"
                value={newAddrText}
                onChange={(e) => setNewAddrText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#EAE5E9] bg-white"
              />
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingAddr(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#EAE5E9] text-[#716B71]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#30102F] text-white font-semibold">
                  Save
                </button>
              </div>
            </form>
          )}

          <div className="divide-y divide-[#EAE5E9]">
            {savedAddresses.map((addr) => (
              <div key={addr.id} className="py-3 flex items-start justify-between">
                <div>
                  <span className="font-bold text-[#242124]">{addr.label}</span>
                  <p className="text-[#716B71] mt-0.5">{addr.address}</p>
                </div>
                <button
                  onClick={() => setSavedAddresses((prev) => prev.filter((a) => a.id !== addr.id))}
                  className="text-[#716B71] hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SUPPORT & AUDIT */}
      {activeProfileTab === 'support' && (
        <div className="p-6 rounded-3xl bg-white border border-[#EAE5E9] space-y-3 text-xs">
          <h3 className="font-heading font-bold text-base text-[#242124]">
            My Support Inquiries & Transaction History
          </h3>
          <div className="divide-y divide-[#EAE5E9]">
            {tickets.map((t) => (
              <div key={t.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#242124]">{t.subject}</span>
                  <p className="text-[10px] text-[#716B71]">{t.createdAt} · Ref: {t.ticketNumber}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.status === 'resolved' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
