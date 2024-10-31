import { useTranslation } from 'react-i18next';

function About() {
  const { t } = useTranslation();

  return (
    <article role="main" aria-labelledby="about-title">
      <section className="content-section">
        <div className="content-wrapper max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 id="about-title" className="text-3xl font-bold mb-4">
              {t('about.title')}
            </h1>
            <p className="text-lg text-gray-600">{t('about.description')}</p>
          </div>

          {/* Core Principles */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6">
              {t('about.principles.title')}
            </h2>
            <ul className="space-y-6">
              <li>
                <h3 className="font-medium">
                  {t('about.principles.speed.title')}
                </h3>
                <p className="text-gray-600">
                  {t('about.principles.speed.description')}
                </p>
              </li>
              <li>
                <h3 className="font-medium">
                  {t('about.principles.quality.title')}
                </h3>
                <p className="text-gray-600">
                  {t('about.principles.quality.description')}
                </p>
              </li>
              <li>
                <h3 className="font-medium">
                  {t('about.principles.types.title')}
                </h3>
                <p className="text-gray-600">
                  {t('about.principles.types.description')}
                </p>
              </li>
              <li>
                <h3 className="font-medium">
                  {t('about.principles.modern.title')}
                </h3>
                <p className="text-gray-600">
                  {t('about.principles.modern.description')}
                </p>
              </li>
            </ul>
          </div>

          {/* Built For */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-6">
              {t('about.builtFor.title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">
                  {t('about.builtFor.teams.title')}
                </h3>
                <p className="text-gray-600">
                  {t('about.builtFor.teams.description')}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">
                  {t('about.builtFor.projects.title')}
                </h3>
                <p className="text-gray-600">
                  {t('about.builtFor.projects.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

export default About;
