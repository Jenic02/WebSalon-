import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const t = {
  en: {
    rights: "All rights reserved.",
    followUs: "Follow Us",
    hours: "Working Hours",
    home: "Home",
    services: "Services",
    gallery: "Gallery",
    about: "About",
    booking: "Book",
    contact: "Contact",
  },
  sr: {
    rights: "Sva prava zadržana.",
    followUs: "Pratite Nas",
    hours: "Radno Vreme",
    home: "Početna",
    services: "Usluge",
    gallery: "Galerija",
    about: "O nama",
    booking: "Rezerviši",
    contact: "Kontakt",
  },
};

export default function Footer() {
  const { language } = useLanguage();
  const txt = t[language];

  const footerStyle = {
    background: 'var(--black)',
    color: 'var(--white)',
    padding: '60px 0 30px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
  };

  const headingStyle = {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.2rem',
    marginBottom: '20px',
    color: 'var(--gold)',
  };

  const linkStyle = {
    display: 'block',
    color: 'var(--gray-light)',
    fontSize: '0.9rem',
    marginBottom: '10px',
    transition: 'var(--transition)',
  };

  const socialStyle = {
    display: 'flex',
    gap: '15px',
    marginTop: '15px',
  };

  const socialIcon = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid var(--gray-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--gray-light)',
    fontSize: '1.1rem',
    transition: 'var(--transition)',
    cursor: 'pointer',
  };

  return (
    <footer style={footerStyle}>
      <div className="container">
        <div style={gridStyle}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.8rem',
              marginBottom: '15px',
              color: 'var(--white)',
            }}>
              Elegant
            </h3>
            <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              {language === 'en'
                ? 'Premium hair salon dedicated to making you look and feel beautiful.'
                : 'Vrhunski frizerski salon posvećen tome da izgledate i osećate se lepo.'}
            </p>
          </div>

          <div>
            <h4 style={headingStyle}>{language === 'en' ? 'Quick Links' : 'Brzi Linkovi'}</h4>
            {['home', 'services', 'gallery', 'about', 'booking', 'contact'].map((page) => (
              <Link
                key={page}
                to={page === 'home' ? '/' : `/${page}`}
                style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray-light)'; }}
              >
                {txt[page]}
              </Link>
            ))}
          </div>

          <div>
            <h4 style={headingStyle}>{txt.hours}</h4>
            <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', marginBottom: '8px' }}>
              {language === 'en' ? 'Mon - Fri:' : 'Pon - Pet:'} 9:00 - 20:00
            </p>
            <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', marginBottom: '8px' }}>
              {language === 'en' ? 'Saturday:' : 'Subota:'} 9:00 - 18:00
            </p>
            <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem' }}>
              {language === 'en' ? 'Sunday:' : 'Nedelja:'} {language === 'en' ? 'Closed' : 'Zatvoreno'}
            </p>
          </div>

          <div>
            <h4 style={headingStyle}>{txt.followUs}</h4>
            <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', marginBottom: '10px' }}>
              {language === 'en' ? 'Stay connected on social media' : 'Pratite nas na društvenim mrežama'}
            </p>
            <div style={socialStyle}>
              {['IG', 'FB', 'YT'].map((label) => (
                <a
                  key={label}
                  href="#"
                  style={socialIcon}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.color = 'var(--gold)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gray-light)';
                    e.currentTarget.style.color = 'var(--gray-light)';
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '20px',
          textAlign: 'center',
          color: 'var(--gray-light)',
          fontSize: '0.85rem',
        }}>
          &copy; {new Date().getFullYear()} Elegant Hair Salon. {txt.rights}
        </div>
      </div>
    </footer>
  );
}
