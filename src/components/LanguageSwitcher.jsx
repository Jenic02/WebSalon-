import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="lang-switcher"
      aria-label="Toggle language"
      style={{
        background: 'none',
        border: '1px solid var(--gold)',
        color: 'var(--gold)',
        padding: '4px 10px',
        fontSize: '0.8rem',
        fontWeight: 600,
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        transition: 'var(--transition)',
        fontFamily: 'var(--font-body)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--gold)';
        e.currentTarget.style.color = 'var(--white)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'none';
        e.currentTarget.style.color = 'var(--gold)';
      }}
    >
      {language === 'en' ? 'SR' : 'EN'}
    </button>
  );
}
