import React, { useState, useRef } from 'react';
import { Save, Type, DollarSign, Upload, Video, Info } from 'lucide-react';
import { usePlatformSettings } from '../../contexts/PlatformSettingsContext';
import { supabase } from '../../supabase';

export default function SuperAdminCMS() {
  const { settings, updateSettings } = usePlatformSettings();
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-bg-${Date.now()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { data, error } = await supabase.storage.from('media').upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath);
      
      setFormData({ ...formData, heroVideoUrl: publicUrlData.publicUrl });
      alert("تم رفع الفيديو بنجاح للـ السيرفر!");
    } catch (err: any) {
      console.error('Error uploading video:', err);
      alert('وقع خطأ فرفع الفيديو! تأكد أنك قاديتي مساحة تخزين اسمها (media) فـ Supabase وأنها (Public).');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    updateSettings(formData);
    setTimeout(() => {
      setIsSaving(false);
      alert('تم حفظ التعديلات بنجاح! التغييرات تظهر الآن مباشرة في الموقع.');
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl pb-20">
      <div>
        <h1 className="text-2xl font-black text-slate-900">إدارة محتوى المنصة (CMS)</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">تعديل نصوص وأسعار الموقع بدون الحاجة للمبرمج</p>
      </div>

      {/* Hero Section Edit */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <Type className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-slate-800">النصوص الرئيسية (الصفحة الأولى)</h2>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">فيديو الخلفية (Video Background)</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                name="heroVideoUrl"
                value={formData.heroVideoUrl}
                onChange={handleChange}
                placeholder="رابط الفيديو (مثال: https://.../video.mp4)"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium text-slate-900"
                dir="ltr"
              />
              <input 
                type="file" 
                accept="video/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    رفع فيديو جديد
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <Video className="w-3 h-3" /> يمكنك إما وضع رابط مباشر للفيديو، أو رفعه مباشرة من حاسوبك. (فيديو بحجم أقل من 10MB مفضل لتسريع الموقع).
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">العنوان الرئيسي (عربي)</label>
              <input 
                type="text" 
                name="heroTitleAr"
                value={formData.heroTitleAr}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">العنوان الرئيسي (فرنسي)</label>
              <input 
                type="text" 
                name="heroTitleFr"
                value={formData.heroTitleFr}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium text-slate-900"
                dir="ltr"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">النص الفرعي (عربي)</label>
              <textarea 
                name="heroSubtitleAr"
                value={formData.heroSubtitleAr}
                onChange={(e) => setFormData({ ...formData, heroSubtitleAr: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium text-slate-900 h-24 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">النص الفرعي (فرنسي)</label>
              <textarea 
                name="heroSubtitleFr"
                value={formData.heroSubtitleFr}
                onChange={(e) => setFormData({ ...formData, heroSubtitleFr: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium text-slate-900 h-24 resize-none"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Edit */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-emerald-500" />
          <h2 className="font-bold text-slate-800">أسعار الباقات (MAD)</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">باقة LITE</label>
            <input 
              type="number" 
              name="litePrice"
              value={formData.litePrice}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-black text-xl text-slate-900 text-center"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">باقة PRO</label>
            <input 
              type="number" 
              name="proPrice"
              value={formData.proPrice}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-black text-xl text-slate-900 text-center"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">باقة AGENCY</label>
            <input 
              type="number" 
              name="agencyPrice"
              value={formData.agencyPrice}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-black text-xl text-slate-900 text-center"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* Sections Visibility */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <Type className="w-5 h-5 text-purple-500" />
          <h2 className="font-bold text-slate-800">إظهار وإخفاء الأقسام (Sections)</h2>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">قسم المميزات (Features)</h3>
            <p className="text-sm text-slate-500 mt-1">عرض أو إخفاء قسم "لماذا تختار منصتنا"</p>
          </div>
          <button 
            onClick={() => setFormData({ ...formData, showFeatures: !formData.showFeatures })}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${formData.showFeatures ? 'bg-cyan-500' : 'bg-slate-300'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.showFeatures ? '-translate-x-8' : '-translate-x-1'}`} />
          </button>
        </div>
        
        <div className="p-6 border-t border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">قسم الفيديو التعريفي (دراسة الحالة)</h3>
            <p className="text-sm text-slate-500 mt-1">عرض أو إخفاء الفيديو الترويجي (كيف تحول مصنع تقليدي...)</p>
          </div>
          <button 
            onClick={() => setFormData({ ...formData, showIntroVideo: !formData.showIntroVideo })}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${formData.showIntroVideo ? 'bg-cyan-500' : 'bg-slate-300'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.showIntroVideo ? '-translate-x-8' : '-translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4 sticky bottom-8">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-10 rounded-xl shadow-[0_10px_30px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
          حفظ التغييرات ونشرها
        </button>
      </div>

    </div>
  );
}
