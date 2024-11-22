import i18n from '../i18n';

export const detectUserLanguage = (): string => {
  const browserLang = navigator.language.split('-')[0];
  const supportedLanguages = ['en', 'es']; // Add more languages as needed

  if (supportedLanguages.includes(browserLang)) {
    return browserLang;
  }

  return i18n.language || 'en'; // Default to English if no supported language is detected
};
