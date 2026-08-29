import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, X } from 'lucide-react';
import { useLang } from '../contexts/LangContext';

const PUBLIC_THEMES = [
  { id: 'streetwear', name: 'Streetwear Pro', defaultColor: '#0f172a', tier: 'free', previewImg: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop' },
  { id: 'minimalist', name: 'Minimalist', defaultColor: '#171717', tier: 'free', previewImg: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop' },
  { id: 'uniform-store', name: 'Uniform Pro', defaultColor: '#4f46e5', tier: 'free', previewImg: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop' },
  { id: 'abaya', name: 'Luxury Abaya', defaultColor: '#b48a44', tier: 'pro', previewImg: 'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?q=80&w=800&auto=format&fit=crop' },
  { id: 'sportswear', name: 'Active Sport', defaultColor: '#84cc16', tier: 'pro', previewImg: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop' },
  { id: 'eco', name: 'Eco Nature', defaultColor: '#4d7c0f', tier: 'pro', previewImg: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=800&auto=format&fit=crop' },
  { id: 'kids', name: 'Playful Kids', defaultColor: '#0ea5e9', tier: 'pro', previewImg: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop' },
  { id: 'clement', name: 'Clement Design', defaultColor: '#1e293b', tier: 'pro', previewImg: 'https://images.unsplash.com/photo-1577221084712-45b0445d2b00?q=80&w=800&auto=format&fit=crop' },
  { id: 'xton', name: 'Xton', defaultColor: '#f59e0b', tier: 'pro', previewImg: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop' },
  { id: 'amaza', name: 'Amaza', defaultColor: '#06b6d4', tier: 'pro', previewImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop' },
  { id: 'ochaka', name: 'Ochaka', defaultColor: '#9f1239', tier: 'pro', previewImg: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop' },
  { id: 'mazia', name: 'Mazia', defaultColor: '#ef4444', tier: 'pro', previewImg: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop' },
  { id: 'blush-studio', name: 'Lamode App (Pro)', defaultColor: '#e8a5b5', tier: 'pro', previewImg: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=800&auto=format&fit=crop' },
  { id: 'pop-fashion', name: 'Simple Minimal (Pro)', defaultColor: '#e11d48', tier: 'pro', previewImg: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop' },
  { id: 'fitness-pulse', name: 'Joyride (Pro)', defaultColor: '#7c3aed', tier: 'pro', previewImg: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop' },
  { id: 'editorial-noir', name: 'Lamode Web (Pro)', defaultColor: '#dc2626', tier: 'pro', previewImg: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop' },
  { id: 'emerald-market', name: 'Ultimate Store (Pro)', defaultColor: '#0d9488', tier: 'pro', previewImg: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop' },
  { id: 'atelier', name: 'Atelier Kitchen Wear', defaultColor: '#1a1a1a', tier: 'pro', previewImg: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop' },
];

export default function ThemesStore() {
  const { lang, isAr } = useLang();
  const txt = (ar: string, fr: string, en: string) => lang === 'ar' ? ar : lang === 'en' ? en : fr;
  const [previewTheme, setPreviewTheme] = useState<typeof PUBLIC_THEMES[number] | null>(null);

  useEffect(() => {
    if (!previewTheme) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setPreviewTheme(null); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [previewTheme]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="pt-24 pb-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
            {txt('متجر القوالب', 'Boutique de Thèmes', 'Themes Store')}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {txt(
              'اختر القالب المثالي لمتجرك الإلكتروني وابدأ البيع في دقائق.',
              'Choisissez le thème parfait pour votre boutique en ligne et lancez-vous en quelques minutes.',
              'Choose the perfect theme for your online store and launch in minutes.'
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PUBLIC_THEMES.map((theme) => (
            <div key={theme.id} className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
              <button
                type="button"
                onClick={() => setPreviewTheme(theme)}
                className="aspect-video relative overflow-hidden bg-slate-100 w-full block text-left"
                aria-label={`${txt('شاهد', 'Aperçu de', 'Preview')} ${theme.name}`}
              >
                <img
                  src={theme.previewImg}
                  alt={theme.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-white/90 text-slate-900 text-sm font-bold px-4 py-2 rounded-full">
                    <Eye className="w-4 h-4" /> {txt('شاهد القالب', 'Aperçu', 'Preview')}
                  </span>
                </div>
                {theme.tier === 'pro' && (
                  <span className={`absolute top-3 ${isAr ? 'left-3' : 'right-3'} bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow`}>
                    PRO
                  </span>
                )}
                <span
                  className={`absolute bottom-3 ${isAr ? 'right-3' : 'left-3'} w-3.5 h-3.5 rounded-full ring-2 ring-white shadow`}
                  style={{ backgroundColor: theme.defaultColor }}
                />
              </button>
              <div className="p-5 flex items-center justify-between gap-3">
                <h3 className="font-bold text-slate-900">{theme.name}</h3>
                <Link
                  to="/store-signup"
                  className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1 shrink-0 group/link"
                >
                  {txt('اختر', 'Choisir', 'Choose')}
                  <ArrowRight className={`w-4 h-4 transition-transform group-hover/link:translate-x-1 ${isAr ? 'rotate-180 group-hover/link:-translate-x-1' : ''}`} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {previewTheme && (
        <div
          className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewTheme(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-slate-100">
              <img src={previewTheme.previewImg} alt={previewTheme.name} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setPreviewTheme(null)}
                aria-label={txt('إغلاق', 'Fermer', 'Close')}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {previewTheme.tier === 'pro' && (
                <span className={`absolute top-3 ${isAr ? 'right-14' : 'left-3'} bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow`}>
                  PRO
                </span>
              )}
            </div>
            <div className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full ring-2 ring-slate-200 shrink-0" style={{ backgroundColor: previewTheme.defaultColor }} />
                <h3 className="text-xl font-black text-slate-900">{previewTheme.name}</h3>
              </div>
              <Link
                to="/store-signup"
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2 shrink-0 whitespace-nowrap"
              >
                {txt('اختر هذا القالب', 'Choisir ce thème', 'Choose this theme')}
                <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
