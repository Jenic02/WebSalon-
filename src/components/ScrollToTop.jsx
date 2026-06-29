import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', toggle);
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'var(--gold)',
        color: 'var(--white)',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        display: visible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow)',
        transition: 'var(--transition)',
        zIndex: 999,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--gold-dark)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--gold)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      ↑
    </button>
  );
}
