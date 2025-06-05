import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations from '../translations';

const LANG_KEY = 'appLanguage';

const resources: Record<keyof typeof translations, {translation: any}> =
  {} as any;

const supportedLanguages: string[] = Object.keys(translations);
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

      const deviceLang = RNLocalize.getLocales()[0]?.languageCode;
      if (deviceLang && supportedLanguages.includes(deviceLang)) {
        return callback(deviceLang);
      }

      callback('en'); // ברירת מחדל
    } catch (err) {
      console.log('Language detection error', err);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (lang: string) => {
    await AsyncStorage.setItem(LANG_KEY, lang);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
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
