import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../context/useTranslation';

const stylistKeys = ['member1Name', 'member2Name', 'member3Name', 'member4Name'];

const monthNamesSr = ['Januar','Februar','Mart','April','Maj','Jun','Jul','Avgust','Septembar','Oktobar','Novembar','Decembar'];

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d}. ${monthNamesSr[m - 1]} ${y}.`;
}

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d}.${m}.${y}.`;
}

export default function Admin() {
  const { language } = useTranslation();

  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStylist, setFilterStylist] = useState('');
  const [search, setSearch] = useState('');

  const api = async (url, opts = {}) => {
    const headers = { ...opts.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { ...opts, headers });
    if (res.status === 401) {
      localStorage.removeItem('adminToken');
      setToken('');
      return null;
    }
    return res.json();
  };

  const doLogin = async () => {
    setLoginError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) { setLoginError(language === 'en' ? 'Wrong password' : 'Pogrešna lozinka'); return; }
    const data = await res.json();
    localStorage.setItem('adminToken', data.token);
    setToken(data.token);
    setPassword('');
  };

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({ limit: '200' });
    if (filterStylist) params.set('stylist', filterStylist);
    if (search.trim()) params.set('search', search.trim());

    const [bData, sData] = await Promise.all([
      api(`/api/admin/bookings?${params}`),
      api('/api/admin/bookings/stats'),
    ]);
    if (bData) setBookings(bData.bookings || []);
    if (sData) setStats(sData);
    setLoading(false);
  }, [token, filterStylist, search]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (!confirm(language === 'en' ? 'Delete this booking?' : 'Obriši ovaj termin?')) return;
    const data = await api(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    if (data) fetchData();
  };

  const exportCSV = () => {
    if (bookings.length === 0) return;
    const headers = ['Stilista', 'Usluga', 'Datum', 'Vreme', 'Ime', 'Telefon', 'Napomena', 'Zakazano'];
    const rows = bookings.map(b => [
      b.stylist || '', b.service || '', b.date || '', b.time || '',
      b.name || '', b.phone || '', b.notes || '',
      b.createdAt ? new Date(b.createdAt).toLocaleString('sr-RS') : '',
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `termini_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f0' }}>
        <div style={{ background: '#fff', padding: '40px', border: '1px solid #e5e0d8', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: '8px', color: 'var(--gold-dark)' }}>
            {language === 'en' ? 'Admin Login' : 'Admin prijava'}
          </h1>
          <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '24px' }}>
            {language === 'en' ? 'Enter admin password' : 'Unesite admin lozinku'}
          </p>
          {loginError && <p style={{ color: '#b91c1c', marginBottom: '12px', fontSize: '0.85rem' }}>{loginError}</p>}
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doLogin()}
            placeholder={language === 'en' ? 'Password' : 'Lozinka'}
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #e5e0d8', fontSize: '0.95rem', marginBottom: '16px', outline: 'none' }}
          />
          <button onClick={doLogin} className="btn btn-primary" style={{ width: '100%' }}>
            {language === 'en' ? 'Login' : 'Prijavi se'}
          </button>
        </div>
      </div>
    );
  }

  const today = stats?.today ?? 0;
  const total = stats?.total ?? 0;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0', paddingBottom: '40px' }}>
      {/* Admin Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e0d8', padding: '16px 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--gold-dark)' }}>
            Elegant Salon <span style={{ color: '#999', fontSize: '0.85rem', fontFamily: 'var(--font-body)', fontWeight: 400 }}>Admin</span>
          </h1>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn" onClick={exportCSV} style={{ border: '1px solid #e5e0d8', background: '#fff', fontSize: '0.85rem' }}>
              {language === 'en' ? 'Export CSV' : 'Izvezi CSV'}
            </button>
            <button className="btn" onClick={fetchData} style={{ border: '1px solid #e5e0d8', background: '#fff', fontSize: '0.85rem' }}>
              {language === 'en' ? 'Refresh' : 'Osveži'}
            </button>
            <button className="btn" onClick={() => { localStorage.removeItem('adminToken'); setToken(''); }} style={{ border: '1px solid #e5e0d8', background: '#fff', fontSize: '0.85rem' }}>
              {language === 'en' ? 'Logout' : 'Odjavi se'}
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: '#fff', border: '1px solid #e5e0d8', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>{today}</div>
            <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '4px' }}>
              {language === 'en' ? "Today's bookings" : 'Današnji termini'}
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e0d8', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--black)' }}>{total}</div>
            <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '4px' }}>
              {language === 'en' ? 'Total bookings' : 'Ukupno termina'}
            </div>
          </div>
          {stats?.perStylist?.map(s => (
            <div key={s.key} style={{ background: '#fff', border: '1px solid #e5e0d8', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold-dark)' }}>{s.count}</div>
              <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '4px' }}>{s.name}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterStylist('')}
              style={{
                padding: '6px 16px', borderRadius: '100px', border: '1px solid #e5e0d8',
                background: !filterStylist ? 'var(--gold)' : 'transparent',
                color: !filterStylist ? '#fff' : '#666', cursor: 'pointer', fontSize: '0.85rem',
              }}
            >{language === 'en' ? 'All' : 'Svi'}</button>
            {stylistKeys.map(sk => (
              <button
                key={sk}
                onClick={() => setFilterStylist(sk === filterStylist ? '' : sk)}
                style={{
                  padding: '6px 16px', borderRadius: '100px', border: '1px solid #e5e0d8',
                  background: filterStylist === sk ? 'var(--gold)' : 'transparent',
                  color: filterStylist === sk ? '#fff' : '#666', cursor: 'pointer', fontSize: '0.85rem',
                }}
              >{/* We need translation context for the stylist names... but admin is Serbian-focused */}
              {sk === 'member1Name' ? 'Marija' : sk === 'member2Name' ? 'Jelena' : sk === 'member3Name' ? 'Ana' : 'Nikola'}</button>
            ))}
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={language === 'en' ? 'Search...' : 'Pretraži...'}
            style={{ padding: '8px 14px', border: '1px solid #e5e0d8', borderRadius: '8px', fontSize: '0.85rem', flex: 1, minWidth: '180px', outline: 'none' }}
          />
        </div>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #e5e0d8', borderRadius: '8px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#999' }}>
              {language === 'en' ? 'Loading...' : 'Učitavanje...'}
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#999' }}>
              {language === 'en' ? 'No bookings found' : 'Nema termina'}
            </div>
          ) : (
            <>
              {/* Table header - desktop */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.8fr 0.8fr 1fr 0.8fr 0.5fr',
                gap: '8px', padding: '12px 20px', fontSize: '0.75rem', fontWeight: 600,
                textTransform: 'uppercase', color: '#999', borderBottom: '1px solid #e5e0d8',
              }} className="admin-th">
                <span>{language === 'en' ? 'Date' : 'Datum'}</span>
                <span>{language === 'en' ? 'Client' : 'Klijent'}</span>
                <span>{language === 'en' ? 'Time' : 'Vreme'}</span>
                <span>{language === 'en' ? 'Service' : 'Usluga'}</span>
                <span>{language === 'en' ? 'Stylist' : 'Stilista'}</span>
                <span>{language === 'en' ? 'Phone' : 'Telefon'}</span>
                <span></span>
              </div>
              {/* Table rows */}
              {bookings.map(b => (
                <div key={b._id} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.8fr 0.8fr 1fr 0.8fr 0.5fr',
                  gap: '8px', padding: '12px 20px', fontSize: '0.9rem',
                  borderBottom: '1px solid #f0ede8', alignItems: 'center',
                  transition: 'background 0.2s',
                }} className="admin-tr">
                  <span data-label="Datum:" style={{ fontSize: '0.85rem' }}>{formatDate(b.date)}</span>
                  <span data-label="Klijent:" style={{ fontWeight: 500 }}>{b.name}</span>
                  <span data-label="Vreme:" style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{b.time}</span>
                  <span data-label="Usluga:" style={{ fontSize: '0.85rem', color: '#666' }}>{b.service}</span>
                  <span data-label="Stilista:" style={{ fontSize: '0.85rem' }}>{b.stylist}</span>
                  <span data-label="Telefon:" style={{ fontSize: '0.85rem', color: '#666' }}>{b.phone}</span>
                  <span style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(b._id)}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', padding: '4px 8px' }}
                      title={language === 'en' ? 'Delete' : 'Obriši'}
                    >&#10005;</button>
                  </span>
                </div>
              ))}
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#ccc', fontSize: '0.8rem', marginTop: '24px' }}>
          {language === 'en' ? 'Auto-refreshes every 30s' : 'Automatsko osvežavanje na 30s'}
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-th { display: none !important; }
          .admin-tr {
            grid-template-columns: 1fr !important;
            gap: 4px !important;
            padding: 14px 16px !important;
            font-size: 0.85rem !important;
          }
          .admin-tr span { display: flex; gap: 8px; }
          .admin-tr span::before {
            content: attr(data-label);
            color: #999;
            font-size: 0.75rem;
            min-width: 70px;
            font-weight: 600;
          }
        }
      `}</style>
    </div>
  );
}
