import React, { useState } from 'react';
import { Scissors, TrendingUp, DollarSign, Target, Plus, CheckCircle, Clock, Camera, Barcode, QrCode, Printer, X, User, Phone, Tag } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { Scanner } from '@yudiel/react-qr-scanner';
import { QRCodeSVG } from 'qrcode.react';

export default function TailorDashboard() {
  const { isAr } = useLang();
  
  // Financial Data State
  const [dailyTarget, setDailyTarget] = useState(500);
  const [actualRevenue, setActualRevenue] = useState(250);
  
  // Orders State
  const [orders, setOrders] = useState([
    { id: 1, ticketId: 'ORD-8932', client: 'محمد', phone: '0612345678', type: 'تقصير سروال', price: 30, status: 'completed' },
    { id: 2, ticketId: 'ORD-8933', client: 'فاطمة', phone: '0698765432', type: 'تضييق فستان', price: 70, status: 'pending' },
  ]);

  // Modal States
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [activeTicket, setActiveTicket] = useState<any>(null);

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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 font-medium">{isAr ? 'الهدف اليومي (درهم)' : 'Daily Target (MAD)'}</span>
                <Target className="w-5 h-5 text-indigo-400" />
              </div>
              <input 
                type="number" 
                value={dailyTarget}
                onChange={(e) => setDailyTarget(Number(e.target.value))}
                className="text-3xl font-black text-slate-800 bg-transparent border-none p-0 focus:ring-0 w-full outline-none"
              />
            </div>
            
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 font-medium">{isAr ? 'المدخول الحالي (درهم)' : 'Current Revenue (MAD)'}</span>
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-600">
                {actualRevenue} <span className="text-sm font-bold text-emerald-400">MAD</span>
              </div>
            </div>

            <div className={`p-5 rounded-xl border ${isSuccess ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${isSuccess ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isAr ? 'حالة المشروع اليوم' : 'Today\'s Project Status'}
                </span>
              </div>
              <div className={`text-xl font-black ${isSuccess ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isSuccess 
                  ? (isAr ? '🔥 مشروع ناجح ومربح اليوم' : '🔥 Profitable Today')
                  : (isAr ? '⚠️ لم نصل للهدف بعد' : '⚠️ Target Not Reached')
                }
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

        {/* Orders List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:hidden">
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
              <div className="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 hover:border-indigo-300 transition-colors cursor-pointer">
                <Camera className="w-8 h-8 mb-2 text-indigo-400" />
                <span className="font-medium text-sm">{isAr ? 'التقط صورة للقطعة (اختياري)' : 'Take a photo of the item'}</span>
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

    </div>
  );
}
