import React, { useState, useEffect } from 'react';
import { FileText, Plus, Pencil, Trash2, Search, ArrowLeft } from 'lucide-react';
import { useLang } from '../../contexts/LangContext';

interface StorePage {
  id: string;
  title: string;
  isDefault?: boolean;
  content?: string;
}

export default function PagesManager() {
  const { lang, isAr } = useLang();
  const [pages, setPages] = useState<StorePage[]>([]);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<StorePage>({ id: '', title: '', content: '' });

  useEffect(() => {
    const saved = localStorage.getItem('beya_store_config');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        if (config.storePages) {
          setPages(config.storePages);
        } else {
          // Defaults if none exist
          setPages([
            { id: 'home', title: lang === 'ar' ? 'الرئيسية' : 'Accueil', isDefault: true },
            { id: 'collections', title: lang === 'ar' ? 'التشكيلات' : 'Collections', isDefault: true },
            { id: 'about', title: lang === 'ar' ? 'من نحن' : 'À propos', isDefault: true }
          ]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [lang]);

  const savePages = (newPages: StorePage[]) => {
    setPages(newPages);
    const saved = localStorage.getItem('beya_store_config');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        config.storePages = newPages;
        localStorage.setItem('beya_store_config', JSON.stringify(config));
      } catch (e) {}
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.title.trim()) return;

    if (isAdding) {
      const newPage = {
        id: 'page_' + Date.now(),
        title: editForm.title.trim(),
        content: editForm.content || '',
        isDefault: false
      };
      savePages([...pages, newPage]);
    } else {
      savePages(pages.map(p => p.id === editForm.id ? { ...p, title: editForm.title.trim(), content: editForm.content } : p));
    }
    
    setIsAdding(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه الصفحة؟' : 'Are you sure you want to delete this page?')) {
      savePages(pages.filter(p => p.id !== id));
    }
  };

  const filtered = pages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  if (isAdding || editingId) {
    return (
      <div className="w-full max-w-5xl mx-auto py-8 px-4 animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
        <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
          <span className="font-bold">{lang === 'ar' ? 'رجوع' : 'Back'}</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10">
          <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <FileText className="w-7 h-7 text-indigo-500" />
            {isAdding ? (lang === 'ar' ? 'إضافة صفحة جديدة' : 'Add New Page') : (lang === 'ar' ? 'تعديل الصفحة' : 'Edit Page')}
          </h2>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {lang === 'ar' ? 'عنوان الصفحة' : 'Page Title'}
              </label>
              <input
                type="text"
                autoFocus
                value={editForm.title}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder={lang === 'ar' ? 'مثال: اتصل بنا' : 'e.g. Contact Us'}
              />
            </div>

            {!editForm.isDefault && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {lang === 'ar' ? 'محتوى الصفحة' : 'Page Content'}
                </label>
                <textarea
                  rows={8}
                  value={editForm.content || ''}
                  onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y"
                  placeholder={lang === 'ar' ? 'اكتب محتوى الصفحة هنا...' : 'Write your page content here...'}
                />
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button type="submit" className="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                {lang === 'ar' ? 'حفظ الصفحة' : 'Save Page'}
              </button>
              <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-8 py-3.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <FileText className="w-7 h-7 text-indigo-500" />
            {lang === 'ar' ? 'الصفحات' : lang === 'en' ? 'Pages' : 'Pages'}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {lang === 'ar' ? 'إدارة صفحات متجرك (الرئيسية، من نحن، اتصل بنا...)' : lang === 'en' ? 'Manage your store pages' : 'Gérez les pages de votre boutique'}
          </p>
        </div>
        
        <button
          onClick={() => {
            setEditForm({ id: '', title: '', content: '' });
            setIsAdding(true);
          }}
          className="bg-indigo-600 text-white px-5 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          {lang === 'ar' ? 'صفحة جديدة' : lang === 'en' ? 'New Page' : 'Nouvelle Page'}
        </button>
      </div>

      <div className="relative mb-6">
        <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${isAr ? 'right-4' : 'left-4'}`} />
        <input
          type="text"
          placeholder={lang === 'ar' ? 'ابحث في الصفحات...' : 'Search pages...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full bg-white border border-slate-200 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-500 font-medium flex flex-col items-center">
             <FileText className="w-12 h-12 text-slate-300 mb-4" />
            {lang === 'ar' ? 'لم يتم العثور على صفحات' : 'No pages found'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(p => (
              <div key={p.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{p.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">/{p.id}</span>
                      {p.isDefault && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                          {lang === 'ar' ? 'افتراضية' : 'Default'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditForm(p); setEditingId(p.id); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Pencil className="w-5 h-5" />
                  </button>
                  {!p.isDefault && (
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
