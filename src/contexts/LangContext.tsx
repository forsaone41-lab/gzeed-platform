import { createContext, useContext, useState, ReactNode } from 'react';
import { Lang } from '../i18n';

interface LangCtx {
  lang: Lang;
  toggle: () => void;
  setLang: (lang: Lang) => void;
  isAr: boolean;
  isEn?: boolean;
  isFr?: boolean;
}

const LangContext = createContext<LangCtx>({ lang: 'fr', toggle: () => {}, setLang: () => {}, isAr: false, isEn: false, isFr: true });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('textrack_lang') as Lang) || 'fr');

  function toggle() {
    const next: Lang = lang === 'fr' ? 'ar' : lang === 'ar' ? 'en' : 'fr';
    localStorage.setItem('textrack_lang', next);
    setLang(next);
  }

  function handleSetLang(newLang: Lang) {
    localStorage.setItem('textrack_lang', newLang);
    setLang(newLang);
  }

  return (
    <LangContext.Provider value={{ lang, toggle, setLang: handleSetLang, isAr: lang === 'ar', isEn: lang === 'en', isFr: lang === 'fr' }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
