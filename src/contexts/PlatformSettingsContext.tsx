import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../supabase';

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
  
  // Intro Video Section Visibility
  showIntroVideo: boolean;
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
  
  showFeatures: true,
  showIntroVideo: false
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

  // Fetch settings from Supabase on load
  useEffect(() => {
    const fetchRemoteSettings = async () => {
      try {
        // We append a timestamp to bypass browser cache
        const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl('settings.json');
        if (publicUrlData?.publicUrl) {
          const res = await fetch(`${publicUrlData.publicUrl}?t=${Date.now()}`);
          if (res.ok) {
            const remoteSettings = await res.json();
            setSettings(prev => ({ ...prev, ...remoteSettings }));
            localStorage.setItem('gzeed_platform_settings', JSON.stringify(remoteSettings));
          }
        }
      } catch (err) {
        console.error('Failed to fetch remote settings', err);
      }
    };
    fetchRemoteSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<PlatformSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // 1. Save locally for instant UI update
      localStorage.setItem('gzeed_platform_settings', JSON.stringify(updated));
      
      // 2. Save remotely to Supabase (so phones and other browsers see it)
      const file = new Blob([JSON.stringify(updated)], { type: 'application/json' });
      supabase.storage.from('media').upload('settings.json', file, { upsert: true })
        .catch(err => console.error('Failed to sync settings to Supabase', err));
        
      return updated;
    });
  };

  return (
    <PlatformSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </PlatformSettingsContext.Provider>
  );
};
