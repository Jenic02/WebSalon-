import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../context/useTranslation';

const stylistKeys = ['member1Name', 'member2Name', 'member3Name', 'member4Name'];

const serviceData = [
  { key: 'womenHaircut', priceEn: 35, priceSr: 2500, curEn: '$', curSr: 'RSD' },
  { key: 'menHaircut', priceEn: 25, priceSr: 1800, curEn: '$', curSr: 'RSD' },
  { key: 'kidsHaircut', priceEn: 20, priceSr: 1500, curEn: '$', curSr: 'RSD' },
  { key: 'basicColoring', priceEn: 60, priceSr: 4500, curEn: '$', curSr: 'RSD' },
  { key: 'balayage', priceEn: 90, priceSr: 6500, curEn: '$', curSr: 'RSD' },
  { key: 'ombre', priceEn: 80, priceSr: 5500, curEn: '$', curSr: 'RSD' },
  { key: 'highlights', priceEn: 70, priceSr: 5000, curEn: '$', curSr: 'RSD' },
  { key: 'blowout', priceEn: 40, priceSr: 2500, curEn: '$', curSr: 'RSD' },
  { key: 'updo', priceEn: 80, priceSr: 5500, curEn: '$', curSr: 'RSD' },
  { key: 'smoothing', priceEn: 120, priceSr: 8000, curEn: '$', curSr: 'RSD' },
  { key: 'deepCondition', priceEn: 45, priceSr: 3000, curEn: '$', curSr: 'RSD' },
  { key: 'scalpTreatment', priceEn: 55, priceSr: 3500, curEn: '$', curSr: 'RSD' },
  { key: 'beardTrim', priceEn: 20, priceSr: 1200, curEn: '$', curSr: 'RSD' },
  { key: 'hotTowels', priceEn: 30, priceSr: 2000, curEn: '$', curSr: 'RSD' },
];

const timeSlots = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30',
  '15:00','15:30','16:00','16:30','17:00','17:30',
  '18:00','18:30','19:00','19:30',
];

const monthNamesEn = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const monthNamesSr = ['Januar','Februar','Mart','April','Maj','Jun','Jul','Avgust','Septembar','Oktobar','Novembar','Decembar'];
const dayNamesEn = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const dayNamesSr = ['Pon','Uto','Sri','Čet','Pet','Sub','Ned'];

export default function Booking() {
  const { t, language } = useTranslation();

  const [step, setStep] = useState(1);
  const [selectedStylist, setSelectedStylist] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

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
    } catch {}
  }, []);

  useEffect(() => { fetchBooked(); }, [fetchBooked]);

  const slotsForDate = bookedSlots.filter((b) => b.date === selectedDate);

  const isSlotTaken = (slotTime) => {
    if (!selectedDate) return false;
    if (selectedStylist) {
      return slotsForDate.some(
        (b) => b.time === slotTime && b.stylistKey === selectedStylist
      );
    }
    const freeStylists = stylistKeys.filter(
      (sk) => !slotsForDate.some((b) => b.time === slotTime && b.stylistKey === sk)
    );
    return freeStylists.length === 0;
  };

  const getFreeCount = (slotTime) => {
    const busy = stylistKeys.filter(
      (sk) => slotsForDate.some((b) => b.time === slotTime && b.stylistKey === sk)
    ).length;
    return stylistKeys.length - busy;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstDay = new Date(calYear, calMonth, 1);
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const startDay = (firstDay.getDay() + 6) % 7;

  const canGoPrev = calYear > today.getFullYear() ||
    (calYear === today.getFullYear() && calMonth > today.getMonth());

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const monthNames = language === 'en' ? monthNamesEn : monthNamesSr;
  const dayNames = language === 'en' ? dayNamesEn : dayNamesSr;

  const formatDateStr = (d, m, y) =>
    `${y}-${(m + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;

  const goNext = () => setStep(s => s + 1);
  const goBack = () => setStep(s => s - 1);

  const canGoStep2 = selectedStylist !== '';
  const canGoStep3 = selectedService !== '';
  const canGoStep4 = selectedDate !== '' && selectedTime !== '';

  const resetBooking = () => {
    setStep(1);
    setSelectedStylist('');
    setSelectedService('');
    setSelectedDate('');
    setSelectedTime('');
    setName('');
    setPhone('');
    setNotes('');
    setSubmitted(false);
    setError('');
    setAssignedStylist('');
  };

  const handleSubmit = async () => {
    setError('');
    setAssignedStylist('');

    if (isSlotTaken(selectedTime)) {
      setError(language === 'en' ? 'This time slot is already taken.' : 'Ovaj termin je već zauzet.');
      return;
    }

    const stylistLabel = selectedStylist ? t(`team.${selectedStylist}`) : '';
    const serviceLabel = selectedService ? t(`services.${selectedService}`) : '';
    const svc = serviceData.find(s => s.key === selectedService);
    const priceStr = svc
      ? `${language === 'en' ? svc.curEn : svc.curSr}${language === 'en' ? svc.priceEn : svc.priceSr}`
      : '';

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, email: '', notes,
          service: serviceLabel,
          stylist: stylistLabel,
          stylistKey: selectedStylist || '',
          date: selectedDate,
          time: selectedTime,
          lang: language,
          price: priceStr,
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
      if (!selectedStylist && data.assignedStylist) {
        setAssignedStylist(data.assignedStylist);
      }
      fetchBooked();
    } catch (err) {
      setError(err.message || (language === 'en' ? 'Failed to send. Please try again.' : 'Greška pri slanju. Pokušajte ponovo.'));
    }
  };

  const price = (svc) => language === 'en'
    ? `${svc.curEn}${svc.priceEn}`
    : `${svc.priceSr} ${svc.curSr}`;

  const renderDateBtn = (d) => {
    const dateObj = new Date(calYear, calMonth, d);
    dateObj.setHours(0, 0, 0, 0);
    const isPast = dateObj < today;
    const isSunday = dateObj.getDay() === 0;
    const isToday = dateObj.getTime() === today.getTime();
    const dateStr = formatDateStr(d, calMonth, calYear);
    const disabled = isPast || isSunday;
    const selected = selectedDate === dateStr;
    return (
      <button
        key={d}
        disabled={disabled}
        className={`cal-day${isToday ? ' cal-today' : ''}${selected ? ' cal-selected' : ''}`}
        onClick={() => {
          if (disabled) return;
          setSelectedDate(dateStr);
          setSelectedTime('');
        }}
      >
        {d}
      </button>
    );
  };

  return (
    <div style={{ paddingTop: '80px' }}>
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

      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          {error && (
            <div style={{
              padding: '16px', background: '#fef2f2', border: '1px solid #f87171',
              marginBottom: '20px', textAlign: 'center', color: '#b91c1c',
            }}>{error}</div>
          )}

          {submitted ? (
            <div className="booking-wizard" style={{
              background: 'var(--white)', border: '1px solid var(--gray-lighter)',
              padding: '48px 24px', textAlign: 'center',
            }}>
              <div style={{
                width: '64px', height: '64px', margin: '0 auto 20px',
                borderRadius: '50%', background: 'var(--beige)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gold)', fontSize: '2rem',
              }}>&#10003;</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '8px' }}>
                {t('booking.success')}
              </h3>
              {assignedStylist && selectedStylist === '' && (
                <p style={{ marginBottom: '8px', color: 'var(--gold-dark)' }}>
                  {language === 'en' ? 'Your stylist:' : 'Vaš stilista:'} <strong>{assignedStylist}</strong>
                </p>
              )}
              <p style={{ color: 'var(--gray)', marginBottom: '24px', fontSize: '0.95rem' }}>
                {language === 'en' ? 'Confirmation has been sent.' : 'Potvrda je poslata.'}
              </p>
              <button className="btn btn-primary" onClick={resetBooking}>
                {language === 'en' ? 'Book Another' : 'Zakaži novi termin'}
              </button>
            </div>
          ) : (
            <div className="booking-wizard" style={{
              background: 'var(--white)', border: '1px solid var(--gray-lighter)',
            }}>
              {/* STEP INDICATOR */}
              <div className="wizard-steps" style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                borderBottom: '1px solid var(--gray-lighter)',
                background: 'var(--beige-light)',
              }}>
                {[
                  { en: 'Stylist', sr: 'Stilista' },
                  { en: 'Service', sr: 'Usluga' },
                  { en: 'Date & Time', sr: 'Datum & Vreme' },
                  { en: 'Confirm', sr: 'Potvrda' },
                ].map((label, i) => {
                  const num = i + 1;
                  const active = step === num;
                  const done = step > num;
                  return (
                    <div key={num} className={`wiz-step${active ? ' active' : ''}${done ? ' done' : ''}`} style={{
                      padding: '16px 8px', textAlign: 'center', opacity: done ? 0.7 : active ? 1 : 0.4,
                      transition: 'var(--transition)',
                    }}>
                      <div style={{
                        width: '32px', height: '32px', margin: '0 auto 6px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.85rem', fontWeight: 700, transition: 'var(--transition)',
                        background: done ? 'var(--gold)' : active ? 'var(--gold)' : 'transparent',
                        border: `2px solid ${done ? 'var(--gold)' : active ? 'var(--gold)' : 'var(--gray-lighter)'}`,
                        color: done || active ? 'var(--white)' : 'var(--gray)',
                      }}>{done ? '\u2713' : num}</div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray)' }}>
                        {language === 'en' ? label.en : label.sr}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* STEP 1: STYLIST */}
              <div className="wizard-body" style={{ padding: '32px 36px' }}>
                {step === 1 && (
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: '8px',
                    }}>{language === 'en' ? 'Choose your stylist' : 'Izaberite stilistu'}</h3>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '20px' }}>
                      {language === 'en' ? 'Choose your preferred stylist.' : 'Izaberite vašeg omiljenog stilistu.'}
                    </p>
                    <div style={{
                      display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px',
                    }}>
                      {stylistKeys.map((sk) => (
                        <div
                          key={sk}
                          className={`sel-card${selectedStylist === sk ? ' sel-selected' : ''}`}
                          onClick={() => setSelectedStylist(sk)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px',
                            border: `2px solid ${selectedStylist === sk ? 'var(--gold)' : 'var(--gray-lighter)'}`,
                            borderRadius: '8px', cursor: 'pointer', transition: 'var(--transition)',
                            background: selectedStylist === sk ? 'var(--beige)' : 'var(--white)',
                          }}
                        >
                          <div style={{
                            width: '44px', height: '44px', borderRadius: '50%',
                            background: selectedStylist === sk ? 'var(--gold)' : 'var(--gray-lighter)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '1rem',
                            color: selectedStylist === sk ? 'var(--white)' : 'var(--gray)',
                          }}>{t(`team.${sk}`).charAt(0)}</div>
                          <div style={{ flex: 1 }}>
                            <strong style={{ display: 'block', fontSize: '1rem' }}>{t(`team.${sk}`)}</strong>
                            <span style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>{t(`team.${sk}Role`)}</span>
                          </div>
                          {selectedStylist === sk && <span style={{ color: 'var(--gold)', fontWeight: 700 }}>&#10003;</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <button className="btn btn-primary" disabled={!canGoStep2} onClick={goNext}>
                        {language === 'en' ? 'Next' : 'Dalje'}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: SERVICE */}
                {step === 2 && (
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: '8px',
                    }}>{language === 'en' ? 'Choose a service' : 'Izaberite uslugu'}</h3>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '20px' }}>
                      {language === 'en' ? 'Select the service you need.' : 'Izaberite uslugu koja vam je potrebna.'}
                    </p>
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px',
                    }}>
                      {serviceData.map((svc) => (
                        <div
                          key={svc.key}
                          className={`sel-card${selectedService === svc.key ? ' sel-selected' : ''}`}
                          onClick={() => setSelectedService(svc.key)}
                          style={{
                            padding: '18px', textAlign: 'center', position: 'relative',
                            border: `2px solid ${selectedService === svc.key ? 'var(--gold)' : 'var(--gray-lighter)'}`,
                            borderRadius: '8px', cursor: 'pointer', transition: 'var(--transition)',
                            background: selectedService === svc.key ? 'var(--beige)' : 'var(--white)',
                          }}
                        >
                          <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '4px' }}>
                            {t(`services.${svc.key}`)}
                          </strong>
                          <span style={{ fontSize: '0.85rem', color: 'var(--gold-dark)', fontWeight: 600 }}>
                            {price(svc)}
                          </span>
                          {selectedService === svc.key && (
                            <span style={{
                              position: 'absolute', top: '8px', right: '8px',
                              width: '20px', height: '20px', borderRadius: '50%',
                              background: 'var(--gold)', color: 'var(--white)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.7rem', fontWeight: 700,
                            }}>&#10003;</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                      <button className="btn" onClick={goBack} style={{ border: '1px solid var(--gray-lighter)', background: 'var(--white)' }}>
                        {language === 'en' ? 'Back' : 'Nazad'}
                      </button>
                      <button className="btn btn-primary" disabled={!canGoStep3} onClick={goNext}>
                        {language === 'en' ? 'Next' : 'Dalje'}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: DATE & TIME */}
                {step === 3 && (
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: '8px',
                    }}>{language === 'en' ? 'Choose date & time' : 'Izaberite datum i vreme'}</h3>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '20px' }}>
                      {language === 'en' ? 'Pick a date and available time slot.' : 'Izaberite datum i slobodan termin.'}
                    </p>
                    <div className="datetime-grid" style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px',
                    }}>
                      {/* Calendar */}
                      <div style={{
                        border: '1px solid var(--gray-lighter)', borderRadius: '8px', padding: '16px',
                      }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px',
                        }}>
                          <button
                            onClick={prevMonth}
                            disabled={!canGoPrev}
                            style={{
                              background: 'none', border: '1px solid var(--gray-lighter)', borderRadius: '50%',
                              width: '30px', height: '30px', cursor: 'pointer', fontSize: '0.9rem',
                              opacity: canGoPrev ? 1 : 0.3, color: 'var(--black)',
                            }}
                          >&lt;</button>
                          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                            {monthNames[calMonth]} {calYear}
                          </span>
                          <button
                            onClick={nextMonth}
                            style={{
                              background: 'none', border: '1px solid var(--gray-lighter)', borderRadius: '50%',
                              width: '30px', height: '30px', cursor: 'pointer', fontSize: '0.9rem',
                              color: 'var(--black)',
                            }}
                          >&gt;</button>
                        </div>
                        <div style={{
                          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '6px',
                        }}>
                          {dayNames.map(d => (
                            <span key={d} style={{
                              textAlign: 'center', fontSize: '0.7rem', color: 'var(--gray)',
                              fontWeight: 600, textTransform: 'uppercase', padding: '4px 0',
                            }}>{d}</span>
                          ))}
                        </div>
                        <div style={{
                          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px',
                        }}>
                          {Array.from({ length: startDay }, (_, i) => (
                            <div key={`e${i}`} />
                          ))}
                          {Array.from({ length: daysInMonth }, (_, i) => renderDateBtn(i + 1))}
                        </div>
                      </div>

                      {/* Time slots */}
                      <div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '12px' }}>
                          {selectedDate
                            ? (language === 'en' ? 'Available times:' : 'Dostupni termini:')
                            : (language === 'en' ? 'Select a date first' : 'Prvo izaberite datum')}
                        </p>
                        <div className="time-grid" style={{
                          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px',
                          maxHeight: '280px', overflowY: 'auto',
                        }}>
                          {selectedDate ? (
                            timeSlots.map(slot => {
                              const taken = isSlotTaken(slot);
                              const [h, m] = slot.split(':').map(Number);
                              const [ySel, mSel, dSel] = selectedDate.split('-').map(Number);
                              const slotDate = new Date(ySel, mSel - 1, dSel, h, m);
                              const isPastTime = slotDate < new Date();
                              const disabled = taken || isPastTime;
                              const cls = `tslot${selectedTime === slot ? ' tslot-sel' : ''}${disabled ? ' tslot-dis' : ''}${!disabled ? ' tslot-free' : ''}`;
                              return (
                                <button
                                  key={slot}
                                  disabled={disabled}
                                  className={cls}
                                  onClick={() => setSelectedTime(slot)}
                                >
                                  {slot}
                                  {taken && !isPastTime && <span className="tslot-badge">&nbsp;{language === 'en' ? '(taken)' : '(zauzeto)'}</span>}
                                  {isPastTime && <span className="tslot-badge">&nbsp;—</span>}
                                </button>
                              );
                            })
                          ) : (
                            <span style={{
                              gridColumn: '1 / -1', textAlign: 'center', color: 'var(--gray)',
                              padding: '24px 0', fontSize: '0.9rem',
                            }}>
                              {language === 'en' ? 'Select a date' : 'Izaberite datum'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                      <button className="btn" onClick={goBack} style={{ border: '1px solid var(--gray-lighter)', background: 'var(--white)' }}>
                        {language === 'en' ? 'Back' : 'Nazad'}
                      </button>
                      <button className="btn btn-primary" disabled={!canGoStep4} onClick={goNext}>
                        {language === 'en' ? 'Next' : 'Dalje'}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: CONFIRM */}
                {step === 4 && (
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: '20px', textAlign: 'center',
                    }}>{language === 'en' ? 'Confirm your booking' : 'Potvrdite termin'}</h3>

                    <div style={{
                      background: 'var(--beige)', border: '1px solid var(--gray-lighter)',
                      borderRadius: '8px', padding: '20px', marginBottom: '20px',
                    }}>
                      {[
                        { label: language === 'en' ? 'Stylist' : 'Stilista', value: t(`team.${selectedStylist}`) },
                        { label: language === 'en' ? 'Service' : 'Usluga', value: t(`services.${selectedService}`) },
                        { label: language === 'en' ? 'Price' : 'Cena', value: price(serviceData.find(s => s.key === selectedService)) },
                        { label: language === 'en' ? 'Date' : 'Datum', value: selectedDate ? `${parseInt(selectedDate.split('-')[2])}. ${monthNames[parseInt(selectedDate.split('-')[1]) - 1]} ${selectedDate.split('-')[0]}.` : '' },
                        { label: language === 'en' ? 'Time' : 'Vreme', value: selectedTime },
                      ].map((item, i, arr) => (
                        <div key={i} style={{
                          display: 'flex', justifyContent: 'space-between',
                          padding: '10px 0',
                          borderBottom: i < arr.length - 1 ? '1px solid var(--gray-lighter)' : 'none',
                        }}>
                          <span style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{item.label}</span>
                          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                      <input
                        type="text"
                        placeholder={language === 'en' ? 'Full Name *' : 'Ime i prezime *'}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        style={{
                          width: '100%', padding: '14px 16px',
                          border: '1px solid var(--gray-lighter)', borderRadius: '8px',
                          fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                          outline: 'none', transition: 'var(--transition)',
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--gray-lighter)'}
                      />
                      <input
                        type="tel"
                        placeholder={language === 'en' ? 'Phone Number *' : 'Broj telefona *'}
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                        style={{
                          width: '100%', padding: '14px 16px',
                          border: '1px solid var(--gray-lighter)', borderRadius: '8px',
                          fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                          outline: 'none', transition: 'var(--transition)',
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--gray-lighter)'}
                      />
                      <textarea
                        placeholder={language === 'en' ? 'Notes (optional)' : 'Napomene (opciono)'}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        rows={3}
                        style={{
                          width: '100%', padding: '14px 16px',
                          border: '1px solid var(--gray-lighter)', borderRadius: '8px',
                          fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                          outline: 'none', transition: 'var(--transition)', resize: 'vertical',
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--gray-lighter)'}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                      <button className="btn" onClick={goBack} style={{ border: '1px solid var(--gray-lighter)', background: 'var(--white)' }}>
                        {language === 'en' ? 'Back' : 'Nazad'}
                      </button>
                      <button
                        className="btn btn-primary"
                        disabled={!name.trim() || !phone.trim()}
                        onClick={handleSubmit}
                      >
                        {language === 'en' ? 'Confirm Booking' : 'Potvrdi termin'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .sel-card { transition: all 0.25s ease; }
        .sel-card:hover { border-color: var(--gold) !important; }

        .cal-day {
          aspect-ratio: 1; border: none; border-radius: 50%;
          background: transparent; color: var(--black);
          font-size: 0.85rem; cursor: pointer; transition: 0.2s;
          font-family: var(--font-body);
        }
        .cal-day:hover:not(:disabled) { background: var(--beige); }
        .cal-day:disabled { color: var(--gray-lighter); cursor: not-allowed; }
        .cal-today { border: 1px solid var(--gray-lighter) !important; }
        .cal-selected { background: var(--gold) !important; color: var(--white) !important; font-weight: 600; }

        .tslot {
          padding: 10px; border: 1px solid var(--gray-lighter); border-radius: 6px;
          text-align: center; font-size: 0.85rem; cursor: pointer; transition: 0.2s;
          background: var(--white); font-family: var(--font-body); color: var(--black);
          position: relative;
        }
        .tslot-free { border-color: #86efac !important; background: #f0fdf4 !important; color: #166534 !important; }
        .tslot-free:hover { border-color: #22c55e !important; }
        .tslot-sel { border-color: var(--gold) !important; background: var(--beige) !important; font-weight: 600; color: var(--gold-dark) !important; }
        .tslot-dis { opacity: 0.5; cursor: not-allowed; background: #f9fafb !important; color: #9ca3af !important; text-decoration: line-through; }
        .tslot-badge { font-size: 0.7rem; }

        @media (max-width: 650px) {
          .wizard-body { padding: 20px 16px !important; }
          .datetime-grid { grid-template-columns: 1fr !important; }
          .wizard-body h3 { font-size: 1.1rem !important; }
        }
      `}</style>
    </div>
  );
}
