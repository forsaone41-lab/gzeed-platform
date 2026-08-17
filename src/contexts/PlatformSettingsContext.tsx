import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PlatformSettings {
  // Hero Section
  heroTitleAr: string;
  heroTitleFr: string;
  heroSubtitleAr: string;
  heroSubtitleFr: string;
  heroVideoUrl: string;
  
  // Pricing
  litePrice: string;
  proPrice: string;
  agencyPrice: string;
  
  // Features Section Visibility
  showFeatures: boolean;
}

const defaultSettings: PlatformSettings = {
  heroTitleAr: 'مستقبل بناء المواقع يبدأ هنا.',
  heroTitleFr: 'L\'avenir de la création Web.',
  heroSubtitleAr: 'أطلق موقعك وتحكم في تصميمه بحرية تامة، مع أسهل وأسرع لوحة إدارة في السوق.',
  heroSubtitleFr: 'Lancez votre site et contrôlez son design en toute liberté.',
  heroVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-1560-large.mp4',
  
  litePrice: '99',
  proPrice: '199',
  agencyPrice: '499',
  
  showFeatures: true
};

const PlatformSettingsContext = createContext<{
  settings: PlatformSettings;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
}>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export const usePlatformSettings = () => useContext(PlatformSettingsContext);

export const PlatformSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    try {
      const saved = localStorage.getItem('gzeed_platform_settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('gzeed_platform_settings', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <PlatformSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </PlatformSettingsContext.Provider>
  );
};
