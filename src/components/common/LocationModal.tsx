import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, X, Check, Navigation } from 'lucide-react';

export const LocationModal: React.FC = () => {
  const { isLocationModalOpen, setIsLocationModalOpen, selectedLocation, setSelectedLocation, showToast } = useApp();
  const [customAddress, setCustomAddress] = useState('');

  if (!isLocationModalOpen) return null;

  const popularZones = [
    { city: 'Lagos', zone: 'Lekki Phase 1, Lagos', desc: 'Admiralty Way, Freedom Way & environs' },
    { city: 'Lagos', zone: 'Victoria Island, Lagos', desc: 'Ahmadu Bello, Adeola Odeku, Tiamiyu Savage' },
    { city: 'Lagos', zone: 'Ikoyi, Lagos', desc: 'Bourbillon, Alexander, Banana Island' },
    { city: 'Lagos', zone: 'Ikeja GRA, Lagos', desc: 'Isaac John, Allen Avenue & environs' },
    { city: 'Lagos', zone: 'Yaba, Lagos', desc: 'Commercial Ave, Herbert Macaulay' },
    { city: 'Abuja', zone: 'Abuja Central, FCT', desc: 'Maitama, Wuse 2, Garki districts' }
  ];

  const handleSelect = (zone: string) => {
    setSelectedLocation(zone);
    setIsLocationModalOpen(false);
    showToast(`Service location set to ${zone}`);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAddress.trim()) return;
    setSelectedLocation(customAddress.trim());
    setIsLocationModalOpen(false);
    showToast(`Delivery address set to ${customAddress.trim()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#EAE5E9] relative animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-labelledby="location-dialog-title"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FAF3F9] text-[#30102F]">
              <MapPin className="w-5 h-5 text-[#30102F]" />
            </div>
            <div>
              <h2 id="location-dialog-title" className="font-heading font-bold text-lg text-[#242124]">
                Choose Delivery Location
              </h2>
              <p className="text-xs text-[#716B71]">
                Prices, restaurant delivery availability & ETA depend on your area
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-2 text-[#716B71] hover:text-[#242124] rounded-lg hover:bg-[#FAF8F4] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current GPS Simulation */}
        <button
          onClick={() => handleSelect('Lekki Phase 1, Lagos')}
          className="w-full mb-4 flex items-center gap-3 p-3 rounded-xl border border-[#CBB477]/40 bg-[#FDFBF7] hover:bg-[#FAF3F9] text-left transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#CBB477]/20 flex items-center justify-center text-[#30102F]">
            <Navigation className="w-4 h-4 text-[#30102F]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#30102F]">Use Current GPS Location</span>
              <span className="text-[10px] font-semibold text-[#716B71] bg-white px-1.5 py-0.5 rounded border border-[#EAE5E9]">
                Detected
              </span>
            </div>
            <p className="text-xs text-[#716B71]">Lekki Phase 1, Lagos (High accuracy)</p>
          </div>
        </button>

        {/* Manual Address Input */}
        <form onSubmit={handleCustomSubmit} className="mb-4">
          <label htmlFor="manual-address-input" className="block text-xs font-semibold text-[#242124] mb-1.5">
            Or enter specific street address
          </label>
          <div className="flex gap-2">
            <input
              id="manual-address-input"
              type="text"
              placeholder="e.g. 15 Adeola Odeku St, Victoria Island"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#EAE5E9] text-sm focus:outline-none focus:ring-2 focus:ring-[#30102F] bg-[#FAF8F4]"
            />
            <button
              type="submit"
              disabled={!customAddress.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#30102F] text-white text-xs font-semibold hover:bg-[#220b22] disabled:opacity-40 transition-colors"
            >
              Apply
            </button>
          </div>
        </form>

        {/* Popular Zones List */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#716B71] mb-2">
            Supported Delivery Hubs
          </h3>
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {popularZones.map((z) => {
              const isSelected = selectedLocation.includes(z.zone.split(',')[0]);
              return (
                <button
                  key={z.zone}
                  onClick={() => handleSelect(z.zone)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left border transition-colors ${
                    isSelected
                      ? 'border-[#30102F] bg-[#FAF3F9]'
                      : 'border-[#EAE5E9] bg-white hover:bg-[#FAF8F4]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#242124]">{z.zone}</span>
                      <span className="text-[10px] font-medium text-[#716B71]">{z.city}</span>
                    </div>
                    <p className="text-xs text-[#716B71] mt-0.5">{z.desc}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#30102F] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
