import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Store, ArrowRight, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react';
import { useLang } from '../contexts/LangContext';

export default function GZeedSignup() {
  const { isAr } = useLang();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    storeName: '',
    password: '',
    agreeToTerms: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.email) return;
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(2);
      }, 800);
    } else if (step === 2) {
      if (!formData.storeName) return;
      setLoading(true);
      // Simulate API call to create store
      setTimeout(() => {
        setLoading(false);
        setStep(3);
        // After success, navigate to the builder
        setTimeout(() => {
          navigate('/store-builder');
        }, 3000);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-6 relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2 z-20 cursor-pointer" onClick={() => navigate('/')} dir="ltr">
        <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-cyan-500/20">
          GZ
        </div>
        <span className="text-2xl font-black text-white tracking-tight">GZeed</span>
      </div>

      <div className="w-full max-w-md z-10">
        
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl shadow-2xl">
          
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20">
                <Mail className="w-8 h-8 text-cyan-400" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2">
                {isAr ? 'لنبدأ رحلتك الرقمية' : 'Commençons votre aventure'}
              </h1>
              <p className="text-slate-400 mb-8 font-medium">
                {isAr ? 'أدخل بريدك الإلكتروني لإنشاء حسابك مجاناً وبدون بطاقة بنكية.' : 'Entrez votre e-mail pour créer votre compte gratuitement, sans carte bancaire.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    {isAr ? 'البريد الإلكتروني' : 'Adresse e-mail'}
                  </label>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="votre@email.com"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium text-lg text-left"
                    dir="ltr"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading || !formData.email}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(8,145,178,0.3)] mt-6"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      {isAr ? 'متابعة' : 'Continuer'}
                      <ArrowRight className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
                <Store className="w-8 h-8 text-indigo-400" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2">
                {isAr ? 'أكمل إعداد حسابك' : 'Finalisez votre compte'}
              </h1>
              <p className="text-slate-400 mb-8 font-medium">
                {isAr ? 'أدخل معلوماتك الشخصية واسم متجرك الجديد للبدء.' : 'Entrez vos informations et le nom de votre boutique pour commencer.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      {isAr ? 'الاسم الشخصي' : 'Prénom'}
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      autoFocus
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      {isAr ? 'الاسم العائلي' : 'Nom'}
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    {isAr ? 'اسم المتجر / المشروع' : 'Nom de la boutique'}
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={formData.storeName}
                    onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                    placeholder={isAr ? "مثال: متجر الأناقة" : "Ex: Ma Super Boutique"}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    {isAr ? 'كلمة السر' : 'Mot de passe'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-left"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                    className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-800"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-400 font-medium leading-tight cursor-pointer hover:text-slate-300 transition-colors">
                    {isAr ? 'أوافق على جميع الشروط والأحكام الخاصة بفتح متجر على منصة GZeed' : 'J\'accepte les conditions générales d\'utilisation de GZeed'}
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !formData.storeName || !formData.firstName || !formData.password || !formData.agreeToTerms}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] mt-8"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> {isAr ? 'جاري التجهيز...' : 'Préparation...'}</>
                  ) : (
                    <>
                      {isAr ? 'أنشئ متجري الآن' : 'Créer ma boutique'}
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in text-center py-8">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-3xl font-black text-white mb-4">
                {isAr ? 'تم إنشاء حسابك بنجاح!' : 'Compte créé avec succès !'}
              </h1>
              <p className="text-slate-400 font-medium mb-8">
                {isAr ? 'جاري توجيهك إلى لوحة التحكم الخاصة بك...' : 'Redirection vers votre tableau de bord...'}
              </p>
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
              </div>
            </div>
          )}

        </div>
        
        {/* Removed duplicate footer info since it's now a checkbox */}
      </div>
    </div>
  );
}
