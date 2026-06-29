import en from '../translations/en.json';
import sr from '../translations/sr.json';
import { useLanguage } from './LanguageContext';

const translations = { en, sr };

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export function useTranslation() {
  const { language } = useLanguage();
  const data = translations[language];

  const t = (key) => {
    const value = getNestedValue(data, key);
    return value !== undefined ? value : key;
  };

  return { t, language };
}
