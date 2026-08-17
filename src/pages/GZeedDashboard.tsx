import React, { useState } from 'react';
import { 
  Home, 
  LayoutTemplate, 
  ShoppingBag, 
  Settings, 
  Box, 
  Users, 
  BarChart3, 
  Globe, 
  Smartphone, 
  Plus, 
  Bell, 
  Search,
  ChevronRight,
  MonitorPlay,
  Palette
} from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useNavigate } from 'react-router-dom';

export default function GZeedDashboard() {
  const { isAr } = useLang();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', icon: Home, labelAr: 'الرئيسية', labelFr: 'Accueil' },
    { id: 'orders', icon: ShoppingBag, labelAr: 'الطلبات', labelFr: 'Commandes' },
    { id: 'products', icon: Box, labelAr: 'المنتجات', labelFr: 'Produits' },
    { id: 'customers', icon: Users, labelAr: 'العملاء', labelFr: 'Clients' },
    { id: 'analytics', icon: BarChart3, labelAr: 'التحليلات', labelFr: 'Analytique' },
    { divider: true },
    { id: 'themes', icon: LayoutTemplate, labelAr: 'القوالب والتصميم', labelFr: 'Thèmes & Design' },
    { id: 'builder', icon: Palette, labelAr: 'تعديل الواجهة', labelFr: 'Éditeur Visuel' },
    { divider: true },
    { id: 'settings', icon: Settings, labelAr: 'الإعدادات', labelFr: 'Paramètres' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex transition-all duration-300 relative border-r border-slate-800" dir={isAr ? 'rtl' : 'ltr'}>
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex items-center gap-2" dir="ltr">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-lg shadow-cyan-500/20">
              GZ
            </div>
            <span className="font-black text-white tracking-tight text-xl">GZeed</span>
          </div>
        </div>

        {/* Store Selector */}
        <div className="p-4 border-b border-slate-800">
          <div className="bg-slate-800 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-slate-700 transition-colors">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400">{isAr ? 'متجرك الحالي' : 'Boutique actuelle'}</span>
              <span className="text-sm font-black text-white">متجر الأناقة</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-400 ${isAr ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <nav className="px-3 space-y-1">
            {navItems.map((item, idx) => {
              if (item.divider) {
                return <div key={`div-${idx}`} className="h-px bg-slate-800 my-4 mx-4" />;
              }
              const Icon = item.icon as React.ElementType;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 group
                    ${isActive 
                      ? 'bg-cyan-500/10 text-cyan-400' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-white transition-colors'}`} />
                  {isAr ? item.labelAr : item.labelFr}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Upgrade Card */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-xl p-4 text-white relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
            <h4 className="font-black text-sm mb-1">{isAr ? 'خطتك الحالية: مجانية' : 'Plan actuel: Gratuit'}</h4>
            <p className="text-xs font-medium text-white/80 mb-3 leading-relaxed">
              {isAr ? 'قم بالترقية للحصول على نطاق مخصص (gzeed.com).' : 'Passez au niveau supérieur pour un domaine personnalisé.'}
            </p>
            <button className="w-full py-2 bg-white text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
              {isAr ? 'ترقية الآن' : 'Mettre à niveau'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder={isAr ? 'ابحث عن منتجات، طلبات، أو إعدادات...' : 'Rechercher des produits, commandes...'}
                className="w-full bg-slate-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                dir={isAr ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 pl-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          
          <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            {/* Greeting */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-1">
                  {isAr ? 'مرحباً بك في GZeed 👋' : 'Bienvenue sur GZeed 👋'}
                </h1>
                <p className="text-slate-500 font-medium">
                  {isAr ? 'لنقم بإعداد مشروعك وإطلاقه للعالم.' : 'Configurons votre projet pour le lancer.'}
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                  <MonitorPlay className="w-4 h-4" />
                  {isAr ? 'عرض المتجر' : 'Voir la boutique'}
                </button>
                <button className="px-4 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-all shadow-md">
                  {isAr ? 'إضافة منتج' : 'Ajouter un produit'}
                </button>
              </div>
            </div>

            {/* Setup Progress */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-50 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1">
                  <h2 className="text-xl font-black text-slate-900 mb-2">
                    {isAr ? 'دليل الإعداد السريع' : 'Guide de configuration rapide'}
                  </h2>
                  <p className="text-slate-500 text-sm font-medium mb-6">
                    {isAr ? 'أكمل هذه الخطوات لبدء البيع واستقبال الزوار.' : 'Complétez ces étapes pour commencer à vendre.'}
                  </p>
                  
                  <div className="space-y-4">
                    {/* Task 1 */}
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-cyan-100 bg-cyan-50/50 hover:bg-cyan-50 transition-colors cursor-pointer group">
                      <div className="w-6 h-6 rounded-full border-2 border-cyan-500 flex items-center justify-center shrink-0 mt-0.5 bg-white">
                        <div className="w-2 h-2 rounded-full bg-cyan-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors">
                          {isAr ? 'اختر اسماً لمشروعك' : 'Choisissez un nom pour votre projet'}
                        </h3>
                        <p className="text-sm text-slate-600 font-medium">
                          {isAr ? 'لم تقم بتسمية متجرك بعد. اختر اسماً يمثل علامتك التجارية.' : 'Vous n\'avez pas encore nommé votre boutique.'}
                        </p>
                        <button className="mt-3 text-sm font-bold text-cyan-600 hover:text-cyan-700">
                          {isAr ? 'إضافة اسم →' : 'Ajouter un nom →'}
                        </button>
                      </div>
                    </div>

                    {/* Task 2 */}
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 mt-0.5 bg-white" />
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors">
                          {isAr ? 'تخصيص الواجهة والقوالب' : 'Personnaliser l\'apparence'}
                        </h3>
                        <p className="text-sm text-slate-600 font-medium">
                          {isAr ? 'اختر قالباً يناسبك وعدله بسهولة باستخدام أداة السحب والإفلات.' : 'Choisissez un thème et modifiez-le facilement.'}
                        </p>
                      </div>
                    </div>

                    {/* Task 3 */}
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 mt-0.5 bg-white" />
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors">
                          {isAr ? 'أضف أول منتج لك' : 'Ajoutez votre premier produit'}
                        </h3>
                        <p className="text-sm text-slate-600 font-medium">
                          {isAr ? 'ارفع صوراً ووصفاً لمنتجك ليراه عملاؤك.' : 'Téléchargez des images et une description.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Circle Visual */}
                <div className="w-full md:w-64 flex flex-col justify-center items-center bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="60" className="stroke-slate-200 fill-none" strokeWidth="8" />
                      <circle cx="64" cy="64" r="60" className="stroke-cyan-500 fill-none" strokeWidth="8" strokeDasharray="377" strokeDashoffset="282.75" strokeLinecap="round" />
                    </svg>
                    <div className="absolute text-3xl font-black text-slate-900">
                      1<span className="text-xl text-slate-400">/4</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 text-center mb-1">
                    {isAr ? 'أنت في الطريق الصحيح!' : 'Vous êtes sur la bonne voie !'}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 text-center">
                    {isAr ? 'أكمل الإعداد لإطلاق مشروعك' : 'Terminez la configuration pour lancer votre projet'}
                  </p>
                </div>
              </div>
            </div>

            {/* Platform Options (Site, App, E-commerce) */}
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4">
                {isAr ? 'ماذا تريد أن تبني اليوم؟' : 'Que voulez-vous construire aujourd\'hui ?'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* E-commerce */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-cyan-300 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-cyan-100 to-transparent rounded-bl-full opacity-50" />
                  <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">{isAr ? 'متجر إلكتروني' : 'Boutique E-commerce'}</h4>
                  <p className="text-sm font-medium text-slate-500 mb-4">
                    {isAr ? 'منصة متكاملة لبيع منتجاتك مع سلة مشتريات ووسائل دفع.' : 'Plateforme complète pour vendre vos produits avec panier.'}
                  </p>
                  <span className="text-sm font-bold text-cyan-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    {isAr ? 'استكشاف القوالب' : 'Explorer les thèmes'} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>

                {/* Website */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-transparent rounded-bl-full opacity-50" />
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">{isAr ? 'موقع تعريفي' : 'Site Vitrine'}</h4>
                  <p className="text-sm font-medium text-slate-500 mb-4">
                    {isAr ? 'موقع احترافي لشركتك، محفظة أعمالك، أو مدونتك الشخصية.' : 'Site professionnel pour votre entreprise ou portfolio.'}
                  </p>
                  <span className="text-sm font-bold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    {isAr ? 'استكشاف القوالب' : 'Explorer les thèmes'} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>

                {/* App */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-bl-full opacity-50" />
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">{isAr ? 'تطبيق هاتف (قريباً)' : 'Application Mobile'}</h4>
                  <p className="text-sm font-medium text-slate-500 mb-4">
                    {isAr ? 'حول مشروعك إلى تطبيق احترافي لأجهزة الآيفون والأندرويد.' : 'Transformez votre projet en application professionnelle.'}
                  </p>
                  <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    {isAr ? 'اشترك في قائمة الانتظار' : 'S\'inscrire à la liste'} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
