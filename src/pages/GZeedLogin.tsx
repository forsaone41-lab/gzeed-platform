import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useLang } from '../contexts/LangContext';

export default function GZeedLogin() {
  const { isAr } = useLang();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    
    setLoading(true);
    // Simulate API login call
    setTimeout(() => {
      setLoading(false);
      // Redirect to the new dashboard interface after login
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-6 relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2 z-20 cursor-pointer" onClick={() => navigate('/')} dir="ltr">
        <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-cyan-500/20">
          GZ
        </div>
        <span className="text-2xl font-black text-white tracking-tight">GZeed</span>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl shadow-2xl">
          
          <div className="animate-fade-in">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">
              {isAr ? 'تسجيل الدخول' : 'Bon retour !'}
            </h1>
            <p className="text-slate-400 mb-8 font-medium">
              {isAr ? 'مرحباً بعودتك! أدخل بياناتك للوصول إلى لوحة التحكم الخاصة بك.' : 'Entrez vos identifiants pour accéder à votre tableau de bord.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  {isAr ? 'البريد الإلكتروني' : 'Adresse e-mail'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="votre@email.com"
                    className={`w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 ${isAr ? 'pr-4 pl-12' : 'pl-12 pr-4'} text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium text-lg text-left`}
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-300">
                    {isAr ? 'كلمة السر' : 'Mot de passe'}
                  </label>
                  <a href="#" className="text-sm font-bold text-cyan-500 hover:text-cyan-400 transition-colors">
                    {isAr ? 'نسيت كلمة السر؟' : 'Mot de passe oublié ?'}
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-left tracking-widest text-lg"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || !formData.email || !formData.password}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(8,145,178,0.3)] mt-8"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    {isAr ? 'دخول' : 'Se connecter'}
                    <ArrowRight className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        <p className="text-center text-slate-500 text-sm mt-8 font-medium">
          {isAr ? 'ليس لديك حساب؟ ' : 'Pas encore de compte ? '}
          <Link to="/store-signup" className="text-cyan-500 hover:text-cyan-400 font-bold transition-colors">
            {isAr ? 'أنشئ حسابك مجاناً' : 'Créer un compte gratuit'}
          </Link>
        </p>
      </div>
    </div>
  );
}
