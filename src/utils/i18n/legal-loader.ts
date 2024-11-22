import i18n from '../../i18n';

export const loadLegalTranslations = async (lang: string): Promise<void> => {
  if (!i18n.hasResourceBundle(lang, 'legal')) {
    try {
      const translations = await import(`../../locales/legal/${lang}.json`);
      i18n.addResourceBundle(lang, 'legal', translations.default, true, true);

      // Wait for a tick to ensure i18next processes the new bundle
      await new Promise((resolve) => setTimeout(resolve, 0));
    } catch (error) {
      console.error('Failed to load legal translations:', error);
      throw error; // Propagate error for handling in component
    }
  }
};
