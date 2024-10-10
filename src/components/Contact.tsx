import { useTranslation } from 'react-i18next';

function Contact() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('contact.title')}</h1>
      <p>{t('contact.description')}</p>
    </div>
  );
}

export default Contact;
