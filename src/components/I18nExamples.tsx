import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatPercentage,
  formatCompactNumber,
  formatList,
  formatUnit,
} from '../utils/i18n';

const I18nExamples: React.FC = () => {
  const { t, i18n } = useTranslation();

  const now = new Date();
  const pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const futureDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  // Example data
  const price = 42599.99;
  const temperature = 23;
  const fileSize = 1567483;
  const distance = 5.3;
  const progress = 0.85;
  const views = 12467;

  return (
    <article className="content-section">
      <div className="content-wrapper max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">{t('i18nExamples.title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('i18nExamples.description')}
          </p>
        </div>

        {/* Currency and Prices */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {t('i18nExamples.prices.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-4">
                {t('i18nExamples.prices.product')}
              </h3>
              <div className="space-y-2">
                <p className="text-lg">
                  {formatCurrency(price, i18n.language, 'USD')}
                </p>
                <p className="text-lg">
                  {formatCurrency(price, i18n.language, 'EUR')}
                </p>
                <p className="text-lg">
                  {formatCurrency(price, i18n.language, 'GBP')}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-4">
                {t('i18nExamples.prices.discount')}
              </h3>
              <div className="space-y-2">
                <p className="text-lg line-through text-gray-500">
                  {formatCurrency(price, i18n.language, 'USD')}
                </p>
                <p className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded">
                  {formatPercentage(0.2, i18n.language)}{' '}
                  {t('i18nExamples.prices.off')}
                </p>
                <p className="text-lg font-medium text-green-600">
                  {formatCurrency(price * 0.8, i18n.language, 'USD')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Units and Measurements */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {t('i18nExamples.units.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-4">
                {t('i18nExamples.units.temperature')}
              </h3>
              <p className="text-lg">
                {formatUnit(temperature, 'celsius', i18n.language)}
              </p>
              <p className="text-lg">
                {formatUnit(
                  (temperature * 9) / 5 + 32,
                  'fahrenheit',
                  i18n.language,
                )}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-4">
                {t('i18nExamples.units.fileSize')}
              </h3>
              <p className="text-lg">
                {formatUnit(
                  Math.floor(fileSize / 1024 / 1024),
                  'megabyte',
                  i18n.language,
                )}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-4">
                {t('i18nExamples.units.distance')}
              </h3>
              <p className="text-lg">
                {formatUnit(distance, 'kilometer', i18n.language)}
              </p>
              <p className="text-lg">
                {formatUnit(distance * 0.621371, 'mile', i18n.language)}
              </p>
            </div>
          </div>
        </section>

        {/* Stats and Metrics */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {t('i18nExamples.stats.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-4">
                {t('i18nExamples.stats.progress')}
              </h3>
              <div className="relative pt-1">
                <div className="overflow-hidden h-6 mb-4 text-xs flex rounded-full bg-gray-200">
                  <div
                    style={{ width: `${progress * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 rounded-full transition-all duration-500"
                  >
                    <span className="px-2">
                      {formatPercentage(progress, i18n.language)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-4">
                {t('i18nExamples.stats.engagement')}
              </h3>
              <p className="text-lg">
                {t('i18nExamples.stats.views', {
                  count: views,
                  formatted: formatCompactNumber(views, i18n.language),
                })}
              </p>
            </div>
          </div>
        </section>

        {/* Dates and Times */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {t('i18nExamples.dates.title')}
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-medium mb-4">
              {t('i18nExamples.dates.event')}
            </h3>
            <div className="space-y-2">
              <p className="text-lg">{formatDate(now, i18n.language)}</p>
              <p className="text-lg">
                {formatRelativeTime(futureDate, i18n.language)} -{' '}
                <span className="text-green-600">
                  {t('i18nExamples.dates.upcoming')}
                </span>
              </p>
              <p className="text-lg">
                {formatRelativeTime(pastDate, i18n.language)} -{' '}
                <span className="text-gray-600">
                  {t('i18nExamples.dates.past')}
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Lists and Series */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {t('i18nExamples.lists.title')}
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-medium mb-4">
              {t('i18nExamples.lists.options')}
            </h3>
            <p className="text-lg">
              {formatList(
                [
                  t('i18nExamples.lists.option1'),
                  t('i18nExamples.lists.option2'),
                  t('i18nExamples.lists.option3'),
                ],
                i18n.language,
              )}
            </p>
          </div>
        </section>
      </div>
    </article>
  );
};

export default I18nExamples;
