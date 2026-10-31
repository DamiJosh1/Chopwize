import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserRound,
  MapPin,
  Heart,
  ShieldCheck,
  Bell,
  HelpCircle,
  LogOut,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  FileText,
  KeyRound,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { selectedLocation, tickets, showToast, setRole } = useApp();

  const [userName, setUserName] = useState('Amina Bello');
  const [userPhone, setUserPhone] = useState('+234 803 555 1290');
  const [userEmail, setUserEmail] = useState('amina.bello@lagosfoodie.ng');
  const [savedAddresses, setSavedAddresses] = useState([
    { id: '1', label: 'Home', address: 'Flat 4B, 18 Bisola Durosinmi Etti Drive, Lekki Phase 1, Lagos' },
    { id: '2', label: 'Office', address: 'Victoria Island Office, 12 Adeola Odeku St, Lagos' },
  ]);
  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrText, setNewAddrText] = useState('');
  const [isAddingAddr, setIsAddingAddr] = useState(false);

  // Dietary and allergies
  const [allergies, setAllergies] = useState<string[]>(['Crustaceans']);
  const [newAllergy, setNewAllergy] = useState('');
  const [prefSpice, setPrefSpice] = useState<'Mild' | 'Medium' | 'Spicy'>('Medium');

  // OTP Demo Simulation
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');

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

  const removeAddress = (id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Address removed');
  };

  const addAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergy.trim()) return;
    if (!allergies.includes(newAllergy.trim())) {
      setAllergies((prev) => [...prev, newAllergy.trim()]);
      showToast(`Added ${newAllergy.trim()} to hard food filter`);
    }
    setNewAllergy('');
  };

  const removeAllergy = (alg: string) => {
    setAllergies((prev) => prev.filter((a) => a !== alg));
    showToast(`Removed ${alg} exclusion`);
  };

  return (
    <div className="space-y-6 max-w-3xl pb-20">
      
      {/* Profile Header */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAE5E9] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#30102F] text-white flex items-center justify-center font-heading font-extrabold text-xl shadow-xs">
            AB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-xl text-[#242124]">
                {userName}
              </h1>
              <span className="text-[10px] font-bold text-[#287A55] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified Customer
              </span>
            </div>
            <p className="text-xs text-[#716B71] mt-0.5">{userPhone} · {userEmail}</p>
          </div>
        </div>

        <button
          onClick={() => setIsSignOutModalOpen(true)}
          className="px-3.5 py-2 rounded-xl border border-[#EAE5E9] hover:bg-[#FAF8F4] text-xs font-semibold text-[#716B71] flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Switch / Re-login</span>
        </button>
      </div>

      {/* Saved Addresses */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAE5E9] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#30102F]" />
            <h2 className="font-heading font-bold text-base text-[#242124]">
              Saved Addresses
            </h2>
          </div>
          <button
            onClick={() => setIsAddingAddr(!isAddingAddr)}
            className="text-xs font-bold text-[#30102F] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </button>
        </div>

        {isAddingAddr && (
          <form onSubmit={handleAddAddress} className="p-4 rounded-xl bg-[#FAF8F4] border border-[#EAE5E9] space-y-2 text-xs">
            <input
              type="text"
              required
              placeholder="Label (e.g. Mum's Place, Studio)"
              value={newAddrLabel}
              onChange={(e) => setNewAddrLabel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#EAE5E9] bg-white"
            />
            <input
              type="text"
              required
              placeholder="Street address & area"
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
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#30102F] text-white font-semibold"
              >
                Save
              </button>
            </div>
          </form>
        )}

        <div className="divide-y divide-[#EAE5E9]">
          {savedAddresses.map((addr) => (
            <div key={addr.id} className="py-3 flex items-start justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-[#242124]">{addr.label}</span>
                <p className="text-[#716B71] mt-0.5">{addr.address}</p>
              </div>
              <button
                onClick={() => removeAddress(addr.id)}
                className="text-[#716B71] hover:text-red-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Food Preferences & Strict Allergy Restrictions */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAE5E9] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#9A6A18]" />
          <h2 className="font-heading font-bold text-base text-[#242124]">
            Food Allergies & Health Hard Filters
          </h2>
        </div>
        <p className="text-xs text-[#716B71]">
          Chopwize uses these to automatically exclude unsafe dishes across search, AI concierge, and surprise picks.
        </p>

        {/* Existing allergies */}
        <div className="flex flex-wrap gap-2">
          {allergies.map((alg) => (
            <span
              key={alg}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-50 text-red-800 text-xs font-semibold border border-red-200"
            >
              <span>{alg}</span>
              <button
                onClick={() => removeAllergy(alg)}
                className="text-red-600 hover:text-red-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Add custom allergy */}
        <form onSubmit={addAllergy} className="flex gap-2">
          <input
            type="text"
            placeholder="Add allergen to avoid (e.g. Shellfish, Peanuts)"
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-[#EAE5E9] text-xs bg-[#FAF8F4]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#30102F] text-white text-xs font-semibold"
          >
            Add Rule
          </button>
        </form>

        <div className="pt-3 border-t border-[#EAE5E9]">
          <label className="block text-xs font-bold text-[#242124] mb-2">
            Default Spice Level Preference
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Mild', 'Medium', 'Spicy'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setPrefSpice(s);
                  showToast(`Preferred spice tolerance set to ${s}`);
                }}
                className={`py-2 text-xs font-semibold rounded-xl border text-center transition-colors ${
                  prefSpice === s
                    ? 'border-[#30102F] bg-[#FAF3F9] text-[#30102F]'
                    : 'border-[#EAE5E9] bg-white text-[#716B71]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Support Case History */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAE5E9] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#30102F]" />
          <h2 className="font-heading font-bold text-base text-[#242124]">
            My Support Inquiries ({tickets.length})
          </h2>
        </div>
        <div className="divide-y divide-[#EAE5E9]">
          {tickets.map((t) => (
            <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
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

      {/* Switch / Sign In Simulation Modal */}
      {isSignOutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#EAE5E9]">
            <h3 className="font-heading font-bold text-base text-[#242124] mb-1">
              Chopwize Account Sign-In
            </h3>
            <p className="text-xs text-[#716B71] mb-4">
              Enter phone or email for instant SMS OTP verification (Nigeria)
            </p>

            {!otpStep ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#242124] mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    defaultValue="+234 803 555 1290"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] bg-[#FAF8F4]"
                  />
                </div>
                <button
                  onClick={() => setOtpStep(true)}
                  className="w-full py-2.5 rounded-xl bg-[#30102F] text-white font-bold"
                >
                  Send OTP Code
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-[#287A55] font-semibold text-[11px]">
                  ✓ 6-digit OTP code sent to +234 803 555 1290
                </p>
                <div>
                  <label className="block font-semibold text-[#242124] mb-1">Enter OTP PIN</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="849201"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5E9] font-mono text-center tracking-widest text-base"
                  />
                </div>
                <button
                  onClick={() => {
                    setIsSignOutModalOpen(false);
                    setOtpStep(false);
                    showToast('Welcome back, Amina!');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#30102F] text-white font-bold"
                >
                  Confirm & Sign In
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setIsSignOutModalOpen(false);
                setOtpStep(false);
              }}
              className="w-full mt-3 text-xs text-[#716B71] hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
