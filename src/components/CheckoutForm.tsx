import React, { useState } from 'react';
import { ShieldCheck, Truck, Banknote, AlertCircle, CheckCircle, CreditCard, Globe, Lock } from 'lucide-react';

const moroccanCities = [
  "Casablanca", "Rabat", "Fès", "Tanger", "Marrakech", "Salé", "Meknès", "Oujda",
  "Kénitra", "Agadir", "Tétouan", "Témara", "Safi", "Mohammédia", "Khouribga",
  "El Jadida", "Béni Mellal", "Nador", "Taza", "Settat", "Laayoune", "Dakhla"
];

type PaymentMethod = 'cod' | 'payzone' | 'stripe';

interface DeliveryData {
  name: string;
  phone: string;
  city: string;
  address: string;
}

interface PayzoneCardData {
  cardNumber: string;
  expiry: string;
  cvc: string;
}

// Formats "1234567812345678" as "1234 5678 1234 5678", capped at 19 digits.
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

// Formats "1225" as "12/25" while typing.
function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function CheckoutForm({ storeIsAr, storeLang, onSubmit, product, quantity, disabled, requireAccount, isAuthenticated, onRequestLogin, selectedColor, selectedSize }: any) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  const [formData, setFormData] = useState<DeliveryData>({ name: '', phone: '', city: '', address: '' });
  const [phoneError, setPhoneError] = useState('');

  const [payzoneCard, setPayzoneCard] = useState<PayzoneCardData>({ cardNumber: '', expiry: '', cvc: '' });
  const [payzoneErrors, setPayzoneErrors] = useState<{ cardNumber?: string; expiry?: string; cvc?: string }>({});

  const lang = storeLang || (storeIsAr ? 'ar' : 'fr');
  const t = (fr: string, en: string, ar: string) => lang === 'ar' ? ar : lang === 'en' ? en : fr;

  if (requireAccount && !isAuthenticated) {
    return (
      <div className="w-full text-center py-10 space-y-4">
        <p className="text-sm font-bold text-slate-600">{t('Un compte est requis pour passer commande', 'An account is required to place an order', 'يجب تسجيل الدخول لإتمام الطلب')}</p>
        <button
          type="button"
          onClick={onRequestLogin}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          {t('Se connecter / Créer un compte', 'Sign in / Create an account', 'تسجيل الدخول / إنشاء حساب')}
        </button>
      </div>
    );
  }

  const validatePhone = (phone: string) => {
    // Basic Moroccan phone validation: starts with 05, 06, or 07 and is exactly 10 digits
    const phoneRegex = /^(05|06|07)\d{8}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      setPhoneError(t(
        'Numéro invalide. Doit contenir 10 chiffres et commencer par 05, 06 ou 07.',
        'Invalid number. Must be 10 digits and start with 05, 06 or 07.',
        'رقم الهاتف غير صالح. يجب أن يتكون من 10 أرقام ويبدأ بـ 05، 06، أو 07'
      ));
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validatePayzoneCard = (): boolean => {
    const errors: typeof payzoneErrors = {};
    const digits = payzoneCard.cardNumber.replace(/\s/g, '');

    if (digits.length < 13 || digits.length > 19) {
      errors.cardNumber = t('Numéro de carte invalide.', 'Invalid card number.', 'رقم البطاقة غير صالح.');
    }

    const expiryMatch = payzoneCard.expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!expiryMatch) {
      errors.expiry = t('Format invalide (MM/AA).', 'Invalid format (MM/YY).', 'صيغة غير صالحة (MM/YY).');
    } else {
      const month = parseInt(expiryMatch[1], 10);
      if (month < 1 || month > 12) {
        errors.expiry = t('Mois invalide.', 'Invalid month.', 'شهر غير صالح.');
      }
    }

    if (!/^\d{3,4}$/.test(payzoneCard.cvc)) {
      errors.cvc = t('CVC invalide.', 'Invalid CVC.', 'رمز CVC غير صالح.');
    }

    setPayzoneErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (!validatePhone(formData.phone)) return;
    if (!formData.name || !formData.city || !formData.address) return;

    if (paymentMethod === 'payzone' && !validatePayzoneCard()) return;

    // Real card data must never be sent to your own backend/database as-is -
    // Payzone and Stripe both require tokenizing the card client-side (their
    // own hosted fields / Elements) and only ever forwarding the resulting
    // token. The fields below are collected for UI completeness; wiring them
    // to a live charge is a separate, backend-side integration step.
    const paymentDetails =
      paymentMethod === 'payzone'
        ? { method: 'payzone' as const, cardLast4: payzoneCard.cardNumber.replace(/\s/g, '').slice(-4) }
        : paymentMethod === 'stripe'
        ? { method: 'stripe' as const }
        : { method: 'cod' as const };

    onSubmit(product, quantity, {
      ...formData,
      color: selectedColor,
      size: selectedSize,
      payment: paymentDetails,
    });
  };

  const paymentOptions: { id: PaymentMethod; icon: typeof Banknote; label: string; sublabel: string }[] = [
    {
      id: 'cod',
      icon: Banknote,
      label: t('Paiement à la livraison', 'Cash on Delivery', 'الدفع عند الاستلام'),
      sublabel: t('Marché local, sans complication', 'Local market, no hassle', 'للسوق المحلي بدون تعقيد'),
    },
    {
      id: 'payzone',
      icon: CreditCard,
      label: t('Carte bancaire (Payzone)', 'Bank Card (Payzone)', 'بطاقة بنكية (Payzone)'),
      sublabel: t('Cartes bancaires marocaines', 'Moroccan bank cards', 'البطاقات البنكية المغربية'),
    },
    {
      id: 'stripe',
      icon: Globe,
      label: t('Paiement international', 'International Payment', 'الدفع العالمي'),
      sublabel: t('Stripe - devises étrangères', 'Stripe - foreign currencies', 'Stripe - بالعملة الصعبة'),
    },
  ];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Payment Method Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2">{t('Méthode de paiement *', 'Payment Method *', 'طريقة الدفع *')}</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" dir="ltr">
            {paymentOptions.map((option) => {
              const Icon = option.icon;
              const isActive = paymentMethod === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPaymentMethod(option.id)}
                  className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div dir={storeIsAr ? 'rtl' : 'ltr'} className={storeIsAr ? 'text-right w-full' : 'text-left w-full'}>
                    <p className={`text-xs font-black ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>{option.label}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{option.sublabel}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Delivery Information (required for every payment method) */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">{t('Nom Complet *', 'Full Name *', 'الاسم الكامل *')}</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('Ex: Mohammed Alaoui', 'Ex: Mohammed Alaoui', 'الاسم الكامل')}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">{t('Numéro de Téléphone *', 'Phone Number *', 'رقم الهاتف *')}</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (phoneError) setPhoneError('');
              }}
              placeholder="06 12 34 56 78"
              className={`w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none transition-all ${phoneError ? 'border-rose-500 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
            />
            {phoneError && <p className={`text-rose-500 text-xs font-bold mt-1.5 flex items-center gap-1 ${storeIsAr ? 'flex-row-reverse text-right' : ''}`}><AlertCircle className="w-3 h-3" /> {phoneError}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">{t('Ville *', 'City *', 'المدينة *')}</label>
            <input
              type="text"
              required
              list="cities-list"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder={t('Sélectionnez ou tapez votre ville', 'Select or type your city', 'اختر أو اكتب مدينتك')}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <datalist id="cities-list">
              {moroccanCities.map((city, idx) => (
                <option key={idx} value={city} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">{t('Adresse de Livraison *', 'Delivery Address *', 'عنوان التوصيل *')}</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={t('Adresse complète (Quartier, Rue...)', 'Full address (Neighborhood, Street...)', 'عنوان التوصيل بالتفصيل')}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        {/* Payzone: Moroccan Bank Card Fields */}
        {paymentMethod === 'payzone' && (
          <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-700">{t('Détails de la carte', 'Card Details', 'تفاصيل البطاقة')}</h4>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">{t('Numéro de carte *', 'Card Number *', 'رقم البطاقة *')}</label>
              <input
                type="text"
                inputMode="numeric"
                required
                dir="ltr"
                value={payzoneCard.cardNumber}
                onChange={(e) => {
                  setPayzoneCard({ ...payzoneCard, cardNumber: formatCardNumber(e.target.value) });
                  if (payzoneErrors.cardNumber) setPayzoneErrors({ ...payzoneErrors, cardNumber: undefined });
                }}
                placeholder="1234 5678 9012 3456"
                className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-mono tracking-wider focus:outline-none transition-all ${payzoneErrors.cardNumber ? 'border-rose-500 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
              />
              {payzoneErrors.cardNumber && <p className="text-rose-500 text-xs font-bold mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {payzoneErrors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">{t("Date d'expiration *", 'Expiry Date *', 'تاريخ الانتهاء *')}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  dir="ltr"
                  value={payzoneCard.expiry}
                  onChange={(e) => {
                    setPayzoneCard({ ...payzoneCard, expiry: formatExpiry(e.target.value) });
                    if (payzoneErrors.expiry) setPayzoneErrors({ ...payzoneErrors, expiry: undefined });
                  }}
                  placeholder="MM/YY"
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-mono focus:outline-none transition-all ${payzoneErrors.expiry ? 'border-rose-500 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
                />
                {payzoneErrors.expiry && <p className="text-rose-500 text-xs font-bold mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {payzoneErrors.expiry}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">CVC *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  dir="ltr"
                  maxLength={4}
                  value={payzoneCard.cvc}
                  onChange={(e) => {
                    setPayzoneCard({ ...payzoneCard, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) });
                    if (payzoneErrors.cvc) setPayzoneErrors({ ...payzoneErrors, cvc: undefined });
                  }}
                  placeholder="123"
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-sm font-mono focus:outline-none transition-all ${payzoneErrors.cvc ? 'border-rose-500 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
                />
                {payzoneErrors.cvc && <p className="text-rose-500 text-xs font-bold mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {payzoneErrors.cvc}</p>}
              </div>
            </div>

            <p className={`text-[10px] font-bold text-slate-400 flex items-center gap-1.5 ${storeIsAr ? 'flex-row-reverse text-right' : ''}`}>
              <Lock className="w-3 h-3 shrink-0" />
              {t('Paiement sécurisé traité par Payzone.', 'Payment securely processed by Payzone.', 'الدفع آمن ومعالج عبر Payzone.')}
            </p>
          </div>
        )}

        {/* Stripe: International Payment Placeholder */}
        {paymentMethod === 'stripe' && (
          <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-700">{t('Paiement international', 'International Payment', 'الدفع العالمي')}</h4>
            </div>

            {/*
              Stripe Card Element placeholder.
              To go live: install @stripe/stripe-js + @stripe/react-stripe-js,
              wrap this form in <Elements stripe={stripePromise}>, and replace
              this div with <PaymentElement /> (or <CardElement />). On submit,
              call stripe.confirmPayment / stripe.createPaymentMethod instead
              of sending raw card data anywhere.
            */}
            <div className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
              <span className="text-sm text-slate-400 font-medium">
                {t('Élément de carte Stripe', 'Stripe Card Element', 'عنصر بطاقة Stripe')}
              </span>
              <div className="flex items-center gap-1.5 opacity-60">
                <div className="w-8 h-5 rounded bg-slate-200" />
                <div className="w-8 h-5 rounded bg-slate-200" />
                <div className="w-8 h-5 rounded bg-slate-200" />
              </div>
            </div>

            <p className={`text-[10px] font-bold text-slate-400 flex items-center gap-1.5 ${storeIsAr ? 'flex-row-reverse text-right' : ''}`}>
              <Lock className="w-3 h-3 shrink-0" />
              {t('Paiement international sécurisé traité par Stripe.', 'Secure international payment processed by Stripe.', 'دفع دولي آمن يعالجه Stripe.')}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={disabled || !formData.name || !formData.phone || !formData.city || !formData.address}
          className={`w-full py-4 mt-2 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <CheckCircle className="w-4 h-4" />
          {t('Confirmer la Commande', 'Confirm Order', 'تأكيد الطلب')}
        </button>
      </form>

      {/* Trust Badges */}
      <div className={`mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 ${storeIsAr ? 'text-right' : 'text-left'}`}>
        <div className={`group flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors cursor-default ${storeIsAr ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{t('Garantie', 'Guarantee', 'ضمان الجودة')}</h5>
            <p className="text-[9px] font-bold text-slate-500 mt-0.5">{t('Satisfaction 100% garantie', '100% satisfaction guaranteed', 'رضاكم مضمون 100%')}</p>
          </div>
        </div>

        <div className={`group flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-amber-200 transition-colors cursor-default ${storeIsAr ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Truck className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{t('Livraison Rapide', 'Fast Delivery', 'توصيل سريع')}</h5>
            <p className="text-[9px] font-bold text-slate-500 mt-0.5">{t('Expédition sous 24-48h', 'Shipped within 24-48h', 'في غضون 24-48 ساعة')}</p>
          </div>
        </div>

        <div className={`group flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-default ${storeIsAr ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Lock className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{t('Paiement Sécurisé', 'Secure Payment', 'دفع آمن')}</h5>
            <p className="text-[9px] font-bold text-slate-500 mt-0.5">{t('COD, carte locale ou internationale', 'COD, local or international card', 'الاستلام، بطاقة محلية أو عالمية')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
