import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

export default function SajuInputForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [calendarType, setCalendarType] = useState('solar');
  const [leapMonth, setLeapMonth] = useState('normal');
  const [knowTime, setKnowTime] = useState(true);
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthBranch, setBirthBranch] = useState('');

  const { language } = useLanguage();
  const t = translations[language];

  const branches = [
    { name: `자시 (23:30~01:30)`, value: '자' },
    { name: `축시 (01:30~03:30)`, value: '축' },
    { name: `인시 (03:30~05:30)`, value: '인' },
    { name: `묘시 (05:30~07:30)`, value: '묘' },
    { name: `진시 (07:30~09:30)`, value: '진' },
    { name: `사시 (09:30~11:30)`, value: '사' },
    { name: `오시 (11:30~13:30)`, value: '오' },
    { name: `미시 (13:30~15:30)`, value: '미' },
    { name: `신시 (15:30~17:30)`, value: '신' },
    { name: `유시 (17:30~19:30)`, value: '유' },
    { name: `술시 (19:30~21:30)`, value: '술' },
    { name: `해시 (21:30~23:30)`, value: '해' },
  ];

  const handleSubmit = () => {
    onSubmit({ name, gender, calendarType, leapMonth, knowTime, birthDate, birthTime, birthBranch });
  };

  return (
    <div className="saju-form-container" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{t.appName}</h2>
      </div>

      <div className="toggle-group" style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {/* Gender Toggle */}
        <div style={{ display: 'flex', background: '#e5e5ea', borderRadius: '14px', overflow: 'hidden', padding: '3px', flex: 1, minWidth: '90px' }}>
          <button onClick={() => setGender('male')} style={{ flex: 1, cursor: 'pointer', padding: '8px 12px', background: gender === 'male' ? 'white' : 'transparent', borderRadius: '12px', border: 'none', boxShadow: gender === 'male' ? '0 3px 8px rgba(0,0,0,0.12), 0 3px 1px rgba(0,0,0,0.04)' : 'none', color: gender === 'male' ? '#1d1d1f' : '#8e8e93', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s' }}>{t.male}</button>
          <button onClick={() => setGender('female')} style={{ flex: 1, cursor: 'pointer', padding: '8px 12px', background: gender === 'female' ? 'white' : 'transparent', borderRadius: '12px', border: 'none', boxShadow: gender === 'female' ? '0 3px 8px rgba(0,0,0,0.12), 0 3px 1px rgba(0,0,0,0.04)' : 'none', color: gender === 'female' ? '#1d1d1f' : '#8e8e93', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s' }}>{t.female}</button>
        </div>

        {/* Calendar Toggle */}
        <div style={{ display: 'flex', background: '#e5e5ea', borderRadius: '14px', overflow: 'hidden', padding: '3px', flex: 1, minWidth: '90px' }}>
          <button onClick={() => setCalendarType('solar')} style={{ flex: 1, cursor: 'pointer', padding: '8px 12px', background: calendarType === 'solar' ? 'white' : 'transparent', borderRadius: '12px', border: 'none', boxShadow: calendarType === 'solar' ? '0 3px 8px rgba(0,0,0,0.12), 0 3px 1px rgba(0,0,0,0.04)' : 'none', color: calendarType === 'solar' ? '#1d1d1f' : '#8e8e93', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s' }}>{t.solar}</button>
          <button onClick={() => setCalendarType('lunar')} style={{ flex: 1, cursor: 'pointer', padding: '8px 12px', background: calendarType === 'lunar' ? 'white' : 'transparent', borderRadius: '12px', border: 'none', boxShadow: calendarType === 'lunar' ? '0 3px 8px rgba(0,0,0,0.12), 0 3px 1px rgba(0,0,0,0.04)' : 'none', color: calendarType === 'lunar' ? '#1d1d1f' : '#8e8e93', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s' }}>{t.lunar}</button>
        </div>

        {/* Leap Month Toggle */}
        <div style={{ display: 'flex', background: '#e5e5ea', borderRadius: '14px', overflow: 'hidden', padding: '3px', flex: 1, minWidth: '90px' }}>
          <button onClick={() => setLeapMonth('normal')} style={{ flex: 1, cursor: 'pointer', padding: '8px 12px', background: leapMonth === 'normal' ? 'white' : 'transparent', borderRadius: '12px', border: 'none', boxShadow: leapMonth === 'normal' ? '0 3px 8px rgba(0,0,0,0.12), 0 3px 1px rgba(0,0,0,0.04)' : 'none', color: leapMonth === 'normal' ? '#1d1d1f' : '#8e8e93', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s' }}>{t.normalMonth}</button>
          <button onClick={() => setLeapMonth('leap')} style={{ flex: 1, cursor: 'pointer', padding: '8px 12px', background: leapMonth === 'leap' ? 'white' : 'transparent', borderRadius: '12px', border: 'none', boxShadow: leapMonth === 'leap' ? '0 3px 8px rgba(0,0,0,0.12), 0 3px 1px rgba(0,0,0,0.04)' : 'none', color: leapMonth === 'leap' ? '#1d1d1f' : '#8e8e93', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s' }}>{t.isLeapMonth}</button>
        </div>
      </div>

      <div className="form-fields" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="form-row" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <label style={{ minWidth: '80px', fontSize: '1rem', fontWeight: 'bold' }}>{t.name} :</label>
          <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} style={{ flex: '1 1 200px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
        </div>
        <div className="form-row" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <label style={{ minWidth: '80px', fontSize: '1rem', fontWeight: 'bold' }}>{t.birthDate} :</label>
          <input 
            type="text" 
            placeholder={t.birthDatePlaceholder}
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            style={{ flex: '1 1 200px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} 
          />
        </div>
        <div className="form-row" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <label style={{ minWidth: '80px', fontSize: '1rem', fontWeight: 'bold' }}>{t.birthTime} :</label>
          <div style={{ display: 'flex', flex: '1 1 200px', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {knowTime ? (
              <input type="text" placeholder={t.birthTimePlaceholder} value={birthTime} onChange={e => setBirthTime(e.target.value)} style={{ flex: '1 1 100px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem', background: 'white', outline: 'none' }} />
            ) : (
              <select value={birthBranch} onChange={e => setBirthBranch(e.target.value)} style={{ flex: '1 1 100px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem', background: 'white', outline: 'none' }}>
                <option value="">{t.unknownTime}</option>
                {branches.map(b => (
                  <option key={b.value} value={b.value}>{b.name}</option>
                ))}
              </select>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '95px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{knowTime ? t.directInput : t.zodiacTime}</span>
              <div onClick={() => { setKnowTime(!knowTime); }} style={{ width: '50px', height: '30px', background: knowTime ? '#34c759' : '#e5e5ea', borderRadius: '15px', position: 'relative', cursor: 'pointer', transition: '0.2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: '2px', left: knowTime ? '22px' : '2px', width: '26px', height: '26px', background: 'white', borderRadius: '50%', boxShadow: '0 3px 8px rgba(0,0,0,0.15), 0 3px 1px rgba(0,0,0,0.06)', transition: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleSubmit}
          style={{
            marginTop: '15px',
            padding: '16px',
            backgroundColor: '#1d1d1f',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#000000'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1d1d1f'}
        >
          {t.lookup}
        </button>
      </div>
    </div>
  );
}
