import { useTranslation } from 'react-i18next';

function Contact() {
  const { t } = useTranslation();
  return (
    <article className="content-section">
      <div className="content-wrapper">
        <h1 className="text-center mb-8">{t('contact.title')}</h1>
        <p className="text-left">{t('contact.description')}</p>
      </div>
    </article>
  );
}

export default Contact;
