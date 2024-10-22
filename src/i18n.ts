import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';

// Function to dynamically import language files
const loadLocale = async (lang: string) => {
  try {
    return await import(`./locales/${lang}.json`);
  } catch (error) {
    console.error(`Failed to load translations for ${lang}:`, error);
    return null;
  }
};

// Initialize i18next with English translations immediately
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path', 'navigator'],
      lookupFromPathIndex: 0,
    },
    load: 'languageOnly',
    supportedLngs: ['en', 'es'],
  });

// Function to load language resources
export const loadLanguageAsync = async (lang: string): Promise<boolean> => {
  // Skip if language is already loaded
  if (i18n.hasResourceBundle(lang, 'translation')) {
    return true;
  }

  try {
    const translations = await loadLocale(lang);
    if (translations) {
      i18n.addResourceBundle(
        lang,
        'translation',
        translations.default,
        true,
        true,
      );
      return true;
    }
  } catch (error) {
    console.error(`Failed to load ${lang} translations:`, error);
  }
  return false;
};

// Function to change language
export const changeLanguage = async (lang: string): Promise<boolean> => {
  if (i18n.options.supportedLngs?.includes(lang)) {
    await loadLanguageAsync(lang);
    await i18n.changeLanguage(lang);
    return true;
  }
  return false;
};

export default i18n;
