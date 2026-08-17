import React, { useState } from 'react';
import { Shield, User, Search, Filter, MoreVertical, Edit, Trash2, Plus } from 'lucide-react';

export default function SuperAdminUsers() {
  const [users] = useState([
    { id: 1, name: 'أحمد العلمي', email: 'ahmed@gzeed.com', role: 'admin', status: 'نشط' },
    { id: 2, name: 'سارة خالد', email: 'sara@gzeed.com', role: 'user', status: 'نشط' },
    { id: 3, name: 'كريم محمد', email: 'karim@gzeed.com', role: 'user', status: 'غير نشط' },
  ]);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">المستخدمين والمدراء</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">إدارة صلاحيات الدخول لمنصة GZeed</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة مستخدم جديد
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="البحث عن مستخدم..." 
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-sm font-medium" 
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-sm transition-colors flex items-center gap-2 bg-white">
              <Filter className="w-4 h-4" />
              تصفية
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">الاسم</th>
                <th className="px-6 py-4">البريد الإلكتروني</th>
                <th className="px-6 py-4">الصلاحية (Role)</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.role === 'admin' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-700'}`}>
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-500 text-sm" dir="ltr">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.role === 'admin' ? (
                      <span className="flex items-center gap-1.5 text-cyan-700 bg-cyan-50 w-fit px-3 py-1 rounded-lg text-xs font-bold border border-cyan-100">
                        <Shield className="w-3.5 h-3.5" /> مدير (Admin)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-slate-700 bg-slate-100 w-fit px-3 py-1 rounded-lg text-xs font-bold border border-slate-200">
                        <User className="w-3.5 h-3.5" /> مستخدم عادي
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`w-fit px-2.5 py-1 rounded-full text-xs font-bold ${user.status === 'نشط' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-100'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="تعديل">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="حذف">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
