import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Globe, Smartphone, ArrowRight, Loader2, Check } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useLang } from "../context/LangContext";

export default function ProjectSelection() {
  const navigate = useNavigate();
  const { lang } = useLang();
  
  const [appWaitlistJoined, setAppWaitlistJoined] = useState(
    () => localStorage.getItem("gzeed_app_waitlist") === "true",
  );
  const [isJoiningAppWaitlist, setIsJoiningAppWaitlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If they already have a project type, redirect to dashboard
    const checkExisting = async () => {
      const localType = localStorage.getItem("gzeed_project_type");
      if (localType) {
        navigate("/dashboard", { replace: true });
        return;
      }
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("user_settings")
            .select("project_type")
            .eq("user_id", user.id)
            .single();
            
          if (data && data.project_type) {
            localStorage.setItem("gzeed_project_type", data.project_type);
            navigate("/dashboard", { replace: true });
            return;
          }
        }
      } catch (err) {
        console.error("Error checking project type:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkExisting();
  }, [navigate]);

  const handleSelectProjectType = async (type: string) => {
    localStorage.setItem("gzeed_project_type", type);
    navigate("/dashboard");
    
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("user_settings").upsert(
          {
            user_id: user.id,
            project_type: type,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );
      }
    } catch (err) {
      console.error("Error saving project type to DB:", err);
    }
  };

  const handleJoinAppWaitlist = async () => {
    if (appWaitlistJoined || isJoiningAppWaitlist) return;
    setIsJoiningAppWaitlist(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("app_waitlist").insert([{ user_id: user.id, email: user.email }]);
      }
      localStorage.setItem("gzeed_app_waitlist", "true");
      setAppWaitlistJoined(true);
    } catch (err) {
      console.error("Error joining waitlist:", err);
    } finally {
      setIsJoiningAppWaitlist(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium">
          {lang === "ar" ? "جاري التحميل..." : "Loading..."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in w-full">
        <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
          {lang === "ar"
            ? "ماذا تريد أن تبني اليوم؟"
            : lang === "en"
              ? "What do you want to build today?"
              : "Que voulez-vous construire aujourd'hui ?"}
        </h3>
        <p className="text-slate-500 font-medium mb-12 max-w-lg text-lg">
          {lang === "ar"
            ? "اختر نوع مشروعك للبدء، وسنوفر لك الأدوات المناسبة."
            : lang === "en"
              ? "Choose your project type to start, we will provide the right tools."
              : "Choisissez votre type de projet pour commencer."}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-start">
          {/* E-commerce */}
          <div
            onClick={() => handleSelectProjectType("store")}
            className="bg-white rounded-[2rem] p-8 border-2 border-slate-100 hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-cyan-100 to-transparent rounded-bl-full opacity-50 transition-transform group-hover:scale-110" />
            <div className="w-14 h-14 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-3">
              {lang === "ar"
                ? "متجر إلكتروني"
                : lang === "en"
                  ? "E-commerce Store"
                  : "Boutique E-commerce"}
            </h4>
            <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed h-16">
              {lang === "ar"
                ? "منصة متكاملة لبيع منتجاتك مع سلة مشتريات ووسائل دفع."
                : lang === "en"
                  ? "Complete platform to sell your products with a cart."
                  : "Plateforme complète pour vendre vos produits avec panier."}
            </p>
            <span className="text-sm font-black text-cyan-600 flex items-center gap-2 group-hover:gap-3 transition-all bg-cyan-50 px-4 py-2.5 rounded-xl w-fit">
              {lang === "ar"
                ? "اختيار المتجر"
                : lang === "en"
                  ? "Choose Store"
                  : "Choisir la boutique"}{" "}
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          {/* Website */}
          <div
            onClick={() => handleSelectProjectType("website")}
            className="bg-white rounded-[2rem] p-8 border-2 border-slate-100 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-transparent rounded-bl-full opacity-50 transition-transform group-hover:scale-110" />
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <Globe className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-3">
              {lang === "ar"
                ? "موقع تعريفي"
                : lang === "en"
                  ? "Showcase Website"
                  : "Site Vitrine"}
            </h4>
            <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed h-16">
              {lang === "ar"
                ? "موقع احترافي لشركتك، محفظة أعمالك، أو مدونتك الشخصية."
                : lang === "en"
                  ? "Professional site for your business or portfolio."
                  : "Site professionnel pour votre entreprise ou portfolio."}
            </p>
            <span className="text-sm font-black text-indigo-600 flex items-center gap-2 group-hover:gap-3 transition-all bg-indigo-50 px-4 py-2.5 rounded-xl w-fit">
              {lang === "ar"
                ? "اختيار الموقع"
                : lang === "en"
                  ? "Choose Website"
                  : "Choisir le site"}{" "}
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          {/* App */}
          <div
            onClick={handleJoinAppWaitlist}
            className={`bg-white rounded-[2rem] p-8 border-2 transition-all relative overflow-hidden ${
              appWaitlistJoined
                ? "border-emerald-200 shadow-md shadow-emerald-500/5"
                : "border-slate-100 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 cursor-pointer group"
            }`}
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-bl-full opacity-50 transition-transform group-hover:scale-110" />
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <Smartphone className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-3">
              {lang === "ar"
                ? "تطبيق هاتف (قريباً)"
                : lang === "en"
                  ? "Mobile App"
                  : "Application Mobile"}
            </h4>
            <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed h-16">
              {lang === "ar"
                ? "حول مشروعك إلى تطبيق احترافي لأجهزة الآيفون والأندرويد."
                : lang === "en"
                  ? "Turn your project into a professional app."
                  : "Transformez votre projet en application professionnelle."}
            </p>
            <span
              className={`text-sm font-black flex items-center gap-2 transition-all w-fit px-4 py-2.5 rounded-xl ${
                appWaitlistJoined
                  ? "text-emerald-700 bg-emerald-100"
                  : "text-emerald-600 bg-emerald-50 group-hover:gap-3"
              }`}
            >
              {isJoiningAppWaitlist ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : appWaitlistJoined ? (
                <>
                  <Check className="w-4 h-4" />{" "}
                  {lang === "ar"
                    ? "تم التسجيل في القائمة"
                    : lang === "en"
                      ? "You're on the list"
                      : "Inscrit sur la liste"}
                </>
              ) : (
                <>
                  {lang === "ar"
                    ? "اشترك في قائمة الانتظار"
                    : lang === "en"
                      ? "Join the waitlist"
                      : "S'inscrire à la liste"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
