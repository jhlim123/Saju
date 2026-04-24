import { X, Phone, Mail, MapPin } from 'lucide-react';

const InstagramIcon = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function CreatorInfoModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#f8fafc',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px', right: '16px',
            background: 'none', border: 'none',
            cursor: 'pointer',
            color: '#64748b',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div style={{ padding: '40px 30px' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '900', 
            color: '#1e3a8a', 
            margin: '0 0 30px 0',
            letterSpacing: '0.05em'
          }}>
            FEZH
          </h2>
          
          <div style={{ marginBottom: '8px', fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>
            Curious Experience Collector
          </div>
          
          <div style={{ marginBottom: '30px', fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a' }}>
            <a href="https://www.instagram.com/clintlim" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Clint LIM 임종현
              <InstagramIcon size={18} color="#e1306c" />
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '1rem', color: '#334155' }}>
            <a href="tel:+821066224016" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={18} color="#3b82f6" />
              +82 10 6622 4016
            </a>
            
            <a href="mailto:clint.lim@fezh.kr" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={18} color="#10b981" />
              clint.lim@fezh.kr
            </a>
          </div>
        </div>

        {/* Footer Address */}
        <div style={{ 
          backgroundColor: '#1e3a8a', 
          padding: '20px', 
          color: 'white',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          <a href="https://www.google.com/maps/search/?api=1&query=41+Daesagwan-ro+11-gil,+Yongsan-gu,+Seoul,+Korea" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <MapPin size={20} style={{ flexShrink: 0, marginTop: '2px' }} color="#93c5fd" />
            <span>41 Daesagwan-ro 11-gil, Yongsan-gu, Seoul, Korea</span>
          </a>
        </div>
      </div>
    </div>
  );
}
