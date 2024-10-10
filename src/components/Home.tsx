import { Link } from 'react-router-dom';
import vertStackLogo from '/vertstack.svg';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();

  return (
    <main className="home-container">
      <div className="title-container">
        <img
          src={vertStackLogo}
          alt="VERT Stack Logo"
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
      <p>
        Explore the different pages to see examples of routing, component
        structure, and API integration.
      </p>
      <div className="cta-container">
        <Link to="/api-example" className="button-link">
          {t('home.cta')}
        </Link>
      </div>
    </main>
  );
}

export default Home;
