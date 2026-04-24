import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/translations';

export default function GyeokSection({ interpretation, onTranslate }) {
  const { language } = useLanguage();
  const t = translations[language];

  if (!interpretation) return null;

  const cardStyle = {
    marginBottom: '20px', padding: '20px', backgroundColor: 'var(--surface-color)',
    borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
  };

  return (
    <>
      {/* 자평진전 격국론 */}
      <div className="interpretation-card" style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
          <h4 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>
            {t.japyungTitle}
          </h4>
          {language !== 'ko' && (
            <button
              onClick={() => onTranslate(`자평진전 격국론\n\n[${interpretation.gyeok}격]: ${interpretation.japyung}`)}
              style={{ padding: '6px 12px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}
            >
              {t.translateBtn}
            </button>
          )}
        </div>
        <p className="interpretation-text" style={{ lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '0.95rem', wordBreak: 'keep-all' }}>
          <strong>[{interpretation.gyeok}격]</strong>: {interpretation.japyung}
        </p>
      </div>

      {/* 연해자평 */}
      <div className="interpretation-card" style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
          <h4 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>
            {t.yeonhaeTitle}
          </h4>
          {language !== 'ko' && (
            <button
              onClick={() => onTranslate(`연해자평 기준 성정 및 운세\n\n${interpretation.yeonhae}`)}
              style={{ padding: '6px 12px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}
            >
              {t.translateBtn}
            </button>
          )}
        </div>
        <p className="interpretation-text" style={{ lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '0.95rem', wordBreak: 'keep-all' }}>
          {interpretation.yeonhae}
        </p>
      </div>
    </>
  );
}
