import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useLang } from '../contexts/LangContext';
import PublicFooter from './PublicFooter';

export default function PublicLayout() {
  const { lang, setLang, isAr } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  const txt = (ar: string, fr: string, en: string) => lang === 'ar' ? ar : lang === 'en' ? en : fr;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowIcon(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/">
            <div className="relative h-10 w-24 flex items-center" dir="ltr">
               <div className={`absolute left-0 transition-opacity duration-700 ease-in-out ${showIcon ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <span className={`text-3xl font-black tracking-tighter leading-none ${scrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                    G<span className="text-cyan-500">Zeed</span>
                  </span>
               </div>
               <div className={`absolute left-0 transition-opacity duration-700 ease-in-out ${showIcon ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                 <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.1)]">
                    <span className="text-2xl font-black flex items-center"><span className="text-white">G</span><span className="text-cyan-500">Z</span></span>
                 </div>
               </div>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as 'ar' | 'fr' | 'en')}
              className={`text-xs font-bold transition-colors uppercase tracking-widest bg-transparent outline-none cursor-pointer ${scrolled ? 'text-slate-600' : 'text-slate-600'}`}
              dir="ltr"
            >
              <option value="ar" className="text-slate-900">العربية</option>
              <option value="fr" className="text-slate-900">FR</option>
              <option value="en" className="text-slate-900">EN</option>
            </select>
            <Link to="/login" className={`text-sm font-semibold transition-colors hidden sm:block ${scrolled ? 'text-slate-900 hover:text-cyan-600' : 'text-slate-900 hover:text-cyan-600'}`}>
              {txt('تسجيل الدخول', 'Se Connecter', 'Log In')}
            </Link>
            <Link to="/store-signup" className="px-6 py-2.5 rounded-md bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-700 transition-all shadow-md">
              {txt('ابدأ الآن', 'Commencer', 'Get Started')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-24">
        <Outlet />
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
