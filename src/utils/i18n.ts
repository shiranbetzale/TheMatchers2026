import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations from '../translations';

const LANG_KEY = 'appLanguage';

const resources: Record<keyof typeof translations, {translation: any}> =
  {} as any;

const supportedLanguages: string[] = Object.keys(translations);
export const getDeviceLanguage = () => {
  const deviceLang = RNLocalize.getLocales()[0]?.languageCode;
  return deviceLang && supportedLanguages.includes(deviceLang)
    ? deviceLang
    : 'he';
};

Object.keys(translations).forEach(lang => {
  resources[lang as keyof typeof translations] = {
    translation: translations[lang as keyof typeof translations],
  };
});

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const savedLang = await AsyncStorage.getItem(LANG_KEY);
      if (savedLang && supportedLanguages.includes(savedLang)) {
        return callback(savedLang);
      }

      callback(getDeviceLanguage());
    } catch (err) {
      console.log('Language detection error', err);
      callback('he');
    }
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'he',
    resources,
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
