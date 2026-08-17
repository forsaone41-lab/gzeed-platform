import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LangContext';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function PublicFooter() {
  const { lang, isAr } = useLang();
  
  const txt = (ar: string, fr: string, en: string) => lang === 'ar' ? ar : lang === 'en' ? en : fr;

  return (
    <footer className="bg-[#0b1120] text-slate-400 pt-20 pb-10 border-t border-slate-800" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
               <span className="text-3xl font-black tracking-tighter leading-none text-white">
                 G<span className="text-cyan-500">Zeed</span>
               </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              {txt(
                'المنصة الأقوى لبناء وإدارة المتاجر الإلكترونية في المغرب. ابدأ رحلتك نحو النجاح الرقمي بخطوات بسيطة.',
                'La plateforme la plus puissante pour créer et gérer des boutiques en ligne au Maroc.',
                'The most powerful platform to build and manage online stores in Morocco.'
              )}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-cyan-600 hover:text-white flex items-center justify-center transition-all text-slate-400 font-bold text-xs uppercase">
                FB
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-cyan-600 hover:text-white flex items-center justify-center transition-all text-slate-400 font-bold text-xs uppercase">
                IG
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-cyan-600 hover:text-white flex items-center justify-center transition-all text-slate-400 font-bold text-xs uppercase">
                IN
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-cyan-600 hover:text-white flex items-center justify-center transition-all text-slate-400 font-bold text-xs uppercase">
                X
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-tight">
              {txt('روابط سريعة', 'Liens Rapides', 'Quick Links')}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors inline-flex items-center gap-2 group">
                  <ArrowRight className={`w-4 h-4 text-cyan-600 group-hover:translate-x-1 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  {txt('من نحن', 'À propos', 'About Us')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-cyan-400 transition-colors inline-flex items-center gap-2 group">
                  <ArrowRight className={`w-4 h-4 text-cyan-600 group-hover:translate-x-1 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  {txt('باقات الأسعار', 'Tarifs', 'Pricing')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors inline-flex items-center gap-2 group">
                  <ArrowRight className={`w-4 h-4 text-cyan-600 group-hover:translate-x-1 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  {txt('اتصل بنا', 'Contact', 'Contact Us')}
                </Link>
              </li>
              <li>
                <Link to="/academy" className="hover:text-cyan-400 transition-colors inline-flex items-center gap-2 group">
                  <ArrowRight className={`w-4 h-4 text-cyan-600 group-hover:translate-x-1 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  {txt('أكاديمية GZeed', 'GZeed Academy', 'GZeed Academy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-tight">
              {txt('حلولنا', 'Nos Solutions', 'Our Solutions')}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/store-builder" className="hover:text-cyan-400 transition-colors inline-flex items-center gap-2 group">
                  <ArrowRight className={`w-4 h-4 text-cyan-600 group-hover:translate-x-1 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  {txt('بناء المتاجر', 'Création de boutiques', 'Store Builder')}
                </Link>
              </li>
              <li>
                <Link to="/ecommerce" className="hover:text-cyan-400 transition-colors inline-flex items-center gap-2 group">
                  <ArrowRight className={`w-4 h-4 text-cyan-600 group-hover:translate-x-1 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  {txt('حلول التجارة الإلكترونية', 'Solutions E-commerce', 'E-commerce Solutions')}
                </Link>
              </li>
              <li>
                <Link to="/partner-signup" className="hover:text-cyan-400 transition-colors inline-flex items-center gap-2 group">
                  <ArrowRight className={`w-4 h-4 text-cyan-600 group-hover:translate-x-1 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  {txt('برنامج الشركاء', 'Programme Partenaires', 'Partner Program')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-tight">
              {txt('تواصل معنا', 'Contactez-nous', 'Contact Us')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                <span>
                  {txt('الدار البيضاء، المغرب', 'Casablanca, Maroc', 'Casablanca, Morocco')}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-cyan-500 shrink-0" />
                <a href="tel:+212500000000" className="hover:text-cyan-400 transition-colors" dir="ltr">
                  +212 500 00 00 00
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-cyan-500 shrink-0" />
                <a href="mailto:contact@gzeed.com" className="hover:text-cyan-400 transition-colors">
                  contact@gzeed.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} GZeed. {txt('جميع الحقوق محفوظة.', 'Tous droits réservés.', 'All rights reserved.')}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/privacy" className="hover:text-cyan-400 transition-colors">
              {txt('سياسة الخصوصية', 'Politique de confidentialité', 'Privacy Policy')}
            </Link>
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">
              {txt('شروط الاستخدام', 'Conditions d\'utilisation', 'Terms of Service')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
