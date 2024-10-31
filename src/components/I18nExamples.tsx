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
      <div className="content-wrapper">
        <h1>{t('i18nExamples.title')}</h1>
        <p>{t('i18nExamples.description')}</p>

        {/* Currency and Prices */}
        <section>
          <h2>{t('i18nExamples.prices.title')}</h2>
          <div className="example-grid">
            <div className="example-item">
              <h3>{t('i18nExamples.prices.product')}</h3>
              <p>{formatCurrency(price, i18n.language, 'USD')}</p>
              <p>{formatCurrency(price, i18n.language, 'EUR')}</p>
              <p>{formatCurrency(price, i18n.language, 'GBP')}</p>
            </div>
            <div className="example-item">
              <h3>{t('i18nExamples.prices.discount')}</h3>
              <p>
                <span className="original-price">
                  {formatCurrency(price, i18n.language, 'USD')}
                </span>
                <span className="discount-badge">
                  {formatPercentage(0.2, i18n.language)}{' '}
                  {t('i18nExamples.prices.off')}
                </span>
                <span className="final-price">
                  {formatCurrency(price * 0.8, i18n.language, 'USD')}
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Units and Measurements */}
        <section>
          <h2>{t('i18nExamples.units.title')}</h2>
          <div className="example-grid">
            <div className="example-item">
              <h3>{t('i18nExamples.units.temperature')}</h3>
              <p>{formatUnit(temperature, 'celsius', i18n.language)}</p>
              <p>
                {formatUnit(
                  (temperature * 9) / 5 + 32,
                  'fahrenheit',
                  i18n.language,
                )}
              </p>
            </div>
            <div className="example-item">
              <h3>{t('i18nExamples.units.fileSize')}</h3>
              <p>
                {formatUnit(
                  Math.floor(fileSize / 1024 / 1024),
                  'megabyte',
                  i18n.language,
                )}
              </p>
            </div>
            <div className="example-item">
              <h3>{t('i18nExamples.units.distance')}</h3>
              <p>{formatUnit(distance, 'kilometer', i18n.language)}</p>
              <p>{formatUnit(distance * 0.621371, 'mile', i18n.language)}</p>
            </div>
          </div>
        </section>

        {/* Stats and Metrics */}
        <section>
          <h2>{t('i18nExamples.stats.title')}</h2>
          <div className="example-grid">
            <div className="example-item">
              <h3>{t('i18nExamples.stats.progress')}</h3>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress * 100}%` }}
                >
                  {formatPercentage(progress, i18n.language)}
                </div>
              </div>
            </div>
            <div className="example-item">
              <h3>{t('i18nExamples.stats.engagement')}</h3>
              <p>
                {t('i18nExamples.stats.views', {
                  count: views,
                  formatted: formatCompactNumber(views, i18n.language),
                })}
              </p>
            </div>
          </div>
        </section>

        {/* Dates and Times */}
        <section>
          <h2>{t('i18nExamples.dates.title')}</h2>
          <div className="example-grid">
            <div className="example-item">
              <h3>{t('i18nExamples.dates.event')}</h3>
              <p>{formatDate(now, i18n.language)}</p>
              <p>
                {formatRelativeTime(futureDate, i18n.language)} -{' '}
                {t('i18nExamples.dates.upcoming')}
              </p>
              <p>
                {formatRelativeTime(pastDate, i18n.language)} -{' '}
                {t('i18nExamples.dates.past')}
              </p>
            </div>
          </div>
        </section>

        {/* Lists and Series */}
        <section>
          <h2>{t('i18nExamples.lists.title')}</h2>
          <div className="example-item">
            <h3>{t('i18nExamples.lists.options')}</h3>
            <p>
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
