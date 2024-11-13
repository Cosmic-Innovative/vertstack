import { logger } from '../logger';
import i18n from '../../i18n';

export type PageNamespace =
  | 'home'
  | 'about'
  | 'contact'
  | 'apiExample'
  | 'i18nExamples'
  | 'userList'
  | 'notFound';

// Validate page namespaces at runtime
const validPages = new Set<PageNamespace>([
  'home',
  'about',
  'contact',
  'apiExample',
  'i18nExamples',
  'userList',
  'notFound',
]);

const isValidPage = (page: string): page is PageNamespace => {
  return validPages.has(page as PageNamespace);
};

const normalizeLanguage = (lang: string): string => {
  return lang.split('-')[0].toLowerCase();
};

export const loadPageTranslations = async (
  page: PageNamespace,
  lang: string,
): Promise<boolean> => {
  const normalizedLang = normalizeLanguage(lang);

  if (!isValidPage(page)) {
    logger.error('Invalid page namespace', { page, language: normalizedLang });
    return false;
  }

  try {
    // Load translations if they're not already loaded
    const loadPromises = [];

    if (!i18n.hasResourceBundle(normalizedLang, 'translation')) {
      loadPromises.push(
        import(`../../locales/${normalizedLang}.json`).then((module) => {
          i18n.addResourceBundle(
            normalizedLang,
            'translation',
            module.default,
            true,
            true,
          );
        }),
      );
    }

    if (!i18n.hasResourceBundle(normalizedLang, page)) {
      loadPromises.push(
        import(`../../locales/pages/${normalizedLang}/${page}.json`).then(
          (module) => {
            const pageData = new Map(Object.entries(module.default)).get(page);
            if (!pageData) {
              throw new Error(`Missing translations for ${page}`);
            }
            i18n.addResourceBundle(normalizedLang, page, pageData, true, true);
          },
        ),
      );
    }

    if (loadPromises.length > 0) {
      await Promise.all(loadPromises);
      logger.info('Translations loaded successfully', {
        page,
        language: normalizedLang,
      });
    }

    return true;
  } catch (error) {
    logger.error('Translation loading failed', {
      error,
      page,
      language: normalizedLang,
    });
    return false;
  }
};
