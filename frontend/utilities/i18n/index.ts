// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/en.json';
import frTranslation from './locales/fr/fr.json';
import esTranslation from './locales/es/es.json'; 
const resources = {
  en: {
    translation: enTranslation
  },
  fr: {
    translation: frTranslation
  },
  es: {
    translation: esTranslation 
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
