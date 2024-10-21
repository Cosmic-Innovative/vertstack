import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Function to dynamically import language files
const loadLocale = (lang: string) => import(`./locales/${lang}.json`);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path', 'navigator'],
    },
  });

// List of supported languages in the application
const supportedLanguages = ['en', 'es'];

// Function to load language resources
const loadLanguageResources = async (lang: string) => {
  if (!i18n.hasResourceBundle(lang, 'translation')) {
    const translations = await loadLocale(lang);
    i18n.addResourceBundle(
      lang,
      'translation',
      translations.default,
      true,
      true,
    );
  }
};

// Load default language (English) immediately
loadLanguageResources('en');

// Function to change language
export const changeLanguage = async (lang: string) => {
  if (supportedLanguages.includes(lang)) {
    await loadLanguageResources(lang);
    await i18n.changeLanguage(lang);
  }
};

export default i18n;
