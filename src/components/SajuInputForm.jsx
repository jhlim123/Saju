import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

export default function SajuInputForm({ onSubmit }) {
  const currentYear = new Date().getFullYear();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [calendarType, setCalendarType] = useState('solar');
  const [leapMonth, setLeapMonth] = useState('normal');
  const [knowTime, setKnowTime] = useState(true);
  
  // Separate states for picker
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [birthBranch, setBirthBranch] = useState('');

  const { language } = useLanguage();
  const t = translations[language];

  // Generate options
  const years = Array.from({ length: 151 }, (_, i) => (currentYear - i).toString()); // 최신순 정렬
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

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
    if (!name.trim()) {
      alert(language === 'ko' ? '이름을 입력해주세요.' : 'Please enter your name.');
      return;
    }
    if (!year || !month || !day) {
      alert(language === 'ko' ? '생년월일을 모두 선택해주세요.' : 'Please select all birth date fields.');
      return;
    }
    if (knowTime && (!hour || !minute)) {
      alert(language === 'ko' ? '출생 시간을 선택해주세요.' : 'Please select birth time.');
      return;
    }
    // 시간을 모르는 경우(knowTime=false 이고 birthBranch='')는 허용함

    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hour}:${minute}`;
    onSubmit({ 
      name, 
      gender, 
      calendarType, 
      leapMonth, 
      knowTime, 
      birthDate: formattedDate, 
      birthTime: formattedTime, 
      birthBranch 
    });
  };

  const selectStyle = {
    flex: 1,
    padding: '12px 8px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.95rem',
    background: 'white',
    outline: 'none',
    appearance: 'none',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#1d1d1f'
  };

  return (
    <div className="saju-form-container" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{t.appName}</h2>
      </div>

      <div className="form-fields">
        <div className="form-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ minWidth: '80px', fontSize: '1rem', fontWeight: 'bold' }}>{t.name}</label>
          <input type="text" placeholder="" value={name} onChange={e => setName(e.target.value)} style={{ flex: 1, padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
        </div>

        <div className="form-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ minWidth: '80px', fontSize: '1rem', fontWeight: 'bold' }}>{t.gender}</label>
          <div style={{ display: 'flex', background: '#e5e5ea', borderRadius: '10px', padding: '2px', flex: 1 }}>
            <button onClick={() => setGender('male')} style={{ flex: 1, cursor: 'pointer', padding: '8px 12px', background: gender === 'male' ? 'white' : 'transparent', borderRadius: '8px', border: 'none', boxShadow: gender === 'male' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none', color: gender === 'male' ? '#1d1d1f' : '#8e8e93', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s' }}>{t.male}</button>
            <button onClick={() => setGender('female')} style={{ flex: 1, cursor: 'pointer', padding: '8px 12px', background: gender === 'female' ? 'white' : 'transparent', borderRadius: '8px', border: 'none', boxShadow: gender === 'female' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none', color: gender === 'female' ? '#1d1d1f' : '#8e8e93', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s' }}>{t.female}</button>
          </div>
        </div>

        <div className="form-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ minWidth: '80px', fontSize: '1rem', fontWeight: 'bold' }}>{t.calendar}</label>
          <div style={{ display: 'flex', background: '#e5e5ea', borderRadius: '10px', padding: '2px', flex: 1 }}>
            <button onClick={() => setCalendarType('solar')} style={{ flex: 1, cursor: 'pointer', padding: '8px 12px', background: calendarType === 'solar' ? 'white' : 'transparent', borderRadius: '8px', border: 'none', boxShadow: calendarType === 'solar' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none', color: calendarType === 'solar' ? '#1d1d1f' : '#8e8e93', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s' }}>{t.solar}</button>
            <button onClick={() => setCalendarType('lunar')} style={{ flex: 1, cursor: 'pointer', padding: '8px 12px', background: calendarType === 'lunar' ? 'white' : 'transparent', borderRadius: '8px', border: 'none', boxShadow: calendarType === 'lunar' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none', color: calendarType === 'lunar' ? '#1d1d1f' : '#8e8e93', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s' }}>{t.lunar}</button>
          </div>
        </div>

        <div className="form-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ minWidth: '80px', fontSize: '1rem', fontWeight: 'bold' }}>{t.leapMonth}</label>
          <div style={{ display: 'flex', background: '#e5e5ea', borderRadius: '10px', padding: '2px', flex: 1 }}>
            <button onClick={() => setLeapMonth('normal')} style={{ flex: 1, cursor: 'pointer', padding: '8px 12px', background: leapMonth === 'normal' ? 'white' : 'transparent', borderRadius: '8px', border: 'none', boxShadow: leapMonth === 'normal' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none', color: leapMonth === 'normal' ? '#1d1d1f' : '#8e8e93', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s' }}>{t.normalMonth}</button>
            <button onClick={() => setLeapMonth('leap')} style={{ flex: 1, cursor: 'pointer', padding: '8px 12px', background: leapMonth === 'leap' ? 'white' : 'transparent', borderRadius: '8px', border: 'none', boxShadow: leapMonth === 'leap' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none', color: leapMonth === 'leap' ? '#1d1d1f' : '#8e8e93', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s' }}>{t.isLeapMonth}</button>
          </div>
        </div>

        <div className="form-row form-row-full" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <label style={{ minWidth: '80px', fontSize: '1rem', fontWeight: 'bold' }}>{t.birthDate}</label>
          <div style={{ flex: '1 1 300px', display: 'flex', gap: '5px' }}>
            <select value={year} onChange={e => setYear(e.target.value)} style={{ ...selectStyle, color: year ? '#1d1d1f' : '#8e8e93' }}>
              <option value="">{language === 'ko' ? '년' : 'Year'}</option>
              {years.map(y => <option key={y} value={y}>{y}{language === 'ko' ? '년' : ''}</option>)}
            </select>
            <select value={month} onChange={e => setMonth(e.target.value)} style={{ ...selectStyle, color: month ? '#1d1d1f' : '#8e8e93' }}>
              <option value="">{language === 'ko' ? '월' : 'Month'}</option>
              {months.map(m => <option key={m} value={m}>{m}{language === 'ko' ? '월' : ''}</option>)}
            </select>
            <select value={day} onChange={e => setDay(e.target.value)} style={{ ...selectStyle, color: day ? '#1d1d1f' : '#8e8e93' }}>
              <option value="">{language === 'ko' ? '일' : 'Day'}</option>
              {days.map(d => <option key={d} value={d}>{d}{language === 'ko' ? '일' : ''}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <label style={{ minWidth: '80px', fontSize: '1rem', fontWeight: 'bold' }}>{t.birthTime}</label>
          <div style={{ display: 'flex', flex: '1 1 300px', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Time Mode Toggle moved here */}
            <div style={{ display: 'flex', background: '#e5e5ea', borderRadius: '10px', padding: '2px', minWidth: '130px' }}>
              <button onClick={() => setKnowTime(true)} style={{ flex: 1, cursor: 'pointer', padding: '6px 10px', background: knowTime ? 'white' : 'transparent', borderRadius: '8px', border: 'none', boxShadow: knowTime ? '0 2px 5px rgba(0,0,0,0.1)' : 'none', color: knowTime ? '#1d1d1f' : '#8e8e93', fontWeight: '600', fontSize: '0.8rem', transition: 'all 0.2s' }}>{t.directInput}</button>
              <button onClick={() => setKnowTime(false)} style={{ flex: 1, cursor: 'pointer', padding: '6px 10px', background: !knowTime ? 'white' : 'transparent', borderRadius: '8px', border: 'none', boxShadow: !knowTime ? '0 2px 5px rgba(0,0,0,0.1)' : 'none', color: !knowTime ? '#1d1d1f' : '#8e8e93', fontWeight: '600', fontSize: '0.8rem', transition: 'all 0.2s' }}>{t.zodiacTime}</button>
            </div>

            {knowTime ? (
              <div style={{ display: 'flex', flex: 1, gap: '5px' }}>
                <select value={hour} onChange={e => setHour(e.target.value)} style={{ ...selectStyle, color: hour ? '#1d1d1f' : '#8e8e93' }}>
                  <option value="">{language === 'ko' ? '시' : 'Hour'}</option>
                  {hours.map(h => <option key={h} value={h}>{h}{language === 'ko' ? '시' : ''}</option>)}
                </select>
                <select value={minute} onChange={e => setMinute(e.target.value)} style={{ ...selectStyle, color: minute ? '#1d1d1f' : '#8e8e93' }}>
                  <option value="">{language === 'ko' ? '분' : 'Min'}</option>
                  {minutes.map(m => <option key={m} value={m}>{m}{language === 'ko' ? '분' : ''}</option>)}
                </select>
              </div>
            ) : (
              <select value={birthBranch} onChange={e => setBirthBranch(e.target.value)} style={{ ...selectStyle, textAlign: 'left', color: birthBranch ? '#1d1d1f' : '#8e8e93', flex: 1 }}>
                <option value="">{t.unknownTime}</option>
                {branches.map(b => (
                  <option key={b.value} value={b.value}>{b.name}</option>
                ))}
              </select>
            )}
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
