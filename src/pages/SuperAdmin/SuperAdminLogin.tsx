import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowLeft } from 'lucide-react';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    navigate('/super-admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 mb-6 shadow-lg">
              <span className="text-3xl font-black text-white tracking-tighter">G<span className="text-cyan-400">Z</span></span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">تسجيل الدخول للإدارة</h1>
            <p className="text-slate-500 font-medium">مرحباً بك في لوحة تحكم GZeed Super Admin</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all font-medium"
                  placeholder="admin@gzeed.com"
                  required
                />
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl mt-4">
              دخول
            </button>
          </form>
        </div>
        <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
          <button onClick={() => navigate('/')} className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-2 mx-auto transition-colors">
            <ArrowLeft className="w-4 h-4" />
            العودة للموقع
          </button>
        </div>
      </div>
    </div>
  );
}
