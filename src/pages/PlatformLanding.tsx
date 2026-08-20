import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../contexts/LangContext';
import { Play, TrendingUp, Users, Laptop, ArrowRight, Search, Video, Mail } from 'lucide-react';
import PublicFooter from '../components/PublicFooter';
import { PricingSection } from '../components/PricingSection';
import { usePlatformSettings } from '../contexts/PlatformSettingsContext';
import { saveRecord } from '../types';

// ==========================================
// 🎥 VIDEO BACKGROUND IS MANAGED VIA CMS
// ==========================================

export default function PlatformLanding() {
  const { lang, setLang, isAr } = useLang();
  const { settings } = usePlatformSettings();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [heroEmail, setHeroEmail] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = heroEmail.trim();
    if (!email || isSubmittingLead) return;
    setIsSubmittingLead(true);
    // Capture the lead immediately so we never lose it, even if the visitor
    // abandons the signup flow right after this - previously this email was
    // typed and thrown away with no record kept anywhere.
    try {
      await saveRecord('leads', {
        id: `lead-${Date.now()}`,
        name: email,
        email,
        type: 'GZeed Landing - Hero Signup',
        status: 'new',
        date: new Date().toISOString(),
      }, true);
    } catch (err) {
      // Don't block the signup flow if the lead write fails
      console.warn('Failed to save landing lead:', err);
    }
    setIsSubmittingLead(false);
    navigate('/store-signup', { state: { email } });
  };

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
            <Link to="/store-signup" className="px-6 py-2.5 rounded-md bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-700 transition-all shadow-md">
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
          {/* Dark Overlay for text readability (20% opacity) */}
          <div className="absolute inset-0 bg-black/20" />
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

          <form onSubmit={handleHeroSubmit} className="relative max-w-2xl mx-auto mb-8 transform transition-all hover:scale-[1.02] duration-300 z-10">
            {/* Desktop View */}
            <div className="hidden sm:flex items-center bg-white rounded-2xl p-2 shadow-2xl border border-slate-100">
              <Mail className="w-6 h-6 text-slate-400 mx-4" />
              <input
                type="email"
                required
                value={heroEmail}
                onChange={(e) => setHeroEmail(e.target.value)}
                placeholder={isAr ? "أدخل بريدك الإلكتروني للبدء..." : "Entrez votre adresse e-mail..."}
                className="flex-1 bg-transparent border-none focus:ring-0 text-lg px-2 font-medium text-slate-900 placeholder:text-slate-400"
                dir={isAr ? "rtl" : "ltr"}
              />
              <button type="submit" disabled={isSubmittingLead} className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-2 group whitespace-nowrap shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)]">
                {isAr ? 'إنشاء حساب' : 'Créer un compte'}
                <ArrowRight className={`w-5 h-5 transition-transform shrink-0 ${isAr ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
              </button>
            </div>

            {/* Mobile View */}
            <div className="flex sm:hidden flex-col gap-3 w-full">
              <div className="bg-white rounded-xl shadow-lg flex items-center border border-slate-200 overflow-hidden">
                <input
                  type="email"
                  required
                  value={heroEmail}
                  onChange={(e) => setHeroEmail(e.target.value)}
                  placeholder={isAr ? "أدخل بريدك الإلكتروني للبدء..." : "Entrez votre e-mail..."}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-base px-4 py-4 font-medium text-slate-900 placeholder:text-slate-400 w-full"
                  dir={isAr ? "rtl" : "ltr"}
                />
              </div>
              <button type="submit" disabled={isSubmittingLead} className="w-full justify-center bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-2 group shadow-[0_0_20px_rgba(8,145,178,0.3)]">
                {isAr ? 'إنشاء حساب' : 'Créer un compte'}
                <ArrowRight className={`w-5 h-5 transition-transform shrink-0 ${isAr ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
              </button>
            </div>
          </form>
          <p className="text-sm text-slate-300 mt-6 font-medium">
            {txt('تسجيل مجاني · لا تحتاج بطاقة بنكية · دعم 24/7', 'Inscription gratuite · Sans carte bancaire · Support 24/7', 'Free signup · No credit card required · 24/7 Support')}
          </p>
          <Link to="/pricing" className="inline-block text-sm text-cyan-300 hover:text-cyan-200 underline underline-offset-4 mt-2 font-medium">
            {txt('شوف الأثمنة والخدمات قبل ما تبدأ', 'Voir les tarifs et services avant de commencer', 'See pricing and services before you start')}
          </Link>

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
            <div onClick={() => navigate('/store-signup')} className="bg-white border border-slate-200 p-10 rounded-2xl hover:shadow-lg transition-all duration-300 group cursor-pointer">
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
            <div onClick={() => navigate('/store-signup')} className="bg-white border border-slate-200 p-10 rounded-2xl hover:shadow-lg transition-all duration-300 group cursor-pointer">
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
            <div onClick={() => navigate('/store-signup')} className="bg-white border border-slate-200 p-10 rounded-2xl hover:shadow-lg transition-all duration-300 group cursor-pointer">
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
      {settings.showIntroVideo && (
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
      )}

      {/* Pricing - shown up-front so visitors know costs before building a store */}
      <PricingSection bgClass="bg-slate-50" titleClass="text-slate-900" />

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
