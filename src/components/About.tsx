import { useTranslation } from 'react-i18next';

function About() {
  const { t } = useTranslation();
  return (
    <article className="content-section">
      <div className="content-wrapper">
        <h1 className="text-center mb-8">{t('about.title')}</h1>
        <p className="text-left">{t('about.description')}</p>
      </div>
    </article>
  );
}

export default About;
