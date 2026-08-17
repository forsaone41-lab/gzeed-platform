import React from 'react';
import { useLang } from '../contexts/LangContext';

export const PageLoader = () => {
  const { isAr } = useLang();
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center relative w-full bg-transparent">
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 border-[3px] border-slate-200/10 rounded-full"></div>
          <div className="absolute inset-0 border-[3px] border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-xs font-bold text-slate-500 tracking-widest animate-pulse">
          {isAr ? 'جاري التحميل...' : 'Chargement...'}
        </p>
      </div>
    </div>
  );
};
