import { useState } from 'react';
import { useTranslation } from '../context/useTranslation';

export default function Contact() {
  const { t, language } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Server error');
      setSent(true);
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setError(language === 'en' ? 'Failed to send. Please try again.' : 'Greška pri slanju. Pokušajte ponovo.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid var(--gray-lighter)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    color: 'var(--black)',
    background: 'var(--white)',
    transition: 'var(--transition)',
    outline: 'none',
    borderRadius: 0,
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 500,
    fontSize: '0.9rem',
    color: 'var(--black)',
  };

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* HERO */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1596526131083-e8f2c00d5960?w=1600) center/cover no-repeat',
        color: 'var(--white)',
        textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            marginBottom: '15px',
          }}>
            {t('contact.title')}
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>{t('contact.subtitle')}</p>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
            marginBottom: '60px',
          }}>
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              background: 'var(--beige)',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📍</div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                marginBottom: '10px',
              }}>
                {t('contact.address')}
              </h3>
              <p style={{ color: 'var(--gray)', fontSize: '0.95rem' }}>
                {t('contact.addressValue')}
              </p>
            </div>

            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              background: 'var(--beige)',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📞</div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                marginBottom: '10px',
              }}>
                {t('contact.phone')}
              </h3>
              <a
                href="tel:+381601234567"
                style={{
                  color: 'var(--gray)',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray)'; }}
              >
                +381 60 123 4567
              </a>
              <div style={{ marginTop: '10px' }}>
                <a
                  href="tel:+381601234567"
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', padding: '10px 24px', display: 'inline-block' }}
                >
                  {t('contact.callNow')}
                </a>
              </div>
            </div>

            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              background: 'var(--beige)',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>✉️</div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                marginBottom: '10px',
              }}>
                {t('contact.email')}
              </h3>
              <a
                href="mailto:info@elegantsalon.com"
                style={{
                  color: 'var(--gray)',
                  fontSize: '0.95rem',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray)'; }}
              >
                info@elegantsalon.com
              </a>
            </div>

            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              background: 'var(--beige)',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🕐</div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                marginBottom: '10px',
              }}>
                {t('contact.hours')}
              </h3>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
                {t('contact.monFri')}: 9:00 - 20:00
              </p>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
                {t('contact.sat')}: 9:00 - 18:00
              </p>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
                {t('contact.sun')}: {t('contact.closed')}
              </p>
            </div>
          </div>

          {/* MAP + FORM */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px',
            alignItems: 'start',
          }}>
            {/* MAP */}
            <div style={{
              height: '450px',
              background: 'var(--beige)',
              border: '1px solid var(--gray-lighter)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'var(--gray)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🗺️</div>
              <p style={{ fontSize: '1rem' }}>Google Map</p>
              <p style={{ fontSize: '0.85rem', marginTop: '5px', textAlign: 'center', padding: '0 20px' }}>
                {language === 'en'
                  ? 'Replace with Google Maps embed iframe'
                  : 'Zamenite sa Google Maps embed iframe-om'}
              </p>
            </div>

            {/* FORM */}
            <div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                marginBottom: '25px',
              }}>
                {t('contact.formTitle')}
              </h3>

              {error && (
                <div style={{
                  padding: '15px',
                  background: '#fef2f2',
                  border: '1px solid #f87171',
                  marginBottom: '20px',
                  textAlign: 'center',
                  color: '#b91c1c',
                }}>
                  {error}
                </div>
              )}
              {sent && (
                <div style={{
                  padding: '15px',
                  background: 'var(--beige)',
                  border: '1px solid var(--gold)',
                  marginBottom: '20px',
                  textAlign: 'center',
                  color: 'var(--gold-dark)',
                }}>
                  {t('contact.formSuccess')}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>{t('contact.formName')} *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--gray-lighter)'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t('contact.formEmail')} *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--gray-lighter)'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t('contact.formMessage')} *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--gray-lighter)'; }}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  {t('contact.formSubmit')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
