import { useState } from 'react';
import { useTranslation } from '../context/useTranslation';
import ImageModal from '../components/ImageModal';

const categories = ['all', 'hairstyles', 'interior', 'beforeAfter'];

const galleryItems = [
  { id: 1, cat: 'hairstyles', title: 'Elegant Updo', gradient: ['#C9A96E', '#E8DED1'] },
  { id: 2, cat: 'hairstyles', title: 'Beach Waves', gradient: ['#DFC99A', '#F8F5F0'] },
  { id: 3, cat: 'hairstyles', title: 'Blunt Bob', gradient: ['#A8884A', '#E8DED1'] },
  { id: 4, cat: 'hairstyles', title: 'Long Layers', gradient: ['#C9A96E', '#F8F5F0'] },
  { id: 5, cat: 'hairstyles', title: 'Braided Crown', gradient: ['#DFC99A', '#E8DED1'] },
  { id: 6, cat: 'hairstyles', title: 'Sleek Ponytail', gradient: ['#A8884A', '#F8F5F0'] },
  { id: 7, cat: 'interior', title: 'Salon Reception', gradient: ['#E8DED1', '#C9A96E'] },
  { id: 8, cat: 'interior', title: 'Styling Station', gradient: ['#F8F5F0', '#DFC99A'] },
  { id: 9, cat: 'interior', title: 'Wash Area', gradient: ['#E8DED1', '#C9A96E'] },
  { id: 10, cat: 'beforeAfter', title: 'Color Transformation', gradient: ['#A8884A', '#C9A96E'] },
  { id: 11, cat: 'beforeAfter', title: 'Cut & Style', gradient: ['#C9A96E', '#DFC99A'] },
  { id: 12, cat: 'beforeAfter', title: 'Balayage', gradient: ['#A8884A', '#DFC99A'] },
];

export default function Gallery() {
  const { t, language } = useTranslation();
  const [activeCat, setActiveCat] = useState('all');
  const [modalImg, setModalImg] = useState(null);

  const filtered = activeCat === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.cat === activeCat);

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* HERO */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1521590832167-161d97d9e9c3?w=1600) center/cover no-repeat',
        color: 'var(--white)',
        textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            marginBottom: '15px',
          }}>
            {t('gallery.title')}
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>{t('gallery.subtitle')}</p>
        </div>
      </section>

      {/* FILTERS */}
      <section style={{ padding: '40px 0 20px' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                style={{
                  padding: '10px 24px',
                  background: activeCat === cat ? 'var(--gold)' : 'transparent',
                  color: activeCat === cat ? 'var(--white)' : 'var(--black)',
                  border: `1px solid ${activeCat === cat ? 'var(--gold)' : 'var(--gray-lighter)'}`,
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
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.color = 'var(--gold)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCat !== cat) {
                    e.currentTarget.style.borderColor = 'var(--gray-lighter)';
                    e.currentTarget.style.color = 'var(--black)';
                  }
                }}
              >
                {t(`gallery.${cat}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRID */}
      <section style={{ padding: '30px 0 100px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setModalImg(item)}
                style={{
                  position: 'relative',
                  height: '300px',
                  background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                  const overlay = e.currentTarget.querySelector('.gallery-overlay');
                  if (overlay) overlay.style.opacity = 1;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  const overlay = e.currentTarget.querySelector('.gallery-overlay');
                  if (overlay) overlay.style.opacity = 0;
                }}
              >
                <div
                  className="gallery-overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'var(--transition)',
                  }}
                >
                  <span style={{
                    color: 'var(--white)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    padding: '10px',
                  }}>
                    {item.title}
                  </span>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  left: '15px',
                  background: 'rgba(255,255,255,0.9)',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: 'var(--black)',
                }}>
                  {t(`gallery.${item.cat}`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {modalImg && (
        <ImageModal
          src=""
          alt={modalImg.title}
          onClose={() => setModalImg(null)}
        >
          <div style={{
            background: `linear-gradient(135deg, ${modalImg.gradient[0]}, ${modalImg.gradient[1]})`,
            width: '400px',
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            flexDirection: 'column',
          }}>
            <span style={{ fontSize: '4rem', color: 'var(--gold-dark)' }}>✂</span>
            <p style={{ color: 'var(--white)', marginTop: '15px', fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>
              {modalImg.title}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '5px', fontSize: '0.9rem' }}>
              ({language === 'en' ? 'Replace with actual image' : 'Zamenite sa stvarnom slikom'})
            </p>
          </div>
        </ImageModal>
      )}
    </div>
  );
}
