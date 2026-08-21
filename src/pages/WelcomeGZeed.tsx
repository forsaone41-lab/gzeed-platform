import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, LayoutTemplate, Palette, Globe, User, Zap } from 'lucide-react';
import { useLang } from '../contexts/LangContext';

export default function WelcomeGZeed() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { lang, toggle } = useLang();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-screen bg-black text-white font-sans overflow-hidden relative selection:bg-indigo-500/30 flex flex-col">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] mix-blend-screen" style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite reverse' }} />
      </div>

      {/* Header */}
      <header className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')} dir="ltr">
          <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-black text-sm shadow-lg shadow-white/10">GZ</div>
          <span className="font-bold text-white text-xl tracking-tight">GZeed</span>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-colors backdrop-blur-md group relative">
            <Globe className="w-4 h-4 text-white" />
            <span className="absolute -bottom-8 bg-white/10 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase border border-white/5">{lang}</span>
          </button>
          <button onClick={() => navigate('/login')} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-colors backdrop-blur-md">
            <User className="w-4 h-4 text-white" />
          </button>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 w-full max-w-5xl mx-auto" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        
        {/* Welcome Tag */}
        <div className={`transition-all duration-1000 ease-out delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] md:text-[11px] font-bold tracking-wider text-indigo-200 uppercase">
              {lang === 'ar' ? 'مرحباً بك في مستقبل التجارة' : lang === 'fr' ? 'Bienvenue dans le futur du e-commerce' : 'Welcome to the future of commerce'}
            </span>
          </div>
        </div>

        {/* Hero Headline - Apple Style */}
        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black text-center tracking-tighter mb-4 transition-all duration-1000 ease-out delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 pb-1">
            {lang === 'ar' ? 'أطلق مشروعك الرقمي.' : 'Launch your digital project.'}
          </span>
          <span className="block mt-1">{lang === 'ar' ? 'بسهولة واحترافية.' : 'With ease and professionalism.'}</span>
        </h1>

        <p className={`text-base md:text-lg text-slate-400 font-medium text-center max-w-2xl mb-10 transition-all duration-1000 ease-out delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {lang === 'ar' 
            ? 'كل ما تحتاجه لبناء، إدارة، وتوسيع تواجدك على الويب. صُمم خصيصاً للمطورين ورواد الأعمال.' 
            : 'Everything you need to build, manage, and scale your web presence. Designed specifically for developers and entrepreneurs.'}
        </p>

        {/* Feature Cards - Glassmorphism */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full mb-10 transition-all duration-1000 ease-out delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          
          <div className="group p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors backdrop-blur-xl">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold mb-2">{lang === 'ar' ? 'قوالب مذهلة' : 'Stunning Themes'}</h3>
            <p className="text-[13px] text-slate-400 leading-relaxed">
              {lang === 'ar' 
                ? 'اختر من بين قوالب احترافية محسنة لزيادة المبيعات وتبدو كتطبيقات أصلية.' 
                : 'Choose from premium, conversion-optimized templates that feel like native apps.'}
            </p>
          </div>

          <div className="group p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors backdrop-blur-xl">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold mb-2">{lang === 'ar' ? 'أدوات وتطبيقات سريعة' : 'Quick Tools & Apps'}</h3>
            <p className="text-[13px] text-slate-400 leading-relaxed">
              {lang === 'ar' 
                ? 'مجموعة متكاملة من الأدوات والتطبيقات المدمجة لتسريع إطلاق مشروعك.' 
                : 'A complete suite of integrated tools and apps to accelerate your project launch.'}
            </p>
          </div>

          <div className="group p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors backdrop-blur-xl">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold mb-2">{lang === 'ar' ? 'توسع عالمي' : 'Global Scale'}</h3>
            <p className="text-[13px] text-slate-400 leading-relaxed">
              {lang === 'ar' 
                ? 'اربط نطاقك وابدأ في قبول المدفوعات من أي مكان في العالم.' 
                : 'Connect your domain and start accepting payments from anywhere in the world.'}
            </p>
          </div>

        </div>

        {/* CTA Button */}
        <div className={`transition-all duration-1000 ease-out delay-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} pb-8 md:pb-0`}>
          <button 
            onClick={() => navigate('/dashboard')}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-white text-black rounded-full font-bold text-base overflow-hidden hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            <span>{lang === 'ar' ? 'الدخول للوحة التحكم' : 'Enter Dashboard'}</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </div>

      </div>
    </div>
  );
}
