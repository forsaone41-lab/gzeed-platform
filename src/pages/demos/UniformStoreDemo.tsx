import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, User, ChevronRight, ArrowRight, ArrowLeft, Star } from 'lucide-react';
import { useLang } from '../../contexts/LangContext';

const MOCK_PRODUCTS = [
  { id: 1, category: 'chef-coats', name: 'VESTE EXECUTIVE', nameFr: 'VESTE EXECUTIVE', price: 950, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800', hoverImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800', colors: ['#ffffff', '#000000', '#475569'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.9, reviews: 124 },
  { id: 2, category: 'aprons', name: 'TABLIER CUIR BISTROT', nameFr: 'TABLIER CUIR BISTROT', price: 550, image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=800', hoverImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800', colors: ['#1e293b', '#78716c'], sizes: ['Standard'], rating: 4.8, reviews: 89 },
  { id: 3, category: 'chef-coats', name: 'VESTE FEMME LÉGÈRE', nameFr: 'VESTE FEMME LÉGÈRE', price: 890, image: 'https://images.unsplash.com/photo-1581182800629-7d90925ad072?auto=format&fit=crop&q=80&w=800', hoverImage: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800', colors: ['#ffffff'], sizes: ['XS', 'S', 'M', 'L'], rating: 5.0, reviews: 56 },
  { id: 4, category: 'pants', name: 'PANTALON PRO STRETCH', nameFr: 'PANTALON PRO STRETCH', price: 450, image: 'https://images.unsplash.com/photo-1577219492769-b63a779fac28?auto=format&fit=crop&q=80&w=800', hoverImage: 'https://images.unsplash.com/photo-1577219492769-b63a779fac28?auto=format&fit=crop&q=80&w=800', colors: ['#000000', '#1e293b'], sizes: ['38', '40', '42', '44', '46'], rating: 4.7, reviews: 210 },
];

export default function UniformStoreDemo() {
  const { isAr } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'product'>('home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [cartCount, setCartCount] = useState(0);
  const [showCartSuccess, setShowCartSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
    setShowCartSuccess(true);
    setTimeout(() => {
      setShowCartSuccess(false);
    }, 2000);
  };

  const openProductPage = (product: any) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]);
    setCurrentView('product');
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  const isNavSolid = scrolled || currentView === 'product';

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="bg-black text-white py-2 text-[10px] uppercase tracking-widest text-center font-medium">
        {isAr ? 'شحن مجاني للطلبات فوق 1000 درهم' : 'LIVRAISON GRATUITE À PARTIR DE 1000 DH'}
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${isNavSolid ? 'bg-white shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          
          <div className="flex items-center gap-6 md:hidden">
            <button className={`${isNavSolid ? 'text-black' : 'text-white'}`}><Menu className="w-6 h-6" /></button>
            <button className={`${isNavSolid ? 'text-black' : 'text-white'}`}><Search className="w-5 h-5" /></button>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
            <button onClick={goHome} className={`hover:opacity-70 transition-opacity ${isNavSolid ? 'text-black' : 'text-white'}`}>{isAr ? 'الرجال' : 'HOMME'}</button>
            <button onClick={goHome} className={`hover:opacity-70 transition-opacity ${isNavSolid ? 'text-black' : 'text-white'}`}>{isAr ? 'النساء' : 'FEMME'}</button>
            <button onClick={goHome} className={`hover:opacity-70 transition-opacity ${isNavSolid ? 'text-black' : 'text-white'}`}>{isAr ? 'المجموعات' : 'COLLECTIONS'}</button>
          </div>
          
          <div 
            onClick={goHome}
            className={`absolute left-1/2 -translate-x-1/2 text-2xl font-black tracking-tighter cursor-pointer ${isNavSolid ? 'text-black' : 'text-white'}`}
          >
            ZIY<span className="font-light">PRO</span>
          </div>

          <div className="flex items-center gap-6">
            <button className={`hidden md:block hover:opacity-70 transition-opacity ${isNavSolid ? 'text-black' : 'text-white'}`}><Search className="w-5 h-5" /></button>
            <button className={`hidden md:block hover:opacity-70 transition-opacity ${isNavSolid ? 'text-black' : 'text-white'}`}><User className="w-5 h-5" /></button>
            <button className={`hover:opacity-70 transition-opacity flex items-center gap-2 ${isNavSolid ? 'text-black' : 'text-white'}`}>
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs font-bold hidden sm:inline">({cartCount})</span>
            </button>
          </div>
        </div>
      </nav>

      {currentView === 'home' && (
        <>
          {/* Hero Section */}
          <div className="relative h-screen min-h-[600px] w-full overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=100&w=2000" 
              alt="Chef cooking" 
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-black/30"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight uppercase">
                {isAr ? 'مجموعة الخريف' : 'NOUVELLE COLLECTION'}
              </h1>
              <p className="text-lg md:text-xl font-light mb-10 max-w-xl mx-auto uppercase tracking-widest">
                {isAr ? 'أناقة واحترافية في المطبخ' : 'L\'ÉLÉGANCE AU SERVICE DE LA GASTRONOMIE'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                <button className="flex-1 px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors">
                  {isAr ? 'تسوق للرجال' : 'SHOP HOMME'}
                </button>
                <button className="flex-1 px-8 py-4 bg-transparent border border-white text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                  {isAr ? 'تسوق للنساء' : 'SHOP FEMME'}
                </button>
              </div>
            </div>
          </div>

          {/* Featured Categories */}
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group relative h-[70vh] min-h-[500px] overflow-hidden bg-slate-100 cursor-pointer">
                <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Veste de chef" />
                <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20"></div>
                <div className="absolute bottom-10 left-10 text-white">
                  <h2 className="text-3xl font-black uppercase mb-4 tracking-tight">{isAr ? 'سترات' : 'VESTES'}</h2>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-white pb-1 group-hover:gap-4 transition-all">
                    {isAr ? 'اكتشف' : 'DÉCOUVRIR'} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
              <div className="group relative h-[70vh] min-h-[500px] overflow-hidden bg-slate-100 cursor-pointer">
                <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Tabliers" />
                <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20"></div>
                <div className="absolute bottom-10 left-10 text-white">
                  <h2 className="text-3xl font-black uppercase mb-4 tracking-tight">{isAr ? 'مآزر' : 'TABLIERS'}</h2>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-white pb-1 group-hover:gap-4 transition-all">
                    {isAr ? 'اكتشف' : 'DÉCOUVRIR'} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Best Sellers */}
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-24">
            <div className="flex justify-between items-end mb-12">
              <h3 className="text-2xl font-black uppercase tracking-tight">{isAr ? 'الأكثر مبيعاً' : 'BEST-SELLERS'}</h3>
              <a href="#" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-slate-500 transition-colors">
                {isAr ? 'عرض الكل' : 'TOUT VOIR'}
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {MOCK_PRODUCTS.map(product => (
                <div key={product.id} className="group cursor-pointer" onClick={() => openProductPage(product)}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 mb-4">
                    <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
                    <img src={product.hoverImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    {/* Quick Add Button */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                        {isAr ? 'إضافة سريعة' : 'AJOUT RAPIDE'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest mb-1">{isAr ? product.name : product.nameFr}</h4>
                      <div className="flex gap-1.5 mt-2">
                        {product.colors.map(color => (
                          <div key={color} className={`w-3 h-3 rounded-full border border-slate-300`} style={{ backgroundColor: color }}></div>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm font-medium">{product.price} MAD</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sustainable Section */}
          <div className="bg-slate-50 py-24">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 order-2 md:order-1 text-center md:text-left" dir={isAr ? 'rtl' : 'ltr'}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 block">
                  {isAr ? 'الاستدامة' : 'DURABILITÉ'}
                </span>
                <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-6 leading-tight">
                  {isAr ? 'مستقبل الزي المهني' : 'CONÇU POUR L\'AVENIR'}
                </h2>
                <p className="text-slate-600 mb-8 max-w-lg mx-auto md:mx-0">
                  {isAr 
                    ? 'نحن نستخدم أقمشة مستدامة وعالية الأداء لتحمل ظروف العمل القاسية في المطبخ مع الحفاظ على البيئة. كل قطعة مصممة لتدوم وتوفر راحة استثنائية.'
                    : 'Nous utilisons des tissus durables et performants pour résister aux conditions intenses en cuisine tout en préservant l\'environnement. Chaque pièce est conçue pour durer.'}
                </p>
                <button className="px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">
                  {isAr ? 'اقرأ المزيد' : 'EN SAVOIR PLUS'}
                </button>
              </div>
              <div className="flex-1 order-1 md:order-2 w-full">
                <div className="aspect-[4/5] bg-slate-200 relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=1000" alt="Sustainability" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {currentView === 'product' && selectedProduct && (
        <div className="pt-32 pb-24 max-w-[1400px] mx-auto px-6 lg:px-12">
          
          <button 
            onClick={goHome}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-black mb-8 transition-colors"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {isAr ? 'العودة للمتجر' : 'RETOUR À LA BOUTIQUE'}
          </button>

          <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
            {/* Product Image Gallery */}
            <div className="md:w-1/2 flex flex-col gap-4">
              <div className="aspect-[3/4] bg-slate-50 relative overflow-hidden group">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] bg-slate-50 relative overflow-hidden">
                  <img src={selectedProduct.hoverImage} alt={selectedProduct.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="aspect-[3/4] bg-slate-50 relative overflow-hidden">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="absolute inset-0 w-full h-full object-cover object-bottom" />
                </div>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="md:w-1/2 md:py-8 lg:sticky lg:top-32 lg:h-fit">
              <div className="mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{selectedProduct.category}</div>
              <h2 className="text-4xl font-black uppercase tracking-tight mb-2">{isAr ? selectedProduct.name : selectedProduct.nameFr}</h2>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-black">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-sm font-bold">{selectedProduct.rating}</span>
                <span className="text-sm text-slate-500">({selectedProduct.reviews} {isAr ? 'تقييم' : 'avis'})</span>
              </div>
              <div className="text-2xl font-medium mb-10">{selectedProduct.price} MAD</div>
              
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest">{isAr ? 'اللون' : 'COULEUR'}</h4>
                </div>
                <div className="flex gap-4">
                  {selectedProduct.colors.map((color: string) => (
                    <button 
                      key={color} 
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color ? 'border-black ring-2 ring-black/20 ring-offset-2' : 'border-slate-200'}`}
                      style={{ backgroundColor: color }}
                    ></button>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest">{isAr ? 'المقاس' : 'TAILLE'}</h4>
                  <a href="#" className="text-xs text-slate-500 underline">{isAr ? 'دليل المقاسات' : 'Guide des tailles'}</a>
                </div>
                <div className="grid grid-cols-4 lg:grid-cols-5 gap-3">
                  {selectedProduct.sizes.map((size: string) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-4 text-xs font-bold uppercase tracking-widest border transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-slate-200 hover:border-black'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                className={`w-full py-5 flex justify-center items-center gap-3 text-sm font-bold uppercase tracking-widest transition-all ${showCartSuccess ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-slate-900'}`}
              >
                {showCartSuccess ? (
                  isAr ? 'تمت الإضافة بنجاح!' : 'AJOUTÉ AVEC SUCCÈS !'
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    {isAr ? 'أضف إلى السلة' : 'AJOUTER AU PANIER'}
                  </>
                )}
              </button>
              
              <div className="mt-12 space-y-6 border-t border-slate-100 pt-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2">{isAr ? 'تفاصيل المنتج' : 'DÉTAILS DU PRODUIT'}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {isAr 
                      ? 'هذا المنتج مصمم خصيصاً ليتحمل بيئة العمل القاسية، ويوفر راحة استثنائية طوال اليوم. يمكنك أيضاً طلب تطريز الشعار الخاص بك بعد إتمام الطلب.' 
                      : 'Cet article est spécialement conçu pour résister aux environnements de travail exigeants, offrant un confort exceptionnel tout au long de la journée. Vous pourrez demander une broderie personnalisée après votre commande.'}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2">{isAr ? 'التوصيل والاسترجاع' : 'LIVRAISON ET RETOURS'}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {isAr 
                      ? 'شحن مجاني للطلبات فوق 1000 درهم. استرجاع مجاني خلال 14 يوماً من تاريخ الاستلام.' 
                      : 'Livraison gratuite à partir de 1000 DH. Retours gratuits sous 14 jours après réception.'}
                  </p>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-12 pt-8 border-t border-slate-100">
                <h3 className="text-lg font-black uppercase tracking-tight mb-6">{isAr ? 'آراء العملاء' : 'AVIS CLIENTS'}</h3>
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-bold text-sm mb-1">{isAr ? 'أمين. ك - شيف تنفيذي' : 'Amine. K - Chef Exécutif'}</h5>
                        <div className="flex text-amber-400">
                          <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">12 Oct 2023</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {isAr ? 'جودة مذهلة. القماش لا يتأثر بالحرارة ومريح جداً خلال ساعات العمل الطويلة في المطبخ.' : 'Qualité incroyable. Le tissu résiste parfaitement à la chaleur et reste très confortable pendant les longues heures de service.'}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-bold text-sm mb-1">{isAr ? 'سارة. م - شيف معجنات' : 'Sara. M - Chef Pâtissière'}</h5>
                        <div className="flex text-amber-400">
                          <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">05 Nov 2023</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {isAr ? 'أفضل زي جربته حتى الآن. التفاصيل والتطريز ممتازة جداً. أنصح به بشدة!' : 'Le meilleur uniforme que j\'ai eu jusqu\'à présent. Les détails et la broderie sont excellents. Je recommande vivement!'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-20 pb-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
             <div className="text-2xl font-black tracking-tighter mb-6">ZIY<span className="font-light">PRO</span></div>
             <p className="text-sm text-slate-500 max-w-sm mb-6">
               {isAr ? 'الخيار الأول لأزياء الطهاة والمطاعم الراقية في المغرب.' : 'Le choix privilégié pour les vêtements de chef et de restauration haut de gamme au Maroc.'}
             </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6">{isAr ? 'المتجر' : 'BOUTIQUE'}</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><button onClick={goHome} className="hover:text-black transition-colors">{isAr ? 'رجال' : 'Homme'}</button></li>
              <li><button onClick={goHome} className="hover:text-black transition-colors">{isAr ? 'نساء' : 'Femme'}</button></li>
              <li><button onClick={goHome} className="hover:text-black transition-colors">{isAr ? 'مآزر' : 'Tabliers'}</button></li>
              <li><button onClick={goHome} className="hover:text-black transition-colors">{isAr ? 'مجموعات' : 'Collections'}</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6">{isAr ? 'خدمة العملاء' : 'SERVICE CLIENT'}</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-black transition-colors">{isAr ? 'اتصل بنا' : 'Contact'}</a></li>
              <li><a href="#" className="hover:text-black transition-colors">{isAr ? 'التوصيل والاسترجاع' : 'Livraison & Retours'}</a></li>
              <li><a href="#" className="hover:text-black transition-colors">{isAr ? 'الأسئلة الشائعة' : 'FAQ'}</a></li>
              <li><a href="#" className="hover:text-black transition-colors">{isAr ? 'دليل المقاسات' : 'Guide des Tailles'}</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ZIY PRO. {isAr ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-black transition-colors">Instagram</a>
            <a href="#" className="hover:text-black transition-colors">Facebook</a>
            <a href="#" className="hover:text-black transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
