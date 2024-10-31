import { useTranslation } from 'react-i18next';

function Contact() {
  const { t } = useTranslation();

  return (
    <article role="main" aria-labelledby="contact-title">
      <section className="content-section">
        <div className="content-wrapper max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 id="contact-title" className="text-3xl font-bold mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-lg text-gray-600 mb-12">
              {t('contact.description')}
            </p>
          </div>

          {/* Community Links */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-center">
              {t('contact.community.title')}
            </h2>
            <div className="flex justify-center gap-4">
              <a
                href="https://t.me/vertstack"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
              >
                Telegram
              </a>
              <a
                href="https://wa.me/vertstack"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Official Contacts */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {t('contact.official.title')}
            </h2>
            <ul className="space-y-3 text-center">
              <li>
                <a
                  href="mailto:contact@vertstack.dev"
                  className="text-primary hover:underline"
                >
                  contact@vertstack.dev
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/vertstack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  github.com/vertstack
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </article>
  );
}

export default Contact;
