import { useState } from 'react';
import { useTranslation } from '../context/useTranslation';

const categories = ['haircuts', 'coloring', 'styling', 'treatments', 'mens'];

const allServices = [
  { key: 'womenHaircut', cat: 'haircuts', duration: '45 min', icon: '💇‍♀️' },
  { key: 'menHaircut', cat: 'haircuts', duration: '30 min', icon: '💇‍♂️' },
  { key: 'kidsHaircut', cat: 'haircuts', duration: '30 min', icon: '👶' },
  { key: 'basicColoring', cat: 'coloring', duration: '90 min', icon: '🎨' },
  { key: 'balayage', cat: 'coloring', duration: '120 min', icon: '✨' },
  { key: 'ombre', cat: 'coloring', duration: '100 min', icon: '🌅' },
  { key: 'highlights', cat: 'coloring', duration: '90 min', icon: '🌟' },
  { key: 'blowout', cat: 'styling', duration: '30 min', icon: '💨' },
  { key: 'updo', cat: 'styling', duration: '60 min', icon: '👑' },
  { key: 'smoothing', cat: 'treatments', duration: '120 min', icon: '✨' },
  { key: 'deepCondition', cat: 'treatments', duration: '45 min', icon: '💧' },
  { key: 'scalpTreatment', cat: 'treatments', duration: '45 min', icon: '🌿' },
  { key: 'beardTrim', cat: 'mens', duration: '20 min', icon: '🧔' },
  { key: 'hotTowels', cat: 'mens', duration: '30 min', icon: '🪒' },
];

const prices = {
  womenHaircut: { en: "$35", sr: "2.500 RSD" },
  menHaircut: { en: "$25", sr: "1.800 RSD" },
  kidsHaircut: { en: "$20", sr: "1.500 RSD" },
  basicColoring: { en: "$60", sr: "4.500 RSD" },
  balayage: { en: "$90", sr: "6.500 RSD" },
  ombre: { en: "$80", sr: "5.500 RSD" },
  highlights: { en: "$70", sr: "5.000 RSD" },
  blowout: { en: "$35", sr: "2.500 RSD" },
  updo: { en: "$80", sr: "5.500 RSD" },
  smoothing: { en: "$120", sr: "8.500 RSD" },
  deepCondition: { en: "$40", sr: "2.800 RSD" },
  scalpTreatment: { en: "$45", sr: "3.000 RSD" },
  beardTrim: { en: "$15", sr: "1.000 RSD" },
  hotTowels: { en: "$25", sr: "1.800 RSD" },
};

export default function Services() {
  const { t, language } = useTranslation();
  const [activeCat, setActiveCat] = useState('haircuts');

  const filtered = allServices.filter((s) => s.cat === activeCat);

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* HERO BANNER */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1600) center/cover no-repeat',
        color: 'var(--white)',
        textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            marginBottom: '15px',
          }}>
            {t('services.title')}
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>{t('services.subtitle')}</p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '50px',
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                style={{
                  padding: '12px 28px',
                  background: activeCat === cat ? 'var(--gold)' : 'transparent',
                  color: activeCat === cat ? 'var(--white)' : 'var(--black)',
                  border: `2px solid ${activeCat === cat ? 'var(--gold)' : 'var(--black)'}`,
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => {
                  if (activeCat !== cat) {
                    e.currentTarget.style.background = 'var(--gold)';
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.color = 'var(--white)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCat !== cat) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--black)';
                    e.currentTarget.style.color = 'var(--black)';
                  }
                }}
              >
                {t(`services.${cat}`)}
              </button>
            ))}
          </div>

          {/* SERVICES GRID */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
          }}>
            {filtered.map((svc) => (
              <div key={svc.key} style={{
                display: 'flex',
                gap: '20px',
                padding: '30px',
                border: '1px solid var(--gray-lighter)',
                transition: 'var(--transition)',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'var(--gold)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--gray-lighter)';
                }}
              >
                <div style={{
                  fontSize: '2.5rem',
                  minWidth: '60px',
                  textAlign: 'center',
                }}>
                  {svc.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.2rem',
                    marginBottom: '8px',
                  }}>
                    {t(`services.${svc.key}`)}
                  </h3>
                  <p style={{
                    color: 'var(--gray)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    marginBottom: '12px',
                  }}>
                    {t(`services.${svc.key}Desc`)}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span style={{
                      color: 'var(--gold)',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      fontFamily: 'var(--font-heading)',
                    }}>
                      {prices[svc.key]?.[language]}
                    </span>
                    <span style={{
                      color: 'var(--gray-light)',
                      fontSize: '0.85rem',
                    }}>
                      ⏱ {svc.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
