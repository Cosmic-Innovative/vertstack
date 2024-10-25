import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';

// Define supported languages as a constant
const SUPPORTED_LANGUAGES = ['en', 'es'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// Function to check if a language is supported
const isSupportedLanguage = (lang: string): lang is SupportedLanguage =>
  SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);

// Function to dynamically import language files
const loadLocale = async (lang: SupportedLanguage) => {
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
    supportedLngs: SUPPORTED_LANGUAGES,
  });

// Function to load language resources
export const loadLanguageAsync = async (lang: string): Promise<boolean> => {
  // Skip if language is already loaded
  if (i18n.hasResourceBundle(lang, 'translation')) {
    return true;
  }

  // Check if the language is supported
  if (!isSupportedLanguage(lang)) {
    return false;
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
  if (isSupportedLanguage(lang)) {
    await loadLanguageAsync(lang);
    await i18n.changeLanguage(lang);
    return true;
  }
  return false;
};

export default i18n;
