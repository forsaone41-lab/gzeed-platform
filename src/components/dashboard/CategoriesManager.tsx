import React, { useState, useEffect } from 'react';
import { Tags, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useLang } from '../../contexts/LangContext';

interface Category {
  id: string;
  name: string;
  itemCount: number;
}

export default function CategoriesManager() {
  const { lang, isAr } = useLang();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('gzeed_categories');
    if (saved) {
      try {
        setCategories(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default sample categories
      setCategories([
        { id: '1', name: lang === 'ar' ? 'ملابس' : 'Clothing', itemCount: 12 },
        { id: '2', name: lang === 'ar' ? 'إلكترونيات' : 'Electronics', itemCount: 5 },
        { id: '3', name: lang === 'ar' ? 'إكسسوارات' : 'Accessories', itemCount: 8 }
      ]);
    }
  }, [lang]);

  const saveCategories = (cats: Category[]) => {
    setCategories(cats);
    localStorage.setItem('gzeed_categories', JSON.stringify(cats));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat = {
      id: Date.now().toString(),
      name: newCatName.trim(),
      itemCount: 0
    };
    saveCategories([...categories, newCat]);
    setNewCatName('');
    setIsAdding(false);
  };

  const handleEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editingId) return;
    saveCategories(categories.map(c => c.id === editingId ? { ...c, name: editName.trim() } : c));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا التصنيف؟' : 'Are you sure you want to delete this category?')) {
      saveCategories(categories.filter(c => c.id !== id));
    }
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Tags className="w-6 h-6 text-indigo-500" />
            {lang === 'ar' ? 'التصنيفات' : lang === 'en' ? 'Categories' : 'Catégories'}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {lang === 'ar' ? 'نظم منتجاتك في تصنيفات لتسهيل التصفح' : lang === 'en' ? 'Organize your products into categories' : 'Organisez vos produits en catégories'}
          </p>
        </div>
        
        <button
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          {lang === 'ar' ? 'تصنيف جديد' : lang === 'en' ? 'New Category' : 'Nouvelle Catégorie'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm mb-6 flex items-end gap-4 animate-fade-in">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {lang === 'ar' ? 'اسم التصنيف' : 'Category Name'}
            </label>
            <input
              type="text"
              autoFocus
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder={lang === 'ar' ? 'مثال: أحذية رياضية' : 'e.g. Sneakers'}
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button type="submit" className="px-5 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
              {lang === 'ar' ? 'حفظ' : 'Save'}
            </button>
          </div>
        </form>
      )}

      <div className="relative mb-6">
        <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${isAr ? 'right-4' : 'left-4'}`} />
        <input
          type="text"
          placeholder={lang === 'ar' ? 'ابحث في التصنيفات...' : 'Search categories...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full bg-white border border-slate-200 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            {lang === 'ar' ? 'لم يتم العثور على تصنيفات' : 'No categories found'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(c => (
              <div key={c.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                {editingId === c.id ? (
                  <form onSubmit={handleSaveEdit} className="flex-1 flex items-center gap-3">
                    <input
                      type="text"
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 bg-white border border-indigo-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button type="submit" className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg">
                      {lang === 'ar' ? 'تحديث' : 'Update'}
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="text-sm font-bold text-slate-500 hover:bg-slate-100 px-3 py-2 rounded-lg">
                      {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Tags className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{c.name}</h3>
                        <p className="text-sm text-slate-500">{c.itemCount} {lang === 'ar' ? 'منتجات' : 'Products'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(c.id, c.name)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
