import { useTranslation } from 'react-i18next';

function Contact() {
  const { t } = useTranslation();

  return (
    <article role="main" aria-labelledby="contact-title">
      <section className="content-section">
        <div className="content-wrapper">
          <div className="title-container h-24 mb-8 flex items-center justify-center">
            <h1 id="contact-title">{t('contact.title')}</h1>
          </div>

          <div className="description-section min-h-[100px] text-left">
            <p>{t('contact.description')}</p>

            {/* Contact information section */}
            <section
              className="contact-info-section mt-8"
              aria-labelledby="contact-info-title"
            >
              <h2 id="contact-info-title" className="mb-4">
                {t('contact.info.title')}
              </h2>
              <ul className="contact-list space-y-4">
                <li>
                  <strong className="block mb-1">
                    {t('contact.info.email')}:
                  </strong>
                  <a
                    href="mailto:contact@example.com"
                    className="text-primary hover:underline"
                    aria-label={t('contact.info.emailLabel')}
                  >
                    contact@example.com
                  </a>
                </li>
                <li>
                  <strong className="block mb-1">
                    {t('contact.info.phone')}:
                  </strong>
                  <a
                    href="tel:+1234567890"
                    className="text-primary hover:underline"
                    aria-label={t('contact.info.phoneLabel')}
                  >
                    +1 (234) 567-890
                  </a>
                </li>
                <li>
                  <strong className="block mb-1">
                    {t('contact.info.address')}:
                  </strong>
                  <address className="not-italic">
                    123 Main Street
                    <br />
                    Suite 456
                    <br />
                    City, State 12345
                    <br />
                    Country
                  </address>
                </li>
              </ul>
            </section>

            {/* Hours section */}
            <section
              className="hours-section mt-8"
              aria-labelledby="hours-title"
            >
              <h2 id="hours-title" className="mb-4">
                {t('contact.hours.title')}
              </h2>
              <dl className="hours-list space-y-2">
                <div className="flex justify-between">
                  <dt>{t('contact.hours.weekdays')}:</dt>
                  <dd>9:00 AM - 5:00 PM</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{t('contact.hours.weekends')}:</dt>
                  <dd>{t('contact.hours.closed')}</dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </section>
    </article>
  );
}

export default Contact;
