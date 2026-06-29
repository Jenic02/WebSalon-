import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/useTranslation';

const prices = {
  womenHaircut: { en: "$35", sr: "2.500 RSD" },
  menHaircut: { en: "$25", sr: "1.800 RSD" },
  basicColoring: { en: "$60", sr: "4.500 RSD" },
  balayage: { en: "$90", sr: "6.500 RSD" },
  updo: { en: "$80", sr: "5.500 RSD" },
  beardTrim: { en: "$15", sr: "1.000 RSD" },
};

const serviceKeys = [
  "womenHaircut", "menHaircut", "basicColoring",
  "balayage", "updo", "beardTrim"
];

const teamKeys = [
  { name: "member1Name", role: "member1Role", desc: "member1Desc", color: "#C9A96E" },
  { name: "member2Name", role: "member2Role", desc: "member2Desc", color: "#DFC99A" },
  { name: "member3Name", role: "member3Role", desc: "member3Desc", color: "#C9A96E" },
  { name: "member4Name", role: "member4Role", desc: "member4Desc", color: "#E8DED1" },
];

const reviewKeys = [
  { text: "reviews.review1", author: "reviews.review1Author" },
  { text: "reviews.review2", author: "reviews.review2Author" },
  { text: "reviews.review3", author: "reviews.review3Author" },
];

export default function Home() {
  const { t, language } = useTranslation();
  const [visible, setVisible] = useState({});
  const refs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({ ...prev, [entry.target.dataset.section]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    Object.values(refs.current).forEach((r) => { if (r) observer.observe(r); });
    return () => observer.disconnect();
  }, []);

  const setRef = (key) => (el) => { refs.current[key] = el; };

  const animStyle = (key) => ({
    opacity: visible[key] ? 1 : 0,
    transform: visible[key] ? 'translateY(0)' : 'translateY(40px)',
    transition: 'opacity 0.8s ease, transform 0.8s ease',
  });

  return (
    <div>
      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600) center/cover no-repeat',
        color: 'var(--white)',
        textAlign: 'center',
        padding: '0 20px',
      }}>
        <div style={{ maxWidth: '800px' }}>
          <p style={{
            fontFamily: 'var(--font-heading)', fontStyle: 'italic',
            fontSize: '1.2rem', marginBottom: '20px', opacity: 0.9, letterSpacing: '2px',
          }}>
            {t('hero.subtitle')}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 600, marginBottom: '20px', lineHeight: 1.1,
          }}>
            {t('hero.title')}
          </h1>
          <p style={{
            fontSize: '1.2rem', fontWeight: 300, marginBottom: '40px', opacity: 0.9,
          }}>
            {t('hero.slogan')}
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/booking" className="btn btn-primary">{t('hero.bookBtn')}</Link>
            <Link to="/services" className="btn btn-secondary">{t('hero.servicesBtn')}</Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section ref={setRef('about')} data-section="about"
        style={{ ...animStyle('about'), padding: '100px 0', background: 'var(--beige)' }}>
        <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <h2 className="section-title">{t('about.title')}</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--gray)', lineHeight: 1.8, marginBottom: '50px' }}>
            {t('about.short')}
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px',
          }}>
            {[
              { label: t('about.experience') },
              { label: t('about.atmosphere') },
              { label: t('about.professional') },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '30px 20px', background: 'var(--white)', boxShadow: 'var(--shadow)',
              }}>
                <div style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '15px' }}>
                  {['✦', '♥', '◆'][i]}
                </div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>{item.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section ref={setRef('services')} data-section="services"
        style={{ ...animStyle('services'), padding: '100px 0' }}>
        <div className="container">
          <h2 className="section-title">{t('home.servicesTitle')}</h2>
          <p className="section-subtitle">{t('home.servicesSubtitle')}</p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px',
          }}>
            {serviceKeys.map((key) => (
              <div key={key} style={{
                padding: '40px 30px', textAlign: 'center',
                border: '1px solid var(--gray-lighter)', transition: 'var(--transition)', cursor: 'default',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = 'var(--gold)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--gray-lighter)';
                }}
              >
                <div style={{
                  width: '60px', height: '60px', margin: '0 auto 20px',
                  color: 'var(--gold)', fontSize: '2.5rem',
                }}>
                  {key.includes('color') || key === 'balayage' ? '🎨' :
                   key === 'updo' || key === 'styling' ? '💇' :
                   key === 'beardTrim' ? '🧔' : '✂️'}
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: '10px' }}>
                  {t(`services.${key}`)}
                </h3>
                <p style={{ color: 'var(--gray)', fontSize: '0.95rem', marginBottom: '15px', lineHeight: 1.6 }}>
                  {t(`services.${key}Desc`)}
                </p>
                <p style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>
                  {t('services.price')} {prices[key]?.[language]}
                </p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/services" className="btn btn-outline">{t('services.viewAll')}</Link>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section ref={setRef('gallery')} data-section="gallery"
        style={{ ...animStyle('gallery'), padding: '100px 0', background: 'var(--beige)' }}>
        <div className="container">
          <h2 className="section-title">{t('home.galleryTitle')}</h2>
          <p className="section-subtitle">{t('home.gallerySubtitle')}</p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px',
          }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                position: 'relative', height: '350px',
                background: `linear-gradient(135deg, var(--beige-dark) ${i * 20}%, var(--gold-light) ${i * 20 + 30}%)`,
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexDirection: 'column', color: 'var(--black)',
                  padding: '20px', textAlign: 'center',
                }}>
                  <span style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--gold-dark)', opacity: 0.5 }}>
                    ✂
                  </span>
                  <p style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--gray)' }}>
                    {language === 'en' ? 'Photo placeholder' : 'Mesto za fotografiju'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/gallery" className="btn btn-outline">{t('gallery.title')}</Link>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section ref={setRef('reviews')} data-section="reviews"
        style={{ ...animStyle('reviews'), padding: '100px 0' }}>
        <div className="container">
          <h2 className="section-title">{t('reviews.title')}</h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px',
          }}>
            {reviewKeys.map((rev, i) => (
              <div key={i} style={{
                padding: '40px', background: 'var(--beige)', position: 'relative',
              }}>
                <span style={{
                  fontFamily: 'var(--font-heading)', fontSize: '4rem', color: 'var(--gold)',
                  opacity: 0.3, position: 'absolute', top: '10px', left: '20px', lineHeight: 1,
                }}>"</span>
                <p style={{
                  color: 'var(--gray)', fontSize: '0.95rem', lineHeight: 1.8,
                  marginBottom: '20px', fontStyle: 'italic',
                }}>
                  {t(rev.text)}
                </p>
                <p style={{ fontWeight: 600, color: 'var(--black)' }}>
                  - {t(rev.author)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section ref={setRef('team')} data-section="team"
        style={{ ...animStyle('team'), padding: '100px 0', background: 'var(--beige)' }}>
        <div className="container">
          <h2 className="section-title">{t('team.title')}</h2>
          <p className="section-subtitle">{t('home.teamSubtitle')}</p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px',
          }}>
            {teamKeys.map((member, i) => (
              <div key={i} style={{
                textAlign: 'center', padding: '30px 20px',
                background: 'var(--white)', boxShadow: 'var(--shadow)',
                transition: 'var(--transition)',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              >
                <div style={{
                  width: '150px', height: '150px', borderRadius: '50%',
                  margin: '0 auto 20px',
                  background: `linear-gradient(135deg, ${member.color}, var(--beige-dark))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--white)', fontSize: '3rem', fontFamily: 'var(--font-heading)',
                }}>
                  {t(`team.${member.name}`).charAt(0)}
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '5px' }}>
                  {t(`team.${member.name}`)}
                </h3>
                <p style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                  {t(`team.${member.role}`)}
                </p>
                <p style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {t(`team.${member.desc}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT PREVIEW */}
      <section ref={setRef('contact')} data-section="contact"
        style={{ ...animStyle('contact'), padding: '100px 0' }}>
        <div className="container">
          <h2 className="section-title">{t('home.contactTitle')}</h2>
          <p className="section-subtitle">{t('home.contactSubtitle')}</p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px',
          }}>
            <div style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '15px' }}>📍</div>
              <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>{t('contact.address')}</h4>
              <p style={{ color: 'var(--gray)' }}>{t('contact.addressValue')}</p>
            </div>
            <div style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '15px' }}>📞</div>
              <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>{t('contact.phone')}</h4>
              <a href="tel:+381601234567" style={{ color: 'var(--gray)', transition: 'var(--transition)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray)'; }}
              >+381 60 123 4567</a>
            </div>
            <div style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '15px' }}>🕐</div>
              <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>{t('contact.hours')}</h4>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{t('contact.monFri')}: 9:00 - 20:00</p>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{t('contact.sat')}: 9:00 - 18:00</p>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{t('contact.sun')}: {t('contact.closed')}</p>
            </div>
          </div>
          <div style={{
            marginTop: '40px', height: '350px', background: 'var(--beige)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gray)', fontSize: '1.1rem',
            border: '1px solid var(--gray-lighter)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🗺️</div>
              <p>Google Map</p>
              <p style={{ fontSize: '0.85rem', marginTop: '5px' }}>
                ({language === 'en' ? 'Replace with actual Google Maps embed' : 'Zamenite sa Google Maps embed kodom'})
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, var(--black), var(--black-light))',
        color: 'var(--white)', textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '15px',
          }}>
            {language === 'en' ? 'Ready for a New Look?' : 'Spremni za Novi Izgled?'}
          </h2>
          <p style={{ color: 'var(--gray-light)', marginBottom: '30px', fontSize: '1.1rem' }}>
            {language === 'en'
              ? 'Book your appointment today and let us work our magic'
              : 'Zakažite termin danas i dozvolite nam da učinimo magiju'}
          </p>
          <Link to="/booking" className="btn btn-primary">{t('home.bookNow')}</Link>
        </div>
      </section>
    </div>
  );
}
