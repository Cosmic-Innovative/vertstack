import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LazyImage from './LazyImage';

function Home() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();

  return (
    <main className="home-container">
      <div className="title-container">
        <LazyImage
          src="/vertstack.svg"
          alt={t('home.logoAlt')}
          className="inline-logo"
        />
        <h1>{t('home.title')}</h1>
      </div>
      <p>{t('home.description')}</p>
      <ul>
        <li>
          <strong>V</strong>
          {t('home.features.vite')}
        </li>
        <li>
          <strong>E</strong>
          {t('home.features.eslint')}
        </li>
        <li>
          <strong>R</strong>
          {t('home.features.react')}
        </li>
        <li>
          <strong>T</strong>
          {t('home.features.typescript')}
        </li>
      </ul>
      <p>{t('home.exploreMessage')}</p>
      <div className="cta-container">
        <Link to={`/${lang}/api-example`} className="button-link">
          {t('home.cta')}
        </Link>
      </div>
    </main>
  );
}

export default Home;
