import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './i18n';

const LANG_KEY = 'appLanguage';

interface LanguageContextProps {
  language: string;
  isRTL: boolean;
  changeLanguage: (lang: string) => void;
  t: (key: string) => string; // ← פונקציה לתרגום
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  isRTL: false,
  changeLanguage: () => { },
  t: (key: string) => key, // ברירת מחדל
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>('en');
  const [isRTL, setIsRTL] = useState<boolean>(false);

  useEffect(() => {
    const loadLang = async () => {
      const savedLang = await AsyncStorage.getItem(LANG_KEY);
      const lang = savedLang || 'en';
      setLanguage(lang);
      setIsRTL(lang === 'he');
      i18n.changeLanguage(lang);
      I18nManager.allowRTL(lang === 'he');
      I18nManager.forceRTL(lang === 'he');
      I18nManager.swapLeftAndRightInRTL(true);
    };
    loadLang();
  }, []);

  const changeLanguage = async (lang: string) => {
    await AsyncStorage.setItem(LANG_KEY, lang);
    setLanguage(lang);
    setIsRTL(lang === 'he');
    i18n.changeLanguage(lang);
    const shouldBeRTL = lang === 'he';
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    I18nManager.swapLeftAndRightInRTL(true);
  };

  const t = (key: string) => {
    const translation = i18n.t(key);
    return typeof translation === 'string' && translation !== '' ? translation : key;
  };

  return (
    <LanguageContext.Provider value={{ language, isRTL, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
