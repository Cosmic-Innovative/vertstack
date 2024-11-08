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

const validPages = new Set<PageNamespace>([
  'home',
  'about',
  'contact',
  'apiExample',
  'i18nExamples',
  'userList',
  'notFound',
]);

const VALID_LANGUAGES = ['en', 'es'] as const;
type ValidLanguage = (typeof VALID_LANGUAGES)[number];

const isValidPageNamespace = (page: string): page is PageNamespace => {
  return validPages.has(page as PageNamespace);
};

const isValidLanguage = (lang: string): lang is ValidLanguage => {
  return VALID_LANGUAGES.includes(lang as ValidLanguage);
};

const CACHE_PREFIX = 'vert_i18n_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CachedTranslation {
  timestamp: number;
  data: Record<string, unknown>;
}

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

  if (!isValidLanguage(lang)) {
    logger.error('Invalid language', {
      category: 'I18n',
      page,
      language: lang,
    });
    return false;
  }

  if (i18n.hasResourceBundle(lang, page)) {
    return true;
  }

  // After validation, safely construct cache key
  const safeKey = `${CACHE_PREFIX}${lang}_${page}` as const;

  try {
    const cached = localStorage.getItem(safeKey);
    if (cached) {
      const parsedCache = JSON.parse(cached) as CachedTranslation;
      if (Date.now() - parsedCache.timestamp < CACHE_DURATION) {
        i18n.addResourceBundle(lang, page, parsedCache.data, true, true);
        logger.debug(`Loaded cached translations for ${page}`, {
          category: 'I18n',
          source: 'cache',
        });
        return true;
      }
    }
  } catch (error) {
    logger.warn('Cache read failed', { error });
  }

  // Fetch from network using validated inputs
  try {
    const validatedPath = new URL(
      `../../locales/pages/${lang}/${page}.json`,
      import.meta.url,
    ).pathname;

    const translations = await import(/* @vite-ignore */ validatedPath);

    // Create a Map for type-safe lookup
    const translationMap = new Map(Object.entries(translations.default));
    const pageData = translationMap.get(page);

    if (!pageData) {
      throw new Error(`Missing translations for ${page}`);
    }

    try {
      localStorage.setItem(
        safeKey,
        JSON.stringify({
          timestamp: Date.now(),
          data: pageData,
        }),
      );
    } catch (error) {
      logger.warn('Cache write failed', { error });
    }

    i18n.addResourceBundle(lang, page, pageData, true, true);
    logger.info(`Loaded translations for ${page}`, {
      category: 'I18n',
      source: 'network',
    });
    return true;
  } catch (error) {
    logger.error(`Failed to load translations for ${page}`, {
      category: 'I18n',
      error,
    });
    return false;
  }
};
