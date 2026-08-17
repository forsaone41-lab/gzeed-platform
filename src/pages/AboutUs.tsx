import React from 'react';
import { useLang } from '../contexts/LangContext';
import { ShieldCheck, Zap, Globe, Users } from 'lucide-react';

export default function AboutUs() {
  const { lang, isAr } = useLang();
  const txt = (ar: string, fr: string, en: string) => lang === 'ar' ? ar : lang === 'en' ? en : fr;

  const features = [
    {
      icon: <Globe className="w-8 h-8 text-cyan-600" />,
      title: txt('رؤية عالمية', 'Vision globale', 'Global Vision'),
      desc: txt('نطمح لتوفير أقوى التقنيات للتجار في كل مكان لمنافسة كبرى الشركات.', 'Nous fournissons les meilleures technologies pour les marchands.', 'Providing top technologies for merchants everywhere.')
    },
    {
      icon: <Zap className="w-8 h-8 text-cyan-600" />,
      title: txt('ابتكار مستمر', 'Innovation', 'Innovation'),
      desc: txt('نطور أدواتنا باستمرار لمواكبة تطورات الويب والتجارة الإلكترونية.', 'Nous développons constamment nos outils web et e-commerce.', 'Constantly developing our web and e-commerce tools.')
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-cyan-600" />,
      title: txt('موثوقية وأمان', 'Sécurité et Fiabilité', 'Security & Reliability'),
      desc: txt('نوفر بيئة آمنة 100% لمعاملاتك التجارية وحماية بيانات عملائك.', 'Environnement sécurisé pour vos transactions.', '100% secure environment for transactions.')
    },
    {
      icon: <Users className="w-8 h-8 text-cyan-600" />,
      title: txt('دعم لا محدود', 'Support illimité', 'Unlimited Support'),
      desc: txt('فريق الدعم الفني لدينا دائماً بجانبك لضمان نجاح مشروعك.', 'Une équipe d\'experts toujours à vos côtés.', 'Our expert team is always by your side.')
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-12 pb-24" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-24 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 to-indigo-900/40" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            {txt('من نحن', 'À propos de GZeed', 'About GZeed')}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {txt(
              'منصة GZeed ولدت من إيماننا بأن بناء المواقع والمتاجر يجب أن يكون في متناول الجميع، بلا تعقيدات تقنية وبأدوات احترافية.',
              'GZeed est née de notre conviction que la création de sites et de boutiques doit être accessible à tous, sans complexité technique.',
              'GZeed was born from our belief that building sites and stores should be accessible to everyone, without technical complexity.'
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Story Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-6">
                {txt('قصتنا', 'Notre Histoire', 'Our Story')}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                {txt(
                  'بدأنا كفريق صغير من المطورين وخبراء التكنولوجيا في المغرب، لاحظنا الفجوة الكبيرة بين ما تقدمه المنصات العالمية وما يحتاجه المستخدم المحلي.',
                  'Nous avons commencé comme une petite équipe de développeurs au Maroc, remarquant l\'écart entre les plateformes mondiales et les besoins locaux.',
                  'We started as a small team of developers in Morocco, noticing the gap between global platforms and local needs.'
                )}
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                {txt(
                  'لذلك قررنا بناء GZeed: منصة متكاملة تدمج سهولة بناء المواقع مع قوة التعديل البرمجي وإدارة العمليات، لتحصل على أقصى درجات المرونة مع سهولة فائقة في مكان واحد.',
                  'Nous avons donc créé GZeed : une plateforme tout-en-un alliant la simplicité de création à une flexibilité extrême.',
                  'So we built GZeed: an all-in-one platform combining ease of creation with extreme flexibility in one place.'
                )}
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-video relative shadow-lg">
               {/* Decorative Placeholder for an image */}
               <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600 to-indigo-600 opacity-90 flex items-center justify-center">
                 <Globe className="w-32 h-32 text-white/30" />
               </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            {txt('قيمنا ومبادئنا', 'Nos Valeurs', 'Our Values')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-xl bg-cyan-50 flex items-center justify-center mb-6">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
