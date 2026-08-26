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
  Trash2,
  X,
  Upload,
  Globe,
  Search,
  Code,
  ShoppingBag,
  ImageIcon,
  Video,
  Type,
  Mail,
  Star,
  MessageSquare
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
      // Force update via postMessage just in case the src change isn't enough, 
      // though the src change itself will trigger an iframe reload.
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_CONFIG', payload: { activeTheme: themeId } }, '*');
    }
  };
  const [deviceScale, setDeviceScale] = useState<'desktop' | 'mobile'>('desktop');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'theme' | 'sections' | 'settings' | 'code'>('theme');
  const [customCode, setCustomCode] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [activeColor, setActiveColor] = useState('#0f172a');
  const [activeFont, setActiveFont] = useState('font-sans');
  const [activeCardStyle, setActiveCardStyle] = useState('rounded');
  const [activeButtonStyle, setActiveButtonStyle] = useState('rounded');
  const [activeHeaderStyle, setActiveHeaderStyle] = useState('standard');
  const [activeHeaderWidth, setActiveHeaderWidth] = useState('full');
  const [hiddenSections, setHiddenSections] = useState<string[]>([]);
  const [activeConfigSection, setActiveConfigSection] = useState<string | null>(null);
  const [storePages, setStorePages] = useState<{id: string, title: string, isDefault?: boolean}[]>([
    { id: 'home', title: 'Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©', isDefault: true },
    { id: 'collections', title: 'Ø§Ù„ØªØ´ÙƒÙŠÙ„Ø§Øª', isDefault: true },
    { id: 'about', title: 'Ù…Ù† Ù†Ø­Ù†', isDefault: false }
  ]);
  const [storeLang, setStoreLang] = useState('fr');
  const [storeCurrency, setStoreCurrency] = useState('MAD');
  const [heroSlides, setHeroSlides] = useState<Array<{image: string; title: string; subtitle: string; buttonText?: string; buttonLink?: string}>>([]);
  const [featuredCategories, setFeaturedCategories] = useState<Array<{title: string; image: string; link?: string}>>([]);
  const [customSections, setCustomSections] = useState<any[]>([]);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  React.useEffect(() => {
    try {
      const existingStr = localStorage.getItem('beya_store_config');
      if (existingStr) {
        const existing = JSON.parse(existingStr);
        if (existing.heroSlides) setHeroSlides(existing.heroSlides);
        if (existing.featuredCategories) setFeaturedCategories(existing.featuredCategories);
        if (existing.customSections) setCustomSections(existing.customSections);
        if (existing.hiddenSections) setHiddenSections(existing.hiddenSections);
      }
    } catch (e) {}
  }, []);

  React.useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'SECTION_CLICKED') {
        const payload = e.data.payload;
        if (payload) {
          setActiveSidebarTab('sections');
          setActiveConfigSection(payload);
        } else {
          setActiveConfigSection(null);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const [slideUnsplashPickerIdx, setSlideUnsplashPickerIdx] = useState<number | null>(null);
  const [unsplashSearchQuery, setUnsplashSearchQuery] = useState('');
  const [unsplashSearchResults, setUnsplashSearchResults] = useState<string[]>([]);
  const [isSearchingUnsplash, setIsSearchingUnsplash] = useState(false);
  const [unsplashSearchError, setUnsplashSearchError] = useState('');
  const UNSPLASH_ACCESS_KEY = '-9T6_bObqAOMmPEAo_lhLYpyYXeyDrmhNNuCSxBpCM8';

  const searchUnsplashPhotos = async (query: string) => {
     if (!query.trim()) { setUnsplashSearchResults([]); setUnsplashSearchError(''); return; }
     setIsSearchingUnsplash(true);
     setUnsplashSearchError('');
     try {
        const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=24&orientation=landscape`, {
           headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
        });
        if (!res.ok) throw new Error('Unsplash request failed');
        const data = await res.json();
        setUnsplashSearchResults((data.results || []).map((p: any) => p.urls?.regular).filter(Boolean));
     } catch (e) {
        setUnsplashSearchError(lang === 'ar' ? 'ØªØ¹Ø°Ø± Ø§Ù„Ø¨Ø­Ø«ØŒ Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰' : 'Search failed, please try again');
        setUnsplashSearchResults([]);
     } finally {
        setIsSearchingUnsplash(false);
     }
  };

  const updateConfigInIframe = (payload: any) => {
    try {
      const existingStr = localStorage.getItem('beya_store_config');
      const existing = existingStr ? JSON.parse(existingStr) : {};
      const updated = { ...existing, ...payload };
      localStorage.setItem('beya_store_config', JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving config to localStorage", e);
    }
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

  const handleAddCustomSection = (type: string) => {
    const newSection = {
       id: `custom_${Date.now()}`,
       type,
       title: type === 'text' ? 'Texte' : type === 'html' ? 'Code HTML' : type === 'video' ? 'VidÃ©o' : type === 'slider' ? 'Slider' : 'Section',
       content: '',
       settings: {}
    };
    const newSections = [...customSections, newSection];
    setCustomSections(newSections);
    updateConfigInIframe({ customSections: newSections });
    setShowAddSectionModal(false);
  };

  const handleUpdateCustomSection = (id: string, key: string, value: any) => {
    const newSections = customSections.map(s => s.id === id ? { ...s, [key]: value } : s);
    setCustomSections(newSections);
    updateConfigInIframe({ customSections: newSections });
  };

  const handleRemoveCustomSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSections = customSections.filter(s => s.id !== id);
    setCustomSections(newSections);
    updateConfigInIframe({ customSections: newSections });
    if (activeConfigSection === id) setActiveConfigSection(null);
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
    try {
      const existingStr = localStorage.getItem('beya_store_config');
      const existing = existingStr ? JSON.parse(existingStr) : {};
      const updated = { ...existing, ...payload };
      localStorage.setItem('beya_store_config', JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving theme to localStorage", e);
    }
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

  const handleButtonStyleChange = (style: string) => {
    setActiveButtonStyle(style);
    updateThemeInIframe({ buttonStyle: style });
  };

  const handleHeaderStyleChange = (style: string) => {
    setActiveHeaderStyle(style);
    updateThemeInIframe({ headerStyle: style });
  };

  const handleHeaderWidthChange = (width: string) => {
    setActiveHeaderWidth(width);
    updateThemeInIframe({ headerWidth: width });
  };

  const handleSave = () => {
    setIsSaving(true);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'REQUEST_SAVE' }, '*');
    }
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 800);
  };

  const getThemePreviewUrl = (id: string | null) => {
    // Load the store builder in builder/preview mode using the app's HashRouter path.
    // preview=1 tells StoreBuilder to auto-activate showPreview + builder mode.
    const themeParam = id ? `&theme=${encodeURIComponent(id)}` : '';
    return `/#/store-builder?preview=1${themeParam}`;
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
              {lang === 'ar' ? 'Ù…Ø­Ø±Ø± Ø§Ù„ÙˆØ§Ø¬Ù‡Ø©' : lang === 'en' ? 'Visual Editor' : 'Ã‰diteur Visuel'}
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
            <span className="hidden sm:block">{lang === 'ar' ? 'Ø­Ø§Ø³ÙˆØ¨' : lang === 'en' ? 'Desktop' : 'Bureau'}</span>
          </button>
          <button 
            onClick={() => setDeviceScale('mobile')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all ${deviceScale === 'mobile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:block">{lang === 'ar' ? 'Ù‡Ø§ØªÙ' : lang === 'en' ? 'Mobile' : 'Mobile'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 mr-2 text-slate-400">
            <button 
              onClick={() => window.open(getThemePreviewUrl(activeThemeId), '_blank')}
              className="px-4 py-2 mr-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center gap-2 border border-slate-200"
            >
              <span className="hidden sm:block">{lang === 'ar' ? 'Ø²ÙŠØ§Ø±Ø© Ø§Ù„Ù…ØªØ¬Ø±' : lang === 'en' ? 'Visit Store' : 'Visiter la boutique'}</span>
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
              {isSaving ? (lang === 'ar' ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø­ÙØ¸...' : lang === 'en' ? 'Saving...' : 'Enregistrement...') 
                : isSaved ? (lang === 'ar' ? 'ØªÙ… Ø§Ù„Ø­ÙØ¸' : lang === 'en' ? 'Saved' : 'EnregistrÃ©') 
                : (lang === 'ar' ? 'Ø­ÙØ¸' : lang === 'en' ? 'Save' : 'Enregistrer')}
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
              {isPublishing ? (lang === 'ar' ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„Ù†Ø´Ø±...' : lang === 'en' ? 'Publishing...' : 'Publication...') 
                : isPublished ? (lang === 'ar' ? 'ØªÙ… Ø§Ù„Ù†Ø´Ø±' : lang === 'en' ? 'Published' : 'PubliÃ©') 
                : (lang === 'ar' ? 'Ù†Ø´Ø±' : lang === 'en' ? 'Publish' : 'Publier')}
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
              { id: 'theme', icon: Palette, label: lang === 'ar' ? 'Ø§Ù„Ù…Ø¸Ù‡Ø±' : lang === 'en' ? 'Theme' : 'Thème' },
              { id: 'sections', icon: Layers, label: lang === 'ar' ? 'Ø§Ù„Ø£Ù‚Ø³Ø§Ù…' : lang === 'en' ? 'Sections' : 'Sections' },
              { id: 'settings', icon: Settings, label: lang === 'ar' ? 'Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª' : lang === 'en' ? 'Settings' : 'Paramètres' },
              { id: 'code', icon: Code, label: lang === 'ar' ? 'ÙƒÙˆØ¯ (Ø¬Ø¯ÙŠØ¯)' : lang === 'en' ? 'Code' : 'Code' }
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
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{lang === 'ar' ? 'Ù‚Ø§Ù„Ø¨ Ø§Ù„Ù…ØªØ¬Ø±' : lang === 'en' ? 'Store Theme' : 'Thème de la boutique'}</h3>
                  <div className="relative">
                    <select 
                      value={activeThemeId}
                      onChange={(e) => handleThemeChange(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block p-3 font-bold cursor-pointer appearance-none"
                    >
                      <option value="streetwear">Streetwear Pro</option>
                      <option value="minimalist">Minimalist</option>
                      <option value="glamour-beauty">Glamour Beauty</option>
                      <option value="abaya">Luxury Abaya</option>
                      <option value="kids">Playful Kids</option>
                      <option value="clement">Clement Design</option>
                      <option value="xton">Xton (Tech/Digital)</option>
                      <option value="mazia">Mazia</option>
                      <option value="emerald-market">Ultimate Store</option>
                      <option value="atelier">Atelier Kitchen</option>
                      <option value="blush-studio">Lamode App</option>
                      <option value="pop-fashion">Simple Minimal</option>
                      <option value="eco">Eco Nature</option>
                      <option value="sportswear">Active Sport</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{lang === 'ar' ? 'Ø§Ù„Ø£Ù„ÙˆØ§Ù† Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ©' : lang === 'en' ? 'Brand Colors' : 'Couleurs de la marque'}</h3>
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
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{lang === 'ar' ? 'Ø§Ù„Ø®Ø·ÙˆØ·' : lang === 'en' ? 'Typography' : 'Typographie'}</h3>
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
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{lang === 'ar' ? 'Ø´ÙƒÙ„ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø¹Ù„ÙˆÙŠØ©' : lang === 'en' ? 'Header Style' : 'Style de l\'En-tÃªte'}</h3>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button 
                      onClick={() => handleHeaderStyleChange('standard')}
                      className={`py-3 px-2 text-xs border rounded-xl transition-colors ${activeHeaderStyle === 'standard' ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
                    >Standard</button>
                    <button 
                      onClick={() => handleHeaderStyleChange('floating')}
                      className={`py-3 px-2 text-xs border rounded-xl transition-colors ${activeHeaderStyle === 'floating' ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
                    >Floating Pill</button>
                    <button 
                      onClick={() => handleHeaderStyleChange('banner-left')}
                      className={`py-3 px-2 text-xs border rounded-xl transition-colors ${activeHeaderStyle === 'banner-left' ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
                    >Banner (Left)</button>
                    <button 
                      onClick={() => handleHeaderStyleChange('banner-center')}
                      className={`py-3 px-2 text-xs border rounded-xl transition-colors ${activeHeaderStyle === 'banner-center' ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
                    >Banner (Center)</button>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{lang === 'ar' ? 'Ø¹Ø±Ø¶ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø¹Ù„ÙˆÙŠØ©' : lang === 'en' ? 'Header Width' : 'Largeur de l\'En-tÃªte'}</h3>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button 
                      onClick={() => handleHeaderWidthChange('full')}
                      className={`py-3 px-2 text-xs border rounded-xl transition-colors ${activeHeaderWidth === 'full' ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
                    >Full Width</button>
                    <button 
                      onClick={() => handleHeaderWidthChange('center')}
                      className={`py-3 px-2 text-xs border rounded-xl transition-colors ${activeHeaderWidth === 'center' ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
                    >Centered (Ù…ØªÙ…Ø±ÙƒØ²)</button>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{lang === 'ar' ? 'Ø´ÙƒÙ„ Ø§Ù„Ø£Ø²Ø±Ø§Ø±' : lang === 'en' ? 'Button Style' : 'Style de bouton'}</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => handleButtonStyleChange('square')}
                      className={`py-3 border rounded-xl transition-colors ${activeButtonStyle === 'square' ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
                    >Square</button>
                    <button 
                      onClick={() => handleButtonStyleChange('rounded')}
                      className={`py-3 border rounded-xl transition-colors ${activeButtonStyle === 'rounded' ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
                    >Rounded</button>
                    <button 
                      onClick={() => handleButtonStyleChange('pill')}
                      className={`py-3 border rounded-full transition-colors ${activeButtonStyle === 'pill' ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
                    >Pill</button>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{lang === 'ar' ? 'Ø´ÙƒÙ„ Ø§Ù„Ø¨Ø·Ø§Ù‚Ø§Øª' : lang === 'en' ? 'Card Style' : 'Style de carte'}</h3>
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
                      onClick={() => handleCardStyleChange('arch')}
                      className={`py-3 border rounded-xl transition-colors ${activeCardStyle === 'arch' ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
                    >Arch</button>
                  </div>
                </div>
              </div>
            )}
            
            {activeSidebarTab === 'sections' && !activeConfigSection && (
              <div className="space-y-3 animate-fade-in">
                {[
                  { id: 'header', icon: Layout, label: lang === 'ar' ? 'Ø§Ù„Ø´Ø±ÙŠØ· Ø§Ù„Ø¹Ù„ÙˆÙŠ' : lang === 'en' ? 'Header Navigation' : 'En-tÃªte' },
                  { id: 'hero', icon: Palette, label: lang === 'ar' ? 'Ø§Ù„ÙˆØ§Ø¬Ù‡Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©' : lang === 'en' ? 'Hero Banner' : 'BanniÃ¨re HÃ©ro' },
                  { id: 'categories', icon: Layers, label: lang === 'ar' ? 'ØªØµÙ†ÙŠÙØ§Øª Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª' : lang === 'en' ? 'Category Grid' : 'Grille de CatÃ©gories' },
                  { id: 'products', icon: Box, label: lang === 'ar' ? 'Ø´Ø¨ÙƒØ© Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª' : lang === 'en' ? 'Product Grid' : 'Grille de Produits' },
                  { id: 'pdp', icon: ShoppingBag, label: lang === 'ar' ? 'ØµÙØ­Ø© Ø§Ù„Ù…Ù†ØªØ¬' : lang === 'en' ? 'Product Page' : 'Page Produit' },
                  { id: 'footer', icon: Layout, label: lang === 'ar' ? 'ØªØ°ÙŠÙŠÙ„ Ø§Ù„ØµÙØ­Ø©' : lang === 'en' ? 'Footer' : 'Pied de page' }
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
                {customSections.map((section, idx) => (
                  <div key={section.id} onClick={() => { handleSectionClick(section.id); setActiveConfigSection(section.id); }} className={`p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-cyan-400 hover:shadow-md transition-all group ${hiddenSections.includes(section.id) ? 'opacity-50 grayscale' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover:text-cyan-600 transition-colors">
                        {section.type === 'slider' ? <ImageIcon className="w-4 h-4" /> : section.type === 'video' ? <Video className="w-4 h-4" /> : section.type === 'html' ? <Code className="w-4 h-4" /> : <Type className="w-4 h-4" />}
                      </div>
                      <span className="font-bold text-slate-700">{section.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => handleToggleSection(section.id, e)} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                        {hiddenSections.includes(section.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <Settings className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
                <button onClick={() => setShowAddSectionModal(true)} className="w-full py-4 mt-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-cyan-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  {lang === 'ar' ? 'Ø¥Ø¶Ø§ÙØ© Ù‚Ø³Ù… Ø¬Ø¯ÙŠØ¯' : lang === 'en' ? 'Add Section' : 'Ajouter une section'}
                </button>
                {showAddSectionModal && (
                  <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                      <div className="flex justify-between items-center p-6 border-b border-slate-100">
                        <h3 className="font-bold text-lg text-slate-800">{lang === 'ar' ? 'Ø§Ø®ØªØ± Ù†ÙˆØ¹ Ø§Ù„Ù‚Ø³Ù…' : 'Choose Section Type'}</h3>
                        <button onClick={() => setShowAddSectionModal(false)} className="text-slate-400 hover:text-slate-700 p-2"><X className="w-5 h-5" /></button>
                      </div>
                      <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        <button onClick={() => handleAddCustomSection('text')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50 transition-all text-center">
                           <Type className="w-6 h-6 text-cyan-600" />
                           <span className="font-bold text-slate-700 text-[11px]">{lang === 'ar' ? 'نص' : 'Text'}</span>
                        </button>
                        <button onClick={() => handleAddCustomSection('slider')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition-all text-center">
                           <ImageIcon className="w-6 h-6 text-amber-600" />
                           <span className="font-bold text-slate-700 text-[11px]">{lang === 'ar' ? 'معرض صور' : 'Slider'}</span>
                        </button>
                        <button onClick={() => handleAddCustomSection('video')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-rose-500 hover:bg-rose-50 transition-all text-center">
                           <Video className="w-6 h-6 text-rose-600" />
                           <span className="font-bold text-slate-700 text-[11px]">{lang === 'ar' ? 'فيديو' : 'Video'}</span>
                        </button>
                        <button onClick={() => handleAddCustomSection('newsletter')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-center">
                           <Mail className="w-6 h-6 text-emerald-600" />
                           <span className="font-bold text-slate-700 text-[11px]">{lang === 'ar' ? 'نشرة بريدية' : 'Newsletter'}</span>
                        </button>
                        <button onClick={() => handleAddCustomSection('features')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
                           <Star className="w-6 h-6 text-blue-600" />
                           <span className="font-bold text-slate-700 text-[11px]">{lang === 'ar' ? 'مميزاتنا' : 'Features'}</span>
                        </button>
                        <button onClick={() => handleAddCustomSection('testimonials')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-pink-500 hover:bg-pink-50 transition-all text-center">
                           <MessageSquare className="w-6 h-6 text-pink-600" />
                           <span className="font-bold text-slate-700 text-[11px]">{lang === 'ar' ? 'آراء العملاء' : 'Testimonials'}</span>
                        </button>
                        <button onClick={() => handleAddCustomSection('html')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center">
                           <Code className="w-6 h-6 text-indigo-600" />
                           <span className="font-bold text-slate-700 text-[11px]">HTML</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSidebarTab === 'sections' && activeConfigSection && (
               <div className="space-y-6 animate-fade-in">
                  <button onClick={() => setActiveConfigSection(null)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900">
                     <ArrowLeft className="w-4 h-4" /> {lang === 'ar' ? 'Ø±Ø¬ÙˆØ¹ Ù„Ù„Ø£Ù‚Ø³Ø§Ù…' : 'Back to Sections'}
                  </button>
                  
                  {activeConfigSection === 'header' && (
                     <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'Ø±Ø§Ø¨Ø· Ø´Ø¹Ø§Ø± Ø§Ù„Ù…ØªØ¬Ø±' : 'Store Logo URL'}</label>
                           <input type="text" onChange={(e) => updateConfigInIframe({ storeLogo: e.target.value })} className="w-full p-3 border border-slate-200 rounded-lg text-sm" placeholder="https://..." />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                           <span className="font-bold text-sm text-slate-700">{lang === 'ar' ? 'Ø¥Ø¸Ù‡Ø§Ø± Ø§Ù„Ø¨Ø­Ø«' : 'Show Search'}</span>
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" onChange={(e) => updateConfigInIframe({ showHeaderSearch: e.target.checked })} />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                           <span className="font-bold text-sm text-slate-700">{lang === 'ar' ? 'Ø¥Ø¸Ù‡Ø§Ø± Ø§Ù„Ù„ØºØ©' : 'Show Language'}</span>
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" onChange={(e) => updateConfigInIframe({ showHeaderLang: e.target.checked })} />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                           <span className="font-bold text-sm text-slate-700">{lang === 'ar' ? 'Ø¥Ø¸Ù‡Ø§Ø± Ø§Ù„Ø­Ø³Ø§Ø¨' : 'Show Account'}</span>
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" onChange={(e) => updateConfigInIframe({ showHeaderAccount: e.target.checked })} />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mt-6">
                           <label className="block text-xs font-black uppercase text-slate-500 mb-4">{lang === 'ar' ? 'Ù‚ÙˆØ§Ø¦Ù… Ø§Ù„Ù…ØªØ¬Ø±' : 'Store Menus'}</label>
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
                              <input type="text" value={newPageName} onChange={e => setNewPageName(e.target.value)} placeholder={lang === 'ar' ? 'Ø§Ø³Ù… Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©...' : 'Menu Name...'} className="flex-1 p-2 border border-slate-200 rounded-lg text-sm" />
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
                           <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ' : 'Hero Title'}</label>
                           <input type="text" onChange={(e) => updateConfigInIframe({ heroTitle: e.target.value })} className="w-full p-3 border border-slate-200 rounded-lg text-sm" placeholder="New Collection" />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'Ø§Ù„Ù†Øµ Ø§Ù„ÙØ±Ø¹ÙŠ' : 'Hero Subtitle'}</label>
                           <input type="text" onChange={(e) => updateConfigInIframe({ heroSubtitle: e.target.value })} className="w-full p-3 border border-slate-200 rounded-lg text-sm" placeholder="Discover our latest..." />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'Ù†Øµ Ø§Ù„Ø²Ø±' : 'Button Text'}</label>
                           <input type="text" onChange={(e) => updateConfigInIframe({ heroButtonText: e.target.value })} className="w-full p-3 border border-slate-200 rounded-lg text-sm" placeholder="Shop Now" />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'Ù†Ù…Ø· Ø§Ù„Ø³Ù„Ø§ÙŠØ¯Ø± (Slideshow)' : 'Slideshow Style'}</label>
                           <select onChange={(e) => updateConfigInIframe({ heroSliderStyle: e.target.value })} className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white">
                             <option value="classic">{lang === 'ar' ? 'ÙƒÙ„Ø§Ø³ÙŠÙƒÙŠ (Classic)' : 'Classic'}</option>
                             <option value="fullscreen">{lang === 'ar' ? 'Ø´Ø§Ø´Ø© ÙƒØ§Ù…Ù„Ø© (Fullscreen)' : 'Fullscreen'}</option>
                             <option value="split">{lang === 'ar' ? 'Ù…Ù†Ù‚Ø³Ù… (Split)' : 'Split'}</option>
                           </select>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100">
                           <div className="flex items-center justify-between mb-4">
                             <label className="block text-xs font-black uppercase text-slate-500">{lang === 'ar' ? 'Ø§Ù„ØµÙˆØ± (Slides)' : 'Slides'}</label>
                             <button onClick={handleAddSlide} className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1">
                               <Plus className="w-3 h-3" /> {lang === 'ar' ? 'Ø¥Ø¶Ø§ÙØ©' : 'Add'}
                             </button>
                           </div>
                           
                           {heroSlides.length === 0 && (
                             <div className="text-center p-4 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                               {lang === 'ar' ? 'Ù„Ø§ ØªÙˆØ¬Ø¯ ØµÙˆØ±. Ø³ÙŠØªÙ… Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„ÙˆØ§Ø¬Ù‡Ø© Ø§Ù„Ø§ÙØªØ±Ø§Ø¶ÙŠØ©.' : 'No slides. Default hero will be used.'}
                             </div>
                           )}

                           <div className="space-y-3">
                             {heroSlides.map((slide, idx) => (
                               <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-white space-y-3 relative group">
                                 <button onClick={() => handleRemoveSlide(idx)} className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                   <X className="w-4 h-4" />
                                 </button>
                                 <div className="flex gap-3 items-center">
                                    <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative group/img">
                                      {slide.image ? <img src={slide.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">No Img</div>}
                                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                        <label className="cursor-pointer hover:bg-white/20 p-1 rounded-md transition-colors w-full text-center flex items-center justify-center">
                                          <Upload className="w-3.5 h-3.5 text-white" />
                                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, idx)} className="hidden" />
                                        </label>
                                        <button onClick={() => setSlideUnsplashPickerIdx(idx)} className="cursor-pointer hover:bg-white/20 p-1 rounded-md transition-colors w-full flex items-center justify-center">
                                          <Search className="w-3.5 h-3.5 text-white" />
                                        </button>
                                      </div>
                                    </div>
                                   <div className="flex-1 space-y-2">
                                     <input type="text" value={slide.image} onChange={(e) => handleUpdateSlide(idx, 'image', e.target.value)} placeholder="Image URL (Unsplash, etc.)" className="w-full p-2 border border-slate-200 rounded-md text-xs" />
                                     <input type="text" value={slide.title} onChange={(e) => handleUpdateSlide(idx, 'title', e.target.value)} placeholder="Slide Title" className="w-full p-2 border border-slate-200 rounded-md text-xs" />
                                   </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-2">
                                   <input type="text" value={slide.buttonText || ''} onChange={(e) => handleUpdateSlide(idx, 'buttonText', e.target.value)} placeholder="Button Text" className="w-full p-2 border border-slate-200 rounded-md text-xs" />
                                   <select value={slide.buttonLink || ''} onChange={(e) => handleUpdateSlide(idx, 'buttonLink', e.target.value)} className="w-full p-2 border border-slate-200 rounded-md text-xs bg-white">
                                     <option value="">{lang === 'ar' ? 'Ø±Ø§Ø¨Ø· Ø§Ù„Ø²Ø±...' : 'Button Link...'}</option>
                                     <option value="collections">{lang === 'ar' ? 'Ø§Ù„ØªØ´ÙƒÙŠÙ„Ø§Øª' : 'Collections'}</option>
                                     <option value="products">{lang === 'ar' ? 'Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª' : 'Products'}</option>
                                     <option value="about">{lang === 'ar' ? 'Ù…Ù† Ù†Ø­Ù†' : 'About'}</option>
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
                           <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'Ø¹Ù†ÙˆØ§Ù† Ø§Ù„ØªØµÙ†ÙŠÙØ§Øª' : 'Categories Title'}</label>
                           <input type="text" onChange={(e) => updateConfigInIframe({ homeCollectionsTitle: e.target.value })} className="w-full p-3 border border-slate-200 rounded-lg text-sm mb-6" placeholder="Trending Now" />
                           
                           <label className="block text-xs font-black uppercase text-slate-500 mb-4">{lang === 'ar' ? 'Ø§Ù„ØªØµÙ†ÙŠÙØ§Øª Ø§Ù„Ù…Ù…ÙŠØ²Ø© (Ø§Ù„ØµÙˆØ±)' : 'Featured Categories (Images)'}</label>
                           <div className="space-y-3">
                              {featuredCategories.map((cat, idx) => (
                                 <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl relative flex flex-col gap-3 group">
                                    <button onClick={() => {
                                       const next = featuredCategories.filter((_, i) => i !== idx);
                                       setFeaturedCategories(next);
                                       updateConfigInIframe({ featuredCategories: next });
                                    }} className="absolute top-2 right-2 w-6 h-6 bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500 rounded-full flex items-center justify-center transition-colors">
                                       <X className="w-3 h-3" />
                                    </button>
                                    
                                    <div className="flex gap-3 items-start pr-8">
                                       <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                                          {cat.image ? (
                                             <img src={cat.image} className="w-full h-full object-cover" />
                                          ) : (
                                             <ImageIcon className="w-6 h-6 text-slate-300" />
                                          )}
                                       </div>
                                       <div className="flex-1 space-y-2">
                                          <input type="text" value={cat.title} onChange={(e) => {
                                             const next = [...featuredCategories];
                                             next[idx].title = e.target.value;
                                             setFeaturedCategories(next);
                                             updateConfigInIframe({ featuredCategories: next });
                                          }} placeholder={lang === 'ar' ? 'Ø§Ø³Ù… Ø§Ù„ØªØµÙ†ÙŠÙ' : 'Category Name'} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-xs" />
                                          <input type="text" value={cat.image} onChange={(e) => {
                                             const next = [...featuredCategories];
                                             next[idx].image = e.target.value;
                                             setFeaturedCategories(next);
                                             updateConfigInIframe({ featuredCategories: next });
                                          }} placeholder="Image URL (Unsplash...)" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-xs" />
                                       </div>
                                    </div>
                                 </div>
                              ))}
                              
                              <button onClick={() => {
                                 const next = [...featuredCategories, { title: 'New Category', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80' }];
                                 setFeaturedCategories(next);
                                 updateConfigInIframe({ featuredCategories: next });
                              }} className="w-full py-3 border-2 border-dashed border-cyan-200 text-cyan-600 rounded-xl text-sm font-bold hover:bg-cyan-50 transition-colors flex items-center justify-center gap-2">
                                 <Plus className="w-4 h-4" /> {lang === 'ar' ? 'Ø¥Ø¶Ø§ÙØ© ØªØµÙ†ÙŠÙ' : 'Add Category'}
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {activeConfigSection === 'products' && (
                     <div className="space-y-4">
                        <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                           <Box className="w-8 h-8 mx-auto mb-2 opacity-50" />
                           <p className="text-sm">{lang === 'ar' ? 'Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø´Ø¨ÙƒØ© Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª' : 'Product Grid Settings'}</p>
                           <p className="text-xs mt-2">{lang === 'ar' ? 'ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ù…Ø¹Ø±ÙˆØ¶Ø© Ù…Ù† Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ…' : 'You can choose displayed products from the dashboard'}</p>
                        </div>
                     </div>
                  )}

                  {activeConfigSection === 'pdp' && (
                     <div className="space-y-6">
                        {/* Image Settings */}
                        <div>
                           <label className="block text-xs font-black uppercase text-slate-500 mb-3">{lang === 'ar' ? 'Ø­Ø¬Ù… ÙˆØ´ÙƒÙ„ Ø§Ù„ØµÙˆØ±' : 'Image Settings'}</label>
                           <div className="space-y-3">
                              <select 
                                 onChange={(e) => updateConfigInIframe({ pdpImageAspect: e.target.value })} 
                                 className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50"
                              >
                                 <option value="4/5">{lang === 'ar' ? 'Ø·ÙˆÙ„ÙŠØ© (Ø£Ø²ÙŠØ§Ø¡)' : 'Portrait (Fashion)'}</option>
                                 <option value="1/1">{lang === 'ar' ? 'Ù…Ø±Ø¨Ø¹Ø© (ÙƒÙ„Ø§Ø³ÙŠÙƒ)' : 'Square (Classic)'}</option>
                                 <option value="3/4">{lang === 'ar' ? 'Ø´Ø¨Ù‡ Ø·ÙˆÙ„ÙŠØ©' : 'Slightly Tall'}</option>
                              </select>
                              <div className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                                 <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                    <span>{lang === 'ar' ? 'Ø¹Ø±Ø¶ Ø§Ù„ØµÙˆØ±Ø©' : 'Image Width'}</span>
                                 </div>
                                 <input 
                                    type="range" min="30" max="70" step="5" defaultValue="50"
                                    onChange={(e) => updateConfigInIframe({ pdpImageWidth: Number(e.target.value) })}
                                    className="w-full"
                                 />
                              </div>
                           </div>
                        </div>

                        {/* Text Settings */}
                        <div>
                           <label className="block text-xs font-black uppercase text-slate-500 mb-3">{lang === 'ar' ? 'Ø­Ø¬Ù… Ø§Ù„Ù†ØµÙˆØµ' : 'Typography Size'}</label>
                           <div className="space-y-3">
                              <select 
                                 onChange={(e) => updateConfigInIframe({ pdpTitleSize: e.target.value })} 
                                 className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50"
                              >
                                 <option value="text-3xl md:text-4xl">{lang === 'ar' ? 'Ø¹Ù†ÙˆØ§Ù† ØµØºÙŠØ±' : 'Small Title'}</option>
                                 <option value="text-4xl md:text-5xl">{lang === 'ar' ? 'Ø¹Ù†ÙˆØ§Ù† Ù…ØªÙˆØ³Ø·' : 'Medium Title'}</option>
                                 <option value="text-5xl md:text-7xl">{lang === 'ar' ? 'Ø¹Ù†ÙˆØ§Ù† Ø¶Ø®Ù…' : 'Large Title'}</option>
                              </select>
                              <select 
                                 onChange={(e) => updateConfigInIframe({ pdpDescSize: e.target.value })} 
                                 className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50"
                              >
                                 <option value="text-sm">{lang === 'ar' ? 'ÙˆØµÙ ØµØºÙŠØ±' : 'Small Description'}</option>
                                 <option value="text-base">{lang === 'ar' ? 'ÙˆØµÙ Ù…ØªÙˆØ³Ø·' : 'Medium Description'}</option>
                                 <option value="text-lg">{lang === 'ar' ? 'ÙˆØµÙ ÙƒØ¨ÙŠØ±' : 'Large Description'}</option>
                              </select>
                           </div>
                        </div>

                        {/* Button Settings */}
                        <div>
                           <label className="block text-xs font-black uppercase text-slate-500 mb-3">{lang === 'ar' ? 'Ø§Ù„Ø²Ø±' : 'Button Style'}</label>
                           <div className="space-y-3">
                              <select 
                                 onChange={(e) => updateConfigInIframe({ pdpButtonSize: e.target.value })} 
                                 className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50"
                              >
                                 <option value="py-3 text-sm">{lang === 'ar' ? 'Ø­Ø¬Ù… ØµØºÙŠØ±' : 'Small Size'}</option>
                                 <option value="py-4 text-base">{lang === 'ar' ? 'Ø­Ø¬Ù… Ù…ØªÙˆØ³Ø·' : 'Medium Size'}</option>
                                 <option value="py-5 text-lg">{lang === 'ar' ? 'Ø­Ø¬Ù… Ø¶Ø®Ù…' : 'Large Size'}</option>
                              </select>
                              <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
                                 <input 
                                    type="color" 
                                    onChange={(e) => updateConfigInIframe({ pdpButtonColor: e.target.value })} 
                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                 />
                                 <span className="text-xs font-bold text-slate-500">{lang === 'ar' ? 'Ù„ÙˆÙ† Ø²Ø± Ø§Ù„Ø·Ù„Ø¨ (Ø§Ø®ØªÙŠØ§Ø±ÙŠ)' : 'Order Button Color (Optional)'}</span>
                              </div>
                           </div>
                        </div>

                        {/* Related Products */}
                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                           <span className="font-bold text-sm text-slate-700">{lang === 'ar' ? 'Ù…Ù†ØªØ¬Ø§Øª Ù…Ø´Ø§Ø¨Ù‡Ø©' : 'Show Related Products'}</span>
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" onChange={(e) => updateConfigInIframe({ showRelatedProducts: e.target.checked })} />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                           <span className="font-bold text-sm text-slate-700">{lang === 'ar' ? 'Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„ØªÙˆØµÙŠÙ„ (COD, Ù…Ø¬Ø§Ù†ÙŠ)' : 'Delivery Info (COD, Free)'}</span>
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" onChange={(e) => updateConfigInIframe({ showDeliveryInfo: e.target.checked })} />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                           <span className="font-bold text-sm text-slate-700">{lang === 'ar' ? 'ØªÙ‚ÙŠÙŠÙ…Ø§Øª Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡' : 'Customer Reviews'}</span>
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" onChange={(e) => updateConfigInIframe({ showProductReviews: e.target.checked })} />
                        </div>
                     </div>
                  )}

                  {activeConfigSection === 'footer' && (
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                           <span className="font-bold text-sm text-slate-700">{lang === 'ar' ? 'Ø¥Ø¸Ù‡Ø§Ø± Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©' : 'Show Privacy Policy'}</span>
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" onChange={(e) => updateConfigInIframe({ footerSettings: { showPrivacy: e.target.checked } })} />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                           <span className="font-bold text-sm text-slate-700">{lang === 'ar' ? 'Ø¥Ø¸Ù‡Ø§Ø± Ø§Ù„Ø´Ø±ÙˆØ· ÙˆØ§Ù„Ø£Ø­ÙƒØ§Ù…' : 'Show Terms & Conditions'}</span>
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" onChange={(e) => updateConfigInIframe({ footerSettings: { showTerms: e.target.checked } })} />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                           <span className="font-bold text-sm text-slate-700">{lang === 'ar' ? 'Ø¥Ø¸Ù‡Ø§Ø± Ø³ÙŠØ§Ø³Ø© Ù…Ù„ÙØ§Øª ØªØ¹Ø±ÙŠÙ Ø§Ù„Ø§Ø±ØªØ¨Ø§Ø·' : 'Show Cookies Policy'}</span>
                           <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" onChange={(e) => updateConfigInIframe({ footerSettings: { showCookies: e.target.checked } })} />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'Ù†Øµ Ø­Ù‚ÙˆÙ‚ Ø§Ù„Ù†Ø´Ø±' : 'Copyright Text'}</label>
                           <input type="text" onChange={(e) => updateConfigInIframe({ footerSettings: { copyright: e.target.value } })} className="w-full p-3 border border-slate-200 rounded-lg text-sm" placeholder="(c) 2026 My Store" />
                        </div>
                     </div>
                  )}

                  {activeConfigSection?.startsWith('custom_') && (() => {
                     const section = customSections.find(s => s.id === activeConfigSection);
                     if (!section) return null;
                     return (
                        <div className="space-y-4">
                           <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                              <span className="font-bold text-slate-700 text-sm">{lang === 'ar' ? 'Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ù‚Ø³Ù…' : 'Section Title'}</span>
                              <input type="text" value={section.title || ''} onChange={(e) => handleUpdateCustomSection(section.id, 'title', e.target.value)} className="w-1/2 p-2 border border-slate-200 rounded-lg text-sm bg-white" />
                           </div>

                           {section.type === 'text' && (
                              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                                 <label className="block text-xs font-black uppercase text-slate-500">{lang === 'ar' ? 'Ø§Ù„Ù†Øµ' : 'Text Content'}</label>
                                 <textarea rows={4} value={section.content} onChange={(e) => handleUpdateCustomSection(section.id, 'content', e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white" placeholder="Text..." />
                                 <label className="block text-xs font-black uppercase text-slate-500 mt-4">{lang === 'ar' ? 'Ø­Ø¬Ù… Ø§Ù„Ø®Ø·' : 'Font Size'}</label>
                                 <input type="range" min="12" max="64" value={section.settings?.fontSize || 16} onChange={(e) => handleUpdateCustomSection(section.id, 'settings', {...section.settings, fontSize: parseInt(e.target.value)})} className="w-full" />
                                 <div className="text-right text-xs text-slate-500">{section.settings?.fontSize || 16}px</div>
                              </div>
                           )}

                           {section.type === 'video' && (
                              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                                 <label className="block text-xs font-black uppercase text-slate-500">{lang === 'ar' ? 'Ø±Ø§Ø¨Ø· ÙŠÙˆØªÙŠÙˆØ¨ Ø£Ùˆ ÙÙŠØ¯ÙŠÙˆ' : 'YouTube or Video URL'}</label>
                                 <input type="text" value={section.content} onChange={(e) => handleUpdateCustomSection(section.id, 'content', e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white" placeholder="https://..." />
                                 <label className="block text-xs font-black uppercase text-slate-500 mt-4">{lang === 'ar' ? 'Ø­Ø¬Ù… Ø§Ù„ÙÙŠØ¯ÙŠÙˆ' : 'Video Width'}</label>
                                 <select value={section.settings?.width || 'full'} onChange={(e) => handleUpdateCustomSection(section.id, 'settings', {...section.settings, width: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm">
                                    <option value="full">100%</option>
                                    <option value="boxed">Boxed</option>
                                    <option value="half">50%</option>
                                 </select>
                              </div>
                           )}

                           {section.type === 'slider' && (
                              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                                 <label className="block text-xs font-black uppercase text-slate-500">{lang === 'ar' ? 'Ø±ÙˆØ§Ø¨Ø· Ø§Ù„ØµÙˆØ± (Ù…ÙØµÙˆÙ„Ø© Ø¨ÙØ§ØµÙ„Ø©)' : 'Image URLs (comma separated)'}</label>
                                 <textarea rows={3} value={section.content} onChange={(e) => handleUpdateCustomSection(section.id, 'content', e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white" placeholder="https://..., https://..." />
                                 <label className="block text-xs font-black uppercase text-slate-500 mt-4">{lang === 'ar' ? 'Ø§Ø±ØªÙØ§Ø¹ Ø§Ù„Ø³Ù„Ø§ÙŠØ¯Ø±' : 'Slider Height'}</label>
                                 <input type="range" min="200" max="800" step="50" value={section.settings?.height || 400} onChange={(e) => handleUpdateCustomSection(section.id, 'settings', {...section.settings, height: parseInt(e.target.value)})} className="w-full" />
                                 <div className="text-right text-xs text-slate-500">{section.settings?.height || 400}px</div>
                              </div>
                           )}

                           {section.type === 'html' && (
                              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                                 <label className="block text-xs font-black uppercase text-slate-500">{lang === 'ar' ? 'ÙƒÙˆØ¯ HTML' : 'HTML Code'}</label>
                                 <textarea rows={8} value={section.content} onChange={(e) => handleUpdateCustomSection(section.id, 'content', e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-900 text-green-400 font-mono" placeholder="<div>...</div>" />
                              </div>
                           )}
                           
                           <button onClick={(e) => handleRemoveCustomSection(section.id, e)} className="w-full p-3 mt-4 bg-red-50 text-red-500 font-bold rounded-xl hover:bg-red-100 transition-colors">
                              {lang === 'ar' ? 'Ø­Ø°Ù Ø§Ù„Ù‚Ø³Ù…' : 'Delete Section'}
                           </button>
                        </div>
                     );
                  })()}
               </div>
            )}


            {activeSidebarTab === 'settings' && (
               <div className="space-y-6 animate-fade-in">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'Ø§Ø³Ù… Ø§Ù„Ù…ØªØ¬Ø±' : 'Store Name'}</label>
                     <input
                       type="text"
                       defaultValue={localStorage.getItem('gzeed_store_name') || ''}
                       onChange={(e) => {
                         localStorage.setItem('gzeed_store_name', e.target.value);
                         updateConfigInIframe({ storeName: e.target.value });
                       }}
                       className="w-full p-3 border border-slate-200 rounded-lg text-sm"
                       placeholder={lang === 'ar' ? 'Ø§Ø³Ù… Ù…ØªØ¬Ø±Ùƒ' : 'Mon Magasin'}
                     />
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'Ø§Ù„Ù†Ø·Ø§Ù‚ (Domain)' : 'Store Domain'}</label>
                     <input
                       type="text"
                       defaultValue={localStorage.getItem('gzeed_domain_name') || ''}
                       readOnly
                       className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                       placeholder="yourstore.gzeed.com"
                     />
                     <p className="text-[10px] text-slate-400 mt-1">{lang === 'ar' ? 'ÙŠÙ…ÙƒÙ† ØªØºÙŠÙŠØ± Ø§Ù„Ù†Ø·Ø§Ù‚ Ù…Ù† Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ… â† Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª' : 'Modifiable depuis le Tableau de bord â†’ Paramètres'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'Ù„ØºØ© Ø§Ù„Ù…ØªØ¬Ø±' : 'Store Language'}</label>
                     <select value={storeLang} onChange={(e) => {
                       setStoreLang(e.target.value);
                       updateConfigInIframe({ storeLang: e.target.value });
                     }} className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white">
                       <option value="fr">{lang === 'ar' ? 'Ø§Ù„ÙØ±Ù†Ø³ÙŠØ©' : 'Français'}</option>
                       <option value="ar">{lang === 'ar' ? 'Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©' : 'Arabe'}</option>
                       <option value="en">{lang === 'ar' ? 'Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©' : 'English'}</option>
                     </select>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'Ø§Ù„Ø¹Ù…Ù„Ø©' : 'Devise'}</label>
                     <select value={storeCurrency} onChange={(e) => {
                       setStoreCurrency(e.target.value);
                       updateConfigInIframe({ storeCurrency: e.target.value });
                     }} className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white">
                       <option value="MAD">MAD (Ø¯Ø±Ù‡Ù… Ù…ØºØ±Ø¨ÙŠ)</option>
                       <option value="USD">USD ($)</option>
                       <option value="EUR">EUR (â‚¬)</option>
                     </select>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'Ø§Ù„Ø®Ø·' : 'Police'}</label>
                     <select value={activeFont} onChange={(e) => handleFontChange(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white">
                       <option value="font-sans">Inter / System Sans</option>
                       <option value="font-serif">Playfair / Serif</option>
                     </select>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <label className="block text-xs font-black uppercase text-slate-500 mb-2">{lang === 'ar' ? 'Ø­Ø§Ù„Ø© Ø§Ù„Ù…ØªØ¬Ø±' : 'Statut'}</label>
                     <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                       <span className="text-sm font-bold text-slate-700">{lang === 'ar' ? 'Ù†Ø´Ø· (Live)' : 'En ligne'}</span>
                     </div>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {lang === 'ar' ? 'Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ…' : 'Retour au Dashboard'}
                  </button>
               </div>
             )}

            {activeSidebarTab === 'code' && (
              <div className="space-y-6 animate-fade-in">
                 <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />
                    <Code className="w-8 h-8 mb-3 text-indigo-500 relative z-10" />
                    <p className="text-sm font-black text-slate-900 mb-2 relative z-10">{lang === 'ar' ? 'Ù…Ø­Ø±Ø± Ø§Ù„Ø£ÙƒÙˆØ§Ø¯ Ø§Ù„Ù…Ø®ØµØµØ© (GZeed Engine)' : 'Custom Code Editor (GZeed Engine)'}</p>
                    <p className="text-xs font-medium leading-relaxed relative z-10">{lang === 'ar' ? 'Ø£Ø¶Ù Ø£ÙƒÙˆØ§Ø¯ HTML/CSS/JS Ø®Ø§ØµØ© Ø¨Ùƒ Ù„ÙŠØªÙ… Ø¹Ø±Ø¶Ù‡Ø§ ÙÙŠ Ø§Ù„Ù…ØªØ¬Ø±. Ù‡Ø§Ø¯ Ø§Ù„Ù…ÙŠØ²Ø© ÙƒØªØ®Ù„ÙŠÙƒ ØªØµØ§ÙˆØ¨ Ù‚ÙˆØ§Ù„Ø¨ Ø§Ø­ØªØ±Ø§ÙÙŠØ© Ø¨Ø­Ø§Ù„ Ù„ÙŠ ÙÙ€ Shopify (Liquid) Ùˆ WordPress.' : 'Add custom HTML/CSS/JS to render in your store, similar to Shopify Liquid.'}</p>
                 </div>
                 <div className="flex flex-col gap-3">
                    <label className="block text-xs font-black uppercase text-slate-500">{lang === 'ar' ? 'Ø£ÙƒÙˆØ§Ø¯Ùƒ Ø§Ù„Ù…Ø®ØµØµØ©' : 'Your Custom Code'}</label>
                    <div className="relative">
                       <textarea 
                         value={customCode}
                         onChange={(e) => setCustomCode(e.target.value)}
                         className="w-full h-[400px] p-5 bg-[#0f172a] text-[#38bdf8] font-mono text-xs rounded-xl border-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed custom-scrollbar shadow-inner"
                         placeholder={`<style>\n  /* CSS */\n  .my-custom-btn {\n    background: #000;\n    color: #fff;\n    padding: 10px 20px;\n    border-radius: 8px;\n  }\n</style>\n\n<!-- HTML -->\n<div class="my-custom-btn">\n  Hello GZeed!\n</div>\n\n<script>\n  /* JS */\n  console.log('Code Loaded!');\n</script>`}
                         dir="ltr"
                         spellCheck={false}
                       />
                       <div className="absolute top-3 right-3 text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">HTML / JS / CSS</div>
                    </div>
                    <button 
                      onClick={() => {
                        updateConfigInIframe({ customCode });
                      }}
                      className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 hover:scale-[1.02]"
                    >
                      <Play className="w-4 h-4" />
                      {lang === 'ar' ? 'ØªØ·Ø¨ÙŠÙ‚ Ø§Ù„ÙƒÙˆØ¯ Ø¹Ù„Ù‰ Ø§Ù„Ù…ØªØ¬Ø±' : 'Apply Code to Store'}
                    </button>
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

      {slideUnsplashPickerIdx !== null && (
         <div className="fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={() => setSlideUnsplashPickerIdx(null)}>
            <div className="bg-white w-full sm:max-w-3xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh' }}>
               <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">{lang === 'ar' ? 'Ø¨Ø­Ø« ÙÙŠ Unsplash' : 'Search Unsplash'}</h3>
                  <button onClick={() => setSlideUnsplashPickerIdx(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><X className="w-5 h-5"/></button>
               </div>
               
               <div className="p-4 bg-slate-50">
                  <form onSubmit={(e) => { e.preventDefault(); searchUnsplashPhotos(unsplashSearchQuery); }} className="relative">
                     <Search className={`absolute w-5 h-5 text-slate-400 top-3 ${lang === 'ar' ? 'right-3' : 'left-3'}`} />
                     <input type="text" value={unsplashSearchQuery} onChange={(e) => setUnsplashSearchQuery(e.target.value)} placeholder={lang === 'ar' ? 'Ø§Ø¨Ø­Ø« Ø¹Ù† ØµÙˆØ± (Ù…Ø«Ø§Ù„: Ø£Ø²ÙŠØ§Ø¡ØŒ Ø¹Ø·ÙˆØ±...)' : 'Search photos (e.g., fashion, perfume...)'} className={`w-full bg-white border border-slate-200 rounded-xl py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`} />
                     <button type="submit" disabled={isSearchingUnsplash || !unsplashSearchQuery.trim()} className={`absolute top-2 ${lang === 'ar' ? 'left-2' : 'right-2'} bg-slate-900 text-white px-4 py-1.5 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-slate-800`}>
                       {isSearchingUnsplash ? '...' : (lang === 'ar' ? 'Ø¨Ø­Ø«' : 'Search')}
                     </button>
                  </form>
                  {unsplashSearchError && <p className="text-red-500 text-xs mt-2 font-medium">{unsplashSearchError}</p>}
               </div>

               <div className="p-4 overflow-y-auto flex-1 bg-white min-h-[300px]">
                  {unsplashSearchResults.length > 0 ? (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {unsplashSearchResults.map((url, i) => (
                           <div key={i} onClick={() => {
                             handleUpdateSlide(slideUnsplashPickerIdx, 'image', url);
                             setSlideUnsplashPickerIdx(null);
                           }} className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative border border-slate-100 shadow-sm">
                             <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                             <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/20 transition-colors"></div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <Globe className="w-12 h-12 mb-3 text-slate-200" />
                        <p className="font-medium text-sm">{lang === 'ar' ? 'Ø§Ø¨Ø­Ø« Ø¹Ù† ØµÙˆØ± Ø¹Ø§Ù„ÙŠØ© Ø§Ù„Ø¬ÙˆØ¯Ø© Ù…Ø¬Ø§Ù†Ø§Ù‹' : 'Search high quality photos for free'}</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      )}
    </div>
  );
}

