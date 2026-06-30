import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../context/useTranslation';

const serviceKeys = [
  'womenHaircut', 'menHaircut', 'kidsHaircut', 'basicColoring',
  'balayage', 'ombre', 'highlights', 'blowout', 'updo',
  'smoothing', 'deepCondition', 'scalpTreatment', 'beardTrim', 'hotTowels',
];

const stylistKeys = ['member1Name', 'member2Name', 'member3Name', 'member4Name'];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
];

export default function Booking() {
  const { t, language } = useTranslation();
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    service: '', stylist: '', date: '', time: '', notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [assignedStylist, setAssignedStylist] = useState('');

  const fetchBooked = useCallback(async () => {
    try {
      const res = await fetch('/api/booked-slots');
      if (res.ok) {
        const data = await res.json();
        setBookedSlots(data.slots || []);
      }
    } catch { /* server nije dostupan */ }
  }, []);

  useEffect(() => { fetchBooked(); }, [fetchBooked]);

  const slotsForDate = bookedSlots.filter((b) => b.date === form.date);

  const isSlotTaken = (slotTime) => {
    if (!form.date) return false;
    if (form.stylist) {
      return slotsForDate.some(
        (b) => b.time === slotTime && b.stylistKey === form.stylist
      );
    }
    const freeStylists = stylistKeys.filter(
      (sk) => !slotsForDate.some((b) => b.time === slotTime && b.stylistKey === sk)
    );
    return freeStylists.length === 0;
  };

  useEffect(() => {
    if (form.time && form.date && isSlotTaken(form.time)) {
      setForm((prev) => ({ ...prev, time: '' }));
    }
  }, [form.date, form.stylist, bookedSlots]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAssignedStylist('');

    if (isSlotTaken(form.time)) {
      setError(language === 'en' ? 'This time slot is already taken.' : 'Ovaj termin je već zauzet.');
      return;
    }

    const stylistLabel = form.stylist ? t(`team.${form.stylist}`) : '';
    const serviceLabel = form.service ? t(`services.${form.service}`) : '';

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          service: serviceLabel,
          stylist: stylistLabel,
          stylistKey: form.stylist || '',
          lang: language,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        if (data.errorCode === 'ALL_STYLISTS_BUSY') {
          throw new Error(language === 'en' ? 'All stylists are busy at this time.' : 'Svi stilisti su zauzeti u ovom terminu.');
        }
        throw new Error(data.error || 'Server error');
      }
      const data = await res.json();
      setSubmitted(true);
      if (!form.stylist && data.assignedStylist) {
        setAssignedStylist(data.assignedStylist);
      }
      setForm({ name: '', phone: '', email: '', service: '', stylist: '', date: '', time: '', notes: '' });
      fetchBooked();
      setTimeout(() => { setSubmitted(false); setAssignedStylist(''); }, 6000);
    } catch (err) {
      setError(err.message || (language === 'en' ? 'Failed to send. Please try again.' : 'Greška pri slanju. Pokušajte ponovo.'));
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
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=1600) center/cover no-repeat',
        color: 'var(--white)',
        textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            marginBottom: '15px',
          }}>
            {t('booking.title')}
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>{t('booking.subtitle')}</p>
        </div>
      </section>

      {/* FORM */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          {error && (
            <div style={{
              padding: '20px',
              background: '#fef2f2',
              border: '1px solid #f87171',
              marginBottom: '30px',
              textAlign: 'center',
              color: '#b91c1c',
            }}>
              {error}
            </div>
          )}
          {submitted && (
            <div style={{
              padding: '20px',
              background: 'var(--beige)',
              border: '1px solid var(--gold)',
              marginBottom: '30px',
              textAlign: 'center',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem',
              color: 'var(--gold-dark)',
            }}>
              {t('booking.success')}
              {assignedStylist && (
                <div style={{ marginTop: '8px', fontSize: '0.95rem', fontWeight: 400 }}>
                  {language === 'en' ? 'Your stylist:' : 'Vaš stilista:'} <strong>{assignedStylist}</strong>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={labelStyle}>{t('booking.name')} *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder={t('booking.namePlaceholder')}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--gray-lighter)'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>{t('booking.phone')} *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder={t('booking.phonePlaceholder')}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--gray-lighter)'; }}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>{t('booking.email')}</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t('booking.emailPlaceholder')}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--gray-lighter)'; }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={labelStyle}>{t('booking.service')} *</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--gray-lighter)'; }}
                >
                  <option value="">{t('booking.chooseService')}</option>
                  {serviceKeys.map((s) => (
                    <option key={s} value={s}>{t(`services.${s}`)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{t('booking.stylist')}</label>
                <select
                  name="stylist"
                  value={form.stylist}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--gray-lighter)'; }}
                >
                  <option value="">{t('booking.anyone')}</option>
                  {stylistKeys.map((s) => (
                    <option key={s} value={s}>{t(`team.${s}`)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={labelStyle}>{t('booking.date')} *</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--gray-lighter)'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>{t('booking.time')} *</label>
                <select
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--gray-lighter)'; }}
                >
                  <option value="">{t('booking.time')}</option>
                  {timeSlots.map((slot) => {
                    const taken = isSlotTaken(slot);
                    let extra = '';
                    if (!form.stylist && form.date) {
                      const busyCount = stylistKeys.filter(
                        (sk) => slotsForDate.some((b) => b.time === slot && b.stylistKey === sk)
                      ).length;
                      const freeCount = stylistKeys.length - busyCount;
                      if (freeCount === 0) {
                        extra = language === 'en' ? ' (all busy)' : ' (zauzeto)';
                      } else if (freeCount < stylistKeys.length) {
                        extra = ` (${freeCount} ${language === 'en' ? 'free' : 'slobodna'})`;
                      }
                    } else if (taken) {
                      extra = language === 'en' ? ' (taken)' : ' (zauzeto)';
                    }
                    const label = slot + extra;
                    return (
                      <option key={slot} value={slot} disabled={taken} style={taken ? { color: '#ccc', textDecoration: 'line-through' } : {}}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>{t('booking.notes')}</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder={t('booking.notesPlaceholder')}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--gray-lighter)'; }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'center', marginTop: '10px' }}>
              {t('booking.submit')}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
