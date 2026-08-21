import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, ShoppingBag, Loader2, Calendar } from 'lucide-react';
import { supabase } from '../../supabase';
import { useLang } from '../../contexts/LangContext';

export default function CustomersManager() {
  const { lang, isAr } = useLang();
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const authUser = sessionData?.session?.user;
        const email = (authUser?.email || '').toLowerCase();
        const isAdmin = email === '00.emaily.zero@gmail.com' || email === 'fashlow@gmail.com';

        const { data: allStores } = await supabase.from('stores').select('name, config_json');
        const myStores = isAdmin
          ? (allStores || [])
          : (allStores || []).filter((s: any) => {
              const ownerEmail = (s.config_json?.owner_email || '').toLowerCase();
              return email && ownerEmail === email;
            });
            
        const storeNames = [...new Set(myStores.map((s: any) => s.name).filter(Boolean))];

        if (storeNames.length > 0) {
          const orClause = storeNames.map(n => `tissu.ilike.Store: ${n}%`).join(',');
          const { data: commandes } = await supabase
            .from('commandes')
            .select('client, prix, created_at')
            .or(orClause);

          const clientMap: Record<string, { phone: string; orders: number; total: number; lastOrder: string }> = {};
          
          (commandes || []).forEach((c: any) => {
            const price = parseFloat(c.prix) || 0;
            const clientRaw = c.client || '';
            const phoneMatch = clientRaw.match(/ - (\S+)$/);
            const clientPhone = phoneMatch ? phoneMatch[1] : '';
            const clientName = (phoneMatch ? clientRaw.slice(0, phoneMatch.index) : clientRaw).trim() || 'Client inconnu';
            const clientKey = clientPhone || clientName;
            
            if (!clientMap[clientKey]) {
              clientMap[clientKey] = { phone: clientPhone, orders: 0, total: 0, lastOrder: c.created_at };
            }
            clientMap[clientKey].orders += 1;
            clientMap[clientKey].total += price;
            if (new Date(c.created_at) > new Date(clientMap[clientKey].lastOrder)) {
              clientMap[clientKey].lastOrder = c.created_at;
            }
          });

          setCustomers(
            Object.entries(clientMap)
              .map(([name, data]) => ({ name, ...data }))
              .sort((a, b) => b.total - a.total)
          );
        }
      } catch (err) {
        console.error('Error fetching customers', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            {lang === 'ar' ? 'العملاء' : lang === 'en' ? 'Customers' : 'Clients'}
          </h2>
          <p className="text-slate-500 font-medium">
            {lang === 'ar' ? 'إدارة زبنائك وتتبع مشترياتهم' : lang === 'en' ? 'Manage your customers and track their purchases' : 'Gérez vos clients et suivez leurs achats'}
          </p>
        </div>
        
        <div className="relative max-w-md w-full">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${isAr ? 'right-4' : 'left-4'}`} />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'البحث عن عميل...' : lang === 'en' ? 'Search customer...' : 'Rechercher un client...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-white border border-slate-200 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">
            {lang === 'ar' ? 'لا يوجد عملاء بعد' : lang === 'en' ? 'No customers yet' : 'Aucun client pour le moment'}
          </h3>
          <p className="text-slate-500 max-w-sm text-center">
            {lang === 'ar' ? 'ستظهر بيانات عملائك هنا بمجرد استلامك لطلبات الشراء.' : 'Your customers data will appear here once you receive orders.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" dir={isAr ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500 font-bold">
                  <th className={`py-4 ${isAr ? 'pr-6' : 'pl-6'}`}>{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th className="py-4 px-4">{lang === 'ar' ? 'الهاتف' : 'Phone'}</th>
                  <th className="py-4 px-4">{lang === 'ar' ? 'الطلبات' : 'Orders'}</th>
                  <th className="py-4 px-4">{lang === 'ar' ? 'إجمالي المشتريات' : 'Total Spent'}</th>
                  <th className={`py-4 ${isAr ? 'pl-6 text-left' : 'pr-6 text-right'}`}>{lang === 'ar' ? 'آخر طلب' : 'Last Order'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className={`py-4 ${isAr ? 'pr-6' : 'pl-6'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="font-medium" dir="ltr">{c.phone || '-'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <ShoppingBag className="w-4 h-4 text-slate-400" />
                        {c.orders}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-black text-emerald-600">
                      {c.total.toLocaleString()} MAD
                    </td>
                    <td className={`py-4 ${isAr ? 'pl-6 text-left' : 'pr-6 text-right'}`}>
                      <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString() : '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
