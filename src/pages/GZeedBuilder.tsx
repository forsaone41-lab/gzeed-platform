import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Monitor, 
  Smartphone, 
  Save, 
  Settings, 
  Palette, 
  Layout, 
  Layers,
  Play,
  CheckCircle2,
  Undo,
  Redo,
  Box,
  Plus,
  ExternalLink
} from 'lucide-react';
import { useLang } from '../contexts/LangContext';

export default function GZeedBuilder() {
  const { lang, isAr } = useLang();
  const navigate = useNavigate();
  const activeThemeId = localStorage.getItem('gzeed_active_theme');
  const domainName = localStorage.getItem('gzeed_domain_name') || 'store-123.gzeed.com';
  const [deviceScale, setDeviceScale] = useState<'desktop' | 'mobile'>('desktop');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'theme' | 'sections' | 'settings'>('theme');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 800);
  };

  const getThemePreviewUrl = (id: string | null) => {
    if (!id) return '#/demo/ecommerce/abaya';
    if (id === 'dentist') return '#/demo/dentist';
    if (id === 'omra') return '#/demo/omra-tours';
    if (id === 'digital') return '#/demo/ecommerce/iptv';
    if (id === 'perfume') return '#/demo/ecommerce/luxury-perfume';
    if (id === 'abaya') return '#/demo/ecommerce/abaya';
    if (id === 'minimalist') return '#/demo/ecommerce/minimalist';
    return `#/demo/ecommerce/${id}`;
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setIsPublished(true);
      setTimeout(() => setIsPublished(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard', { state: { tab: 'themes' } })}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center font-black text-white text-xs">
              GZ
            </div>
            <span className="font-bold text-slate-900 hidden sm:block">
              {lang === 'ar' ? 'محرر الواجهة' : lang === 'en' ? 'Visual Editor' : 'Éditeur Visuel'}
            </span>
          </div>
        </div>

        {/* Device Toggles */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setDeviceScale('desktop')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all ${deviceScale === 'desktop' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:block">{lang === 'ar' ? 'حاسوب' : lang === 'en' ? 'Desktop' : 'Bureau'}</span>
          </button>
          <button 
            onClick={() => setDeviceScale('mobile')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all ${deviceScale === 'mobile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:block">{lang === 'ar' ? 'هاتف' : lang === 'en' ? 'Mobile' : 'Mobile'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 mr-2 text-slate-400">
            <button 
              onClick={() => window.open(getThemePreviewUrl(activeThemeId), '_blank')}
              className="px-4 py-2 mr-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center gap-2 border border-slate-200"
            >
              <span className="hidden sm:block">{lang === 'ar' ? 'زيارة المتجر' : lang === 'en' ? 'Visit Store' : 'Visiter la boutique'}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <button className="p-2 hover:text-slate-900 transition-colors"><Undo className="w-4 h-4" /></button>
            <button className="p-2 hover:text-slate-900 transition-colors"><Redo className="w-4 h-4" /></button>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${isSaved ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin" />
            ) : isSaved ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span className="hidden sm:block">
              {isSaving ? (lang === 'ar' ? 'جاري الحفظ...' : lang === 'en' ? 'Saving...' : 'Enregistrement...') 
                : isSaved ? (lang === 'ar' ? 'تم الحفظ' : lang === 'en' ? 'Saved' : 'Enregistré') 
                : (lang === 'ar' ? 'حفظ' : lang === 'en' ? 'Save' : 'Enregistrer')}
            </span>
          </button>
          <button 
            onClick={handlePublish}
            disabled={isPublishing || isPublished}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-md ${isPublished ? 'bg-emerald-500 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}
          >
            {isPublishing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isPublished ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span className="hidden sm:block">
              {isPublishing ? (lang === 'ar' ? 'جاري النشر...' : lang === 'en' ? 'Publishing...' : 'Publication...') 
                : isPublished ? (lang === 'ar' ? 'تم النشر' : lang === 'en' ? 'Published' : 'Publié') 
                : (lang === 'ar' ? 'نشر' : lang === 'en' ? 'Publish' : 'Publier')}
            </span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Control Panel */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          {/* Tabs */}
          <div className="flex items-center p-2 border-b border-slate-100">
            {[
              { id: 'theme', icon: Palette, label: lang === 'ar' ? 'المظهر' : lang === 'en' ? 'Theme' : 'Thème' },
              { id: 'sections', icon: Layers, label: lang === 'ar' ? 'الأقسام' : lang === 'en' ? 'Sections' : 'Sections' },
              { id: 'settings', icon: Settings, label: lang === 'ar' ? 'إعدادات' : lang === 'en' ? 'Settings' : 'Paramètres' }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeSidebarTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSidebarTab(tab.id as any)}
                  className={`flex-1 py-3 flex flex-col items-center gap-1 rounded-xl transition-all ${isActive ? 'text-cyan-600 bg-cyan-50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-wider">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {activeSidebarTab === 'theme' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{lang === 'ar' ? 'الألوان الأساسية' : lang === 'en' ? 'Brand Colors' : 'Couleurs de la marque'}</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {['#0f172a', '#06b6d4', '#8b5cf6', '#ec4899', '#10b981'].map((color, idx) => (
                      <button key={idx} className="aspect-square rounded-full border-2 border-transparent hover:scale-110 transition-transform focus:border-slate-900 shadow-sm" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{lang === 'ar' ? 'الخطوط' : lang === 'en' ? 'Typography' : 'Typographie'}</h3>
                  <div className="space-y-3">
                    <button className="w-full p-4 border border-slate-200 rounded-xl text-left hover:border-cyan-400 transition-colors bg-slate-50 font-sans">
                      <div className="font-bold text-slate-900">Inter / System Sans</div>
                      <div className="text-xs text-slate-500 mt-1">Clean, modern, readable</div>
                    </button>
                    <button className="w-full p-4 border border-slate-200 rounded-xl text-left hover:border-cyan-400 transition-colors font-serif">
                      <div className="font-bold text-slate-900">Playfair Display</div>
                      <div className="text-xs text-slate-500 mt-1">Elegant, classic, luxury</div>
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{lang === 'ar' ? 'شكل الأزرار' : lang === 'en' ? 'Button Style' : 'Style de bouton'}</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Square</button>
                    <button className="py-3 border border-slate-900 rounded-xl bg-slate-900 text-white font-bold transition-colors shadow-md">Rounded</button>
                    <button className="py-3 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">Pill</button>
                  </div>
                </div>
              </div>
            )}
            
            {activeSidebarTab === 'sections' && (
              <div className="space-y-3 animate-fade-in">
                {[
                  { id: 'header', icon: Layout, label: lang === 'ar' ? 'الشريط العلوي' : lang === 'en' ? 'Header Navigation' : 'En-tête' },
                  { id: 'hero', icon: Palette, label: lang === 'ar' ? 'الواجهة الرئيسية' : lang === 'en' ? 'Hero Banner' : 'Bannière Héro' },
                  { id: 'products', icon: Box, label: lang === 'ar' ? 'شبكة المنتجات' : lang === 'en' ? 'Product Grid' : 'Grille de Produits' },
                  { id: 'footer', icon: Layout, label: lang === 'ar' ? 'تذييل الصفحة' : lang === 'en' ? 'Footer' : 'Pied de page' }
                ].map((section, idx) => (
                  <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-cyan-400 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover:text-cyan-600 transition-colors">
                        <section.icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-700">{section.label}</span>
                    </div>
                    <Settings className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
                <button className="w-full py-4 mt-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-cyan-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  {lang === 'ar' ? 'إضافة قسم جديد' : lang === 'en' ? 'Add Section' : 'Ajouter une section'}
                </button>
              </div>
            )}

            {activeSidebarTab === 'settings' && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center animate-fade-in">
                <Settings className="w-12 h-12 mb-4 animate-spin-slow opacity-50" />
                <p className="font-medium max-w-[200px]">{lang === 'ar' ? 'إعدادات المتجر العامة ستظهر هنا قريباً.' : lang === 'en' ? 'General store settings will appear here soon.' : 'Les paramètres généraux apparaîtront ici bientôt.'}</p>
              </div>
            )}
          </div>
        </aside>

        {/* Live Preview Area */}
        <main className="flex-1 bg-slate-100 overflow-y-auto relative p-8 flex justify-center custom-scrollbar">
          <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div 
            className={`bg-white rounded-2xl shadow-2xl overflow-hidden relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border border-slate-200/50 ${
              deviceScale === 'mobile' ? 'w-[375px] h-[812px] shrink-0 my-auto' : 'w-full max-w-[1400px] h-full flex flex-col'
            }`}
          >
            {/* Fake Browser Chrome for Desktop */}
            {deviceScale === 'desktop' && (
              <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2 shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="mx-auto px-4 min-w-[200px] h-6 bg-white rounded-md border border-slate-200 text-center text-[10px] text-slate-500 flex items-center justify-center font-mono shadow-sm">
                  {domainName}
                </div>
              </div>
            )}
            
            {/* Iframe Preview container */}
            <div className="flex-1 relative bg-white w-full h-full">
              {/* Fallback mockup inside if iframe is blocked or slow */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin mb-4" />
                <p className="font-bold tracking-widest uppercase text-xs">Loading Preview...</p>
              </div>
              <iframe 
                src={getThemePreviewUrl(activeThemeId)}
                title="Live Preview" 
                className="absolute inset-0 w-full h-full border-0 z-10 bg-white"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
