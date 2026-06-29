import { useTranslation } from '../context/useTranslation';

const teamKeys = [
  { name: "member1Name", role: "member1Role", desc: "member1Desc", color: "#C9A96E" },
  { name: "member2Name", role: "member2Role", desc: "member2Desc", color: "#DFC99A" },
  { name: "member3Name", role: "member3Role", desc: "member3Desc", color: "#C9A96E" },
  { name: "member4Name", role: "member4Role", desc: "member4Desc", color: "#E8DED1" },
];

export default function About() {
  const { t, language } = useTranslation();

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* HERO */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1600) center/cover no-repeat',
        color: 'var(--white)',
        textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            marginBottom: '15px',
          }}>
            {t('about.title')}
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            {t('about.short')}
          </p>
        </div>
      </section>

      {/* STORY */}
      <section style={{ padding: '100px 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '50px',
            alignItems: 'center',
          }}>
            <div style={{
              height: '400px',
              background: 'linear-gradient(135deg, var(--beige-dark), var(--gold-light))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
              color: 'var(--gold-dark)',
            }}>
              ✂
            </div>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                marginBottom: '20px',
              }}>
                {t('about.storyTitle')}
              </h2>
              <p style={{
                color: 'var(--gray)',
                lineHeight: 1.8,
                fontSize: '1.05rem',
              }}>
                {t('about.story')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ padding: '100px 0', background: 'var(--beige)' }}>
        <div className="container">
          <h2 className="section-title">{t('about.meetTeam')}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '30px',
            marginTop: '50px',
          }}>
            {teamKeys.map((member, i) => (
              <div key={i} style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'var(--white)',
                boxShadow: 'var(--shadow)',
                transition: 'var(--transition)',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              >
                <div style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  margin: '0 auto 20px',
                  background: `linear-gradient(135deg, ${member.color}, var(--beige-dark))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--white)',
                  fontSize: '3.5rem',
                  fontFamily: 'var(--font-heading)',
                }}>
                  {t(`team.${member.name}`).charAt(0)}
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: '5px' }}>
                  {t(`team.${member.name}`)}
                </h3>
                <p style={{
                  color: 'var(--gold)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px',
                }}>
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

      {/* CERTIFICATIONS */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <h2 className="section-title">{t('about.certifications')}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '30px',
            marginTop: '50px',
          }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                padding: '40px 20px',
                textAlign: 'center',
                border: '1px solid var(--gray-lighter)',
                transition: 'var(--transition)',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--gray-lighter)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '15px', color: 'var(--gold)' }}>
                  {['🏆', '📜', '🥇', '🎓'][i - 1]}
                </div>
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  color: 'var(--black)',
                }}>
                  {t(`about.cert${i}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERIOR */}
      <section style={{ padding: '100px 0', background: 'var(--beige)' }}>
        <div className="container">
          <h2 className="section-title">{t('about.interior')}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '50px',
          }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                height: '300px',
                background: `linear-gradient(135deg, var(--beige-dark) ${i * 25}%, var(--gold-light) ${i * 25 + 30}%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                color: 'var(--gold-dark)',
              }}>
                {language === 'en' ? 'Interior Photo' : 'Foto enterijera'}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
