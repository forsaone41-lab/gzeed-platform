import React, { useState } from 'react';
import { Scissors, TrendingUp, DollarSign, Target, Plus, CheckCircle, Clock, Camera, Barcode, QrCode, Printer, X, User, Phone, Tag, Wallet, MinusCircle, ArrowRight, Tags } from 'lucide-react';
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
  
  // Orders State
  const [orders, setOrders] = useState([
    { id: 1, ticketId: 'ORD-8932', client: 'محمد', phone: '0612345678', type: 'تقصير سروال', price: 30, status: 'completed' },
    { id: 2, ticketId: 'ORD-8933', client: 'فاطمة', phone: '0698765432', type: 'تضييق فستان', price: 70, status: 'pending' },
  ]);

  // Modal States
  const [showOrderModal, setShowOrderModal] = useState(false);
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
      status: 'pending'
    };
    
    setOrders([orderToSave, ...orders]);
    setActualRevenue(prev => prev + orderToSave.price);
    
    // Reset form and show ticket
    setNewOrder({ client: '', phone: '', type: '', price: '', notes: '' });
    setShowOrderModal(false);
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

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:hidden">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Scissors className="w-6 h-6 text-indigo-600" />
              {isAr ? 'نظام تسيير الخياطة والروتوش' : 'Tailor & Retouche POS'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {isAr ? 'لوحة تحكم ذكية للطلبات وتتبع المداخيل' : 'Smart dashboard for orders and revenue'}
            </p>
          </div>
          <div className="flex items-center gap-3">
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
              onClick={() => setShowOrderModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-5 h-5" />
              {isAr ? 'طلب جديد' : 'New Order'}
            </button>
          </div>
        </div>

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
            <h2 className="text-xl font-bold text-slate-800 mb-6">{isAr ? 'طلبات اليوم' : 'Today\'s Orders'}</h2>
          <div className="space-y-3">
            {orders.map(order => (
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
                  <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                    <Barcode className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>

      </div>

      {/* NEW ORDER MODAL */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-800">{isAr ? 'إضافة طلب جديد' : 'Add New Order'}</h2>
              <button onClick={() => setShowOrderModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrder} className="p-6 space-y-5">
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
                {isAr ? 'تأكيد واستخراج التذكرة' : 'Confirm & Generate Ticket'}
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

              {/* Scannable QR Code */}
              <div className="mt-8 text-center pt-4">
                <div className="flex justify-center mb-2">
                   <QRCodeSVG value={activeTicket.ticketId} size={100} level="M" />
                </div>
                <span className="text-xs font-bold tracking-[0.3em] text-slate-500">{activeTicket.ticketId}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50 flex gap-3 print:hidden border-t border-slate-100">
              <button 
                onClick={() => {
                  if (activeTicket.status === 'pending') {
                    setOrders(orders.map(o => o.id === activeTicket.id ? {...o, status: 'completed'} : o));
                    setActiveTicket({...activeTicket, status: 'completed'});
                  }
                }}
                className={`flex-1 py-3 border rounded-xl font-bold transition-colors ${activeTicket.status === 'pending' ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' : 'bg-slate-200 text-slate-500 border-slate-200 cursor-not-allowed'}`}
                disabled={activeTicket.status === 'completed'}
              >
                {activeTicket.status === 'pending' ? (isAr ? 'تأكيد التسليم' : 'Mark as Done') : (isAr ? 'تم التسليم' : 'Completed')}
              </button>
              <button 
                onClick={() => setShowTicketModal(false)}
                className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-colors"
              >
                إغلاق
              </button>
              <button 
                onClick={handlePrint}
                className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
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
