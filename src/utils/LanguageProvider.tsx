import React, {createContext, useState, useEffect, ReactNode, useContext} from 'react';
import {I18nManager} from 'react-native';
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
  changeLanguage: () => {},
  t: (key: string) => key, // ברירת מחדל
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({children}: {children: ReactNode}) => {
  const [language, setLanguage] = useState<string>('en');
  const [isRTL, setIsRTL] = useState<boolean>(false);

  useEffect(() => {
    const loadLang = async () => {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
      I18nManager.swapLeftAndRightInRTL(false);

      const savedLang = await AsyncStorage.getItem(LANG_KEY);
      const lang = savedLang || 'en';
      await i18n.changeLanguage(lang);
      setLanguage(lang);
      setIsRTL(lang === 'he');
    };
    loadLang();
  }, []);

  const changeLanguage = async (lang: string) => {
    await AsyncStorage.setItem(LANG_KEY, lang);
    await i18n.changeLanguage(lang);
    setLanguage(lang);
    setIsRTL(lang === 'he');
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
