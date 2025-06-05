import React, {createContext, useState, useEffect, ReactNode} from 'react';
import {I18nManager} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './i18n';

const LANG_KEY = 'appLanguage';

interface LanguageContextProps {
  language: string;
  isRTL: boolean;
  changeLanguage: (lang: string) => void;
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  isRTL: false,
  changeLanguage: () => {},
});

export const LanguageProvider = ({children}: {children: ReactNode}) => {
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
    };
    loadLang();
  }, []);

  const changeLanguage = async (lang: string) => {
    await AsyncStorage.setItem(LANG_KEY, lang);
    setLanguage(lang);
    setIsRTL(lang === 'he');
    i18n.changeLanguage(lang);
    I18nManager.allowRTL(lang === 'he');
    I18nManager.forceRTL(lang === 'he');
  };

  return (
    <LanguageContext.Provider value={{language, isRTL, changeLanguage}}>
      {children}
    </LanguageContext.Provider>
  );
};
