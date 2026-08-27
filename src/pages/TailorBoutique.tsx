import React, { useState } from 'react';
import { ShoppingBag, Ruler, Camera, ChevronRight, CheckCircle, Upload, ShoppingCart, Star } from 'lucide-react';
import { useLang } from '../contexts/LangContext';

const MOCK_PRODUCTS = [
  { id: 1, category: 'جلابة', name: 'جلابة مخزنية بخياطة المعلم', price: 650, image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=1000', rating: 4.8 },
  { id: 2, category: 'قفطان', name: 'قفطان عصري خفيف', price: 800, image: 'https://images.unsplash.com/photo-1583391733958-d15fa899ddca?auto=format&fit=crop&q=80&w=1000', rating: 4.9 },
  { id: 3, category: 'تكشيطة', name: 'تكشيطة للعرائس', price: 2500, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000', rating: 5.0 },
  { id: 4, category: 'جلابة', name: 'جلابة شتوية قفال', price: 750, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000', rating: 4.7 },
  { id: 5, category: 'قفطان', name: 'قفطان جوهرة', price: 1200, image: 'https://images.unsplash.com/photo-1550614000-4b95dd2449a5?auto=format&fit=crop&q=80&w=1000', rating: 4.9 },
];

export default function TailorBoutique() {
  const { isAr } = useLang();
  const [activeTab, setActiveTab] = useState<'ready' | 'custom'>('ready');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Custom Order Form
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCustomPhoto(url);
    }
  };

  const openProduct = (p: any) => {
    setSelectedProduct(p);
    setShowOrderModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-slate-900">BEYA <span className="text-indigo-600">ATELIER</span></h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{isAr ? 'الخياطة الراقية' : 'HAUTE COUTURE'}</p>
            </div>
          </div>
          
          <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">0</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1558769132-cb1fac08c04e?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            {isAr ? 'أزياء تقليدية وعصرية مصممة خصيصاً لك' : 'Traditional & Modern Fashion Tailored For You'}
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            {isAr 
              ? 'اكتشف مجموعتنا الجاهزة للارتداء أو قم بتفصيل الموديل الخاص بك على مقاسك بالضبط. خياطة مغربية أصيلة ولمسة عصرية.'
              : 'Discover our ready-to-wear collection or custom-tailor your dream outfit.'}
          </p>
          
          <div className="inline-flex bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20">
            <button 
              onClick={() => setActiveTab('ready')}
              className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${activeTab === 'ready' ? 'bg-white text-slate-900 shadow-lg' : 'text-white hover:bg-white/10'}`}
            >
              {isAr ? 'الموديلات الجاهزة' : 'Ready to Wear'}
            </button>
            <button 
              onClick={() => setActiveTab('custom')}
              className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${activeTab === 'custom' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white hover:bg-white/10'}`}
            >
              {isAr ? 'تفصيل على العبار' : 'Custom Tailoring'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* READY TO WEAR STORE */}
        {activeTab === 'ready' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-black text-slate-900">{isAr ? 'أحدث الموديلات' : 'Latest Arrivals'}</h3>
                <p className="text-slate-500 mt-1">{isAr ? 'متوفرة بمقاسات M, L, XL' : 'Available in standard sizes'}</p>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto w-full md:w-auto">
                {['الكل', 'جلابة', 'قفطان', 'تكشيطة'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
                  >
                    {cat === 'الكل' && !isAr ? 'All' : cat === 'جلابة' && !isAr ? 'Djellaba' : cat === 'قفطان' && !isAr ? 'Caftan' : cat === 'تكشيطة' && !isAr ? 'Tekchita' : cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_PRODUCTS.filter(p => selectedCategory === 'الكل' || p.category === selectedCategory).map(product => (
                <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group cursor-pointer" onClick={() => openProduct(product)}>
                  <div className="h-80 overflow-hidden relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {product.category}
                    </div>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {product.rating}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-slate-800 mb-2">{product.name}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-black text-indigo-600">{product.price} DH</span>
                      <button className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors">
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOM TAILORING (SUR MESURE) */}
        {activeTab === 'custom' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ruler className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-3">{isAr ? 'فصّل الموديل ديالك' : 'Custom Design'}</h3>
                <p className="text-slate-500">{isAr ? 'عندك شي تصويرة ديال شي موديل عجبك؟ صيفطها لينا ونصايبو ليك بحالها على عبارك بالضبط.' : 'Upload an inspiration photo and we will tailor it to your exact measurements.'}</p>
              </div>

              <div className="space-y-8">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">{isAr ? 'صورة الموديل (إجباري)' : 'Inspiration Photo'}</label>
                  <div className="relative">
                    <input type="file" id="upload-photo" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    <label htmlFor="upload-photo" className="block w-full h-48 border-2 border-dashed border-indigo-200 rounded-3xl bg-indigo-50/50 hover:bg-indigo-50 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative">
                      {customPhoto ? (
                        <>
                          <img src={customPhoto} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white font-bold gap-2">
                            <Upload className="w-5 h-5" /> {isAr ? 'تغيير الصورة' : 'Change Photo'}
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <Camera className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                          <span className="font-bold text-indigo-600">{isAr ? 'اضغط لرفع الصورة' : 'Click to upload photo'}</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Measurements Choice */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">{isAr ? 'طريقة أخذ القياسات' : 'Measurements Method'}</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="border-2 border-indigo-600 bg-indigo-50 p-4 rounded-2xl cursor-pointer relative">
                      <input type="radio" name="measure_type" className="absolute top-4 right-4" defaultChecked />
                      <h4 className="font-bold text-indigo-900 mb-1">{isAr ? 'أدخل قياساتي بنفسي' : 'Enter My Measurements'}</h4>
                      <p className="text-xs text-indigo-600 font-medium">{isAr ? 'الكتاف، الصدر، الطول...' : 'Shoulders, Chest, Length...'}</p>
                    </label>
                    <label className="border-2 border-slate-200 bg-white p-4 rounded-2xl cursor-pointer hover:border-slate-300 relative opacity-60">
                      <input type="radio" name="measure_type" className="absolute top-4 right-4" disabled />
                      <h4 className="font-bold text-slate-700 mb-1">{isAr ? 'تحديد موعد لأخذ القياس' : 'Book a Measurement Session'}</h4>
                      <p className="text-xs text-slate-500 font-medium">{isAr ? 'قريباً...' : 'Coming soon...'}</p>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                   <div>
                     <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? 'الكتاف' : 'Shoulders'}</label>
                     <input type="number" placeholder="cm" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-bold" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? 'الصدر' : 'Chest'}</label>
                     <input type="number" placeholder="cm" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-bold" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? 'الطول' : 'Length'}</label>
                     <input type="number" placeholder="cm" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-bold" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 mb-1">{isAr ? 'الكمام' : 'Sleeves'}</label>
                     <input type="number" placeholder="cm" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-bold" />
                   </div>
                </div>

                <button className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-2">
                  {isAr ? 'إرسال طلب التفصيل' : 'Send Custom Request'} <ChevronRight className="w-5 h-5" />
                </button>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* PRODUCT MODAL */}
      {showOrderModal && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in">
            <div className="md:w-1/2 h-64 md:h-auto">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">{selectedProduct.name}</h2>
                  <div className="text-3xl font-black text-indigo-600">{selectedProduct.price} DH</div>
                </div>
                <button onClick={() => setShowOrderModal(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                  <CheckCircle className="w-5 h-5 rotate-45" /> {/* acts as X */}
                </button>
              </div>
              
              <div className="space-y-6 flex-1">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">{isAr ? 'المقاس (Size)' : 'Size'}</label>
                  <div className="flex gap-3">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                      <button key={size} className="w-12 h-12 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 focus:border-indigo-600 focus:text-indigo-600 focus:bg-indigo-50 transition-all">{size}</button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                  <p className="text-sm text-amber-800 font-medium leading-relaxed">
                    {isAr ? 'ملاحظة: هذا الموديل جاهز للتوصيل. إذا أردت تعديل المقاسات أو إضافة لمسة خاصة، يرجى استخدام صفحة "تفصيل على العبار".' : 'Note: This model is ready to ship. For custom sizing, please use the Custom Tailoring tab.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <input placeholder={isAr ? "الاسم الكامل" : "Full Name"} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-medium" />
                  <input placeholder={isAr ? "رقم الهاتف" : "Phone Number"} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-medium" />
                  <input placeholder={isAr ? "المدينة والعنوان" : "City & Address"} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-medium" />
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-lg transition-all shadow-lg flex justify-center items-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> {isAr ? 'تأكيد الطلب' : 'Confirm Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
