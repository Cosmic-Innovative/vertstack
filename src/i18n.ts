import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

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

const supportedLanguages = ['en', 'es'];

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
