import React, { useState } from 'react';
import { Scissors, Lock, Mail, ChevronRight } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useNavigate } from 'react-router-dom';

export default function TailorAuth() {
  const { isAr } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login success and redirect to dashboard
    navigate('/tailor-dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-indigo-600/30">
            <Scissors className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">BEYA <span className="text-indigo-600">ATELIER</span></h1>
          <p className="text-slate-500 font-medium mt-2">{isAr ? 'تسجيل الدخول لإدارة محلك' : 'Login to manage your atelier'}</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <div className="relative">
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 outline-none focus:border-indigo-500 focus:bg-white transition-colors" 
                  placeholder="admin@beya.com" 
                />
                <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${isAr ? 'right-3' : 'left-3'}`} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{isAr ? 'كلمة المرور' : 'Password'}</label>
              <div className="relative">
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 outline-none focus:border-indigo-500 focus:bg-white transition-colors" 
                  placeholder="••••••••" 
                />
                <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${isAr ? 'right-3' : 'left-3'}`} />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-lg transition-all shadow-lg flex justify-center items-center gap-2 mt-4">
              {isAr ? 'تسجيل الدخول' : 'Sign In'} <ChevronRight className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium mb-3">{isAr ? 'ليس لديك حساب؟' : 'Don\'t have an account?'}</p>
            <button type="button" onClick={() => navigate('/tailor-boutique')} className="text-indigo-600 font-bold hover:text-indigo-700">
              {isAr ? 'الذهاب إلى المتجر (للزبائن)' : 'Go to Storefront (Customers)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
