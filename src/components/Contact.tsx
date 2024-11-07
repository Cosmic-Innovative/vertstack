import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { loadPageTranslations } from '../utils/i18n/page-loader';

function Contact() {
  const { t } = useTranslation('contact');
  const { lang } = useParams<{ lang: string }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeTranslations = async () => {
      if (lang) {
        setIsLoading(true);
        await loadPageTranslations('contact', lang);
        // Only update state if component is still mounted
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeTranslations();

    // Cleanup function to prevent memory leaks
    return () => {
      mounted = false;
    };
  }, [lang]);

  if (isLoading) {
    return (
      <div className="content-section">
        <div className="content-wrapper max-w-2xl mx-auto">
          <div className="loading-container" role="status" aria-live="polite">
            {t('general:loading')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <article role="main" aria-labelledby="contact-title">
      <section className="content-section">
        <div className="content-wrapper max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 id="contact-title" className="text-3xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>

          {/* Community Section */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-center">
              {t('community.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
              {/* Telegram */}
              <a
                href="https://t.me/vertstack"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
              >
                <span
                  role="img"
                  aria-label="Telegram"
                  className="text-4xl mb-3 group-hover:scale-110 transition-transform"
                >
                  📬
                </span>
                <h3 className="font-medium text-lg mb-1">Telegram</h3>
                <p className="text-sm text-gray-600">@vertstack</p>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/vertstack"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
              >
                <span
                  role="img"
                  aria-label="WhatsApp"
                  className="text-4xl mb-3 group-hover:scale-110 transition-transform"
                >
                  💬
                </span>
                <h3 className="font-medium text-lg mb-1">WhatsApp</h3>
                <p className="text-sm text-gray-600">VERT Stack Group</p>
              </a>
            </div>
          </div>

          {/* Official Contacts Section */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-6 text-center">
              {t('official.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
              {/* Email */}
              <a
                href="mailto:contact@vertstack.dev"
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
              >
                <span
                  role="img"
                  aria-label="Email"
                  className="text-4xl mb-3 group-hover:scale-110 transition-transform"
                >
                  ✉️
                </span>
                <h3 className="font-medium text-lg mb-1">Email</h3>
                <p className="text-sm text-gray-600">contact@vertstack.dev</p>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/vertstack"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
              >
                <span
                  role="img"
                  aria-label="GitHub"
                  className="text-4xl mb-3 group-hover:scale-110 transition-transform"
                >
                  🐙
                </span>
                <h3 className="font-medium text-lg mb-1">GitHub</h3>
                <p className="text-sm text-gray-600">github.com/vertstack</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

export default Contact;
