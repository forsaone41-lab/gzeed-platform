import React, { useState } from 'react';
import { Scissors, TrendingUp, DollarSign, Target, Plus, CheckCircle, Clock, Camera, Barcode, QrCode, Printer, X, User, Phone, Tag, Wallet, MinusCircle, ArrowRight, Tags, MessageCircle, Ruler } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { Scanner } from '@yudiel/react-qr-scanner';
import { QRCodeSVG } from 'qrcode.react';

const quickServices = [
  { name: 'تقصير سروال', price: 30 },
  { name: 'تضييق قميص', price: 40 },
  { name: 'تضييق فستان', price: 60 },
  { name: 'تركيب سحاب', price: 50 },
  { name: 'كفة عادية', price: 20 },
  { name: 'روتوش سترة', price: 80 },
];

const DressSketch = () => (
  <svg viewBox="0 0 200 300" fill="none" stroke="currentColor" strokeWidth="2" className="w-32 h-48 md:w-full md:h-full text-indigo-200" preserveAspectRatio="xMidYMid meet">
    <path d="M60 40 Q100 30 140 40" />
    <path d="M60 40 L30 120 L45 125 L70 80" />
    <path d="M140 40 L170 120 L155 125 L130 80" />
    <path d="M70 80 Q85 110 80 140 Q70 200 50 280 L150 280 Q130 200 120 140 Q115 110 130 80" />
    <path d="M90 40 C90 55 110 55 110 40" />
    <g stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-indigo-400">
      <line x1="60" y1="35" x2="140" y2="35" /> 
      <line x1="75" y1="85" x2="125" y2="85" /> 
      <line x1="80" y1="120" x2="120" y2="120" /> 
      <line x1="75" y1="160" x2="125" y2="160" /> 
      <line x1="100" y1="40" x2="100" y2="280" /> 
      <line x1="60" y1="40" x2="35" y2="120" /> 
    </g>
    <circle cx="60" cy="40" r="3" fill="currentColor" className="text-indigo-600" />
    <circle cx="140" cy="40" r="3" fill="currentColor" className="text-indigo-600" />
    <circle cx="75" cy="85" r="3" fill="currentColor" className="text-indigo-600" />
    <circle cx="125" cy="85" r="3" fill="currentColor" className="text-indigo-600" />
  </svg>
);

export default function TailorDashboard() {
  const { isAr } = useLang();
  
  // Financial Data State
  const [dailyTarget, setDailyTarget] = useState(500);
  const [actualRevenue, setActualRevenue] = useState(250);
  
  // Expenses State (Gestion)
  const [expenses, setExpenses] = useState([
    { id: 1, desc: 'خيط وإبر', amount: 30 },
  ]);
  const [newExpense, setNewExpense] = useState({ desc: '', amount: '' });

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = actualRevenue - totalExpenses;
  
  // App Mode
  const [activeMode, setActiveMode] = useState<'retouche' | 'traditional'>('retouche');

  // Orders State
  const [orders, setOrders] = useState([
    { id: 1, ticketId: 'ORD-8932', client: 'محمد', phone: '0612345678', type: 'تقصير سروال', price: 30, category: 'retouche', status: 'completed' },
    { id: 2, ticketId: 'ORD-8933', client: 'فاطمة', phone: '0698765432', type: 'تضييق فستان', price: 70, category: 'retouche', status: 'pending' },
    { id: 3, ticketId: 'TRD-1024', client: 'ليلى', phone: '0655443322', type: 'جلابة مخزنية', price: 600, avance: 200, category: 'traditional', status: 'pending', measurements: { length: 135, chest: 28, shoulders: 40, sleeves: 58, waist: 26, hips: 30, armhole: 24, bicep: 18, wrist: 14, bottomWidth: 40 } },
  ]);

  // Modal States
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showTraditionalModal, setShowTraditionalModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [activeTicket, setActiveTicket] = useState<any>(null);

  // Tags Form State
  const [tagData, setTagData] = useState({
    name: 'سروال كلاسيك',
    price: '150',
    size: 'M',
    quantity: 1
  });

  // New Order Form State
  const [newOrder, setNewOrder] = useState({
    client: '',
    phone: '',
    type: '',
    price: '',
    notes: ''
  });

  // New Traditional Order Form State
  const [newTradOrder, setNewTradOrder] = useState({
    client: '', phone: '', type: '', price: '', avance: '', 
    measurements: { 
      shoulders: '', chest: '', waist: '', hips: '', 
      sleeves: '', armhole: '', bicep: '', wrist: '', 
      length: '', bottomWidth: '' 
    }
  });

  const progress = Math.min((actualRevenue / dailyTarget) * 100, 100);
  const isSuccess = actualRevenue >= dailyTarget;

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const orderToSave = {
      id: orders.length + 1,
      ticketId,
      ...newOrder,
      price: Number(newOrder.price),
      category: 'retouche',
      status: 'pending'
    };
    
    setOrders([orderToSave, ...orders]);
    setActualRevenue(prev => prev + orderToSave.price);
    
    setNewOrder({ client: '', phone: '', type: '', price: '', notes: '' });
    setShowOrderModal(false);
    setActiveTicket(orderToSave);
    setShowTicketModal(true);
  };

  const handleCreateTradOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = 'TRD-' + Math.floor(1000 + Math.random() * 9000);
    const orderToSave = {
      id: orders.length + 1,
      ticketId,
      ...newTradOrder,
      price: Number(newTradOrder.price),
      avance: Number(newTradOrder.avance),
      category: 'traditional',
      status: 'pending'
    };
    
    setOrders([orderToSave, ...orders]);
    setActualRevenue(prev => prev + orderToSave.avance);
    
    setNewTradOrder({ 
      client: '', phone: '', type: '', price: '', avance: '', 
      measurements: { shoulders: '', chest: '', waist: '', hips: '', sleeves: '', armhole: '', bicep: '', wrist: '', length: '', bottomWidth: '' } 
    });
    setShowTraditionalModal(false);
    setActiveTicket(orderToSave);
    setShowTicketModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const result = detectedCodes[0].rawValue;
      const foundOrder = orders.find(o => o.ticketId === result);
      if (foundOrder) {
        setActiveTicket(foundOrder);
        setShowScanner(false);
        setShowTicketModal(true);
      } else {
        alert(isAr ? 'لم يتم العثور على هذا الطلب!' : 'Order not found!');
      }
    }
  };

  const sendWhatsApp = (order: any) => {
    if (!order.phone) {
      alert(isAr ? 'لا يوجد رقم هاتف مسجل لهذا الزبون' : 'No phone number for this client');
      return;
    }
    
    let phone = order.phone.replace(/\s+/g, '');
    if (phone.startsWith('0')) {
      phone = '212' + phone.substring(1);
    } else if (phone.startsWith('+')) {
      phone = phone.substring(1);
    }
    
    let message = '';
    if (order.status === 'completed') {
      message = `مرحبا ${order.client}، 👋\nالبياسة ديالك (${order.type}) راهي واجدة تقدر تجي تاخدها من BEYA CREATIVE.\n\n🏷️ الثمن: ${order.price} درهم.\nمرحبا بك في أي وقت!`;
    } else {
      message = `مرحبا ${order.client}، 👋\nتم تسجيل طلبك (${order.type}) بنجاح في BEYA CREATIVE.\n\n🧾 رقم الطلب: ${order.ticketId}\n💰 الثمن: ${order.price} درهم.\n\nغادي نعلموك فاش توجد، شكرا لك!`;
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f2f2f7] md:p-6 font-sans pb-28 md:pb-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto md:space-y-6">
        
        {/* iOS Style Header */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl md:bg-white p-4 md:p-6 rounded-b-[32px] md:rounded-2xl shadow-sm border-b md:border border-slate-200 print:hidden flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <Scissors className="w-6 h-6 text-indigo-600" />
              {isAr ? 'إدارة الخياطة والروتوش' : 'Tailor POS'}
            </h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium">
              {isAr ? 'نظام تتبع المداخيل والطلبات' : 'Smart dashboard for orders'}
            </p>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => setShowTagsModal(true)}
              className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors"
            >
              <Tags className="w-5 h-5" />
              {isAr ? 'الملصقات (Étiquettes)' : 'Tags'}
            </button>
            <button 
              onClick={() => setShowScanner(true)}
              className="bg-slate-900 hover:bg-black text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-slate-900/20"
            >
              <QrCode className="w-5 h-5" />
              {isAr ? 'سكان (Scan)' : 'Scan Ticket'}
            </button>
            <button 
              onClick={() => activeMode === 'retouche' ? setShowOrderModal(true) : setShowTraditionalModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-5 h-5" />
              {isAr ? 'طلب جديد' : 'New Order'}
            </button>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="px-4 md:px-0 mb-6 print:hidden">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 inline-flex shadow-sm w-full md:w-auto">
            <button 
              onClick={() => setActiveMode('retouche')}
              className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeMode === 'retouche' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {isAr ? 'الروتوش السريع' : 'Alterations'}
            </button>
            <button 
              onClick={() => setActiveMode('traditional')}
              className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeMode === 'traditional' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {isAr ? 'الخياطة التقليدية (جلابة/قفطان)' : 'Traditional Tailoring'}
            </button>
          </div>
        </div>

        <div className="px-4 md:px-0 space-y-6">
        {/* Financial Dashboard */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:hidden">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-800">
              {isAr ? 'الهدف المالي اليومي (دراسة الجدوى)' : 'Daily Financial Target'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 font-medium text-sm">{isAr ? 'الهدف اليومي' : 'Daily Target'}</span>
                <Target className="w-5 h-5 text-indigo-400" />
              </div>
              <input 
                type="number" 
                value={dailyTarget}
                onChange={(e) => setDailyTarget(Number(e.target.value))}
                className="text-2xl font-black text-slate-800 bg-transparent border-none p-0 focus:ring-0 w-full outline-none"
              />
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 font-medium text-sm">{isAr ? 'المداخيل (Gross)' : 'Revenue'}</span>
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-600">
                {actualRevenue} <span className="text-xs font-bold text-emerald-400">MAD</span>
              </div>
            </div>

            <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-rose-700 font-medium text-sm">{isAr ? 'المصاريف' : 'Expenses'}</span>
                <MinusCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-rose-600">
                {totalExpenses} <span className="text-xs font-bold text-rose-400">MAD</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${netProfit >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium text-sm ${netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {isAr ? 'الربح الصافي (Net Profit)' : 'Net Profit'}
                </span>
                <Wallet className={`w-5 h-5 ${netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
              </div>
              <div className={`text-2xl font-black ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {netProfit} <span className="text-xs font-bold opacity-70">MAD</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-slate-500">{isAr ? 'نسبة تحقيق الهدف' : 'Target Progress'}</span>
              <span className={isSuccess ? 'text-emerald-500' : 'text-indigo-500'}>{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${isSuccess ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
          
          {/* Expenses / Gestion Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-1 h-fit">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-rose-500" />
              {isAr ? 'المصاريف اليومية' : 'Daily Expenses'}
            </h2>
            
            <div className="space-y-4 mb-6">
              {expenses.map(exp => (
                <div key={exp.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">{exp.desc}</span>
                  <span className="font-bold text-rose-600">-{exp.amount} DH</span>
                </div>
              ))}
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (newExpense.desc && newExpense.amount) {
                  setExpenses([...expenses, { id: Date.now(), desc: newExpense.desc, amount: Number(newExpense.amount) }]);
                  setNewExpense({ desc: '', amount: '' });
                }
              }}
              className="space-y-3 pt-4 border-t border-slate-100"
            >
              <input required value={newExpense.desc} onChange={e => setNewExpense({...newExpense, desc: e.target.value})} placeholder={isAr ? "شنو خسرتي؟ (مثلا: خيط)" : "Description"} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 font-medium text-sm" />
              <div className="flex gap-2">
                <input required type="number" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} placeholder={isAr ? "الثمن" : "Amount"} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 font-bold text-sm" />
                <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-black transition-colors shrink-0">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Orders List */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-1 lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              {isAr ? (activeMode === 'retouche' ? 'طلبات الروتوش اليوم' : 'طلبات الخياطة التقليدية') : 'Today\'s Orders'}
            </h2>
          <div className="space-y-3">
            {orders.filter(o => o.category === activeMode).map(order => (
              <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer" onClick={() => { setActiveTicket(order); setShowTicketModal(true); }}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {order.status === 'completed' ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{order.client} <span className="text-slate-400 text-sm font-normal mx-2">| {order.ticketId}</span></h3>
                    <p className="text-sm font-medium text-slate-600">{order.type}</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {order.status === 'completed' ? (isAr ? 'مكتمل' : 'Completed') : (isAr ? 'قيد الإنجاز' : 'Pending')}
                  </span>
                  <div className="font-black text-xl text-slate-800">
                    {order.price} <span className="text-sm text-slate-400">MAD</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); sendWhatsApp(order); }} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Send WhatsApp">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      <Barcode className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>

        </div>

      </div>

      {/* iOS Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-2 pb-6 flex justify-around items-center z-40">
        <button onClick={() => setShowTagsModal(true)} className="flex flex-col items-center gap-1 text-slate-500 hover:text-indigo-600 w-20">
          <Tags className="w-6 h-6" />
          <span className="text-[10px] font-bold">{isAr ? 'الملصقات' : 'Tags'}</span>
        </button>
        
        <button onClick={() => activeMode === 'retouche' ? setShowOrderModal(true) : setShowTraditionalModal(true)} className="relative -top-6 bg-indigo-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/40 border-4 border-[#f2f2f7] shrink-0">
          <Plus className="w-6 h-6" />
        </button>

        <button onClick={() => setShowScanner(true)} className="flex flex-col items-center gap-1 text-slate-500 hover:text-indigo-600 w-20">
          <QrCode className="w-6 h-6" />
          <span className="text-[10px] font-bold">{isAr ? 'سكان' : 'Scan'}</span>
        </button>
      </div>

      {/* NEW ORDER MODAL */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-black text-slate-800">{isAr ? 'إضافة طلب جديد' : 'Add New Order'}</h2>
              <button onClick={() => setShowOrderModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrder} className="p-6 space-y-5 overflow-y-auto">
              {/* Photo Upload Placeholder */}
              <div className="w-full h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 hover:border-indigo-300 transition-colors cursor-pointer">
                <Camera className="w-6 h-6 mb-1 text-indigo-400" />
                <span className="font-medium text-xs">{isAr ? 'التقط صورة للقطعة (اختياري)' : 'Take a photo of the item'}</span>
              </div>

              {/* Quick POS Buttons (Caisse Rapide) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{isAr ? 'خدمات سريعة (Caisse Rapide)' : 'Quick Services'}</label>
                <div className="flex flex-wrap gap-2">
                  {quickServices.map(service => (
                    <button 
                      key={service.name} 
                      type="button"
                      onClick={() => setNewOrder({...newOrder, type: service.name, price: service.price.toString()})}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm"
                    >
                      {service.name} <span className="opacity-60 font-medium">({service.price}DH)</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><User className="w-4 h-4"/> {isAr ? 'اسم الزبون' : 'Client Name'}</label>
                  <input required value={newOrder.client} onChange={e => setNewOrder({...newOrder, client: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium" placeholder={isAr ? "مثال: يوسف" : "e.g. Youssef"} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Phone className="w-4 h-4"/> {isAr ? 'رقم الهاتف' : 'Phone'}</label>
                  <input required value={newOrder.phone} onChange={e => setNewOrder({...newOrder, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium" placeholder="06..." dir="ltr" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Scissors className="w-4 h-4"/> {isAr ? 'نوع الخدمة' : 'Service Type'}</label>
                  <input required value={newOrder.type} onChange={e => setNewOrder({...newOrder, type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium" placeholder={isAr ? "مثال: تقصير سروال جينز" : "e.g. Shorten jeans"} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Tag className="w-4 h-4"/> {isAr ? 'الثمن' : 'Price'}</label>
                  <div className="relative">
                    <input required type="number" value={newOrder.price} onChange={e => setNewOrder({...newOrder, price: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-black text-slate-800" placeholder="0" />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">DH</span>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-lg transition-all shadow-lg shadow-indigo-600/20 mt-4">
                {isAr ? 'تأكيد واستخراج التذكرة' : 'Create & Print Ticket'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NEW TRADITIONAL ORDER MODAL (BELDI) */}
      {showTraditionalModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Ruler className="w-6 h-6 text-indigo-600" />
                {isAr ? 'طلب خياطة تقليدية' : 'Traditional Tailoring'}
              </h2>
              <button onClick={() => setShowTraditionalModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTradOrder} className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{isAr ? 'الزبون' : 'Client'}</label>
                  <input required value={newTradOrder.client} onChange={e => setNewTradOrder({...newTradOrder, client: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{isAr ? 'الهاتف' : 'Phone'}</label>
                  <input required value={newTradOrder.phone} onChange={e => setNewTradOrder({...newTradOrder, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-medium" dir="ltr" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{isAr ? 'النوع (جلابة، قفطان...)' : 'Type (Djellaba...)'}</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['جلابة', 'قفطان', 'تكشيطة', 'جابادور', 'كندورة'].map(type => (
                    <button key={type} type="button" onClick={() => setNewTradOrder({...newTradOrder, type})} className={`px-4 py-2 rounded-xl font-bold text-sm border transition-colors ${newTradOrder.type === type ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>{type}</button>
                  ))}
                </div>
                <input required value={newTradOrder.type} onChange={e => setNewTradOrder({...newTradOrder, type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-medium" placeholder={isAr ? "نوع الخياطة والثوب" : "Details"} />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-6">
                
                {/* 2D Sketch Reference */}
                <div className="md:w-1/3 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200 p-4 relative shadow-inner">
                  <DressSketch />
                  <span className="absolute bottom-2 text-[10px] font-black tracking-widest text-slate-300">{isAr ? 'رسم تخطيطي 2D' : '2D TECH SKETCH'}</span>
                </div>

                {/* Measurements Form */}
                <div className="md:w-2/3">
                  <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                    <Ruler className="w-4 h-4" /> {isAr ? 'القياسات المفصلة (سنتيمتر)' : 'Detailed Measurements (cm)'}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Row 1 */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? 'الكتاف' : 'Shoulders'}</label>
                    <input type="number" value={newTradOrder.measurements.shoulders} onChange={e => setNewTradOrder({...newTradOrder, measurements: {...newTradOrder.measurements, shoulders: e.target.value}})} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 outline-none focus:border-indigo-500 text-center font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? 'الصدر' : 'Chest'}</label>
                    <input type="number" value={newTradOrder.measurements.chest} onChange={e => setNewTradOrder({...newTradOrder, measurements: {...newTradOrder.measurements, chest: e.target.value}})} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 outline-none focus:border-indigo-500 text-center font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? 'الحزام' : 'Waist'}</label>
                    <input type="number" value={newTradOrder.measurements.waist} onChange={e => setNewTradOrder({...newTradOrder, measurements: {...newTradOrder.measurements, waist: e.target.value}})} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 outline-none focus:border-indigo-500 text-center font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? 'الحوض (Bassin)' : 'Hips'}</label>
                    <input type="number" value={newTradOrder.measurements.hips} onChange={e => setNewTradOrder({...newTradOrder, measurements: {...newTradOrder.measurements, hips: e.target.value}})} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 outline-none focus:border-indigo-500 text-center font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? 'الطول الكلي' : 'Length'}</label>
                    <input type="number" value={newTradOrder.measurements.length} onChange={e => setNewTradOrder({...newTradOrder, measurements: {...newTradOrder.measurements, length: e.target.value}})} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 outline-none focus:border-indigo-500 text-center font-bold text-sm" />
                  </div>
                  
                  {/* Row 2 */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? 'الكمام' : 'Sleeves'}</label>
                    <input type="number" value={newTradOrder.measurements.sleeves} onChange={e => setNewTradOrder({...newTradOrder, measurements: {...newTradOrder.measurements, sleeves: e.target.value}})} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 outline-none focus:border-indigo-500 text-center font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? 'التركيز' : 'Armhole'}</label>
                    <input type="number" value={newTradOrder.measurements.armhole} onChange={e => setNewTradOrder({...newTradOrder, measurements: {...newTradOrder.measurements, armhole: e.target.value}})} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 outline-none focus:border-indigo-500 text-center font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? 'الذراع' : 'Bicep'}</label>
                    <input type="number" value={newTradOrder.measurements.bicep} onChange={e => setNewTradOrder({...newTradOrder, measurements: {...newTradOrder.measurements, bicep: e.target.value}})} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 outline-none focus:border-indigo-500 text-center font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? 'فم الكم' : 'Wrist'}</label>
                    <input type="number" value={newTradOrder.measurements.wrist} onChange={e => setNewTradOrder({...newTradOrder, measurements: {...newTradOrder.measurements, wrist: e.target.value}})} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 outline-none focus:border-indigo-500 text-center font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">{isAr ? 'الجلايل' : 'Évasement'}</label>
                    <input type="number" value={newTradOrder.measurements.bottomWidth} onChange={e => setNewTradOrder({...newTradOrder, measurements: {...newTradOrder.measurements, bottomWidth: e.target.value}})} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 outline-none focus:border-indigo-500 text-center font-bold text-sm" />
                  </div>
                </div>
              </div>
            </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{isAr ? 'الثمن الإجمالي (DH)' : 'Total Price'}</label>
                  <input required type="number" value={newTradOrder.price} onChange={e => setNewTradOrder({...newTradOrder, price: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-black text-slate-800" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{isAr ? 'التسبيق (Avance)' : 'Advance Payment'}</label>
                  <input required type="number" value={newTradOrder.avance} onChange={e => setNewTradOrder({...newTradOrder, avance: e.target.value})} className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-black" />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-lg transition-all shadow-lg shadow-indigo-600/20">
                {isAr ? 'تسجيل طلب الخياطة' : 'Save Traditional Order'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TICKET MODAL (Can be printed) */}
      {showTicketModal && activeTicket && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:bg-white print:p-0">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 print:shadow-none print:max-w-none print:w-80 print:mx-auto">
            
            {/* Ticket Header */}
            <div className="p-6 text-center border-b border-dashed border-slate-300 bg-slate-50 print:bg-white">
              <Scissors className="w-8 h-8 text-slate-800 mx-auto mb-2" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight">ATELIER GZEED</h2>
              <p className="text-slate-500 text-xs mt-1">الخياطة والروتوش السريع</p>
            </div>

            {/* Ticket Body */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">رقم الطلب</span>
                <span className="font-black text-slate-900">{activeTicket.ticketId}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">الزبون</span>
                <span className="font-bold text-slate-900">{activeTicket.client}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">الهاتف</span>
                <span className="font-bold text-slate-900" dir="ltr">{activeTicket.phone}</span>
              </div>
              
              <div className="h-px w-full bg-dashed border-t border-dashed border-slate-300 my-4"></div>
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">{activeTicket.type}</span>
                <span className="font-black text-lg text-slate-900">{activeTicket.price} DH</span>
              </div>
              
              {activeTicket.category === 'traditional' && (
                <div className="mt-4 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 print:bg-white text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-500">التسبيق (Avance):</span>
                    <span className="font-bold text-emerald-600">{activeTicket.avance} DH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">الباقي (Reste):</span>
                    <span className="font-bold text-rose-600">{activeTicket.price - activeTicket.avance} DH</span>
                  </div>
                  {activeTicket.measurements && (
                    <div className="mt-3 pt-3 border-t border-dashed border-slate-200 grid grid-cols-5 gap-2 text-center text-[10px]">
                      <div><div className="text-slate-400">الكتاف</div><div className="font-bold text-sm">{activeTicket.measurements.shoulders || '-'}</div></div>
                      <div><div className="text-slate-400">الصدر</div><div className="font-bold text-sm">{activeTicket.measurements.chest || '-'}</div></div>
                      <div><div className="text-slate-400">الحزام</div><div className="font-bold text-sm">{activeTicket.measurements.waist || '-'}</div></div>
                      <div><div className="text-slate-400">الحوض</div><div className="font-bold text-sm">{activeTicket.measurements.hips || '-'}</div></div>
                      <div><div className="text-slate-400">الطول</div><div className="font-bold text-sm">{activeTicket.measurements.length || '-'}</div></div>
                      
                      <div><div className="text-slate-400">الكمام</div><div className="font-bold text-sm">{activeTicket.measurements.sleeves || '-'}</div></div>
                      <div><div className="text-slate-400">التركيز</div><div className="font-bold text-sm">{activeTicket.measurements.armhole || '-'}</div></div>
                      <div><div className="text-slate-400">الذراع</div><div className="font-bold text-sm">{activeTicket.measurements.bicep || '-'}</div></div>
                      <div><div className="text-slate-400">فم الكم</div><div className="font-bold text-sm">{activeTicket.measurements.wrist || '-'}</div></div>
                      <div><div className="text-slate-400">الجلايل</div><div className="font-bold text-sm">{activeTicket.measurements.bottomWidth || '-'}</div></div>
                    </div>
                  )}
                </div>
              )}

              {/* Scannable QR Code */}
              <div className="mt-8 text-center pt-4">
                <div className="flex justify-center mb-2">
                   <QRCodeSVG value={activeTicket.ticketId} size={100} level="M" />
                </div>
                <span className="text-xs font-bold tracking-[0.3em] text-slate-500">{activeTicket.ticketId}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50 grid grid-cols-2 gap-3 print:hidden border-t border-slate-100">
              <button 
                onClick={() => {
                  if (activeTicket.status === 'pending') {
                    setOrders(orders.map(o => o.id === activeTicket.id ? {...o, status: 'completed'} : o));
                    setActiveTicket({...activeTicket, status: 'completed'});
                  }
                }}
                className={`py-3 border rounded-xl font-bold transition-colors ${activeTicket.status === 'pending' ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' : 'bg-slate-200 text-slate-500 border-slate-200 cursor-not-allowed'}`}
                disabled={activeTicket.status === 'completed'}
              >
                {activeTicket.status === 'pending' ? (isAr ? 'تأكيد التسليم' : 'Mark as Done') : (isAr ? 'تم التسليم' : 'Completed')}
              </button>
              <button 
                onClick={() => sendWhatsApp(activeTicket)}
                className="py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
              
              <button 
                onClick={() => setShowTicketModal(false)}
                className="py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-colors"
              >
                إغلاق
              </button>
              <button 
                onClick={handlePrint}
                className="py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                طباعة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCANNER MODAL */}
      {showScanner && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 print:hidden">
          <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10 relative">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <QrCode className="w-6 h-6 text-indigo-600" />
                {isAr ? 'مسح التذكرة' : 'Scan Ticket'}
              </h2>
              <button onClick={() => setShowScanner(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative bg-black w-full aspect-square flex items-center justify-center">
              <Scanner 
                onScan={handleScan}
                formats={['qr_code', 'code_128', 'ean_13']}
                styles={{ container: { width: '100%', height: '100%' } }}
              />
              <div className="absolute inset-0 border-[6px] border-indigo-500/50 rounded-2xl m-8 pointer-events-none"></div>
            </div>
            <div className="p-4 bg-slate-50 text-center text-sm font-bold text-slate-500">
              {isAr ? 'قم بتوجيه الكاميرا نحو الكود الموجود في التذكرة' : 'Point your camera at the ticket barcode'}
            </div>
          </div>
        </div>
      )}
      {/* TAGS (ETIQUETTES) MODAL */}
      {showTagsModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:bg-white print:p-0">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row print:shadow-none print:max-w-none print:w-full">
            
            {/* Form Section */}
            <div className="p-6 md:w-1/2 border-b md:border-b-0 md:border-r border-slate-100 print:hidden bg-slate-50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Tags className="w-6 h-6 text-indigo-600" />
                  {isAr ? 'تصميم ملصق (Étiquette)' : 'Design Tag'}
                </h2>
                <button onClick={() => setShowTagsModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{isAr ? 'اسم المنتوج' : 'Product Name'}</label>
                  <input value={tagData.name} onChange={e => setTagData({...tagData, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{isAr ? 'الثمن (DH)' : 'Price'}</label>
                    <input type="number" value={tagData.price} onChange={e => setTagData({...tagData, price: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-black text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{isAr ? 'المقاس' : 'Size'}</label>
                    <input value={tagData.size} onChange={e => setTagData({...tagData, size: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-black text-center uppercase" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{isAr ? 'الكمية (للطباعة)' : 'Quantity to Print'}</label>
                  <input type="number" min="1" max="100" value={tagData.quantity} onChange={e => setTagData({...tagData, quantity: Number(e.target.value)})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-medium" />
                </div>
              </div>
              <button 
                onClick={handlePrint}
                className="w-full mt-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Printer className="w-5 h-5" />
                {isAr ? 'طباعة الملصقات' : 'Print Tags'}
              </button>
            </div>

            {/* Preview & Print Section */}
            <div className="p-6 md:w-1/2 bg-white flex flex-col items-center justify-center overflow-auto max-h-[60vh] print:max-h-none print:p-0">
              <div className="print:hidden text-sm font-bold text-slate-400 mb-4">{isAr ? 'معاينة الملصقات (يظهر في الطباعة)' : 'Tags Preview'}</div>
              
              <div className="flex flex-wrap gap-4 justify-center print:gap-2 print:justify-start">
                {Array.from({ length: tagData.quantity || 1 }).map((_, i) => (
                  <div key={i} className="w-48 bg-white border-2 border-slate-900 rounded-xl p-4 flex flex-col items-center text-center shadow-sm print:border print:shadow-none print:break-inside-avoid">
                    <div className="font-black text-xs tracking-widest text-slate-900 uppercase mb-2">BEYA CREATIVE</div>
                    <div className="h-px w-full bg-slate-200 mb-2"></div>
                    <div className="font-bold text-sm text-slate-800 mb-1">{tagData.name || 'Product'}</div>
                    <div className="font-black text-xl text-slate-900 mb-3">{tagData.price || '0'} DH</div>
                    
                    <div className="flex justify-center mb-2">
                       <QRCodeSVG value={`PRD-${tagData.name}-${tagData.price}`} size={60} level="M" />
                    </div>
                    
                    <div className="mt-auto pt-2 w-full flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>SIZE:</span>
                      <span className="bg-slate-900 text-white px-2 py-0.5 rounded">{tagData.size || 'M'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
