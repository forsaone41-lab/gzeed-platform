import React from 'react';
import { Users, Store, CreditCard, Activity, Search, Filter, MoreVertical, Ban, CheckCircle } from 'lucide-react';

export default function SuperAdminDashboard() {
  const stats = [
    { title: 'إجمالي المتاجر', value: '1,248', trend: '+12%', icon: Store, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { title: 'العملاء النشطين', value: '892', trend: '+5%', icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { title: 'الدخل الشهري (MRR)', value: '145,000 DH', trend: '+18%', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'زيارات المنصة', value: '45.2K', trend: '+2%', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  const clients = [
    { id: 1, name: 'أحمد العلمي', store: 'ahmed.gzeed.com', plan: 'PRO', status: 'active', date: '2024-05-12' },
    { id: 2, name: 'وكالة المبدعين', store: 'creative.com', plan: 'AGENCY', status: 'active', date: '2024-05-10' },
    { id: 3, name: 'سارة فاشن', store: 'sarafashion.ma', plan: 'PRO', status: 'inactive', date: '2024-05-08' },
    { id: 4, name: 'يوسف ستور', store: 'youssef.gzeed.com', plan: 'LITE', status: 'active', date: '2024-05-01' },
    { id: 5, name: 'إلكترو ماروك', store: 'electro.ma', plan: 'ENTERPRISE', status: 'active', date: '2024-04-20' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">نظرة عامة</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">إحصائيات المنصة وأداء المتاجر</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition-colors">
          تصدير التقرير
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-slate-500 font-bold text-sm mb-1">{stat.title}</p>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{stat.value}</h3>
              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold">{stat.trend} هذا الشهر</span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-black text-slate-900">أحدث المتاجر والعملاء</h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input type="text" placeholder="البحث عن متجر..." className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-sm font-medium" />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">العميل</th>
                <th className="px-6 py-4">رابط المتجر</th>
                <th className="px-6 py-4">الباقة</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4">تاريخ التسجيل</th>
                <th className="px-6 py-4">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 text-sm">{client.name}</td>
                  <td className="px-6 py-4 font-medium text-slate-500 text-sm" dir="ltr">{client.store}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{client.plan}</span>
                  </td>
                  <td className="px-6 py-4">
                    {client.status === 'active' ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-full text-xs font-bold">
                        <CheckCircle className="w-3.5 h-3.5" /> نشط
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-rose-600 bg-rose-50 w-fit px-2.5 py-1 rounded-full text-xs font-bold">
                        <Ban className="w-3.5 h-3.5" /> غير نشط
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm font-medium">{client.date}</td>
                  <td className="px-6 py-4">
                    <button className="text-slate-400 hover:text-slate-900 transition-colors p-1">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
