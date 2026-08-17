import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LangContext';
import { usePlatformSettings } from '../contexts/PlatformSettingsContext';

const PricingPlanDefinition = [
  { id: 'lite', title: { ar: 'LITE', fr: 'LITE' }, desc: { ar: 'أسهل طريقة لبناء موقعك', fr: 'Le plus simple pour démarrer' }, oldPrice: '149' },
  { id: 'pro', title: { ar: 'PRO', fr: 'PRO' }, desc: { ar: 'مرونة كاملة وسهولة فائقة في الاستخدام', fr: 'Flexibilité totale et simplicité' }, oldPrice: '299', isPopular: true },
  { id: 'agency', title: { ar: 'AGENCY', fr: 'AGENCY' }, desc: { ar: 'للوكالات والمطورين المحترفين', fr: 'Pour les agences et développeurs' }, oldPrice: '799' },
];

export function PricingSection({
  bgClass = "bg-slate-50",
  titleClass = "text-slate-900"
}: {
  bgClass?: string;
  titleClass?: string;
}) {
  const { isAr } = useLang();
  const { settings } = usePlatformSettings();

  return (
    <section className={`py-32 relative ${bgClass}`} id="pricing">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className={`text-4xl md:text-6xl font-black mb-6 tracking-tight ${titleClass}`}>
            {isAr ? 'خطط أسعار واضحة' : 'Des tarifs transparents'}
          </h2>
          <p className="text-xl text-slate-600">
            {isAr 
              ? 'اختر الخطة التي تناسبك وابدأ البيع اليوم. بدون رسوم خفية.'
              : 'Choisissez le plan qui vous convient et commencez à vendre aujourd\'hui. Sans frais cachés.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto items-stretch" dir={isAr ? "rtl" : "ltr"}>
          
          {/* LITE Plan */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-200 hover:border-slate-300 transition-all hover:shadow-xl relative flex flex-col h-full lg:mt-4">
            <div className="text-center sm:text-start mt-6">
              <h3 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tight">LITE</h3>
              <p className="text-slate-500 mb-6 font-medium text-xs">{isAr ? 'أسهل طريقة لبناء موقعك' : 'Le plus simple pour démarrer'}</p>
            </div>
            
            <div className="mb-6 flex flex-col pb-6 border-b border-slate-100 items-center sm:items-start">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-slate-400 line-through decoration-2">149</span>
                <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full uppercase tracking-wider">{isAr ? 'خصم' : 'PROMO'}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">{settings.litePrice}</span>
                <span className="text-slate-500 font-bold text-xs">MAD / {isAr ? 'شهر' : 'mois'}</span>
              </div>
            </div>
            
            <ul className="space-y-3.5 mb-8 flex-1 text-sm">
              {[
                isAr ? 'واجهة احترافية تزيد من مصداقيتك' : 'Site vitrine ultra professionnel',
                isAr ? 'صمم موقعك بنفسك في 5 دقائق' : 'Créez votre site en 5 minutes',
                isAr ? 'موقع سريع جداً لا يتوقف أبداً' : 'Site ultra-rapide et toujours en ligne',
                isAr ? 'جاهز للعمل بدون أي خبرة سابقة' : 'Prêt à l\'emploi sans expérience',
                isAr ? 'دعم فني يرافقك خطوة بخطوة' : 'Support technique à vos côtés',
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 bg-indigo-50 rounded-full" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/store-signup?plan=LITE" className="block w-full py-3.5 text-center rounded-2xl font-bold text-sm bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all">
              {isAr ? 'ابدأ موقعك الآن' : 'Créer mon site'}
            </Link>
          </div>

          {/* PRO Plan (Highlighted) */}
          <div className="bg-[#0b1120] text-white rounded-[2rem] p-6 md:p-8 border border-slate-800 shadow-2xl relative flex flex-col h-full transform hover:-translate-y-2 transition-all duration-300 z-10 lg:-translate-y-4">
            <div className={`absolute top-6 ${isAr ? 'right-6' : 'left-6'}`}>
              <span className="bg-cyan-500 text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                {isAr ? 'الأكثر اختياراً' : 'Le plus populaire'}
              </span>
            </div>
            
            <div className="mt-6 text-center sm:text-start">
              <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">PRO</h3>
              <p className="text-slate-400 mb-6 font-medium text-xs">{isAr ? 'مرونة كاملة وسهولة فائقة في الاستخدام' : 'Flexibilité totale et simplicité'}</p>
            </div>
            
            <div className="mb-6 flex flex-col pb-6 border-b border-slate-800 items-center sm:items-start">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-slate-500 line-through decoration-2">299</span>
                <span className="text-[9px] font-black text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full uppercase tracking-wider">{isAr ? 'عرض' : 'PROMO'}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white tracking-tighter">{settings.proPrice}</span>
                <span className="text-slate-400 font-bold text-xs">MAD / {isAr ? 'شهر' : 'mois'}</span>
              </div>
            </div>
            
            <ul className="space-y-3.5 mb-8 flex-1 text-sm">
              {[
                isAr ? 'متجر إلكتروني متكامل واحترافي' : 'Boutique en ligne professionnelle',
                isAr ? 'تصميم مخصص 100% يعكس هويتك' : 'Design 100% personnalisé et modifiable',
                isAr ? 'أدوات ذكية تضاعف مبيعاتك أوتوماتيكياً' : 'Outils marketing qui doublent vos ventes',
                isAr ? 'إدارة سهلة لطلبياتك من هاتفك فقط' : 'Gestion facile depuis votre téléphone',
                isAr ? 'سرعة فائقة تتحمل آلاف الزوار بثبات' : 'Vitesse extrême pour des milliers de visiteurs',
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-200 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 bg-cyan-500/10 rounded-full" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/store-signup?plan=PRO" className="block w-full py-3.5 text-center rounded-2xl font-bold text-sm bg-cyan-600 text-white hover:bg-cyan-700 transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_25px_rgba(8,145,178,0.5)]">
              {isAr ? 'احجز متجرك الآن' : 'Créer ma boutique PRO'}
            </Link>
          </div>
          
          {/* AGENCY Plan */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-200 hover:border-slate-300 transition-all hover:shadow-xl relative flex flex-col h-full lg:mt-4">
            <div className="text-center sm:text-start mt-6">
              <h3 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tight">AGENCY</h3>
              <p className="text-slate-500 mb-6 font-medium text-xs">{isAr ? 'للوكالات والمطورين المحترفين' : 'Pour les agences et développeurs'}</p>
            </div>
            
            <div className="mb-6 flex flex-col pb-6 border-b border-slate-100 items-center sm:items-start">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-slate-400 line-through decoration-2">799</span>
                <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full uppercase tracking-wider">{isAr ? 'خصم' : 'PROMO'}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">{settings.agencyPrice}</span>
                <span className="text-slate-500 font-bold text-xs">MAD / {isAr ? 'شهر' : 'mois'}</span>
              </div>
            </div>
            
            <ul className="space-y-3.5 mb-8 flex-1 text-sm">
              {[
                isAr ? 'برمج تطبيقات ومواقع وبعها لعملائك' : 'Créez et vendez vos propres applications',
                isAr ? 'عمولة مستمرة من اشتراكات عملائك الشهرية' : 'Commissions sur les abonnements de vos clients',
                isAr ? 'لوحة تحكم مركزية لإدارة عملائك وأرباحك' : 'Tableau de bord centralisé clients & revenus',
                isAr ? 'واجهة بيضاء (White-Label) باسمك وشعارك' : 'Plateforme en Marque Blanche (White-Label)',
                isAr ? 'بنية تحتية مرنة للمطورين (API/Webhooks)' : 'Infrastructure flexible (API/Webhooks)',
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 bg-indigo-50 rounded-full" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/store-signup?plan=AGENCY" className="block w-full py-3.5 text-center rounded-2xl font-bold text-sm bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all">
              {isAr ? 'تواصل معنا' : 'S\'abonner maintenant'}
            </Link>
          </div>

        </div>

        {/* Custom Solutions Banner */}
        <div className="mt-16 bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 z-10" dir={isAr ? "rtl" : "ltr"}>
          
          <div className="max-w-3xl text-center sm:text-start">
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
              {isAr ? 'نظام متكامل خاص بشركتك أو مشروعك' : 'Système sur-mesure pour votre entreprise ou projet'}
            </h3>
            
            <p className="text-slate-600 text-lg leading-relaxed">
              {isAr 
                ? 'سواء كنت تدير شركة أو مشروعاً كبيراً، نقوم بتحويل عملك إلى نظام رقمي متكامل. منصة واحدة مخصصة لك لتسيير عملياتك، موظفيك، وحساباتك بكل سهولة واحترافية.' 
                : 'Que vous dirigiez une entreprise ou un grand projet, nous transformons votre activité en un système numérique complet pour gérer vos opérations et employés en toute simplicité.'}
            </p>
          </div>

          <div className="flex-shrink-0 w-full sm:w-auto mt-4 md:mt-0">
            <Link to="/contact" className="block w-full sm:w-auto px-8 py-4 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl text-center transition-all shadow-md">
              {isAr ? 'تواصل معنا لدراسة مشروعك' : 'Étudions votre projet'}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
