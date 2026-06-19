import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type Language } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('scanron_lang');
      if (saved === 'en' || saved === 'fr') return saved as Language;
    }
    return 'en';
  });

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('scanron_lang', lang);
    }
  }

  function t(key: keyof typeof translations.en): string {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || String(key);
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
