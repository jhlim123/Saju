import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

export default function SajuHistory({ onSelect, onBack }) {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = 최신순, 'asc' = 오래된순
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saju_history') || '[]');
    setHistory(saved);
  }, []);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem('saju_history', JSON.stringify(updated));
    setHistory(updated);
  };

  const handleClear = () => {
    if (window.confirm(language === 'ko' ? '전체 기록을 삭제하시겠습니까?' : 'Are you sure you want to delete all records?')) {
      localStorage.removeItem('saju_history');
      setHistory([]);
    }
  };

  const displayList = history
    .filter(item => item.name.includes(searchQuery))
    .sort((a, b) => sortOrder === 'desc' ? b.id - a.id : a.id - b.id);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>{t.historyTitle}</h2>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          {t.noHistory}
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--surface-color)', color: 'var(--text-primary)', fontSize: '1rem' }}
            />
            <button 
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              style={{ padding: '0 16px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: '500', color: 'var(--text-primary)', minWidth: '100px', fontSize: '0.9rem' }}
            >
              {sortOrder === 'desc' ? t.sortLatest : t.sortOldest}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayList.map((item) => (
              <div 
              key={item.id} 
              onClick={() => onSelect(item)}
              style={{ 
                padding: '16px 20px', 
                backgroundColor: 'var(--surface-color)', 
                borderRadius: '20px', 
                border: '1px solid var(--border-color)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                transition: 'transform 0.1s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div>
                <div style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  {item.name} <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>({item.gender === 'male' ? (language === 'ko' ? '남' : 'M') : (language === 'ko' ? '여' : 'F')})</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.5' }}>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>[양]</span>
                    {item.birthDate.includes('-') ? (
                      `${item.birthDate.split('-')[0]}년 ${item.birthDate.split('-')[1]}월 ${item.birthDate.split('-')[2]}일`
                    ) : (
                      `${item.birthDate.substring(0,4)}년 ${item.birthDate.substring(4,6)}월 ${item.birthDate.substring(6,8)}일`
                    )}
                    {/* 직접 입력한 경우에만 양력 행에 시간 표시 */}
                    {item.knowTime && (
                      ` ${item.birthTime && item.birthTime.includes(':') ? item.birthTime : (item.birthTime ? `${item.birthTime.substring(0,2)}:${item.birthTime.substring(2,4)}` : '')}`
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '2px' }}>
                    <span style={{ color: '#059669', fontWeight: '500' }}>[음]</span>
                    {item.lunarDateStr ? (
                      item.lunarDateStr.replace(/-/g, '년 ').replace(/(\d{2})$/, '$1일')
                    ) : (
                      item.calendarType === 'lunar' ? 
                      (item.birthDate.includes('-') ? item.birthDate : `${item.birthDate.substring(0,4)}-${item.birthDate.substring(4,6)}-${item.birthDate.substring(6,8)}`) 
                      : '계산중...'
                    )}
                    {/* 12지시를 선택한 경우에만 음력 행에 12지시 표시 */}
                    {!item.knowTime && item.zodiacSign && (
                      <span style={{ marginLeft: '5px', color: '#6366f1' }}>[{item.zodiacSign}시]</span>
                    )}
                    {!item.knowTime && !item.zodiacSign && !item.birthBranch && (
                      <span style={{ marginLeft: '5px', color: '#8e8e93' }}>[시간모름]</span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={(e) => handleDelete(item.id, e)}
                style={{ 
                  padding: '8px 16px', 
                  background: '#ffefef', 
                  color: '#ff3b30', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {t.delete}
              </button>
            </div>
          ))}
          
          <button 
            onClick={handleClear}
            style={{ 
              marginTop: '24px', 
              padding: '14px', 
              background: 'transparent', 
              color: 'var(--text-secondary)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '16px', 
              fontSize: '0.95rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {t.deleteAll}
          </button>
        </div>
        </>
      )}
    </div>
  );
}
