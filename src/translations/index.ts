import en from './en.json';
import he from './he.json';

interface Translations {
  [lang: string]: Record<string, string>;
}

const i18n: Translations = {
  en,
  he,
};

export default i18n;
