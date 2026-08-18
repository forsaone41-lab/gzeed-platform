import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, Scissors, MonitorSmartphone, TrendingUp, CheckCircle2, ShoppingCart, Zap, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabase';

const TRANSLATIONS = {
  ar: {
    dir: 'rtl',
    startNow: 'ابدأ الآن',
    subtitle: 'النظام المتكامل الأول في المغرب',
    title1: 'أطلق علامتك ',
    titleHighlight: 'التجارية',
    title2: '\nمن الفكرة إلى المبيعات',
    desc: 'نحن لا نصنع ملابسك فقط، بل نبني متجرك الإلكتروني ونربطه بذكاء لتتمكن من البيع في يومك الأول.',
    problemTitle: 'الطريقة القديمة (معاناة)',
    problemDesc: 'أغلب من يبدأ في مجال الملابس يستسلم في الشهر الأول بسبب هذه المشاكل:',
    prob1Title: 'تصنيع بطيء ورديء',
    prob1Desc: 'البحث عن خياطين موثوقين يأخذ وقتاً طويلاً، وغالباً ما تكون الجودة غير مطابقة لتوقعاتك ومواعيد التسليم متأخرة.',
    prob2Title: 'تكاليف متجر باهظة',
    prob2Desc: 'يطلب منك المبرمجون مبالغ خيالية لإنشاء موقعك، وفي النهاية تحصل على متجر بطيء ولا يتناسب مع السوق المغربي.',
    prob3Title: 'تشتت في التسيير',
    prob3Desc: 'تضيع وقتك بين المعمل، استوديو التصوير، وتتبع الطلبيات، مما يمنعك من التركيز على التسويق والمبيعات.',
    solSubtitle: 'الحل المتكامل',
    solTitle: 'نظام BEYA البيئي',
    solDesc: 'مكان واحد يجمع التصنيع العالي الجودة مع أحدث تكنولوجيا التجارة الإلكترونية.',
    prodTitle: '1. BEYA Production',
    prodDesc: 'نحن نتكفل بصناعة ملابسك من الألف إلى الياء. أثواب ممتازة، فصالة عصرية، وخياطة بمعايير التصدير.',
    prodCheck1: 'تتبع مباشر لمراحل الخياطة من حسابك',
    prodCheck2: 'احترام تام لمواعيد التسليم',
    storeTitle: '2. BEYA Store',
    storeDesc: 'نبني لك متجراً إلكترونياً ذكياً ومحسّناً للسوق المغربي بنسبة 100%.',
    storeCheck1: 'الدفع عند الاستلام (COD) سريع جداً',
    storeCheck2: 'ربط أوتوماتيكي مع شركات التوصيل (eGrow)',
    featureTitle: 'الميزة الخارقة (Push to Store)',
    featureDesc: 'بمجرد الانتهاء من خياطة ملابسك، يتم إرسالها آلياً إلى متجرك مع الكمية الصحيحة لتصبح جاهزة للبيع فوراً!',
    addToCart: 'إضافة للسلة',
    readyTitle: 'هل أنت مستعد للبدء؟',
    readyDesc: 'أدخل معلوماتك وسنتواصل معك فوراً لتحديد موعد والبدء في مشروعك.',
    successTitle: 'تم الإرسال بنجاح!',
    successDesc: 'سنتصل بك في أقرب وقت لبدء رحلتك مع BEYA.',
    formName: 'الاسم الكامل',
    formNamePl: 'أدخل اسمك هنا...',
    formPhone: 'رقم الواتساب',
    formProject: 'شنو الفكرة ديال مشروعك؟',
    formProjectPl: 'مثال: بغيت نصاوب ماركة ديال التيشيرتات...',
    btnSubmit: 'إرسال الطلب الآن',
    btnSending: 'جاري الإرسال...',
    rights: 'Tous droits réservés.',
    arrowLeft: ArrowLeft,
    arrowRight: ArrowRight
  },
  fr: {
    dir: 'ltr',
    startNow: 'Commencer',
    subtitle: 'Le Premier Système Intégré au Maroc',
    title1: 'Lancez Votre ',
    titleHighlight: 'Marque',
    title2: '\nDe l\'idée à la Vente',
    desc: 'Nous ne fabriquons pas seulement vos vêtements, nous construisons votre boutique en ligne et la connectons intelligemment pour que vous puissiez vendre dès le premier jour.',
    problemTitle: 'L\'ancienne méthode (souffrance)',
    problemDesc: 'La plupart de ceux qui se lancent dans l\'habillement abandonnent le premier mois à cause de ces problèmes :',
    prob1Title: 'Fabrication lente et de mauvaise qualité',
    prob1Desc: 'Trouver des tailleurs fiables prend du temps, la qualité ne correspond souvent pas à vos attentes et les délais sont retardés.',
    prob2Title: 'Coûts de boutique exorbitants',
    prob2Desc: 'Les programmeurs demandent des sommes astronomiques pour créer votre site, et au final vous obtenez une boutique lente inadaptée au marché.',
    prob3Title: 'Dispersion dans la gestion',
    prob3Desc: 'Vous perdez du temps entre l\'atelier, le studio photo et le suivi des commandes, vous empêchant de vous concentrer sur les ventes.',
    solSubtitle: 'La Solution Intégrée',
    solTitle: 'Écosystème BEYA',
    solDesc: 'Un seul endroit réunissant une fabrication de haute qualité et les dernières technologies e-commerce.',
    prodTitle: '1. BEYA Production',
    prodDesc: 'Nous gérons la fabrication de vos vêtements de A à Z. Tissus d\'excellence, coupes modernes et couture aux normes d\'exportation.',
    prodCheck1: 'Suivi en direct des étapes de couture depuis votre compte',
    prodCheck2: 'Respect total des délais de livraison',
    storeTitle: '2. BEYA Store',
    storeDesc: 'Nous vous construisons une boutique en ligne intelligente, optimisée à 100% pour le marché marocain.',
    storeCheck1: 'Paiement à la livraison (COD) ultra-rapide',
    storeCheck2: 'Connexion automatique avec les livreurs (eGrow)',
    featureTitle: 'La Fonctionnalité Ultime (Push to Store)',
    featureDesc: 'Une fois vos vêtements cousus, ils sont envoyés à votre boutique avec la bonne quantité, prêts à être vendus instantanément !',
    addToCart: 'Ajouter au Panier',
    readyTitle: 'Êtes-vous prêt à commencer ?',
    readyDesc: 'Entrez vos informations et nous vous contacterons immédiatement pour fixer un rendez-vous et démarrer.',
    successTitle: 'Envoyé avec succès !',
    successDesc: 'Nous vous appellerons très bientôt pour commencer votre aventure avec BEYA.',
    formName: 'Nom Complet',
    formNamePl: 'Entrez votre nom ici...',
    formPhone: 'Numéro WhatsApp',
    formProject: 'Quelle est l\'idée de votre projet ?',
    formProjectPl: 'Exemple : Je veux créer une marque de t-shirts...',
    btnSubmit: 'Envoyer la Demande',
    btnSending: 'Envoi en cours...',
    rights: 'Tous droits réservés.',
    arrowLeft: ArrowRight,
    arrowRight: ArrowLeft
  },
  en: {
    dir: 'ltr',
    startNow: 'Start Now',
    subtitle: 'The First Integrated System in Morocco',
    title1: 'Launch Your ',
    titleHighlight: 'Brand',
    title2: '\nFrom Idea to Sales',
    desc: 'We don\'t just manufacture your clothes, we build your online store and connect it intelligently so you can sell on day one.',
    problemTitle: 'The Old Way (Struggle)',
    problemDesc: 'Most who start in the clothing business give up in the first month because of these problems:',
    prob1Title: 'Slow and Poor Quality Manufacturing',
    prob1Desc: 'Finding reliable tailors takes time, quality often doesn\'t match expectations, and delivery times are delayed.',
    prob2Title: 'Exorbitant Store Costs',
    prob2Desc: 'Programmers ask for astronomical amounts to create your site, and you get a slow store that doesn\'t fit the market.',
    prob3Title: 'Scattered Management',
    prob3Desc: 'You waste time between the workshop, photo studio, and tracking orders, preventing you from focusing on sales.',
    solSubtitle: 'The Integrated Solution',
    solTitle: 'BEYA Ecosystem',
    solDesc: 'One place combining high-quality manufacturing and the latest e-commerce technology.',
    prodTitle: '1. BEYA Production',
    prodDesc: 'We handle your clothing manufacturing from A to Z. Excellent fabrics, modern cuts, and export-standard sewing.',
    prodCheck1: 'Live tracking of sewing stages from your account',
    prodCheck2: 'Total respect of delivery times',
    storeTitle: '2. BEYA Store',
    storeDesc: 'We build you a smart online store, 100% optimized for the Moroccan market.',
    storeCheck1: 'Ultra-fast Cash on Delivery (COD)',
    storeCheck2: 'Automatic connection with delivery companies (eGrow)',
    featureTitle: 'Killer Feature (Push to Store)',
    featureDesc: 'Once your clothes are sewn, they are automatically sent to your store with the right quantity, ready to sell instantly!',
    addToCart: 'Add to Cart',
    readyTitle: 'Are you ready to start?',
    readyDesc: 'Enter your information and we will contact you immediately to schedule an appointment and start.',
    successTitle: 'Successfully sent!',
    successDesc: 'We will call you very soon to start your journey with BEYA.',
    formName: 'Full Name',
    formNamePl: 'Enter your name here...',
    formPhone: 'WhatsApp Number',
    formProject: 'What is your project idea?',
    formProjectPl: 'Example: I want to create a t-shirt brand...',
    btnSubmit: 'Send Request Now',
    btnSending: 'Sending...',
    rights: 'All rights reserved.',
    arrowLeft: ArrowRight,
    arrowRight: ArrowLeft
  }
};

function useOnScreen(ref: React.RefObject<Element>, rootMargin = '0px') {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIntersecting(true);
      },
      { rootMargin }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, rootMargin]);
  return isIntersecting;
}

const FadeIn = ({ children, delay = 0, className = '' }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref, '-50px');
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
    >
      {children}
    </div>
  );
};

export default function BeyaFunnel() {
  const navigate = useNavigate();
  const { lang: urlLang } = useParams<{ lang?: string }>();
  
  const [currentLang, setCurrentLang] = useState<'ar' | 'fr' | 'en'>(() => {
    if (urlLang === 'fr' || urlLang === 'ar' || urlLang === 'en') return urlLang;
    const stored = localStorage.getItem('funnel_lang');
    if (stored === 'fr' || stored === 'ar' || stored === 'en') return stored;
    return 'ar';
  });

  useEffect(() => {
    if (urlLang === 'fr' || urlLang === 'ar' || urlLang === 'en') {
      setCurrentLang(urlLang);
      localStorage.setItem('funnel_lang', urlLang);
    }
  }, [urlLang]);

  const changeLang = (l: 'ar' | 'fr' | 'en') => {
    setCurrentLang(l);
    localStorage.setItem('funnel_lang', l);
    navigate(`/funnel/${l}`, { replace: true });
  };

  const t = TRANSLATIONS[currentLang];
  const SubmitArrow = t.arrowLeft;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [project, setProject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setIsSubmitting(true);
    try {
      await supabase.from('leads').insert({
        name,
        phone,
        type: project || 'Marque de vêtement complète (Ecosystem)',
        status: 'nouveau',
        source: `Beya Funnel (${currentLang.toUpperCase()})`
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0f172a] text-slate-50 ${currentLang === 'ar' ? 'font-arabic' : 'font-sans'} selection:bg-indigo-500/30`} dir={t.dir}>
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-black text-xl tracking-widest uppercase">BEYA CREATIVE</span>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={currentLang} 
              onChange={(e) => changeLang(e.target.value as any)}
              className="bg-[#1e293b] text-white border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold outline-none cursor-pointer hover:bg-white/5 transition-colors"
              dir="ltr"
            >
              <option value="ar">العربية (AR)</option>
              <option value="fr">Français (FR)</option>
              <option value="en">English (EN)</option>
            </select>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-2.5 bg-white text-slate-900 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform hidden sm:block"
            >
              {t.startNow}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0f172a] to-[#0f172a]"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <FadeIn delay={100}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">{t.subtitle}</span>
            </div>
          </FadeIn>
          
          <FadeIn delay={200}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
              {t.title1}<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{t.titleHighlight}</span><br />
              {t.title2}
            </h1>
          </FadeIn>
          
          <FadeIn delay={300}>
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              {t.desc}
            </p>
          </FadeIn>
        </div>

        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20">
          <FadeIn delay={400}>
            <button 
              onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors animate-bounce backdrop-blur-sm"
            >
              <ArrowDown className="w-6 h-6 text-slate-400" />
            </button>
          </FadeIn>
        </div>
      </section>

      {/* The Problem */}
      <section id="problem" className="py-32 bg-[#0a0f1c] relative">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">{t.problemTitle}</h2>
              <p className="text-xl text-slate-400">{t.problemDesc}</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={100}>
              <div className="bg-[#0f172a] p-8 rounded-[2rem] border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
                  <Scissors className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{t.prob1Title}</h3>
                <p className="text-slate-400 leading-relaxed">{t.prob1Desc}</p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="bg-[#0f172a] p-8 rounded-[2rem] border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
                  <MonitorSmartphone className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{t.prob2Title}</h3>
                <p className="text-slate-400 leading-relaxed">{t.prob2Desc}</p>
              </div>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="bg-[#0f172a] p-8 rounded-[2rem] border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{t.prob3Title}</h3>
                <p className="text-slate-400 leading-relaxed">{t.prob3Desc}</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* The BEYA Solution */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/5"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn>
            <div className="text-center mb-24">
              <span className="text-indigo-400 font-black tracking-widest uppercase text-sm mb-4 block">{t.solSubtitle}</span>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">{t.solTitle}</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">{t.solDesc}</p>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Production */}
            <FadeIn delay={100} className="order-2 lg:order-1">
              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-white/5 transform -rotate-6">
                    <Scissors className="w-8 h-8 text-slate-900" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-3">{t.prodTitle}</h3>
                    <p className="text-slate-400 leading-relaxed mb-4">{t.prodDesc}</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm text-slate-300 font-bold"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t.prodCheck1}</li>
                      <li className="flex items-center gap-2 text-sm text-slate-300 font-bold"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t.prodCheck2}</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-indigo-500/20 transform rotate-6">
                    <MonitorSmartphone className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-3">{t.storeTitle}</h3>
                    <p className="text-slate-400 leading-relaxed mb-4">{t.storeDesc}</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm text-slate-300 font-bold"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t.storeCheck1}</li>
                      <li className="flex items-center gap-2 text-sm text-slate-300 font-bold"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t.storeCheck2}</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-start gap-4">
                  <Zap className="w-8 h-8 text-emerald-400 shrink-0 mt-1 animate-pulse" />
                  <div>
                    <h4 className="text-lg font-black text-white mb-1">{t.featureTitle}</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{t.featureDesc}</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right: Visual */}
            <FadeIn delay={200} className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
                <div className="relative bg-[#1e293b] border border-white/10 rounded-[3rem] p-4 shadow-2xl overflow-hidden aspect-[4/5] flex flex-col group">
                  <div className="w-full flex-1 bg-[url('https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80')] bg-cover bg-center rounded-[2.5rem] relative overflow-hidden transition-transform duration-700 group-hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                       <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-black">Hoodie Premium</span>
                            <span className="text-emerald-400 font-black">450 MAD</span>
                          </div>
                          <div className="w-full bg-white text-slate-900 text-center py-2.5 rounded-xl font-black text-xs uppercase tracking-widest mt-2 cursor-pointer hover:bg-emerald-400 hover:text-white transition-colors">
                            {t.addToCart}
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-32 bg-[#0a0f1c] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80')] opacity-5 bg-cover bg-center"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <FadeIn>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-1 rounded-[3rem] shadow-2xl shadow-indigo-900/50">
              <div className="bg-[#0f172a] p-10 md:p-16 rounded-[2.8rem]">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-4">{t.readyTitle}</h2>
                  <p className="text-slate-400 text-lg">{t.readyDesc}</p>
                </div>

                {success ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-center">
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-black text-white mb-2">{t.successTitle}</h3>
                    <p className="text-slate-400">{t.successDesc}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-black text-slate-300 uppercase tracking-widest mb-2">{t.formName}</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-[#1e293b] border-2 border-white/5 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 focus:bg-[#0f172a] transition-all outline-none"
                        placeholder={t.formNamePl}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-slate-300 uppercase tracking-widest mb-2">{t.formPhone}</label>
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        dir="ltr"
                        className={`w-full bg-[#1e293b] border-2 border-white/5 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 focus:bg-[#0f172a] transition-all outline-none ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}
                        placeholder="+212 6..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-slate-300 uppercase tracking-widest mb-2">{t.formProject}</label>
                      <textarea 
                        rows={3}
                        value={project}
                        onChange={e => setProject(e.target.value)}
                        className="w-full bg-[#1e293b] border-2 border-white/5 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 focus:bg-[#0f172a] transition-all outline-none resize-none"
                        placeholder={t.formProjectPl}
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-white/10 disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? t.btnSending : t.btnSubmit}
                      {!isSubmitting && <SubmitArrow className="w-4 h-4" />}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center border-t border-white/5 text-slate-500 text-sm font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} BEYA CREATIVE. {t.rights}
      </footer>
    </div>
  );
}
