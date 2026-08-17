import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LangContext';
import { Play, TrendingUp, Users, Laptop, ArrowRight, ShieldCheck, Zap, Layers, ChevronRight, CheckCircle2, Search, Video } from 'lucide-react';
import PublicFooter from '../components/PublicFooter';
import { usePlatformSettings } from '../contexts/PlatformSettingsContext';

// ==========================================
// 🎥 VIDEO BACKGROUND IS MANAGED VIA CMS
// ==========================================

export default function PlatformLanding() {
  const { lang, setLang, isAr } = useLang();
  const { settings } = usePlatformSettings();
  const [scrolled, setScrolled] = useState(false);
  const [brandInput, setBrandInput] = useState("");
  const [debouncedBrand, setDebouncedBrand] = useState("");
  const [isSearchingDomain, setIsSearchingDomain] = useState(false);
  const [domainResults, setDomainResults] = useState<{ ext: string, available: boolean }[]>([]);
  const [showIcon, setShowIcon] = useState(false);

  // Helper for 3-way translation
  const txt = (ar: string, fr: string, en: string) => lang === 'ar' ? ar : lang === 'en' ? en : fr;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Alternate logo every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowIcon(prev => !prev);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Debounce the input for domain search
  useEffect(() => {
    setIsSearchingDomain(true);
    const timer = setTimeout(() => {
      setDebouncedBrand(brandInput);
    }, 1000);
    return () => clearTimeout(timer);
  }, [brandInput]);

  // Simulate Domain API Call
  useEffect(() => {
    if (!debouncedBrand) {
      setDomainResults([]);
      setIsSearchingDomain(false);
      return;
    }

    // Fake logic: if word is very common or short (e.g. "google", "apple", < 4 chars), mark .com as taken
    const isTaken = debouncedBrand.length < 5 || ['google', 'apple', 'amazon', 'facebook'].includes(debouncedBrand);

    setDomainResults([
      { ext: '.com', available: !isTaken },
      { ext: '.ma', available: true },
      { ext: '.store', available: true },
    ]);
    setIsSearchingDomain(false);

  }, [debouncedBrand]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-cyan-500/20" dir={isAr ? 'rtl' : 'ltr'}>

      {/* Navigation (GoDaddy Style: Solid black text, clean white background on scroll) */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo (Alternating) */}
          <Link to="/" className="relative h-10 w-32 flex items-center" dir="ltr">
            {/* Text Version */}
            <div className={`absolute left-0 transition-opacity duration-1000 ease-in-out ${showIcon ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <span className={`text-3xl font-black tracking-tighter leading-none ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                G<span className="text-cyan-400">Zeed</span>
              </span>
            </div>

            {/* Icon Version */}
            <div className={`absolute left-0 transition-opacity duration-1000 ease-in-out ${showIcon ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border bg-white border-slate-200/50">
                <span className="text-2xl font-black tracking-tighter leading-none flex items-center">
                  <span className="text-slate-900">G</span><span className="text-cyan-400">Z</span>
                </span>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'ar' | 'fr' | 'en')}
              className={`text-xs font-bold transition-colors uppercase tracking-widest bg-transparent outline-none cursor-pointer ${scrolled ? 'text-slate-600' : 'text-white/80'}`}
              dir="ltr"
            >
              <option value="ar" className="text-slate-900">العربية</option>
              <option value="fr" className="text-slate-900">FR</option>
              <option value="en" className="text-slate-900">EN</option>
            </select>
            <Link to="/login" className={`text-sm font-semibold transition-colors hidden sm:block ${scrolled ? 'text-slate-900 hover:text-cyan-600' : 'text-white hover:text-cyan-300'}`}>
              {txt('تسجيل الدخول', 'Se Connecter', 'Log In')}
            </Link>
            <Link to="/academy" className="px-6 py-2.5 rounded-md bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-700 transition-all shadow-md">
              {txt('ابدأ الآن', 'Commencer', 'Get Started')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Video Background */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden min-h-screen flex flex-col justify-center bg-black">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            key={settings.heroVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover opacity-50"
          >
            <source src={settings.heroVideoUrl || "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-1560-large.mp4"} type="video/mp4" />
          </video>
          {/* Dark Overlay for text readability (65% opacity) */}
          <div className="absolute inset-0 bg-black/[0.65]" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 w-full">

          <h1 className="text-[40px] md:text-[55px] lg:text-[70px] font-black tracking-tight leading-[1.25] md:leading-[1.1] mb-6 text-white drop-shadow-xl">
            {txt(settings.heroTitleAr, settings.heroTitleFr, 'The future of web building.')}
          </h1>

          <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md">
            {txt(
              settings.heroSubtitleAr || 'أطلق موقعك وتحكم في تصميمه بحرية تامة، مع أسهل وأسرع لوحة إدارة في السوق.',
              settings.heroSubtitleFr || 'Lancez votre site et contrôlez son design librement, avec l\'interface la plus simple du marché.',
              'Launch your site and control its design freely, with the easiest admin panel in the market.'
            )}
          </p>

          {/* GoDaddy Style Search/Input Bar */}
          <div className="max-w-3xl mx-auto bg-white p-2 rounded-xl flex flex-col sm:flex-row shadow-2xl relative z-20">
            <div className="flex-1 flex items-center px-4 bg-white rounded-l-lg">
              <Search className="w-6 h-6 text-slate-400 shrink-0" />
              <input
                type="text"
                value={brandInput}
                onChange={(e) => setBrandInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder={txt("شنو هي سمية المشروع ديالك؟ (مثال: mybrand)", "Quel est le nom de votre projet ?", "What is your project name?")}
                className={`w-full py-4 px-4 outline-none text-xl font-medium text-slate-900 bg-transparent placeholder-slate-400 ${isAr ? 'text-right' : 'text-left'}`}
                dir={isAr ? 'rtl' : 'ltr'}
              />
            </div>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xl px-10 py-4 rounded-lg transition-colors whitespace-nowrap mt-2 sm:mt-0 flex items-center justify-center gap-2 shadow-lg">
              {txt('ابحث عن اسمك', 'Vérifier', 'Check Name')}
              <ArrowRight className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Dynamic URL & Domain Preview */}
          {brandInput && (
            <div className="max-w-3xl mx-auto mt-6 text-center animate-fade-in">
              {/* Free Subdomain */}
              <p className="text-white text-lg font-medium bg-black/40 inline-block px-6 py-2.5 rounded-full backdrop-blur-md border border-white/10 shadow-xl mb-4">
                {txt('نطاقك المجاني:', 'Votre domaine gratuit:', 'Your free domain:')}
                <span className="text-cyan-400 font-black ml-2 tracking-wide" dir="ltr">{brandInput}.gzeed.com</span>
              </p>

              {/* Premium Domains */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 max-w-2xl mx-auto">
                <p className="text-slate-300 text-sm mb-3 font-medium">
                  {isAr ? 'أو احجز نطاقاً احترافياً خاصاً بك:' : 'Ou réservez un domaine professionnel personnalisé :'}
                </p>
                <div className="flex flex-wrap justify-center gap-3 min-h-[40px]">
                  {isSearchingDomain ? (
                    <div className="flex items-center gap-3 text-slate-300">
                      <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">{isAr ? 'جاري فحص النطاقات في قواعد البيانات...' : 'Vérification dans les bases de données...'}</span>
                    </div>
                  ) : (
                    domainResults.map((domain, idx) => (
                      <div key={idx} className={`bg-white text-slate-900 px-4 py-2 rounded-xl font-bold flex items-center gap-3 text-sm shadow-sm transition-transform ${domain.available ? 'cursor-pointer hover:-translate-y-1' : 'opacity-80'}`}>
                        <span dir="ltr">{debouncedBrand}{domain.ext}</span>
                        {domain.available ? (
                          <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">{isAr ? 'متاح' : 'Dispo'}</span>
                        ) : (
                          <span className="text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">{isAr ? 'مأخوذ' : 'Pris'}</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          <p className="text-sm text-slate-300 mt-6 font-medium">
            {txt('تسجيل مجاني · لا تحتاج بطاقة بنكية · دعم 24/7', 'Inscription gratuite · Sans carte bancaire · Support 24/7', 'Free signup · No credit card required · 24/7 Support')}
          </p>

        </div>
      </section>

      {/* Services Grid - GoDaddy Style */}
      {settings.showFeatures !== false && (
      <section className="py-24 px-6 relative z-10 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 text-slate-900">{txt('كل ما تحتاجه للنجاح الرقمي', 'Tout ce dont vous avez besoin pour réussir', 'Everything you need to succeed')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Service 1 */}
            <div className="bg-white border border-slate-200 p-10 rounded-2xl hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <Laptop className="w-12 h-12 text-slate-900 mb-6" />
              <h3 className="text-2xl font-black mb-3 text-slate-900">{txt('بناء أي موقع بحرية', 'Création de Sites Flexibles', 'Flexible Site Creation')}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                {txt(
                  'من المتاجر إلى المواقع التعريفية والبورتفوليو. صمم موقعك كما تتخيله، وغير الكود المصدري للقالب بدون قيود.',
                  'Boutiques, sites vitrines ou portfolios. Modifiez le code source du thème sans aucune restriction.',
                  'From stores to portfolios. Modify the theme source code with absolutely no restrictions.'
                )}
              </p>
              <span className="text-cyan-600 font-bold group-hover:text-cyan-800 flex items-center gap-2 transition-colors">
                {txt('ابدأ الآن', 'Commencer', 'Start Now')} <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              </span>
            </div>

            {/* Service 2 */}
            <div className="bg-white border border-slate-200 p-10 rounded-2xl hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <TrendingUp className="w-12 h-12 text-slate-900 mb-6" />
              <h3 className="text-2xl font-black mb-3 text-slate-900">{txt('إدارة سهلة وبدون تعقيدات', 'Gestion facile et sans complexité', 'Easy & Hassle-free Management')}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                {txt(
                  'لوحة تحكم احترافية وسهلة تغنيك عن أي تعقيدات تقنية، مع ربط أوتوماتيكي بالتوصيل والدفع.',
                  'Interface admin intuitive éliminant toute complexité technique. Intégration auto paiement/livraison.',
                  'Intuitive admin interface eliminating technical complexity. Auto integration for payments/shipping.'
                )}
              </p>
              <span className="text-cyan-600 font-bold group-hover:text-cyan-800 flex items-center gap-2 transition-colors">
                {txt('اكتشف المزيد', 'En savoir plus', 'Learn More')} <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              </span>
            </div>

            {/* Service 3 */}
            <div className="bg-white border border-slate-200 p-10 rounded-2xl hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <Users className="w-12 h-12 text-slate-900 mb-6" />
              <h3 className="text-2xl font-black mb-3 text-slate-900">{txt('أكاديمية GZeed', 'GZeed Academy', 'GZeed Academy')}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                {txt(
                  'تعلم كيف تؤسس وكالتك الرقمية، وكيف تبيع المواقع والمتاجر للشركات وتحقق أرباحاً.',
                  'Apprenez à fonder votre agence digitale, vendre des sites et générer des profits.',
                  'Learn how to build your digital agency, sell websites to businesses, and generate profits.'
                )}
              </p>
              <span className="text-cyan-600 font-bold group-hover:text-cyan-800 flex items-center gap-2 transition-colors">
                {txt('تصفح الدروس', 'Voir les cours', 'View Courses')} <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              </span>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* Case Study Section (GoDaddy style big banner) */}
      <section className="py-24 px-6 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-3xl overflow-hidden flex flex-col md:flex-row items-center">

          <div className="p-12 md:w-1/2 flex flex-col justify-center">
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center mb-6">
              <span className="text-white font-black text-xl">BEYA</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white leading-tight">
              {txt('كيف تحول مصنع تقليدي إلى إمبراطورية رقمية؟', 'Comment une usine s\'est transformée en empire digital ?', 'How a traditional factory became a digital empire?')}
            </h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              {txt(
                'اكتشف كيف استخدمنا منصة GZeed لأتمتة عمليات شركة Beya Creative بالكامل وزيادة المبيعات بشكل مضاعف.',
                'Découvrez comment nous avons automatisé Beya Creative avec GZeed pour multiplier les ventes.',
                'Discover how we automated Beya Creative with GZeed to multiply sales.'
              )}
            </p>
            <a href="#/case-study/beya" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-black px-8 py-4 rounded-md hover:bg-slate-200 transition-colors w-fit">
              <Play className="w-5 h-5" />
              {txt('شاهد دراسة الحالة', 'Voir l\'étude de cas', 'Watch Case Study')}
            </a>
          </div>

          <div className="w-full md:w-1/2 h-64 md:h-full bg-slate-800 relative">
            {/* Decorative image/pattern representing the case study */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/30 to-indigo-600/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Video className="w-24 h-24 text-white/20" />
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
