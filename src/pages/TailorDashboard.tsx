import React, { useState } from 'react';
import { Scissors, TrendingUp, DollarSign, Target, Plus, CheckCircle, Clock } from 'lucide-react';
import { useLang } from '../contexts/LangContext'; // Assuming this exists in your project

export default function TailorDashboard() {
  const { isAr } = useLang();
  
  // Financial Data State
  const [dailyTarget, setDailyTarget] = useState(500); // 500 DH daily target
  const [actualRevenue, setActualRevenue] = useState(250); // Today's current revenue
  
  // Orders State
  const [orders, setOrders] = useState([
    { id: 1, type: 'تقصير سروال', price: 30, status: 'completed' },
    { id: 2, type: 'تضييق فستان', price: 70, status: 'pending' },
    { id: 3, type: 'خياطة أزرار', price: 20, status: 'completed' },
    { id: 4, type: 'روتوش سترة', price: 130, status: 'completed' },
  ]);

  const progress = Math.min((actualRevenue / dailyTarget) * 100, 100);
  const isSuccess = actualRevenue >= dailyTarget;

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Scissors className="w-6 h-6 text-indigo-600" />
              {isAr ? 'لوحة تحكم الخياطة والروتوش' : 'Tailor & Retouche Dashboard'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {isAr ? 'تتبع الطلبات والدراسة المالية اليومية' : 'Track orders and daily financial targets'}
            </p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
            <Plus className="w-5 h-5" />
            {isAr ? 'طلب جديد' : 'New Order'}
          </button>
        </div>

        {/* Financial Dashboard (دراسة الجدوى اليومية) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-800">
              {isAr ? 'الهدف المالي اليومي (دراسة الجدوى)' : 'Daily Financial Target'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 font-medium">{isAr ? 'الهدف اليومي (درهم)' : 'Daily Target (MAD)'}</span>
                <Target className="w-5 h-5 text-indigo-400" />
              </div>
              <input 
                type="number" 
                value={dailyTarget}
                onChange={(e) => setDailyTarget(Number(e.target.value))}
                className="text-3xl font-black text-slate-800 bg-transparent border-none p-0 focus:ring-0 w-full"
              />
            </div>
            
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 font-medium">{isAr ? 'المدخول الحالي (درهم)' : 'Current Revenue (MAD)'}</span>
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-600">
                {actualRevenue} <span className="text-sm font-bold text-emerald-400">MAD</span>
              </div>
            </div>

            <div className={`p-5 rounded-xl border ${isSuccess ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${isSuccess ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isAr ? 'حالة المشروع اليوم' : 'Today\'s Project Status'}
                </span>
              </div>
              <div className={`text-xl font-black ${isSuccess ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isSuccess 
                  ? (isAr ? '🔥 مشروع ناجح ومربح اليوم' : '🔥 Profitable Today')
                  : (isAr ? '⚠️ لم نصل للهدف بعد' : '⚠️ Target Not Reached')
                }
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-slate-500">{isAr ? 'نسبة تحقيق الهدف' : 'Target Progress'}</span>
              <span className={isSuccess ? 'text-emerald-500' : 'text-indigo-500'}>{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${isSuccess ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">{isAr ? 'طلبات اليوم' : 'Today\'s Orders'}</h2>
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {order.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{order.type}</h3>
                    <p className="text-xs text-slate-500">{order.status === 'completed' ? (isAr ? 'مكتمل' : 'Completed') : (isAr ? 'قيد الإنجاز' : 'Pending')}</p>
                  </div>
                </div>
                <div className="font-black text-lg text-slate-700">
                  {order.price} <span className="text-sm">MAD</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
