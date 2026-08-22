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
  ExternalLink,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';
import { useLang } from '../contexts/LangContext';

export default function GZeedBuilder() {
  const { lang, isAr } = useLang();
  const navigate = useNavigate();
  const [activeThemeId, setActiveThemeId] = useState(localStorage.getItem('gzeed_active_theme') || 'glamour-beauty');
  const domainName = localStorage.getItem('gzeed_domain_name') || 'store-123.gzeed.com';

  const handleThemeChange = (themeId: string) => {
    setActiveThemeId(themeId);
    localStorage.setItem('gzeed_active_theme', themeId);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.location.reload();
    }
  };
  const [deviceScale, setDeviceScale] = useState<'desktop' | 'mobile'>('desktop');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'theme' | 'sections' | 'settings'>('theme');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [activeColor, setActiveColor] = useState('#0f172a');
  const [activeFont, setActiveFont] = useState('font-sans');
  const [activeCardStyle, setActiveCardStyle] = useState('rounded');
  const [hiddenSections, setHiddenSections] = useState<string[]>([]);
  const [activeConfigSection, setActiveConfigSection] = useState<string | null>(null);
  const [storePages, setStorePages] = useState<{id: string, title: string, isDefault?: boolean}[]>([
    { id: 'home', title: 'الرئيسية', isDefault: true },
    { id: 'collections', title: 'التشكيلات', isDefault: true },
    { id: 'about', title: 'من نحن', isDefault: false }
  ]);
  const [heroSlides, setHeroSlides] = useState<Array<{image: string; title: string; subtitle: string; buttonText?: string; buttonLink?: string}>>([]);
  const [newPageName, setNewPageName] = useState('');

  const updateConfigInIframe = (payload: any) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_CONFIG', payload }, '*');
    }
  };

  const handleAddSlide = () => {
    const newSlides = [...heroSlides, { image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop', title: 'New Slide', subtitle: 'Slide subtitle', buttonText: 'Discover', buttonLink: 'collections' }];
    setHeroSlides(newSlides);
    updateConfigInIframe({ heroSlides: newSlides });
  };

  const handleUpdateSlide = (idx: number, key: string, value: string) => {
    const newSlides = [...heroSlides];
    newSlides[idx] = { ...newSlides[idx], [key]: value };
    setHeroSlides(newSlides);
    updateConfigInIframe({ heroSlides: newSlides });
  };

  const handleRemoveSlide = (idx: number) => {
    const newSlides = heroSlides.filter((_, i) => i !== idx);
    setHeroSlides(newSlides);
    updateConfigInIframe({ heroSlides: newSlides });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleUpdateSlide(idx, 'image', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPage = () => {
    if (!newPageName.trim()) return;
    const newPage = { id: `page_${Date.now()}`, title: newPageName, isDefault: false };
    const newPages = [...storePages, newPage];
    setStorePages(newPages);
    setNewPageName('');
    updateConfigInIframe({ storePages: newPages });
  };

  const handleRemovePage = (id: string) => {
    const newPages = storePages.filter(p => p.id !== id);
    setStorePages(newPages);
    updateConfigInIframe({ storePages: newPages });
  };

  const handleToggleSection = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHiddenSections(prev => 
      prev.includes(sectionId) ? prev.filter(s => s !== sectionId) : [...prev, sectionId]
    );
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'TOGGLE_SECTION', payload: sectionId }, '*');
    }
  };
  const updateThemeInIframe = (payload: any) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_THEME', payload }, '*');
    }
  };

  const handleSectionClick = (sectionId: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'SCROLL_TO_SECTION', payload: sectionId }, '*');
    }
  };

  const handleColorChange = (color: string) => {
    setActiveColor(color);
    updateThemeInIframe({ primaryColor: color });
  };

  const handleFontChange = (font: string) => {
    setActiveFont(font);
    updateThemeInIframe({ fontFamily: font });
  };

  const handleCardStyleChange = (style: string) => {
    setActiveCardStyle(style);
    updateThemeInIframe({ cardStyle: style });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 800);
  };

  const getThemePreviewUrl = (id: string | null) => {
    // Priority: Show the user's actual live store preview with their products
    const storeName = localStorage.getItem('gzeed_store_name');
    if (storeName && storeName !== 'متجر تجريبي' && storeName !== 'My Store') {
      return `/#/store/${encodeURIComponent(storeName)}?theme=${id}`;
    }

    // Fallback to demo themes if no store is created yet
    if (!id) return '/#/demo/ecommerce/abaya';
    if (id === 'dentist') return '/#/demo/dentist';
    if (id === 'omra') return '/#/demo/omra-tours';
    if (id === 'tourism') return '/#/demo/tourism';
    if (id === 'vacation-deals') return '/#/demo/vacation-deals';
    if (id === 'mazia') return '/#/demo/mazia';
    if (id === 'bidla') return '/#/demo/bidla';
    if (id === 'car-rental') return '/#/demo/car-rental';
    if (id === 'service-pro') return '/#/demo/service-pro';
    if (id === 'apartment') return '/#/demo/apartment';
    if (id === 'beauty-salon') return '/#/demo/beauty-salon';
    if (id === 'traiteur') return '/#/demo/traiteur';
    if (id === 'logistics') return '/#/demo/logistics';
    if (id === 'city-rentals') return '/#/demo/city-rentals';
    
    if (id === 'digital') return '/#/demo/ecommerce/iptv';
    if (id === 'perfume') return '/#/demo/ecommerce/luxury-perfume';
    if (id === 'abaya') return '/#/demo/ecommerce/abaya';
    if (id === 'minimalist') return '/#/demo/ecommerce/minimalist';
    return `/#/demo/ecommerce/${id}`;
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
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{lang === 'ar' ? 'قالب المتجر' : lang === 'en' ? 'Store Theme' : 'Thème de la boutique'}</h3>
                  <div className="relative">
                    <select 
                      value={activeThemeId}
                      onChange={(e) => handleThemeChange(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block p-3 font-bold cursor-pointer appearance-none"
                    >
                      <option value="glamour-beauty">{lang === 'ar' ? 'مكياج وتجميل' : 'Glamour Beauty'}</option>
                      <option value="emerald-market">{lang === 'ar' ? 'ألتيميت ستور' : 'Ultimate Store (Pro)'}</option>
                      <option value="atelier">{lang === 'ar' ? 'مطبخ أتيليي' : 'Atelier Kitchen'}</option>
                      <option value="eco">{lang === 'ar' ? 'طبيعة إيكو' : 'Eco Nature'}</option>
                      <option value="streetwear">{lang === 'ar' ? 'ستريت وير برو' : 'Streetwear Pro'}</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{lang === 'ar' ? 'الألوان الأساسية' : lang === 'en' ? 'Brand Colors' : 'Couleurs de la marque'}</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {['#0f172a', '#1e3a8a', '#7c3aed', '#db2777', '#dc2626', '#d97706', '#16a34a', '#0891b2', '#b48a44', '#64748b', '#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#000000'].map((color, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleColorChange(color)}
                        className={`aspect-square rounded-full border-2 transition-transform hover:scale-110 shadow-sm ${activeColor === color ? 'border-slate-900 scale-110' : 'border-transparent'}`} 
                        style={{ backgroundColor: color }} 
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{lang === 'ar' ? 'الخطوط' : lang === 'en' ? 'Typography' : 'Typographie'}</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleFontChange('font-sans')}
                      className={`w-full p-4 border rounded-xl text-left transition-colors ${activeFont === 'font-sans' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 hover:border-cyan-400 bg-slate-50'}`}
                    >
                      <div className="font-bold text-slate-900 font-sans">Inter / System Sans</div>
                      <div className="text-xs text-slate-500 mt-1 font-sans">Clean, modern, readable</div>
                    </button>
                    <button 
                      onClick={() => handleFontChange('font-serif')}
                      className={`w-full p-4 border rounded-xl text-left transition-colors ${activeFont === 'font-serif' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 hover:border-cyan-400 bg-white'}`}
                    >
                      <div className="font-bold text-slate-900 font-serif">Playfair Display</div>
                      <div className="text-xs text-slate-500 mt-1 font-serif">Elegant, classic, luxury</div>
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{lang === 'ar' ? 'شكل الأزرار' : lang === 'en' ? 'Button Style' : 'Style de bouton'}</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => handleCardStyleChange('square')}
                      className={`py-3 border rounded-xl transition-colors ${activeCardStyle === 'square' ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
                    >Square</button>
                    <button 
                      onClick={() => handleCardStyleChange('rounded')}
                      className={`py-3 border rounded-xl transition-colors ${activeCardStyle === 'rounded' ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
                    >Rounded</button>
                    <button 
                      onClick={() => handleCardStyleChange('pill')}
                      className={`py-3 border rounded-full transition-colors ${activeCardStyle === 'pill' ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
                    >Pill</button>
                  </div>
                </div>
              </div>
            )}
            
            {activeSidebarTab === 'sections' && !activeConfigSection && (
              <div className="space-y-3 animate-fade-in">
                {[
                  { id: 'header', icon: Layout, label: lang === 'ar' ? 'الشريط العلوي' : lang === 'en' ? 'Header Navigation' : 'En-tête' },
                  { id: 'hero', icon: Palette, label: lang === 'ar' ? 'الواجهة الرئيسية' : lang === 'en' ? 'Hero Banner' : 'Bannière Héro' },
                  { id: 'categories', icon: Layers, label: lang === 'ar' ? 'تصنيفات المنتجات' : lang === 'en' ? 'Category Grid' : 'Grille de Catégories' },
                  { id: 'products', icon: Box, label: lang === 'ar' ? 'شبكة المنتجات' : lang === 'en' ? 'Product Grid' : 'Grille de Produits' },
                  { id: 'footer', icon: Layout, label: lang === 'ar' ? 'تذييل الصفحة' : lang === 'en' ? 'Footer' : 'Pied de page' }
                ].map((section, idx) => (
                  <div key={idx} onClick={() => { handleSectionClick(section.id); setActiveConfigSection(section.id); }} className={`p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-cyan-400 hover:shadow-md transition-all group ${hiddenSections.includes(section.id) ? 'opacity-50 grayscale' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover:text-cyan-600 transition-colors">
                        <section.icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-700">{section.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => handleToggleSection(section.id, e)} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                        {hiddenSections.includes(section.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <Settings className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
                <button className="w-full py-4 mt-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-cyan-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  {lang === 'ar' ? 'إضافة قسم جديد' : lang === 'en' ? 'Add Section' : 'Ajouter une section'}
                </button>
              </div>
            )}

            {activeSidebarTab === 'sections' && activeConfigSection && (
               <div className="space-y-6 animate-fade-in">
                  <button onClick={() => setActiveConfigSection(null)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900">
                     <ArrowLeft className="w-4 h-4" /> {lang === 'ar' ? 'رجوع للأقسام' : 'Back to Sections'}
                  </button>
                  
                  {activeConfigSection === 'header' && (
                     <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'رابط شعار المتجر' : 'Store Logo URL'}</label>
                           <input type="text" onChange={(e) => updateConfigInIframe({ storeLogo: e.target.value })} className="w-full p-3 border border-slate-200 rounded-lg text-sm" placeholder="https://..." />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                           <span className="font-bold text-sm text-slate-700">{lang === 'ar' ? 'إظهار البحث' : 'Show Search'}</span>
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" onChange={(e) => updateConfigInIframe({ showHeaderSearch: e.target.checked })} />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                           <span className="font-bold text-sm text-slate-700">{lang === 'ar' ? 'إظهار اللغة' : 'Show Language'}</span>
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" onChange={(e) => updateConfigInIframe({ showHeaderLang: e.target.checked })} />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                           <span className="font-bold text-sm text-slate-700">{lang === 'ar' ? 'إظهار الحساب' : 'Show Account'}</span>
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" onChange={(e) => updateConfigInIframe({ showHeaderAccount: e.target.checked })} />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mt-6">
                           <label className="block text-xs font-black uppercase text-slate-500 mb-4">{lang === 'ar' ? 'قوائم المتجر' : 'Store Menus'}</label>
                           <div className="space-y-2 mb-4">
                              {storePages.map(page => (
                                <div key={page.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                                  <span className="text-sm font-bold text-slate-700">{page.title}</span>
                                  {!page.isDefault && (
                                    <button onClick={() => handleRemovePage(page.id)} className="text-red-400 hover:text-red-600 p-1">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                           </div>
                           <div className="flex gap-2">
                              <input type="text" value={newPageName} onChange={e => setNewPageName(e.target.value)} placeholder={lang === 'ar' ? 'اسم القائمة...' : 'Menu Name...'} className="flex-1 p-2 border border-slate-200 rounded-lg text-sm" />
                              <button onClick={handleAddPage} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                                 <Plus className="w-5 h-5" />
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {activeConfigSection === 'hero' && (
                     <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'العنوان الرئيسي' : 'Hero Title'}</label>
                           <input type="text" onChange={(e) => updateConfigInIframe({ heroTitle: e.target.value })} className="w-full p-3 border border-slate-200 rounded-lg text-sm" placeholder="New Collection" />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'النص الفرعي' : 'Hero Subtitle'}</label>
                           <input type="text" onChange={(e) => updateConfigInIframe({ heroSubtitle: e.target.value })} className="w-full p-3 border border-slate-200 rounded-lg text-sm" placeholder="Discover our latest..." />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'نص الزر' : 'Button Text'}</label>
                           <input type="text" onChange={(e) => updateConfigInIframe({ heroButtonText: e.target.value })} className="w-full p-3 border border-slate-200 rounded-lg text-sm" placeholder="Shop Now" />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'نمط السلايدر (Slideshow)' : 'Slideshow Style'}</label>
                           <select onChange={(e) => updateConfigInIframe({ heroSliderStyle: e.target.value })} className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white">
                             <option value="classic">{lang === 'ar' ? 'كلاسيكي (Classic)' : 'Classic'}</option>
                             <option value="fullscreen">{lang === 'ar' ? 'شاشة كاملة (Fullscreen)' : 'Fullscreen'}</option>
                             <option value="split">{lang === 'ar' ? 'منقسم (Split)' : 'Split'}</option>
                           </select>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100">
                           <div className="flex items-center justify-between mb-4">
                             <label className="block text-xs font-black uppercase text-slate-500">{lang === 'ar' ? 'الصور (Slides)' : 'Slides'}</label>
                             <button onClick={handleAddSlide} className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1">
                               <Plus className="w-3 h-3" /> {lang === 'ar' ? 'إضافة' : 'Add'}
                             </button>
                           </div>
                           
                           {heroSlides.length === 0 && (
                             <div className="text-center p-4 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                               {lang === 'ar' ? 'لا توجد صور. سيتم استخدام الواجهة الافتراضية.' : 'No slides. Default hero will be used.'}
                             </div>
                           )}

                           <div className="space-y-3">
                             {heroSlides.map((slide, idx) => (
                               <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-white space-y-3 relative group">
                                 <button onClick={() => handleRemoveSlide(idx)} className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                   <X className="w-4 h-4" />
                                 </button>
                                 <div className="flex gap-3 items-center">
                                   <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative">
                                     {slide.image ? <img src={slide.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">No Img</div>}
                                     <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                                       <Upload className="w-4 h-4 text-white" />
                                       <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, idx)} className="hidden" />
                                     </label>
                                   </div>
                                   <div className="flex-1 space-y-2">
                                     <input type="text" value={slide.image} onChange={(e) => handleUpdateSlide(idx, 'image', e.target.value)} placeholder="Image URL (Unsplash, etc.)" className="w-full p-2 border border-slate-200 rounded-md text-xs" />
                                     <input type="text" value={slide.title} onChange={(e) => handleUpdateSlide(idx, 'title', e.target.value)} placeholder="Slide Title" className="w-full p-2 border border-slate-200 rounded-md text-xs" />
                                   </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-2">
                                   <input type="text" value={slide.buttonText || ''} onChange={(e) => handleUpdateSlide(idx, 'buttonText', e.target.value)} placeholder="Button Text" className="w-full p-2 border border-slate-200 rounded-md text-xs" />
                                   <select value={slide.buttonLink || ''} onChange={(e) => handleUpdateSlide(idx, 'buttonLink', e.target.value)} className="w-full p-2 border border-slate-200 rounded-md text-xs bg-white">
                                     <option value="">{lang === 'ar' ? 'رابط الزر...' : 'Button Link...'}</option>
                                     <option value="collections">{lang === 'ar' ? 'التشكيلات' : 'Collections'}</option>
                                     <option value="products">{lang === 'ar' ? 'المنتجات' : 'Products'}</option>
                                     <option value="about">{lang === 'ar' ? 'من نحن' : 'About'}</option>
                                   </select>
                                 </div>
                               </div>
                             ))}
                           </div>
                        </div>
                     </div>
                  )}
                  {activeConfigSection === 'categories' && (
                     <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'عنوان التصنيفات' : 'Categories Title'}</label>
                           <input type="text" onChange={(e) => updateConfigInIframe({ homeCollectionsTitle: e.target.value })} className="w-full p-3 border border-slate-200 rounded-lg text-sm" placeholder="Trending Now" />
                        </div>
                     </div>
                  )}

                  {activeConfigSection === 'products' && (
                     <div className="space-y-4">
                        <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                           <Box className="w-8 h-8 mx-auto mb-2 opacity-50" />
                           <p className="text-sm">{lang === 'ar' ? 'إعدادات شبكة المنتجات' : 'Product Grid Settings'}</p>
                           <p className="text-xs mt-2">{lang === 'ar' ? 'يمكنك اختيار المنتجات المعروضة من لوحة التحكم' : 'You can choose displayed products from the dashboard'}</p>
                        </div>
                     </div>
                  )}

                  {activeConfigSection === 'footer' && (
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                           <span className="font-bold text-sm text-slate-700">{lang === 'ar' ? 'إظهار سياسة الخصوصية' : 'Show Privacy Policy'}</span>
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" onChange={(e) => updateConfigInIframe({ footerSettings: { showPrivacy: e.target.checked } })} />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                           <span className="font-bold text-sm text-slate-700">{lang === 'ar' ? 'إظهار الشروط والأحكام' : 'Show Terms & Conditions'}</span>
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" onChange={(e) => updateConfigInIframe({ footerSettings: { showTerms: e.target.checked } })} />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                           <span className="font-bold text-sm text-slate-700">{lang === 'ar' ? 'إظهار سياسة ملفات تعريف الارتباط' : 'Show Cookies Policy'}</span>
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" onChange={(e) => updateConfigInIframe({ footerSettings: { showCookies: e.target.checked } })} />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'نص حقوق النشر' : 'Copyright Text'}</label>
                           <input type="text" onChange={(e) => updateConfigInIframe({ footerSettings: { copyright: e.target.value } })} className="w-full p-3 border border-slate-200 rounded-lg text-sm" placeholder="(c) 2026 My Store" />
                        </div>
                     </div>
                  )}
               </div>
            )}


            {activeSidebarTab === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'اسم المتجر' : 'Store Name'}</label>
                    <input type="text" onChange={(e) => updateConfigInIframe({ storeName: e.target.value })} className="w-full p-3 border border-slate-200 rounded-lg text-sm" placeholder="My Store" defaultValue="Atelier" />
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'النطاق (Domain)' : 'Store Domain'}</label>
                    <input type="text" onChange={(e) => updateConfigInIframe({ storeDomain: e.target.value })} className="w-full p-3 border border-slate-200 rounded-lg text-sm" placeholder="mystore.com" defaultValue="mystore.com" />
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'لغة المتجر' : 'Store Language'}</label>
                    <select onChange={(e) => updateConfigInIframe({ storeLang: e.target.value })} className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white">
                      <option value="fr">{lang === 'ar' ? 'الفرنسية' : 'French'}</option>
                      <option value="ar">{lang === 'ar' ? 'العربية' : 'Arabic'}</option>
                      <option value="en">{lang === 'ar' ? 'الإنجليزية' : 'English'}</option>
                    </select>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'العملة' : 'Currency'}</label>
                    <select onChange={(e) => updateConfigInIframe({ storeCurrency: e.target.value })} className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white">
                      <option value="MAD">MAD (درهم مغربي)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'حالة المتجر' : 'Store Status'}</label>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm font-bold text-slate-700">{lang === 'ar' ? 'نشط (Live)' : 'Live'}</span>
                    </div>
                 </div>
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
                ref={iframeRef}
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
