import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Function to dynamically import language files
const loadLocale = (lang: string) => import(`./locales/${lang}.json`);

i18n
  // Use language detector plugin for automatic language detection
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    // Set fallback language if the detected or selected language is not available
    fallbackLng: 'en',
    // Disable escaping of HTML entities in translation values
    interpolation: {
      escapeValue: false,
    },
    // Configure language detection order
    detection: {
      order: ['path', 'navigator'],
    },
  });

// List of supported languages in the application
const supportedLanguages = ['en', 'es'];

// Dynamically load and add language resources for each supported language
supportedLanguages.forEach((lang) => {
  loadLocale(lang).then((translations) => {
    i18n.addResourceBundle(
      lang,
      'translation',
      translations.default,
      true,
      true,
    );
  });
});

export default i18n;
