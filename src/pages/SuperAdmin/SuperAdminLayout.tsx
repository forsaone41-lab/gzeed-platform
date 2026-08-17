import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, Menu, Users, Store } from 'lucide-react';

export default function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // In real app: clear tokens
    navigate('/super-admin/login');
  };

  const menuItems = [
    { icon: FileText, label: 'تعديل الموقع (CMS)', path: '/super-admin/cms' },
    { icon: Users, label: 'المستخدمين والمدراء', path: '/super-admin/users' },
    { icon: Settings, label: 'الإعدادات', path: '/super-admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      {/* Sidebar */}
      <aside className={`bg-[#0b1120] text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} fixed h-full z-20 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {sidebarOpen && <span className="font-black text-xl tracking-tighter">G<span className="text-cyan-500">Zeed</span> Admin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 py-6 px-3 flex flex-col gap-2">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path || (location.pathname === '/super-admin' && item.path === '/super-admin');
            return (
              <Link 
                key={idx} 
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span className="font-bold text-sm whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors">
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="font-bold text-sm">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-64' : 'mr-20'} flex flex-col min-h-screen`}>
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between sticky top-0 z-10">
          <h2 className="font-bold text-slate-800 text-lg">لوحة تحكم الإدارة</h2>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-sm">
               A
             </div>
             <span className="font-bold text-sm text-slate-700 hidden sm:block">Admin</span>
          </div>
        </header>
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
