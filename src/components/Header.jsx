import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

const translations = {
  en: {
    home: "Home",
    services: "Services",
    gallery: "Gallery",
    about: "About",
    booking: "Book",
    contact: "Contact",
  },
  sr: {
    home: "Početna",
    services: "Usluge",
    gallery: "Galerija",
    about: "O nama",
    booking: "Rezerviši",
    contact: "Kontakt",
  },
};

export default function Header() {
  const { language } = useLanguage();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = translations[language];

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [language, location.pathname]);

  const links = [
    { to: '/', label: t.home },
    { to: '/services', label: t.services },
    { to: '/gallery', label: t.gallery },
    { to: '/about', label: t.about },
    { to: '/booking', label: t.booking },
    { to: '/contact', label: t.contact },
  ];

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: 'var(--transition)',
    background: (scrolled || !isHome) ? 'var(--white)' : 'transparent',
    boxShadow: (scrolled || !isHome) ? 'var(--shadow)' : 'none',
    padding: (scrolled || !isHome) ? '10px 0' : '20px 0',
  };

  const logoStyle = {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: (scrolled || !isHome) ? 'var(--black)' : 'var(--white)',
    letterSpacing: '1px',
    transition: 'var(--transition)',
  };

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
  };

  const linkBaseColor = (scrolled || !isHome) ? 'var(--black)' : 'var(--white)';

  const linkStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.85rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'var(--transition)',
    color: linkBaseColor,
    position: 'relative',
    paddingBottom: '4px',
  };

  return (
    <header style={headerStyle}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link to="/" style={logoStyle}>
          Elegant
        </Link>

        <nav className={menuOpen ? 'nav-open' : ''} style={{
          ...navStyle,
        }}>
          <ul className="nav-links" style={{
            display: 'flex',
            gap: '30px',
            alignItems: 'center',
            listStyle: 'none',
          }}>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  style={({ isActive }) => ({
                    ...linkStyle,
                    color: isActive
                      ? 'var(--gold)'
                      : linkBaseColor,
                    borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                    paddingBottom: '2px',
                  })}
                  className="nav-link"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li><LanguageSwitcher /></li>
          </ul>
        </nav>

        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 998,
            }}
          />
        )}
        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            flexDirection: 'column',
            gap: '5px',
            padding: '5px',
          }}
        >
          <span style={{
            width: '25px',
            height: '2px',
            background: menuOpen ? 'var(--white)' : ((scrolled || !isHome) ? 'var(--black)' : 'var(--white)'),
            transition: 'var(--transition)',
            transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
          }} />
          <span style={{
            width: '25px',
            height: '2px',
            background: menuOpen ? 'var(--white)' : ((scrolled || !isHome) ? 'var(--black)' : 'var(--white)'),
            transition: 'var(--transition)',
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            width: '25px',
            height: '2px',
            background: menuOpen ? 'var(--white)' : ((scrolled || !isHome) ? 'var(--black)' : 'var(--white)'),
            transition: 'var(--transition)',
            transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
          }} />
        </button>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .hamburger {
            display: flex !important;
          }
          .nav-links {
            position: fixed;
            top: 0;
            right: ${menuOpen ? '0' : '-100%'};
            width: 280px;
            height: 100vh;
            background: var(--black);
            flex-direction: column !important;
            padding: 80px 40px 40px;
            transition: right 0.3s ease;
            z-index: 999;
            gap: 20px !important;
            align-items: flex-start !important;
          }
          .nav-links .nav-link {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </header>
  );
}
