import React, { useEffect, useState } from "react";
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
  Palette,
  ArrowRight,
  LogOut,
  User,
  Check,
  ExternalLink,
  X,
  ArrowLeft,
  UploadCloud,
  Package,
  DownloadCloud,
  Loader2,
  CreditCard,
  ShieldCheck,
  Banknote,
  CheckCircle,
  Tags,
  Briefcase,
} from "lucide-react";
import { useLang } from "../contexts/LangContext";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import { saveRecord } from "../types";
import StoreAnalytics from "./StoreAnalytics";
import CustomersManager from "../components/dashboard/CustomersManager";
import CategoriesManager from "../components/dashboard/CategoriesManager";
import TeamManager from "../components/dashboard/TeamManager";

export default function GZeedDashboard() {
  const { isAr, toggle, lang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    if (location.state && location.state.tab) {
      return location.state.tab;
    }
    const sn = localStorage.getItem("gzeed_store_name");
    const dn = localStorage.getItem("gzeed_domain_name");
    const isSetup =
      sn && dn && sn !== "متجر الأناقة" && dn !== "store-123.gzeed.com";
    return isSetup ? "home" : "settings";
  });

  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
      // Clear state to prevent getting stuck if user navigates away and back naturally
      window.history.replaceState({}, document.title)
    }
  }, [location.state]);

  const [themeFilter, setThemeFilter] = useState("all");
  const [activeThemeId, setActiveThemeId] = useState<string | null>(
    () => localStorage.getItem("gzeed_active_theme") || null,
  );
  const [isDomainEditing, setIsDomainEditing] = useState(false);
  const [domainTab, setDomainTab] = useState("subdomain");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // For development, we bypass the login redirect
        setUserEmail("demo@gzeed.com");
        return;
      }
      setUserEmail(session.user.email || "");
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Basic Info States
  const [isBasicInfoEditing, setIsBasicInfoEditing] = useState(false);
  const [storeName, setStoreName] = useState(() => {
    const saved = localStorage.getItem("gzeed_store_name");
    return saved && saved !== "متجر الأناقة" ? saved : "";
  });
  const [storeDescription, setStoreDescription] = useState("");

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState(() => {
    const saved = localStorage.getItem("gzeed_payment_settings");
    return saved
      ? JSON.parse(saved)
      : {
          codEnabled: true,
          onlineEnabled: false,
          isStoreActive: false,
          stripePublicKey: "",
          stripeSecretKey: "",
          paypalEnabled: false,
          paypalEmail: "",
          paypalClientId: "",
        };
  });

  // Domain States
  const [domainName, setDomainName] = useState(() => {
    const saved = localStorage.getItem("gzeed_domain_name");
    return saved && saved !== "store-123.gzeed.com" ? saved : "";
  });
  const [subdomainInput, setSubdomainInput] = useState("");

  const isStoreSetup = Boolean(storeName && domainName);
  const [customDomainInput, setCustomDomainInput] = useState("");
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);

  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Task Progress State
  const tasksCompleted = {
    name: Boolean(
      storeName && storeName.trim() !== "" && storeName !== "متجر الأناقة",
    ),
    domain: Boolean(
      domainName &&
      domainName.trim() !== "" &&
      domainName !== "store-123.gzeed.com",
    ),
    theme: Boolean(activeThemeId),
    product: storeProducts.length > 0,
  };

  // Single source of truth for "what's already saved for this store" - always
  // reads fresh from Supabase. Previously several save paths read a stale
  // localStorage snapshot instead, which silently overwrote/erased whatever
  // another save (e.g. a new product) had just written to the server.
  const loadCurrentStoreConfig = React.useCallback(async (): Promise<any> => {
    let { data } = await supabase
      .from("stores")
      .select("config_json")
      .eq("domain", domainName)
      .maybeSingle();
    if (!data) {
      const fallback = await supabase
        .from("stores")
        .select("config_json")
        .eq("domain", "latest_saved_store")
        .maybeSingle();
      data = fallback.data;
    }
    return data?.config_json || {};
  }, [domainName]);

  const fetchStoreProducts = React.useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const config = await loadCurrentStoreConfig();
      setStoreProducts(config.storeProducts || []);
      if (config.paymentSettings) {
        setPaymentSettings(config.paymentSettings);
        localStorage.setItem(
          "gzeed_payment_settings",
          JSON.stringify(config.paymentSettings),
        );
      }
    } catch (e) {
      setStoreProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [loadCurrentStoreConfig]);

  React.useEffect(() => {
    fetchStoreProducts();
  }, [fetchStoreProducts]);

  const [productType, setProductType] = useState("physical");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    stock: "",
  });
  const [productImages, setProductImages] = useState<string[]>([]);
  const [productSizes, setProductSizes] = useState<string[]>([]);
  const [productColors, setProductColors] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const productFileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [projectType, setProjectType] = useState<string | null>(
    () => localStorage.getItem("gzeed_project_type") || null,
  );
  const [isLoadingProject, setIsLoadingProject] = useState(true);

  React.useEffect(() => {
    const fetchProjectType = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("user_settings")
            .select("project_type")
            .eq("user_id", user.id)
            .single();

          if (data && data.project_type) {
            setProjectType(data.project_type);
            localStorage.setItem("gzeed_project_type", data.project_type);
          }
        }
      } catch (err) {
        console.error("Error fetching project type:", err);
      } finally {
        setIsLoadingProject(false);
      }
    };
    fetchProjectType();
  }, []);

  const handleSelectProjectType = async (type: string) => {
    setProjectType(type);
    localStorage.setItem("gzeed_project_type", type);

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

  const [appWaitlistJoined, setAppWaitlistJoined] = useState(
    () => localStorage.getItem("gzeed_app_waitlist") === "true",
  );
  const [isJoiningAppWaitlist, setIsJoiningAppWaitlist] = useState(false);

  const handleJoinAppWaitlist = async () => {
    if (appWaitlistJoined || isJoiningAppWaitlist) return;
    setIsJoiningAppWaitlist(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await saveRecord(
        "leads",
        {
          id: `lead-${Date.now()}`,
          name: user?.email || storeName,
          email: user?.email || "",
          type: "GZeed Mobile App Waitlist",
          status: "new",
          date: new Date().toISOString(),
        },
        true,
      );
      localStorage.setItem("gzeed_app_waitlist", "true");
      setAppWaitlistJoined(true);
    } catch (err) {
      console.error("Error joining app waitlist:", err);
    } finally {
      setIsJoiningAppWaitlist(false);
    }
  };

  React.useEffect(() => {
    if (activeThemeId)
      localStorage.setItem("gzeed_active_theme", activeThemeId);
    localStorage.setItem("gzeed_store_name", storeName);
    localStorage.setItem("gzeed_domain_name", domainName);
    localStorage.setItem("gzeed_tasks", JSON.stringify(tasksCompleted));
  }, [activeThemeId, storeName, domainName, tasksCompleted]);

  // The "Add a product" step only makes sense for an e-commerce store, not a showcase website
  const totalTasks = projectType === "website" ? 3 : 4;
  const completedCount = Object.entries(tasksCompleted).filter(
    ([key, done]) => done && (key !== "product" || projectType !== "website"),
  ).length;
  const progressOffset = 377 - 377 * (completedCount / totalTasks);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getThemePreviewUrl = (id: string | null) => {
    if (!id) return "#/demo/ecommerce/abaya";
    if (id === "dentist") return "#/demo/dentist";
    if (id === "omra") return "#/demo/omra-tours";
    if (id === "digital") return "#/demo/ecommerce/iptv";
    if (id === "perfume") return "#/demo/ecommerce/luxury-perfume";
    if (id === "abaya") return "#/demo/ecommerce/abaya";
    if (id === "minimalist") return "#/demo/ecommerce/minimalist";
    return `#/demo/ecommerce/${id}`;
  };

  // Real live storefront for this store (same Layout renderer used by the theme editor), not the generic theme demo gallery
  const getLiveStoreUrl = () => {
    if (domainName && domainName.toLowerCase().endsWith(".gzeed.com")) {
      const slug = domainName.replace(/\.gzeed\.com$/i, "");
      return `#/store/${slug}`;
    }
    return `https://${domainName}`;
  };

  const showToastAndNavigate = (msg: string, nextTab: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
    setActiveTab(nextTab);
  };

  const handleSaveSubdomain = async () => {
    if (!subdomainInput.trim()) return;
    const input = subdomainInput.trim().toLowerCase();

    if (input.length < 3) {
      setDomainError(
        lang === "ar"
          ? "الاسم قصير جداً (أقل من 3 أحرف)"
          : lang === "en"
            ? "Name too short"
            : "Nom trop court",
      );
      return;
    }

    const reserved = ["shop", "store", "admin", "gzeed", "app", "www"];
    const newDomain = `${input}.gzeed.com`;

    setIsVerifyingDomain(true);
    setDomainError(null);

    try {
      if (reserved.includes(input)) {
        setDomainError(
          lang === "ar"
            ? "هذا الاسم محجوز، يرجى اختيار اسم مختلف."
            : lang === "en"
              ? "This name is reserved, please choose another."
              : "Ce nom est réservé, veuillez en choisir un autre.",
        );
        setIsVerifyingDomain(false);
        return;
      }

      // Check real availability against the stores table (the same table StoreBuilder
      // reads from for live-store domain resolution).
      const { data: existing } = await supabase
        .from("stores")
        .select("domain")
        .eq("domain", newDomain)
        .maybeSingle();

      if (existing) {
        setDomainError(
          lang === "ar"
            ? "هذا النطاق مستخدم مسبقاً من متجر آخر، يرجى اختيار اسم مختلف."
            : lang === "en"
              ? "This domain is already taken, please choose another."
              : "Ce domaine est déjà pris, veuillez en choisir un autre.",
        );
        setIsVerifyingDomain(false);
        return;
      }

      // Load whatever config this browser's store already has (if any) so we don't
      // clobber products/theme saved by StoreBuilder under the previous domain/slug.
      const existingConfig = await loadCurrentStoreConfig();
      const storeConfig = { ...existingConfig, storeName, storeSlug: input };

      await supabase.from("stores").upsert(
        {
          domain: newDomain,
          config_json: storeConfig,
          name: storeName,
          updated_at: new Date(),
        },
        { onConflict: "domain" },
      );

      // Keep the 'latest_saved_store' fallback in sync so local/dev preview still works.
      await supabase.from("stores").upsert(
        {
          domain: "latest_saved_store",
          config_json: storeConfig,
          name: storeName,
          updated_at: new Date(),
        },
        { onConflict: "domain" },
      );

      localStorage.setItem("beya_store_config", JSON.stringify(storeConfig));

      setDomainName(newDomain);
      setIsDomainEditing(false);
      setIsVerifyingDomain(false);
      showToastAndNavigate(
        lang === "ar"
          ? "تم إنشاء وحجز النطاق بنجاح! 🎉"
          : lang === "en"
            ? "Domain created successfully! 🎉"
            : "Domaine créé avec succès ! 🎉",
        "themes",
      );
    } catch (err) {
      setDomainError(
        lang === "ar"
          ? "حدث خطأ، حاول مرة أخرى."
          : lang === "en"
            ? "Something went wrong, please try again."
            : "Une erreur est survenue, veuillez réessayer.",
      );
      setIsVerifyingDomain(false);
    }
  };

  // Reads/writes a File as a resized base64 JPEG so previews and Supabase storage
  // both stay small (mirrors the image-compression pattern used elsewhere in the app).
  const readImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX = 1000;
          let w = img.width,
            h = img.height;
          if (w > h && w > MAX) {
            h = (h * MAX) / w;
            w = MAX;
          } else if (h > MAX) {
            w = (w * MAX) / h;
            h = MAX;
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL("image/jpeg", 0.75));
          } else {
            resolve(ev.target?.result as string);
          }
        };
        img.onerror = reject;
        img.src = ev.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const addProductImages = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (imageFiles.length === 0) return;
    const encoded = await Promise.all(imageFiles.map(readImageFile));
    setProductImages((prev) => [...prev, ...encoded]);
  };

  const removeProductImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = (kind: "size" | "color") => {
    const raw = kind === "size" ? sizeInput : colorInput;
    const value = raw.trim();
    if (!value) return;
    if (kind === "size") {
      setProductSizes((prev) =>
        prev.includes(value) ? prev : [...prev, value],
      );
      setSizeInput("");
    } else {
      setProductColors((prev) =>
        prev.includes(value) ? prev : [...prev, value],
      );
      setColorInput("");
    }
  };

  const removeTag = (kind: "size" | "color", value: string) => {
    if (kind === "size")
      setProductSizes((prev) => prev.filter((s) => s !== value));
    else setProductColors((prev) => prev.filter((c) => c !== value));
  };

  const resetProductForm = () => {
    setNewProduct({
      name: "",
      description: "",
      price: "",
      comparePrice: "",
      stock: "",
    });
    setProductImages([]);
    setProductSizes([]);
    setProductColors([]);
    setSizeInput("");
    setColorInput("");
    setProductType("physical");
  };

  const handleSaveProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price) {
      setToastMessage(
        lang === "ar"
          ? "خاصك تعمر اسم المنتج والسعر على الأقل."
          : lang === "en"
            ? "Product name and price are required."
            : "Le nom et le prix du produit sont requis.",
      );
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setIsSavingProduct(true);
    try {
      const domain = domainName || "latest_saved_store";

      // Load whatever config already exists for this store so we append to its
      // product list instead of clobbering theme/domain settings saved elsewhere.
      const existingConfig = await loadCurrentStoreConfig();

      const product = {
        id: `prod-${Date.now()}`,
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: Number(newProduct.price) || 0,
        comparePrice: newProduct.comparePrice
          ? Number(newProduct.comparePrice)
          : undefined,
        stock: newProduct.stock ? Number(newProduct.stock) : 0,
        type: productType,
        sizes: productSizes,
        colors: productColors,
        image: productImages[0] || "",
        images: productImages,
        category: "General",
      };

      const storeConfig = {
        ...existingConfig,
        storeName,
        storeProducts: [...(existingConfig.storeProducts || []), product],
      };

      await supabase.from("stores").upsert(
        {
          domain,
          config_json: storeConfig,
          name: storeName,
          updated_at: new Date(),
        },
        { onConflict: "domain" },
      );

      // Keep the local-preview fallback in sync too.
      await supabase.from("stores").upsert(
        {
          domain: "latest_saved_store",
          config_json: storeConfig,
          name: storeName,
          updated_at: new Date(),
        },
        { onConflict: "domain" },
      );

      localStorage.setItem("beya_store_config", JSON.stringify(storeConfig));

      resetProductForm();
      setActiveTab("products");
      await fetchStoreProducts();
      showToastAndNavigate(
        lang === "ar"
          ? "تم إضافة المنتج بنجاح!"
          : lang === "en"
            ? "Product added successfully!"
            : "Produit ajouté avec succès !",
        "products",
      );
    } catch (err) {
      setToastMessage(
        lang === "ar"
          ? "حدث خطأ أثناء الحفظ، حاول مرة أخرى."
          : lang === "en"
            ? "Something went wrong, please try again."
            : "Une erreur est survenue, veuillez réessayer.",
      );
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleUpdatePaymentSetting = async (
    key: keyof typeof paymentSettings,
    value: string | boolean,
  ) => {
    const newSettings = { ...paymentSettings, [key]: value };
    setPaymentSettings(newSettings);
    localStorage.setItem("gzeed_payment_settings", JSON.stringify(newSettings));

    try {
      const existingConfig = await loadCurrentStoreConfig();
      const storeConfig = { ...existingConfig, paymentSettings: newSettings };
      await supabase.from("stores").upsert(
        {
          domain: domainName || "latest_saved_store",
          config_json: storeConfig,
          name: storeName,
          updated_at: new Date(),
        },
        { onConflict: "domain" },
      );
      await supabase.from("stores").upsert(
        {
          domain: "latest_saved_store",
          config_json: storeConfig,
          name: storeName,
          updated_at: new Date(),
        },
        { onConflict: "domain" },
      );
      localStorage.setItem("beya_store_config", JSON.stringify(storeConfig));
    } catch (err) {
      console.error("Error saving payment settings", err);
    }
  };

  const navItems = [
    {
      id: "home",
      icon: Home,
      labelAr: "الرئيسية",
      labelFr: "Accueil",
      labelEn: "Home",
    },
    {
      id: "orders",
      icon: ShoppingBag,
      labelAr: "الطلبات",
      labelFr: "Commandes",
      labelEn: "Orders",
    },
    {
      id: "products",
      icon: Box,
      labelAr: "المنتجات",
      labelFr: "Produits",
      labelEn: "Products",
    },
    {
      id: "categories",
      icon: Tags,
      labelAr: "التصنيفات",
      labelFr: "Catégories",
      labelEn: "Categories",
    },
    {
      id: "customers",
      icon: Users,
      labelAr: "العملاء",
      labelFr: "Clients",
      labelEn: "Customers",
    },
    {
      id: "team",
      icon: Briefcase,
      labelAr: "فريق العمل",
      labelFr: "Équipe",
      labelEn: "Team / Staff",
    },
    {
      id: "analytics",
      icon: BarChart3,
      labelAr: "التحليلات",
      labelFr: "Analytique",
      labelEn: "Analytics",
    },
    { divider: true },
    {
      id: "themes",
      icon: LayoutTemplate,
      labelAr: "القوالب والتصميم",
      labelFr: "Thèmes & Design",
      labelEn: "Themes & Design",
    },
    {
      id: "builder",
      icon: Palette,
      labelAr: "تعديل الواجهة",
      labelFr: "Éditeur Visuel",
      labelEn: "Visual Editor",
    },
    { divider: true },
    {
      id: "settings",
      icon: Settings,
      labelAr: "الإعدادات",
      labelFr: "Paramètres",
      labelEn: "Settings",
    },
  ];

  if (isLoadingProject) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-cyan-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium">
          {lang === "ar" ? "جاري التحميل..." : "Loading..."}
        </p>
      </div>
    );
  }

  if (!projectType) {
    return <Navigate to="/project-selection" replace />;
  }

  return (
    <div
      className="min-h-screen bg-slate-50 flex"
      dir={lang === "ar" ? "rtl" : lang === "en" ? "ltr" : "ltr"}
    >
      {/* Sidebar - Apple Style Minimalist */}
      <aside
        className="w-64 bg-[#F5F5F7] text-slate-900 flex flex-col hidden md:flex transition-all duration-300 relative border-r border-slate-200"
        dir={lang === "ar" ? "rtl" : lang === "en" ? "ltr" : "ltr"}
      >
        {/* Logo Area */}
        <div
          className="h-16 flex items-center px-6 border-b border-slate-200 bg-[#F5F5F7]/80 backdrop-blur-xl sticky top-0 z-10 cursor-pointer"
          onClick={() => navigate("/welcome")}
        >
          <div className="flex items-center gap-2" dir="ltr">
            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md">
              GZ
            </div>
            <span className="font-black text-slate-900 tracking-tight text-xl">
              GZeed
            </span>
          </div>
        </div>

        {/* Store Selector */}
        <div className="p-4 border-b border-slate-200">
          <div
            onClick={() =>
              isStoreSetup
                ? window.open(getLiveStoreUrl(), "_blank")
                : setActiveTab("settings")
            }
            className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-cyan-300 transition-all group/storebox"
          >
            <div className="flex flex-col overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">
                {lang === "ar"
                  ? "متجرك الحالي"
                  : lang === "en"
                    ? "Current Store"
                    : "Boutique actuelle"}
              </span>
              <span className="text-sm font-black text-slate-900 leading-tight truncate">
                {isStoreSetup
                  ? storeName
                  : lang === "ar"
                    ? "قم بإعداد متجرك أولاً"
                    : "Setup your store first"}
              </span>
              {isStoreSetup && (
                <a
                  href={getLiveStoreUrl()}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 mt-1 flex items-center gap-1 group/link w-max truncate"
                >
                  {domainName}
                  <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform shrink-0" />
                </a>
              )}
            </div>
            <ChevronRight
              className={`w-5 h-5 text-slate-300 group-hover/storebox:text-cyan-500 transition-colors shrink-0 ${isAr ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <nav className="px-3 space-y-1">
            {navItems.map((item, idx) => {
              if (item.divider) {
                return (
                  <div
                    key={`div-${idx}`}
                    className="h-px bg-slate-200 my-4 mx-4"
                  />
                );
              }
              const Icon = item.icon as React.ElementType;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "builder") {
                      navigate("/gzeed-builder");
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                        : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-black" : "text-slate-400 group-hover:text-slate-600 transition-colors"}`}
                  />
                  {lang === "ar"
                    ? item.labelAr
                    : lang === "en"
                      ? item.labelEn
                      : item.labelFr}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Upgrade Card - Minimalist */}
        <div className="p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm relative overflow-hidden">
            <h4 className="font-black text-sm mb-1">
              {lang === "ar"
                ? "خطتك الحالية: مجانية"
                : lang === "en"
                  ? "Current Plan: Free"
                  : "Plan actuel: Gratuit"}
            </h4>
            <p className="text-xs font-medium text-slate-500 mb-4 leading-relaxed">
              {lang === "ar"
                ? "قم بالترقية للحصول على نطاق مخصص (gzeed.com)."
                : lang === "en"
                  ? "Upgrade to get a custom domain."
                  : "Passez au niveau supérieur pour un domaine personnalisé."}
            </p>
            <button className="w-full py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md">
              {lang === "ar"
                ? "ترقية الآن"
                : lang === "en"
                  ? "Upgrade"
                  : "Mettre à niveau"}
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
                placeholder={
                  lang === "ar"
                    ? "ابحث عن منتجات، طلبات، أو إعدادات..."
                    : lang === "en"
                      ? "Search products, orders..."
                      : "Rechercher des produits, commandes..."
                }
                className="w-full bg-slate-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                dir={lang === "ar" ? "rtl" : lang === "en" ? "ltr" : "ltr"}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 pl-4 relative">
            <button
              onClick={toggle}
              className="p-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{lang}</span>
            </button>
            <div
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm cursor-pointer hover:bg-slate-200 transition-colors"
            >
              <User className="w-5 h-5" />
            </div>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute top-12 left-0 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2 animate-fade-in z-50">
                <div className="px-4 py-3 border-b border-slate-100 mb-2">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {userEmail || (lang === "ar" ? "حسابي" : "Mon compte")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setActiveTab("settings");
                  }}
                  className="w-full text-start px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  {lang === "ar"
                    ? "الإعدادات"
                    : lang === "en"
                      ? "Settings"
                      : "Paramètres"}
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="w-full text-start px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {lang === "ar"
                    ? "تسجيل الخروج"
                    : lang === "en"
                      ? "Logout"
                      : "Déconnexion"}
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          {activeTab === "home" && (
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
              {/* Greeting */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 mb-1 flex items-center gap-3">
                    {lang === "ar"
                      ? "مرحباً بك في GZeed 👋"
                      : lang === "en"
                        ? "Welcome to GZeed 👋"
                        : "Bienvenue sur GZeed 👋"}
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${projectType === "store" ? "bg-cyan-100 text-cyan-700" : "bg-indigo-100 text-indigo-700"}`}
                    >
                      {projectType === "store"
                        ? lang === "ar"
                          ? "متجر إلكتروني"
                          : "E-commerce"
                        : projectType === "website"
                          ? lang === "ar"
                            ? "موقع إلكتروني"
                            : "Website"
                          : lang === "ar"
                            ? "تطبيق هاتف"
                            : "App"}
                    </span>
                  </h1>
                  <p className="text-slate-500 font-medium">
                    {lang === "ar"
                      ? "لنقم بإعداد مشروعك وإطلاقه للعالم."
                      : lang === "en"
                        ? "Let's set up your project for launch."
                        : "Configurons votre projet pour le lancer."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {isStoreSetup && (
                    <button
                      onClick={() => window.open(getLiveStoreUrl(), "_blank")}
                      className="flex-1 md:flex-none justify-center px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <MonitorPlay className="w-4 h-4" />
                      {lang === "ar"
                        ? "عرض الواجهة"
                        : lang === "en"
                          ? "View Site"
                          : "Voir le site"}
                    </button>
                  )}
                  {projectType === "store" && (
                    <button
                      onClick={() => setActiveTab("add-product")}
                      className="flex-1 md:flex-none justify-center px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {lang === "ar"
                        ? "إضافة منتج"
                        : lang === "en"
                          ? "Add Product"
                          : "Ajouter un produit"}
                    </button>
                  )}
                </div>
              </div>

              {/* Setup Progress */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-50 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex-1">
                    <h2 className="text-xl font-black text-slate-900 mb-2">
                      {lang === "ar"
                        ? "دليل الإعداد السريع"
                        : lang === "en"
                          ? "Quick Setup Guide"
                          : "Guide de configuration rapide"}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium mb-6">
                      {projectType === "website"
                        ? lang === "ar"
                          ? "أكمل هذه الخطوات لنشر موقعك واستقبال الزوار."
                          : lang === "en"
                            ? "Complete these steps to publish your site."
                            : "Complétez ces étapes pour publier votre site."
                        : lang === "ar"
                          ? "أكمل هذه الخطوات لبدء البيع واستقبال الزوار."
                          : lang === "en"
                            ? "Complete these steps to start selling."
                            : "Complétez ces étapes pour commencer à vendre."}
                    </p>

                    <div className="space-y-4">
                      {/* Task 1: Domain */}
                      <div
                        onClick={() => setActiveTab("settings")}
                        className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer group ${tasksCompleted.domain ? "border-emerald-100 bg-emerald-50/50" : "border-cyan-100 bg-cyan-50/50 hover:bg-cyan-50"}`}
                      >
                        {tasksCompleted.domain ? (
                          <div className="w-6 h-6 rounded-full border-2 border-emerald-500 bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-cyan-500 flex items-center justify-center shrink-0 mt-0.5 bg-white">
                            <div className="w-2 h-2 rounded-full bg-cyan-500" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors">
                            {lang === "ar"
                              ? "ربط اسم النطاق"
                              : lang === "en"
                                ? "Connect a domain"
                                : "Connecter un domaine"}
                          </h3>
                          <p className="text-sm text-slate-600 font-medium">
                            {lang === "ar"
                              ? "قم بربط نطاقك الخاص للبدء في استقبال الزوار."
                              : lang === "en"
                                ? "Connect your custom domain to start receiving visitors."
                                : "Connectez votre domaine personnalisé pour commencer à recevoir des visiteurs."}
                          </p>
                          <button className="mt-3 text-sm font-bold text-cyan-600 hover:text-cyan-700">
                            {lang === "ar"
                              ? "إضافة نطاق →"
                              : lang === "en"
                                ? "Add domain →"
                                : "Ajouter un domaine →"}
                          </button>
                        </div>
                      </div>

                      {/* Task 2: Name */}
                      <div
                        onClick={() => setActiveTab("settings")}
                        className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer group ${tasksCompleted.name ? "border-emerald-100 bg-emerald-50/50" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}
                      >
                        {tasksCompleted.name ? (
                          <div className="w-6 h-6 rounded-full border-2 border-emerald-500 bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 mt-0.5 bg-white" />
                        )}
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors">
                            {lang === "ar"
                              ? "اختر اسماً لمشروعك"
                              : lang === "en"
                                ? "Choose a name for your project"
                                : "Choisissez un nom pour votre projet"}
                          </h3>
                          <p className="text-sm text-slate-600 font-medium">
                            {projectType === "website"
                              ? lang === "ar"
                                ? "لم تقم بتسمية موقعك بعد. اختر اسماً يمثل علامتك التجارية."
                                : lang === "en"
                                  ? "You haven't named your site yet."
                                  : "Vous n'avez pas encore nommé votre site."
                              : lang === "ar"
                                ? "لم تقم بتسمية متجرك بعد. اختر اسماً يمثل علامتك التجارية."
                                : lang === "en"
                                  ? "You haven't named your store yet."
                                  : "Vous n'avez pas encore nommé votre boutique."}
                          </p>
                        </div>
                      </div>

                      {/* Task 3: Theme */}
                      <div
                        onClick={() => setActiveTab("themes")}
                        className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer group ${tasksCompleted.theme ? "border-emerald-100 bg-emerald-50/50" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}
                      >
                        {tasksCompleted.theme ? (
                          <div className="w-6 h-6 rounded-full border-2 border-emerald-500 bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 mt-0.5 bg-white" />
                        )}
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors">
                            {lang === "ar"
                              ? "تخصيص الواجهة والقوالب"
                              : lang === "en"
                                ? "Customize appearance"
                                : "Personnaliser l'apparence"}
                          </h3>
                          <p className="text-sm text-slate-600 font-medium">
                            {lang === "ar"
                              ? "اختر قالباً يناسبك وعدله بسهولة باستخدام أداة السحب والإفلات."
                              : lang === "en"
                                ? "Choose a theme and customize it easily."
                                : "Choisissez un thème et modifiez-le facilement."}
                          </p>
                        </div>
                      </div>

                      {/* Task 4: Product (e-commerce stores only) */}
                      {projectType !== "website" && (
                        <div
                          onClick={() => setActiveTab("products")}
                          className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer group ${tasksCompleted.product ? "border-emerald-100 bg-emerald-50/50" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}
                        >
                          {tasksCompleted.product ? (
                            <div className="w-6 h-6 rounded-full border-2 border-emerald-500 bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 mt-0.5 bg-white" />
                          )}
                          <div>
                            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors">
                              {lang === "ar"
                                ? "أضف أول منتج لك"
                                : lang === "en"
                                  ? "Add your first product"
                                  : "Ajoutez votre premier produit"}
                            </h3>
                            <p className="text-sm text-slate-600 font-medium">
                              {lang === "ar"
                                ? "ارفع صوراً ووصفاً لمنتجك ليراه عملاؤك."
                                : lang === "en"
                                  ? "Upload images and a description."
                                  : "Téléchargez des images et une description."}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Circle Visual */}
                  <div className="w-full md:w-64 flex flex-col justify-center items-center bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="60"
                          className="stroke-slate-200 fill-none"
                          strokeWidth="8"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="60"
                          className="stroke-cyan-500 fill-none stroke-[8px] transition-all duration-1000 ease-out"
                          strokeDasharray="377"
                          strokeDashoffset={progressOffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute text-3xl font-black text-slate-900">
                        {completedCount}
                        <span className="text-xl text-slate-400">
                          /{totalTasks}
                        </span>
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-900 text-center mb-1">
                      {lang === "ar"
                        ? "أنت في الطريق الصحيح!"
                        : lang === "en"
                          ? "You are on the right track!"
                          : "Vous êtes sur la bonne voie !"}
                    </h4>
                    <p className="text-xs font-medium text-slate-500 text-center">
                      {lang === "ar"
                        ? "أكمل الإعداد لإطلاق مشروعك"
                        : lang === "en"
                          ? "Finish setup to launch your project"
                          : "Terminez la configuration pour lancer votre projet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="max-w-5xl mx-auto animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {lang === "ar"
                      ? "الطلبات"
                      : lang === "en"
                        ? "Orders"
                        : "Commandes"}
                  </h2>
                  <p className="text-slate-500 font-medium">
                    {lang === "ar"
                      ? "إدارة وتتبع جميع طلبات متجرك."
                      : lang === "en"
                        ? "Manage and track all your orders."
                        : "Gérez et suivez toutes vos commandes."}
                  </p>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  {lang === "ar"
                    ? "لا توجد طلبات بعد"
                    : lang === "en"
                      ? "No orders yet"
                      : "Aucune commande pour le moment"}
                </h3>
                <p className="text-slate-500 font-medium mb-6 max-w-md">
                  {lang === "ar"
                    ? "عندما يقوم العملاء بالشراء من متجرك، ستظهر طلباتهم هنا."
                    : lang === "en"
                      ? "When clients buy from your store, their orders will appear here."
                      : "Lorsque les clients achèteront sur votre boutique, leurs commandes apparaîtront ici."}
                </p>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-md hover:bg-slate-800 transition-all">
                  {lang === "ar"
                    ? "كيف أزيد مبيعاتي؟"
                    : lang === "en"
                      ? "How to increase my sales?"
                      : "Comment augmenter mes ventes ?"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="max-w-5xl mx-auto animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {lang === "ar"
                      ? "المنتجات"
                      : lang === "en"
                        ? "Products"
                        : "Produits"}
                  </h2>
                  <p className="text-slate-500 font-medium">
                    {lang === "ar"
                      ? "أضف منتجاتك وابدأ البيع."
                      : lang === "en"
                        ? "Add your products and start selling."
                        : "Ajoutez vos produits et commencez à vendre."}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("add-product")}
                  className="px-5 py-2.5 bg-cyan-600 text-white rounded-xl font-bold shadow-md hover:bg-cyan-500 transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {lang === "ar"
                    ? "إضافة منتج"
                    : lang === "en"
                      ? "Add Product"
                      : "Ajouter un produit"}
                </button>
              </div>
              {isLoadingProducts ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
                  <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                </div>
              ) : storeProducts.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
                  <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mb-4 border border-cyan-100">
                    <Box className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">
                    {lang === "ar"
                      ? "أضف أول منتج لك"
                      : lang === "en"
                        ? "Add your first product"
                        : "Ajoutez votre premier produit"}
                  </h3>
                  <p className="text-slate-500 font-medium mb-6 max-w-md">
                    {lang === "ar"
                      ? "قم بإعداد منتجاتك، أسعارك، وصورك لتبدأ استقبال العملاء."
                      : lang === "en"
                        ? "Configure your products, prices, and images to get started."
                        : "Configurez vos produits, prix et images pour commencer."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {storeProducts.map((p: any) => (
                    <div
                      key={p.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Box className="w-10 h-10 text-slate-300" />
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-slate-900 truncate">
                          {p.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-black text-cyan-600">
                            {p.price} {lang === "ar" ? "درهم" : "MAD"}
                          </span>
                          {p.comparePrice ? (
                            <span className="text-xs text-slate-400 line-through">
                              {p.comparePrice}
                            </span>
                          ) : null}
                        </div>
                        {(p.sizes?.length > 0 || p.colors?.length > 0) && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(p.sizes || []).map((s: string) => (
                              <span
                                key={s}
                                className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                              >
                                {s}
                              </span>
                            ))}
                            {(p.colors || []).map((c: string) => (
                              <span
                                key={c}
                                className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-slate-400 font-medium mt-2">
                          {lang === "ar" ? "المخزون" : "Stock"}: {p.stock ?? 0}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "themes" && (
            <div className="max-w-6xl mx-auto animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {lang === "ar"
                      ? "القوالب والتصميم"
                      : lang === "en"
                        ? "Themes & Design"
                        : "Thèmes & Design"}
                  </h2>
                  <p className="text-slate-500 font-medium">
                    {lang === "ar"
                      ? "اختر القالب المناسب لنوع باقتك ومشروعك."
                      : lang === "en"
                        ? "Choose the theme that fits your plan."
                        : "Choisissez le thème adapté à votre forfait."}
                  </p>
                </div>

                {/* Theme Filters */}
                <div className="flex bg-slate-200/50 p-1 rounded-xl">
                  {[
                    {
                      id: "all",
                      label:
                        lang === "ar" ? "الكل" : lang === "en" ? "All" : "Tous",
                    },
                    {
                      id: "store",
                      label:
                        lang === "ar"
                          ? "متاجر إلكترونية"
                          : lang === "en"
                            ? "E-commerce"
                            : "E-commerce",
                    },
                    {
                      id: "website",
                      label:
                        lang === "ar"
                          ? "مواقع تعريفية"
                          : lang === "en"
                            ? "Showcase Sites"
                            : "Sites Vitrine",
                    },
                    {
                      id: "dev",
                      label:
                        lang === "ar"
                          ? "للمطورين"
                          : lang === "en"
                            ? "Developers"
                            : "Développeurs",
                    },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setThemeFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        themeFilter === filter.id
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: "emerald-market",
                    category: "store",
                    name: lang === "ar" ? "ألتيميت ستور" : lang === "en" ? "Ultimate Store (Pro)" : "Ultimate Store (Pro)",
                    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop",
                    desc: lang === "ar" ? "متجر شامل ومتكامل" : lang === "en" ? "Comprehensive store design" : "Design de boutique complet",
                  },
                  {
                    id: "atelier",
                    category: "store",
                    name: lang === "ar" ? "مطبخ أتيليي" : lang === "en" ? "Atelier Kitchen" : "Atelier Cuisine",
                    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop",
                    desc: lang === "ar" ? "مثالي للمطاعم والمقاهي" : lang === "en" ? "Perfect for restaurants" : "Parfait pour les restaurants",
                  },
                  {
                    id: "eco",
                    category: "store",
                    name: lang === "ar" ? "طبيعة إيكو" : lang === "en" ? "Eco Nature" : "Eco Nature",
                    image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=800&auto=format&fit=crop",
                    desc: lang === "ar" ? "منتجات طبيعية وعضوية" : lang === "en" ? "Natural and organic products" : "Produits naturels et bio",
                  },
                  {
                    id: "streetwear",
                    category: "store",
                    name: lang === "ar" ? "ستريت وير برو" : lang === "en" ? "Streetwear Pro" : "Streetwear Pro",
                    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop",
                    desc: lang === "ar" ? "تصميم عصري للملابس" : lang === "en" ? "Modern fashion layout" : "Layout mode moderne",
                  },
                  {
                    id: "glamour-beauty",
                    category: "store",
                    name: lang === "ar" ? "مكياج وتجميل" : lang === "en" ? "Glamour Beauty" : "Glamour Beauté",
                    image: "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=800&auto=format&fit=crop",
                    desc: lang === "ar" ? "قالب متطور لمستحضرات التجميل" : lang === "en" ? "Advanced layout for cosmetics" : "Layout avancé pour cosmétiques",
                  },
                ]
                  .filter(
                    (theme) =>
                      themeFilter === "all" || theme.category === themeFilter,
                  )
                  .map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => {
                        setActiveThemeId(theme.id);
                        localStorage.setItem("gzeed_active_theme", theme.id);
                        navigate("/gzeed-builder");
                      }}
                      className={`bg-white rounded-2xl border overflow-hidden group cursor-pointer hover:shadow-xl hover:border-cyan-300 transition-all ${activeThemeId === theme.id ? "border-2 border-emerald-500 shadow-md ring-4 ring-emerald-50" : "border-slate-200"}`}
                    >
                      <div className="h-48 bg-slate-100 relative">
                        <img
                          src={theme.image}
                          alt={theme.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=600&auto=format&fit=crop";
                          }}
                        />
                        <div className="absolute top-3 right-3 bg-slate-900/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                          {theme.category === "store"
                            ? lang === "ar"
                              ? "متجر"
                              : lang === "en"
                                ? "Store"
                                : "Store"
                            : theme.category === "website"
                              ? lang === "ar"
                                ? "موقع"
                                : lang === "en"
                                  ? "Site"
                                  : "Site"
                              : "Dev"}
                        </div>
                        {activeThemeId === theme.id && (
                          <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                            <Check className="w-3.5 h-3.5" />
                            {lang === "ar"
                              ? "مفعل"
                              : lang === "en"
                                ? "Active"
                                : "Actif"}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <button className="px-6 py-2.5 bg-cyan-500 text-white rounded-lg font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all hover:bg-cyan-400">
                            {lang === "ar"
                              ? "استخدام القالب"
                              : lang === "en"
                                ? "Use this theme"
                                : "Utiliser ce thème"}
                          </button>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-slate-900">
                          {theme.name}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                          {theme.desc}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === "builder" && (
            <div className="max-w-5xl mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-cyan-500/30">
                <Palette className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">
                {lang === "ar"
                  ? "محرر الواجهة المرئي"
                  : lang === "en"
                    ? "Visual Editor"
                    : "Éditeur Visuel"}
              </h2>
              <p className="text-slate-500 font-medium mb-8 max-w-lg mx-auto">
                {lang === "ar"
                  ? "قم بتعديل كل جزء من موقعك باستخدام أداة السحب والإفلات السهلة. لا تحتاج لأي خبرة في البرمجة!"
                  : lang === "en"
                    ? "Edit every part of your site with our drag-and-drop tool. No experience required!"
                    : "Modifiez chaque partie de votre site avec notre outil glisser-déposer. Aucune expérience requise !"}
              </p>
              <button
                onClick={() => navigate("/gzeed-builder")}
                className="px-8 py-4 bg-slate-900 text-white rounded-xl font-black text-lg shadow-xl shadow-slate-900/20 hover:scale-105 transition-all flex items-center gap-3"
              >
                <MonitorPlay className="w-6 h-6" />
                {lang === "ar"
                  ? "افتح المحرر الآن"
                  : lang === "en"
                    ? "Open the editor now"
                    : "Ouvrir l'éditeur maintenant"}
              </button>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900">
                  {lang === "ar"
                    ? "إعدادات المتجر"
                    : lang === "en"
                      ? "Store Settings"
                      : "Paramètres de la boutique"}
                </h2>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm transition-all overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    {lang === "ar"
                      ? "المعلومات الأساسية"
                      : lang === "en"
                        ? "General Information"
                        : "Informations générales"}
                  </h3>
                  {!isBasicInfoEditing && (
                    <button
                      onClick={() => setIsBasicInfoEditing(true)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      {lang === "ar"
                        ? "تعديل المعلومات"
                        : lang === "en"
                          ? "Edit Info"
                          : "Modifier les infos"}
                    </button>
                  )}
                </div>

                {!isBasicInfoEditing ? (
                  <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                        <span className="font-black text-slate-800 text-sm">
                          متجر
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-0.5">
                          {lang === "ar"
                            ? "اسم المتجر"
                            : lang === "en"
                              ? "Store Name"
                              : "Nom de la boutique"}
                        </p>
                        <p className="font-bold text-slate-900">{storeName}</p>
                      </div>
                    </div>
                    {storeDescription && (
                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-xs font-bold text-slate-500 mb-1">
                          {lang === "ar"
                            ? "وصف المتجر"
                            : lang === "en"
                              ? "Store Description"
                              : "Description de la boutique"}
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {storeDescription}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in border border-slate-200 p-5 rounded-xl bg-slate-50">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        {lang === "ar"
                          ? "اسم المتجر"
                          : lang === "en"
                            ? "Store Name"
                            : "Nom de la boutique"}
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 outline-none font-bold text-slate-900"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        dir="auto"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        {lang === "ar"
                          ? "وصف المتجر"
                          : lang === "en"
                            ? "Store Description"
                            : "Description de la boutique"}
                      </label>
                      <textarea
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 outline-none h-24 font-medium text-slate-700"
                        value={storeDescription}
                        onChange={(e) => setStoreDescription(e.target.value)}
                        placeholder={
                          lang === "ar"
                            ? "أضف وصفاً قصيراً لمتجرك..."
                            : lang === "en"
                              ? "Add a short description..."
                              : "Ajoutez une courte description..."
                        }
                        dir="auto"
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => setIsBasicInfoEditing(false)}
                        className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        {lang === "ar"
                          ? "إلغاء"
                          : lang === "en"
                            ? "Cancel"
                            : "Annuler"}
                      </button>
                      <button
                        onClick={async () => {
                          setIsBasicInfoEditing(false);
                          try {
                            const existingConfig =
                              await loadCurrentStoreConfig();
                            const storeConfig = {
                              ...existingConfig,
                              storeName,
                              storeDescription,
                            };
                            if (domainName) {
                              await supabase.from("stores").upsert(
                                {
                                  domain: domainName,
                                  config_json: storeConfig,
                                  name: storeName,
                                  updated_at: new Date(),
                                },
                                { onConflict: "domain" },
                              );
                            }
                            await supabase.from("stores").upsert(
                              {
                                domain: "latest_saved_store",
                                config_json: storeConfig,
                                name: storeName,
                                updated_at: new Date(),
                              },
                              { onConflict: "domain" },
                            );
                            localStorage.setItem(
                              "beya_store_config",
                              JSON.stringify(storeConfig),
                            );
                          } catch (err) {
                            console.error("Error saving store info:", err);
                          }
                          showToastAndNavigate(
                            lang === "ar"
                              ? "تم حفظ المعلومات بنجاح!"
                              : lang === "en"
                                ? "Information saved!"
                                : "Informations enregistrées !",
                            "settings",
                          );
                        }}
                        className="px-6 py-2 bg-cyan-600 text-white text-sm font-bold rounded-lg hover:bg-cyan-500 transition-colors flex items-center justify-center gap-2"
                      >
                        {lang === "ar"
                          ? "حفظ التغييرات"
                          : lang === "en"
                            ? "Save"
                            : "Enregistrer"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    {lang === "ar"
                      ? "النطاق (Domain)"
                      : lang === "en"
                        ? "Domain"
                        : "Domaine"}
                  </h3>
                  {!isDomainEditing && (
                    <button
                      onClick={() => setIsDomainEditing(true)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      {lang === "ar"
                        ? "تعديل النطاق"
                        : lang === "en"
                          ? "Edit Domain"
                          : "Modifier le domaine"}
                    </button>
                  )}
                </div>

                {!isDomainEditing ? (
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-bold text-slate-900" dir="ltr">
                          {domainName}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {domainName.includes(".gzeed.com")
                            ? lang === "ar"
                              ? "نطاق فرعي مجاني"
                              : lang === "en"
                                ? "Free Subdomain"
                                : "Sous-domaine gratuit"
                            : lang === "ar"
                              ? "نطاق مخصص PRO"
                              : lang === "en"
                                ? "Custom Domain PRO"
                                : "Domaine personnalisé PRO"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-fade-in border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <div className="flex border-b border-slate-200">
                      <button
                        onClick={() => setDomainTab("subdomain")}
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${domainTab === "subdomain" ? "bg-white text-cyan-600 border-b-2 border-cyan-500" : "text-slate-500 hover:bg-slate-100"}`}
                      >
                        {lang === "ar"
                          ? "نطاق فرعي مجاني"
                          : lang === "en"
                            ? "Free Subdomain"
                            : "Sous-domaine gratuit"}
                      </button>
                      <button
                        onClick={() => setDomainTab("custom")}
                        className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${domainTab === "custom" ? "bg-white text-indigo-600 border-b-2 border-indigo-500" : "text-slate-500 hover:bg-slate-100"}`}
                      >
                        {lang === "ar"
                          ? "نطاق مخصص PRO"
                          : lang === "en"
                            ? "Custom Domain PRO"
                            : "Domaine personnalisé PRO"}
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full">
                          PRO
                        </span>
                      </button>
                    </div>

                    <div className="p-6 bg-white">
                      {domainTab === "subdomain" && (
                        <div className="space-y-4 animate-fade-in">
                          <p className="text-sm font-medium text-slate-500 mb-4">
                            {lang === "ar"
                              ? "اختر اسماً لمشروعك ليظهر قبل .gzeed.com"
                              : lang === "en"
                                ? "Choose a name for your project before .gzeed.com"
                                : "Choisissez un nom pour votre projet avant .gzeed.com"}
                          </p>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col md:flex-row gap-3">
                              <div className="relative flex-1 flex items-center">
                                <input
                                  type="text"
                                  placeholder="my-awesome-store"
                                  value={subdomainInput}
                                  onChange={(e) => {
                                    setSubdomainInput(e.target.value);
                                    setDomainError(null);
                                  }}
                                  className={`w-full bg-slate-50 border rounded-lg px-4 py-3 focus:ring-2 outline-none font-bold text-slate-900 text-right md:text-left transition-all ${domainError ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-cyan-500"}`}
                                  dir="ltr"
                                />
                                <span className="absolute right-4 text-slate-400 font-bold bg-slate-50 pl-2">
                                  .gzeed.com
                                </span>
                              </div>
                              <button
                                onClick={handleSaveSubdomain}
                                disabled={
                                  isVerifyingDomain || !subdomainInput.trim()
                                }
                                className="px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-colors shrink-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px]"
                              >
                                {isVerifyingDomain ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {lang === "ar"
                                      ? "جاري الإنشاء..."
                                      : lang === "en"
                                        ? "Creating..."
                                        : "Création..."}
                                  </>
                                ) : lang === "ar" ? (
                                  "إنشاء النطاق"
                                ) : lang === "en" ? (
                                  "Create"
                                ) : (
                                  "Créer"
                                )}
                              </button>
                            </div>
                            {domainError && (
                              <p className="text-red-500 text-xs font-bold px-1 animate-fade-in">
                                {domainError}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {domainTab === "custom" && (
                        <div className="space-y-4 animate-fade-in">
                          <p className="text-sm font-medium text-slate-500 mb-4">
                            {lang === "ar"
                              ? "اربط نطاقك الخاص (مثال: www.mystore.com) لتبدو أكثر احترافية."
                              : lang === "en"
                                ? "Connect your custom domain (ex: www.mystore.com)."
                                : "Connectez votre propre domaine (ex: www.mystore.com)."}
                          </p>
                          <div className="flex flex-col md:flex-row gap-3 mb-6">
                            <input
                              type="text"
                              placeholder="www.mystore.com"
                              value={customDomainInput}
                              onChange={(e) =>
                                setCustomDomainInput(e.target.value)
                              }
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900 text-left"
                              dir="ltr"
                            />
                            <button
                              onClick={() => {
                                if (customDomainInput.trim()) {
                                  setDomainName(
                                    customDomainInput.trim().toLowerCase(),
                                  );
                                  setIsDomainEditing(false);
                                  showToastAndNavigate(
                                    lang === "ar"
                                      ? "تم ربط النطاق بنجاح! حان وقت اختيار قالبك."
                                      : lang === "en"
                                        ? "Domain connected! Now choose your theme."
                                        : "Domaine connecté ! Choisissez maintenant votre thème.",
                                    "themes",
                                  );
                                }
                              }}
                              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-colors shrink-0"
                            >
                              {lang === "ar"
                                ? "ربط النطاق"
                                : lang === "en"
                                  ? "Connect"
                                  : "Connecter"}
                            </button>
                          </div>
                          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm font-medium text-indigo-900">
                            <h4 className="font-bold mb-2 flex items-center gap-2">
                              <Settings className="w-4 h-4" />{" "}
                              {lang === "ar"
                                ? "إعدادات DNS المطلوبة:"
                                : lang === "en"
                                  ? "Required DNS Settings:"
                                  : "Paramètres DNS requis :"}
                            </h4>
                            <p className="mb-2 opacity-80">
                              {lang === "ar"
                                ? "قم بإضافة هذا السجل في لوحة تحكم النطاق الخاص بك (Namecheap, GoDaddy...):"
                                : lang === "en"
                                  ? "Add this record in your DNS control panel:"
                                  : "Ajoutez cet enregistrement dans votre panneau de contrôle DNS :"}
                            </p>
                            <code
                              className="block bg-white p-3 rounded-lg border border-indigo-200 font-mono text-xs text-left"
                              dir="ltr"
                            >
                              Type: A <br />
                              Name: @ <br />
                              Value: 76.76.21.21
                            </code>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
                      <button
                        onClick={() => setIsDomainEditing(false)}
                        className="text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        {lang === "ar"
                          ? "إلغاء"
                          : lang === "en"
                            ? "Cancel"
                            : "Annuler"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Settings Block */}
              {projectType !== "website" && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-indigo-500" />
                      {lang === "ar"
                        ? "طرق الدفع"
                        : lang === "en"
                          ? "Payment Methods"
                          : "Méthodes de Paiement"}
                    </h3>
                    <div className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-2 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />{" "}
                      {lang === "ar"
                        ? "آمن"
                        : lang === "en"
                          ? "Secure"
                          : "Sécurisé"}
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed mb-6">
                    {lang === "ar"
                      ? "قم بتفعيل وتكوين طرق الدفع لعملائك."
                      : lang === "en"
                        ? "Activate and configure payment methods for your customers."
                        : "Activez et configurez les méthodes de paiement pour vos clients."}
                  </p>

                  <div className="space-y-4">
                    {/* Store Activation Toggle */}
                    <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-[1.5rem] mb-6 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[1rem] bg-amber-100 flex items-center justify-center text-amber-600">
                           <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-amber-900">{lang === 'ar' ? 'تفعيل استقبال الطلبات' : lang === 'en' ? 'Activate Order Receiving' : 'Activer la réception des commandes'}</h4>
                          <p className="text-xs font-bold text-amber-700/80">{lang === 'ar' ? 'السماح للعملاء بإتمام عمليات الشراء من متجرك' : lang === 'en' ? 'Allow customers to checkout from your store' : 'Autoriser les clients à passer commande'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleUpdatePaymentSetting(
                            "isStoreActive",
                            !paymentSettings.isStoreActive,
                          )
                        }
                        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none z-10 shadow-inner ${paymentSettings.isStoreActive ? "bg-amber-500" : "bg-slate-300"}`}
                        dir="ltr"
                      >
                        <span
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out ${paymentSettings.isStoreActive ? "translate-x-5" : "translate-x-0"}`}
                        />
                      </button>
                    </div>

                    {/* COD */}
                    <div
                      className={`relative group p-5 rounded-[1.5rem] border-2 transition-all duration-300 overflow-hidden ${paymentSettings.codEnabled ? "bg-gradient-to-br from-white to-slate-50/50 border-indigo-500 shadow-xl shadow-indigo-100/50" : "bg-white border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-md"}`}
                    >
                      {paymentSettings.codEnabled && (
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-[100px] -z-10 transition-all duration-700"></div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 z-10">
                          <div
                            className={`w-12 h-12 rounded-[1rem] flex items-center justify-center shrink-0 transition-all duration-300 ${paymentSettings.codEnabled ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105" : "bg-slate-100 text-slate-400"}`}
                          >
                            <Banknote className="w-6 h-6" />
                          </div>
                          <div>
                            <h4
                              className={`text-base font-black tracking-tight transition-colors duration-300 ${paymentSettings.codEnabled ? "text-slate-900" : "text-slate-600"}`}
                            >
                              {lang === "ar"
                                ? "الدفع عند الاستلام"
                                : lang === "en"
                                  ? "Cash on Delivery"
                                  : "Paiement à la Livraison"}
                            </h4>
                            <p className="text-xs font-bold text-slate-500 mt-0.5">
                              Cash on Delivery (COD)
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleUpdatePaymentSetting(
                              "codEnabled",
                              !paymentSettings.codEnabled,
                            )
                          }
                          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none z-10 shadow-inner ${paymentSettings.codEnabled ? "bg-indigo-600" : "bg-slate-200"}`}
                          dir="ltr"
                        >
                          <span
                            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out ${paymentSettings.codEnabled ? "translate-x-5" : "translate-x-0"}`}
                          />
                        </button>
                      </div>

                      {paymentSettings.codEnabled && (
                        <div className="mt-5 pt-4 border-t border-slate-100/80 flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {lang === "ar"
                              ? "مفعل وجاهز لعملائك المحليين."
                              : lang === "en"
                                ? "Active and ready."
                                : "Activé et prêt pour vos clients locaux."}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Stripe / Online */}
                    <div
                      className={`relative group p-5 rounded-[1.5rem] border-2 transition-all duration-300 overflow-hidden ${paymentSettings.onlineEnabled ? "bg-gradient-to-br from-white to-slate-50/50 border-indigo-500 shadow-xl shadow-indigo-100/50" : "bg-white border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-md"}`}
                    >
                      {paymentSettings.onlineEnabled && (
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-[100px] -z-10 transition-all duration-700"></div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 z-10">
                          <div
                            className={`w-12 h-12 rounded-[1rem] flex items-center justify-center shrink-0 transition-all duration-300 ${paymentSettings.onlineEnabled ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105" : "bg-slate-100 text-slate-400"}`}
                          >
                            <Globe className="w-6 h-6" />
                          </div>
                          <div>
                            <h4
                              className={`text-base font-black tracking-tight transition-colors duration-300 ${paymentSettings.onlineEnabled ? "text-slate-900" : "text-slate-600"}`}
                            >
                              {lang === "ar"
                                ? "البطاقة البنكية"
                                : lang === "en"
                                  ? "Credit Card"
                                  : "Carte Bancaire"}
                            </h4>
                            <p className="text-xs font-bold text-slate-500 mt-0.5">
                              {lang === "ar"
                                ? "الدفع عبر الإنترنت"
                                : lang === "en"
                                  ? "Online Payment"
                                  : "Paiement en ligne (Stripe/Payzone)"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-md border border-amber-200">
                            {lang === "ar" ? "قريباً" : "Coming soon"}
                          </span>
                          <button
                            disabled
                            className="relative inline-flex h-7 w-12 shrink-0 cursor-not-allowed rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none z-10 shadow-inner bg-slate-200 opacity-50"
                            dir="ltr"
                          >
                            <span className="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out translate-x-0" />
                          </button>
                        </div>
                      </div>

                      {paymentSettings.onlineEnabled && (
                        <div className="mt-5 pt-4 border-t border-slate-100/80 animate-in slide-in-from-top-2 duration-300 space-y-4">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                {lang === "ar"
                                  ? "مفتاح النشر (Publishable Key)"
                                  : lang === "en"
                                    ? "Publishable Key"
                                    : "Clé Publique (Publishable)"}
                              </label>
                              <input
                                type="text"
                                placeholder="pk_test_..."
                                value={paymentSettings.stripePublicKey || ""}
                                onChange={(e) =>
                                  setPaymentSettings({
                                    ...paymentSettings,
                                    stripePublicKey: e.target.value,
                                  })
                                }
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300"
                                dir="ltr"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                {lang === "ar"
                                  ? "المفتاح السري (Secret Key)"
                                  : lang === "en"
                                    ? "Secret Key"
                                    : "Clé Secrète"}
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="password"
                                  placeholder="sk_test_..."
                                  value={paymentSettings.stripeSecretKey || ""}
                                  onChange={(e) =>
                                    setPaymentSettings({
                                      ...paymentSettings,
                                      stripeSecretKey: e.target.value,
                                    })
                                  }
                                  className="flex-1 bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300"
                                  dir="ltr"
                                />
                                <button
                                  onClick={() => {
                                    handleUpdatePaymentSetting(
                                      "stripePublicKey",
                                      paymentSettings.stripePublicKey,
                                    );
                                    handleUpdatePaymentSetting(
                                      "stripeSecretKey",
                                      paymentSettings.stripeSecretKey,
                                    );
                                    setToastMessage(
                                      lang === "ar"
                                        ? "تم حفظ إعدادات الدفع"
                                        : lang === "en"
                                          ? "Settings saved"
                                          : "Paramètres enregistrés",
                                    );
                                    setTimeout(
                                      () => setToastMessage(null),
                                      3000,
                                    );
                                  }}
                                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
                                >
                                  {lang === "ar"
                                    ? "حفظ"
                                    : lang === "en"
                                      ? "Save"
                                      : "Sauvegarder"}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3 p-3 bg-rose-50/50 border border-rose-100 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)] shrink-0" />
                            <span className="text-[11px] font-bold text-rose-600">
                              {lang === "ar"
                                ? "وضع الاختبار مفعل حالياً."
                                : lang === "en"
                                  ? "Test mode is currently active."
                                  : "Le mode test est actuellement actif."}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* PayPal */}
                    <div
                      className={`relative group p-5 rounded-[1.5rem] border-2 transition-all duration-300 overflow-hidden ${paymentSettings.paypalEnabled ? "bg-gradient-to-br from-white to-slate-50/50 border-indigo-500 shadow-xl shadow-indigo-100/50" : "bg-white border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-md"}`}
                    >
                      {paymentSettings.paypalEnabled && (
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-[100px] -z-10 transition-all duration-700"></div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 z-10">
                          <div
                            className={`w-12 h-12 rounded-[1rem] flex items-center justify-center shrink-0 transition-all duration-300 ${paymentSettings.paypalEnabled ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105" : "bg-slate-100 text-slate-400"}`}
                          >
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div>
                            <h4
                              className={`text-base font-black tracking-tight transition-colors duration-300 ${paymentSettings.paypalEnabled ? "text-slate-900" : "text-slate-600"}`}
                            >
                              PayPal
                            </h4>
                            <p className="text-xs font-bold text-slate-500 mt-0.5">
                              {lang === "ar"
                                ? "دفع آمن عبر بايبال"
                                : lang === "en"
                                  ? "Secure PayPal Checkout"
                                  : "Paiement sécurisé via PayPal"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-md border border-amber-200">
                            {lang === "ar" ? "قريباً" : "Coming soon"}
                          </span>
                          <button
                            disabled
                            className="relative inline-flex h-7 w-12 shrink-0 cursor-not-allowed rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none z-10 shadow-inner bg-slate-200 opacity-50"
                            dir="ltr"
                          >
                            <span className="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out translate-x-0" />
                          </button>
                        </div>
                      </div>

                      {paymentSettings.paypalEnabled && (
                        <div className="mt-5 pt-4 border-t border-slate-100/80 animate-in slide-in-from-top-2 duration-300 space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                              {lang === "ar"
                                ? "البريد الإلكتروني لحساب PayPal"
                                : lang === "en"
                                  ? "PayPal Email Address"
                                  : "Adresse Email PayPal"}
                            </label>
                            <input
                              type="email"
                              placeholder="contact@votreboutique.com"
                              value={paymentSettings.paypalEmail || ""}
                              onChange={(e) =>
                                setPaymentSettings({
                                  ...paymentSettings,
                                  paypalEmail: e.target.value,
                                })
                              }
                              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300"
                              dir="ltr"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                              {lang === "ar"
                                ? "معرف العميل (Client ID)"
                                : lang === "en"
                                  ? "Client ID"
                                  : "Client ID"}
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="AbC123..."
                                value={paymentSettings.paypalClientId || ""}
                                onChange={(e) =>
                                  setPaymentSettings({
                                    ...paymentSettings,
                                    paypalClientId: e.target.value,
                                  })
                                }
                                className="flex-1 bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300"
                                dir="ltr"
                              />
                              <button
                                onClick={() => {
                                  handleUpdatePaymentSetting(
                                    "paypalEmail",
                                    paymentSettings.paypalEmail,
                                  );
                                  handleUpdatePaymentSetting(
                                    "paypalClientId",
                                    paymentSettings.paypalClientId,
                                  );
                                  setToastMessage(
                                    lang === "ar"
                                      ? "تم حفظ إعدادات الدفع"
                                      : lang === "en"
                                        ? "Settings saved"
                                        : "Paramètres enregistrés",
                                  );
                                  setTimeout(() => setToastMessage(null), 3000);
                                }}
                                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
                              >
                                {lang === "ar"
                                  ? "حفظ"
                                  : lang === "en"
                                    ? "Save"
                                    : "Sauvegarder"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "add-product" && (
            <div className="w-full max-w-6xl animate-fade-in pb-12">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setActiveTab("products")}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors shrink-0"
                >
                  <ArrowLeft
                    className={`w-5 h-5 text-slate-600 ${isAr ? "rotate-180" : ""}`}
                  />
                </button>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {lang === "ar"
                      ? "إضافة منتج جديد"
                      : lang === "en"
                        ? "Add New Product"
                        : "Ajouter un nouveau produit"}
                  </h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    {lang === "ar"
                      ? "أدخل تفاصيل منتجك لبدء بيعه."
                      : lang === "en"
                        ? "Enter your product details to start selling."
                        : "Entrez les détails de votre produit pour commencer à le vendre."}
                  </p>
                </div>
              </div>

              {/* Main Form Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Forms) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Info */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">
                      {lang === "ar"
                        ? "المعلومات الأساسية"
                        : lang === "en"
                          ? "Basic Information"
                          : "Informations de base"}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          {lang === "ar"
                            ? "اسم المنتج"
                            : lang === "en"
                              ? "Product Name"
                              : "Nom du produit"}
                        </label>
                        <input
                          type="text"
                          value={newProduct.name}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              name: e.target.value,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all font-medium text-slate-900"
                          placeholder={
                            lang === "ar"
                              ? "مثال: حذاء رياضي"
                              : lang === "en"
                                ? "e.g. Sneakers"
                                : "ex: Baskets"
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          {lang === "ar"
                            ? "وصف المنتج"
                            : lang === "en"
                              ? "Description"
                              : "Description"}
                        </label>
                        <textarea
                          rows={4}
                          value={newProduct.description}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              description: e.target.value,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all font-medium text-slate-900 resize-none"
                          placeholder={
                            lang === "ar"
                              ? "اكتب وصفاً جذاباً لمنتجك..."
                              : lang === "en"
                                ? "Write a catchy description..."
                                : "Écrivez une description accrocheuse..."
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">
                      {lang === "ar"
                        ? "السعر والمخزون"
                        : lang === "en"
                          ? "Pricing & Inventory"
                          : "Prix & Inventaire"}
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          {lang === "ar"
                            ? "السعر (درهم)"
                            : lang === "en"
                              ? "Price (MAD)"
                              : "Prix (MAD)"}
                        </label>
                        <input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              price: e.target.value,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all font-medium text-slate-900"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          {lang === "ar"
                            ? "السعر الأصلي (قبل التخفيض)"
                            : lang === "en"
                              ? "Compare at price"
                              : "Prix avant réduction"}
                        </label>
                        <input
                          type="number"
                          value={newProduct.comparePrice}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              comparePrice: e.target.value,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all font-medium text-slate-900"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          {lang === "ar"
                            ? "الكمية المتوفرة (Stock)"
                            : lang === "en"
                              ? "Available Stock"
                              : "Stock disponible"}
                        </label>
                        <input
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              stock: e.target.value,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all font-medium text-slate-900"
                          placeholder="1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Variants: Size / Color - WooCommerce style tag inputs */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">
                      {lang === "ar"
                        ? "المقاسات والألوان"
                        : lang === "en"
                          ? "Sizes & Colors"
                          : "Tailles & Couleurs"}
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          {lang === "ar"
                            ? "المقاسات (Tailles)"
                            : lang === "en"
                              ? "Sizes"
                              : "Tailles"}
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={sizeInput}
                            onChange={(e) => setSizeInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === ",") {
                                e.preventDefault();
                                addTag("size");
                              }
                            }}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all font-medium text-slate-900"
                            placeholder={
                              lang === "ar"
                                ? "مثال: S, M, L..."
                                : lang === "en"
                                  ? "e.g. S, M, L..."
                                  : "ex: S, M, L..."
                            }
                          />
                          <button
                            type="button"
                            onClick={() => addTag("size")}
                            className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors shrink-0"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        {productSizes.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {productSizes.map((size) => (
                              <span
                                key={size}
                                className="inline-flex items-center gap-1.5 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-full px-3 py-1 text-sm font-bold"
                              >
                                {size}
                                <button
                                  type="button"
                                  onClick={() => removeTag("size", size)}
                                  className="hover:text-cyan-900"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          {lang === "ar"
                            ? "الألوان (Couleurs)"
                            : lang === "en"
                              ? "Colors"
                              : "Couleurs"}
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={colorInput}
                            onChange={(e) => setColorInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === ",") {
                                e.preventDefault();
                                addTag("color");
                              }
                            }}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all font-medium text-slate-900"
                            placeholder={
                              lang === "ar"
                                ? "مثال: أحمر، أزرق، أسود..."
                                : lang === "en"
                                  ? "e.g. Red, Blue, Black..."
                                  : "ex: Rouge, Bleu, Noir..."
                            }
                          />
                          <button
                            type="button"
                            onClick={() => addTag("color")}
                            className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors shrink-0"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        {productColors.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {productColors.map((color) => (
                              <span
                                key={color}
                                className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-3 py-1 text-sm font-bold"
                              >
                                {color}
                                <button
                                  type="button"
                                  onClick={() => removeTag("color", color)}
                                  className="hover:text-indigo-900"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (Settings & Images) */}
                <div className="space-y-6">
                  {/* Type of Product */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      {lang === "ar"
                        ? "نوع المنتج"
                        : lang === "en"
                          ? "Product Type"
                          : "Type de produit"}
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          id: "physical",
                          icon: Package,
                          title:
                            lang === "ar"
                              ? "منتج ملموس"
                              : lang === "en"
                                ? "Physical"
                                : "Physique",
                          desc:
                            lang === "ar"
                              ? "ملابس، إلكترونيات، إلخ"
                              : lang === "en"
                                ? "Clothes, electronics, etc"
                                : "Vêtements, etc",
                        },
                        {
                          id: "digital",
                          icon: DownloadCloud,
                          title:
                            lang === "ar"
                              ? "منتج رقمي"
                              : lang === "en"
                                ? "Digital"
                                : "Numérique",
                          desc:
                            lang === "ar"
                              ? "كتب، دورات، برامج"
                              : lang === "en"
                                ? "Books, courses, soft"
                                : "Livres, logiciels",
                        },
                      ].map((type) => (
                        <div
                          key={type.id}
                          onClick={() => setProductType(type.id)}
                          className={`p-3 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${productType === type.id ? "border-cyan-500 bg-cyan-50" : "border-slate-100 hover:border-slate-200 bg-white"}`}
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${productType === type.id ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-500"}`}
                          >
                            <type.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {type.title}
                            </p>
                            <p className="text-xs text-slate-500 font-medium">
                              {type.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Images */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      {lang === "ar"
                        ? "الصور"
                        : lang === "en"
                          ? "Images"
                          : "Images"}
                    </h3>
                    <input
                      ref={productFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) addProductImages(e.target.files);
                        e.target.value = "";
                      }}
                    />
                    <div
                      onClick={() => productFileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingImages(true);
                      }}
                      onDragLeave={() => setIsDraggingImages(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingImages(false);
                        if (e.dataTransfer.files)
                          addProductImages(e.dataTransfer.files);
                      }}
                      className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group ${isDraggingImages ? "border-cyan-500 bg-cyan-50" : "border-slate-200 hover:border-cyan-500 hover:bg-cyan-50"}`}
                    >
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-white transition-colors">
                        <UploadCloud className="w-6 h-6 text-cyan-500" />
                      </div>
                      <p className="font-bold text-sm text-slate-700">
                        {lang === "ar"
                          ? "اسحب الصور وأفلتها هنا"
                          : lang === "en"
                            ? "Drag & drop images here"
                            : "Glissez & déposez vos images ici"}
                      </p>
                      <p className="text-xs font-medium text-slate-500 mt-1">
                        {lang === "ar"
                          ? "أو اضغط لتصفح الملفات"
                          : lang === "en"
                            ? "or click to browse"
                            : "ou cliquez pour parcourir"}
                      </p>
                    </div>

                    {productImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        {productImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200"
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeProductImage(idx)}
                              className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSaveProduct}
                    disabled={isSavingProduct}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-lg shadow-xl shadow-slate-900/20 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 transition-transform flex items-center justify-center gap-2"
                  >
                    {isSavingProduct ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Check className="w-5 h-5" />
                    )}
                    {lang === "ar"
                      ? "حفظ ونشر المنتج"
                      : lang === "en"
                        ? "Save & Publish Product"
                        : "Enregistrer le produit"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === "analytics" && (
            <div className="-m-4 md:-m-8">
              <StoreAnalytics currentUser={null} embedded={true} />
            </div>
          )}
          {activeTab === "customers" && <CustomersManager />}
          {activeTab === "categories" && <CategoriesManager />}
          {activeTab === "team" && <TeamManager />}
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-3 animate-fade-in z-50">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
