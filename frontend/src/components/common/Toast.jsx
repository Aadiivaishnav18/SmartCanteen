import React from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0" />,
    error: <XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-[#F97316] flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
  };

  const styles = {
    success: 'border-[#16A34A]/30 bg-[#F0FDF4] text-[#15803D]',
    error: 'border-[#EF4444]/30 bg-[#FEE2E2] text-[#B91C1C]',
    warning: 'border-[#F97316]/30 bg-[#FFEDD5] text-[#C2410C]',
    info: 'border-slate-800 bg-[#172018] text-white'
  };

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm animate-pop-in">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md ${styles[toast.type] || styles.info}`}>
        {icons[toast.type] || icons.info}
        <p className="text-xs font-semibold leading-snug">{toast.message}</p>
      </div>
    </div>
  );
};
