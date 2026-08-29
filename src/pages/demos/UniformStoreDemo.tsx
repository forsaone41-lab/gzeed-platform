import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, Phone, Mail, MapPin, ChevronRight, CheckCircle, Shield, Truck, Users } from 'lucide-react';
import { useLang } from '../../contexts/LangContext';

const UNIFORM_CATEGORIES = [
  { id: 'medical', name: 'الطبي والصحي', nameFr: 'Medical & Health', image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=1000' },
  { id: 'corporate', name: 'الشركات والمكاتب', nameFr: 'Corporate', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000' },
  { id: 'hospitality', name: 'الفنادق والمطاعم', nameFr: 'Hospitality', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1000' },
  { id: 'industrial', name: 'الصناعة والأمن', nameFr: 'Industrial & Safety', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=1000' },
];

const MOCK_PRODUCTS = [
  { id: 1, category: 'medical', name: 'طقم طبي احترافي (Scrubs)', nameFr: 'Professional Medical Scrub', price: 299, image: 'https://images.unsplash.com/photo-1584982751601-973059632832?auto=format&fit=crop&q=80&w=1000', colors: ['#0ea5e9', '#0f172a', '#10b981'] },
  { id: 2, category: 'corporate', name: 'بدلة رسمية للمكاتب', nameFr: 'Corporate Suit', price: 850, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000', colors: ['#0f172a', '#334155'] },
  { id: 3, category: 'hospitality', name: 'مئزر طاهي (Chef Coat)', nameFr: 'Executive Chef Coat', price: 180, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=1000', colors: ['#ffffff', '#000000'] },
  { id: 4, category: 'industrial', name: 'سترة أمان عاكسة', nameFr: 'Safety Reflective Vest', price: 120, image: 'https://images.unsplash.com/photo-1534065609405-18b6c0e0b355?auto=format&fit=crop&q=80&w=1000', colors: ['#eab308', '#f97316'] },
];

export default function UniformStoreDemo() {
  const { isAr } = useLang();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Topbar */}
      <div className="bg-slate-900 text-slate-300 py-2 text-xs font-medium hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><Phone className="w-3 h-3" /> +212 500 000 000</span>
            <span className="flex items-center gap-2"><Mail className="w-3 h-3" /> contact@uniformpro.ma</span>
          </div>
          <div className="flex gap-4">
            <span>{isAr ? 'توصيل مجاني للطلبات الكبرى' : 'Free Shipping on Bulk Orders'}</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white sticky top-0 z-40 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-slate-900">Uniform<span className="text-indigo-600">Pro</span></h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{isAr ? 'الزي المهني' : 'Professional Wear'}</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-bold text-slate-600">
            <a href="#" className="text-indigo-600">{isAr ? 'الرئيسية' : 'Home'}</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">{isAr ? 'القطاعات' : 'Sectors'}</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">{isAr ? 'من نحن' : 'About Us'}</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">{isAr ? 'اتصل بنا' : 'Contact'}</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">
              <Users className="w-4 h-4" />
              {isAr ? 'طلب عرض سعر (B2B)' : 'Request Quote'}
            </button>
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80" alt="Corporate" className="w-full h-full object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              {isAr ? 'الزي الرسمي الذي يعكس احترافية شركتك' : 'Professional Uniforms That Reflect Your Brand'}
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              {isAr 
                ? 'نقدم حلولاً متكاملة للزي المهني لجميع القطاعات. جودة عالية، تصاميم مريحة، وأسعار تنافسية للشركات والمؤسسات.'
                : 'Complete uniform solutions for all sectors. High quality, comfortable designs, and competitive prices for businesses.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2">
                {isAr ? 'اكتشف التشكيلة' : 'Explore Collection'}
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                {isAr ? 'الطلب بالجملة' : 'Bulk Orders'} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">{isAr ? 'جودة مضمونة' : 'Guaranteed Quality'}</h4>
                <p className="text-slate-500 text-sm mt-1">{isAr ? 'أقمشة متينة تتحمل ظروف العمل' : 'Durable fabrics for work conditions'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">{isAr ? 'تخصيص للشركات' : 'Corporate Customization'}</h4>
                <p className="text-slate-500 text-sm mt-1">{isAr ? 'تطريز وطباعة شعار شركتك' : 'Embroidery and logo printing'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">{isAr ? 'توصيل لجميع المدن' : 'Nationwide Delivery'}</h4>
                <p className="text-slate-500 text-sm mt-1">{isAr ? 'توصيل سريع وموثوق للطلبيات' : 'Fast and reliable bulk shipping'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sectors */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-black text-slate-900 mb-4">{isAr ? 'القطاعات التي نخدمها' : 'Sectors We Serve'}</h3>
          <p className="text-slate-500 max-w-2xl mx-auto">{isAr ? 'نوفر أزياء مهنية متخصصة تلبي متطلبات ومعايير كل قطاع.' : 'We provide specialized professional wear meeting the standards of each sector.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {UNIFORM_CATEGORIES.map(category => (
            <div key={category.id} className="group cursor-pointer relative overflow-hidden rounded-3xl h-80 shadow-md">
              <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="text-xl font-black text-white mb-2">{isAr ? category.name : category.nameFr}</h4>
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                  {isAr ? 'عرض المنتجات' : 'View Products'} <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">{isAr ? 'منتجات مختارة' : 'Featured Products'}</h3>
              <p className="text-slate-500">{isAr ? 'الأكثر طلباً من قبل عملائنا' : 'Most requested by our clients'}</p>
            </div>
            
            <div className="flex bg-white p-1 rounded-xl shadow-sm overflow-x-auto w-full md:w-auto">
              <button onClick={() => setActiveCategory('all')} className={`px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${activeCategory === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                {isAr ? 'الكل' : 'All'}
              </button>
              {UNIFORM_CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                  {isAr ? cat.name : cat.nameFr}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.filter(p => activeCategory === 'all' || p.category === activeCategory).map(product => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 group">
                <div className="h-64 overflow-hidden relative p-4">
                  <div className="absolute inset-0 bg-slate-100 rounded-t-2xl"></div>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl relative z-10 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wider">
                    {UNIFORM_CATEGORIES.find(c => c.id === product.category)?.[isAr ? 'name' : 'nameFr']}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3">{isAr ? product.name : product.nameFr}</h4>
                  
                  <div className="flex gap-1.5 mb-4">
                    {product.colors.map(color => (
                      <div key={color} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }}></div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-2">
                    <span className="text-xl font-black text-slate-900">{product.price} DH</span>
                    <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors">
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
