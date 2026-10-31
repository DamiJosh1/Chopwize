import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-[#30102F] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-[#CBB477]/30 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150 max-w-sm text-center">
        <CheckCircle2 className="w-4 h-4 text-[#CBB477] shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
