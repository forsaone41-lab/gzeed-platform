import React from 'react';
import { useLang } from '../contexts/LangContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactUs() {
  const { lang, isAr } = useLang();
  const txt = (ar: string, fr: string, en: string) => lang === 'ar' ? ar : lang === 'en' ? en : fr;

  return (
    <div className="bg-slate-50 min-h-screen pt-12 pb-24" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-20 mb-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            {txt('تواصل معنا', 'Contactez-nous', 'Contact Us')}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {txt(
              'نحن هنا لمساعدتك والإجابة على استفساراتك. فريق دعم GZeed متاح دائماً لخدمتك.',
              'Nous sommes là pour vous aider. L\'équipe support de GZeed est toujours à votre service.',
              'We are here to help. The GZeed support team is always ready to serve you.'
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Details */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">
                {txt('معلومات التواصل', 'Nos Coordonnées', 'Contact Info')}
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-1">{txt('الهاتف', 'Téléphone', 'Phone')}</p>
                    <p className="text-lg font-bold text-slate-900" dir="ltr">+212 500 00 00 00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-1">{txt('البريد الإلكتروني', 'Email', 'Email')}</p>
                    <p className="text-lg font-bold text-slate-900">contact@gzeed.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-1">{txt('العنوان', 'Adresse', 'Address')}</p>
                    <p className="text-lg font-bold text-slate-900">
                      {txt('الدار البيضاء، المغرب', 'Casablanca, Maroc', 'Casablanca, Morocco')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Box */}
            <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500 rounded-full blur-[50px] opacity-20" />
               <h3 className="text-xl font-bold mb-4 relative z-10">
                 {txt('دعم فني 24/7', 'Support 24/7', '24/7 Support')}
               </h3>
               <p className="text-slate-400 relative z-10">
                 {txt(
                   'نحن نوفر دعماً فنياً متكاملاً لجميع عملائنا على مدار الساعة لضمان استمرارية عملكم دون توقف.',
                   'Nous fournissons un support technique complet 24/7 pour assurer la continuité de vos opérations.',
                   'We provide full technical support 24/7 to ensure your operations never stop.'
                 )}
               </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-3xl font-black text-slate-900 mb-8">
                {txt('أرسل رسالة', 'Envoyez un message', 'Send a Message')}
              </h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {txt('الاسم الكامل', 'Nom complet', 'Full Name')}
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow" 
                      placeholder={txt('أدخل اسمك...', 'Votre nom...', 'Enter your name...')} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {txt('البريد الإلكتروني', 'Adresse email', 'Email Address')}
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow" 
                      placeholder="email@example.com" 
                      dir="ltr"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {txt('الموضوع', 'Sujet', 'Subject')}
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow" 
                    placeholder={txt('كيف يمكننا مساعدتك؟', 'Comment pouvons-nous vous aider ?', 'How can we help?')} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {txt('الرسالة', 'Message', 'Message')}
                  </label>
                  <textarea 
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow resize-none" 
                    placeholder={txt('اكتب رسالتك هنا...', 'Écrivez votre message...', 'Write your message here...')} 
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full sm:w-auto px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  <Send className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
                  {txt('إرسال الرسالة', 'Envoyer le message', 'Send Message')}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
