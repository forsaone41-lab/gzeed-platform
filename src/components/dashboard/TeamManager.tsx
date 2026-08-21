import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, UserPlus, Mail, Shield, Trash2, ShieldAlert } from 'lucide-react';
import { useLang } from '../../contexts/LangContext';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending';
}

export default function TeamManager() {
  const { lang, isAr } = useLang();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('manager');

  useEffect(() => {
    const saved = localStorage.getItem('gzeed_team');
    if (saved) {
      try {
        setTeam(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default owner
      setTeam([
        { id: '1', name: lang === 'ar' ? 'أنت (المالك)' : 'You (Owner)', email: 'owner@store.com', role: 'admin', status: 'active' }
      ]);
    }
  }, [lang]);

  const saveTeam = (t: TeamMember[]) => {
    setTeam(t);
    localStorage.setItem('gzeed_team', JSON.stringify(t));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    const member: TeamMember = {
      id: Date.now().toString(),
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      status: 'pending' // pending invite
    };
    saveTeam([...team, member]);
    setNewName('');
    setNewEmail('');
    setNewRole('manager');
    setIsAdding(false);
  };

  const handleDelete = (id: string, role: string) => {
    if (role === 'admin') {
      alert(lang === 'ar' ? 'لا يمكن حذف المالك الرئيسي' : 'Cannot delete the main owner');
      return;
    }
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من إزالة هذا العضو؟' : 'Are you sure you want to remove this member?')) {
      saveTeam(team.filter(m => m.id !== id));
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-500" />
            {lang === 'ar' ? 'فريق العمل' : lang === 'en' ? 'Team & Staff' : 'Équipe et Personnel'}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {lang === 'ar' ? 'قم بإدارة الأشخاص الذين يمكنهم الوصول لمتجرك' : lang === 'en' ? 'Manage people who have access to your store' : 'Gérez les personnes qui ont accès à votre boutique'}
          </p>
        </div>
        
        <button
          onClick={() => setIsAdding(true)}
          className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
        >
          <UserPlus className="w-5 h-5" />
          {lang === 'ar' ? 'دعوة عضو' : lang === 'en' ? 'Invite Member' : 'Inviter un membre'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
            <Mail className="w-5 h-5 text-indigo-500" />
            {lang === 'ar' ? 'إرسال دعوة جديدة' : 'Send New Invite'}
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                {lang === 'ar' ? 'الاسم' : 'Name'}
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                {lang === 'ar' ? 'الصلاحيات' : 'Role'}
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none"
              >
                <option value="manager">{lang === 'ar' ? 'مدير (Manager)' : 'Manager'}</option>
                <option value="support">{lang === 'ar' ? 'دعم فني (Support)' : 'Support'}</option>
                <option value="shipper">{lang === 'ar' ? 'مسؤول شحن (Shipper)' : 'Shipper'}</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6 border-t border-slate-100 pt-4">
            <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
              {lang === 'ar' ? 'إرسال الدعوة' : 'Send Invite'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {team.map(member => (
            <div key={member.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${member.role === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    {member.name}
                    {member.role === 'admin' && <ShieldAlert className="w-4 h-4 text-amber-500" />}
                  </h3>
                  <p className="text-sm text-slate-500">{member.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                <div className="flex flex-col sm:items-end">
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    member.role === 'admin' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {member.role}
                  </span>
                  {member.status === 'pending' && (
                    <span className="text-[10px] text-amber-500 font-bold mt-1">
                      {lang === 'ar' ? 'دعوة معلقة' : 'Pending Invite'}
                    </span>
                  )}
                </div>
                
                {member.role !== 'admin' && (
                  <button onClick={() => handleDelete(member.id, member.role)} className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
