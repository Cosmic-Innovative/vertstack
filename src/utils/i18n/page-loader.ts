import { logger } from '../logger';
import i18n from '../../i18n';

export type PageNamespace =
  | 'home'
  | 'about'
  | 'contact'
  | 'apiExample'
  | 'i18nExamples';

// Helper to type-check translations object
interface TranslationsModule {
  default: {
    home?: Record<string, unknown>;
    about?: Record<string, unknown>;
    contact?: Record<string, unknown>;
    apiExample?: Record<string, unknown>;
    i18nExamples?: Record<string, unknown>;
  };
}

const validPages = new Set<PageNamespace>([
  'home',
  'about',
  'contact',
  'apiExample',
  'i18nExamples',
]);

const isValidPageNamespace = (page: string): page is PageNamespace => {
  return validPages.has(page as PageNamespace);
};

const getTranslations = (
  translations: TranslationsModule,
  page: PageNamespace,
): Record<string, unknown> | null => {
  switch (page) {
    case 'home':
      return translations.default.home || null;
    case 'about':
      return translations.default.about || null;
    case 'contact':
      return translations.default.contact || null;
    case 'apiExample':
      return translations.default.apiExample || null;
    case 'i18nExamples':
      return translations.default.i18nExamples || null;
    default:
      return null;
  }
};

export const loadPageTranslations = async (
  page: PageNamespace,
  lang: string,
): Promise<boolean> => {
  // Validate inputs
  if (!isValidPageNamespace(page)) {
    logger.error('Invalid page namespace', {
      category: 'I18n',
      page,
      language: lang,
    });
    return false;
  }

  if (!i18n.hasResourceBundle(lang, page)) {
    try {
      const translations = (await import(
        `../../locales/pages/${lang}/${page}.json`
      )) as TranslationsModule;

      const pageTranslations = getTranslations(translations, page);
      if (!pageTranslations) {
        throw new Error(`Missing translations for ${page}`);
      }

      i18n.addResourceBundle(lang, page, pageTranslations, true, true);

      logger.info(`Loaded translations for ${page} (${lang})`, {
        category: 'I18n',
        page,
        language: lang,
      });
      return true;
    } catch (error) {
      logger.error(`Failed to load translations for ${page} (${lang})`, {
        category: 'I18n',
        page,
        language: lang,
        error,
      });
      return false;
    }
  }
  return true;
};
