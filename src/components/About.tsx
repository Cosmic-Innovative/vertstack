import { useTranslation } from 'react-i18next';

function About() {
  const { t } = useTranslation();

  return (
    <article role="main" aria-labelledby="about-title">
      <section className="content-section">
        <div className="content-wrapper">
          <div className="title-container h-24 mb-8 flex items-center justify-center">
            <h1 id="about-title">{t('about.title')}</h1>
          </div>

          <div className="description-section min-h-[100px] text-left">
            <p>{t('about.description')}</p>
          </div>
        </div>
      </section>
    </article>
  );
}

export default About;
