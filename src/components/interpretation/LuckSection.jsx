import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/translations';

const monthEn = ['', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const cardStyle = {
  marginBottom: '20px', padding: '20px', backgroundColor: 'var(--surface-color)',
  borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
};

export default function LuckSection({ luck, onTranslate }) {
  const { language } = useLanguage();
  const t = translations[language];

  if (!luck) return null;

  return (
    <>
      {/* 대운 */}
      {luck.daewun && (
        <div className="luck-flow-card" style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <h4 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>
              {t.daewunDesc} — {luck.daewun.age}{t.ageSuffix} ({luck.daewun.pillar} {luck.daewun.god}운)
            </h4>
            {language !== 'ko' && (
              <button
                onClick={() => onTranslate(`대운 해설\n\n[자평진전 관점]\n${luck.daewun.japyung}\n\n[연해자평 관점]\n${luck.daewun.yeonhae}`)}
                style={{ padding: '6px 12px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}
              >
                {t.translateBtn}
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '12px' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>자평진전 관점</strong>
              <p className="luck-desc" style={{ marginTop: '6px', color: 'var(--text-secondary)', lineHeight: '1.7', wordBreak: 'keep-all' }}>{luck.daewun.japyung}</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '12px' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>연해자평 관점</strong>
              <p className="luck-desc" style={{ marginTop: '6px', color: 'var(--text-secondary)', lineHeight: '1.7', wordBreak: 'keep-all' }}>{luck.daewun.yeonhae}</p>
            </div>
          </div>
        </div>
      )}

      {/* 세운 */}
      {luck.sewun && (
        <div className="luck-flow-card" style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <h4 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>
              {t.sewunDesc} — {luck.sewun.year}{language === 'ko' ? '년' : ''} ({luck.sewun.pillar} {luck.sewun.god}운)
            </h4>
            {language !== 'ko' && (
              <button
                onClick={() => onTranslate(`세운 해설\n\n[자평진전 관점]\n${luck.sewun.japyung}\n\n[연해자평 관점]\n${luck.sewun.yeonhae}`)}
                style={{ padding: '6px 12px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}
              >
                {t.translateBtn}
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '12px' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>자평진전 관점</strong>
              <p className="luck-desc" style={{ marginTop: '6px', color: 'var(--text-secondary)', lineHeight: '1.7', wordBreak: 'keep-all' }}>{luck.sewun.japyung}</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '12px' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>연해자평 관점</strong>
              <p className="luck-desc" style={{ marginTop: '6px', color: 'var(--text-secondary)', lineHeight: '1.7', wordBreak: 'keep-all' }}>{luck.sewun.yeonhae}</p>
            </div>
          </div>
        </div>
      )}

      {/* 월운 */}
      {luck.monthlyLuck?.length > 0 && (
        <div className="luck-flow-card" style={{ ...cardStyle, marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <h4 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>
              {t.wolunDesc}
            </h4>
            {language !== 'ko' && (
              <button
                onClick={() => onTranslate(`월운 상세 해설\n\n${luck.monthlyLuck.map(ml => `[${language === 'ko' ? `${ml.month}월` : monthEn[ml.month]}]\n${ml.desc}`).join('\n\n')}`)}
                style={{ padding: '6px 12px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}
              >
                {t.translateBtn}
              </button>
            )}
          </div>
          <div className="monthly-grid" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto', paddingRight: '5px' }}>
            {luck.monthlyLuck.map((ml, idx) => (
              <div key={idx} style={{ padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '12px' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  {language === 'ko' ? `${ml.month}월` : monthEn[ml.month]} ({ml.pillar} {ml.god}운)
                </strong>
                <p style={{ marginTop: '8px', color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', margin: '8px 0 0', wordBreak: 'keep-all' }}>
                  {ml.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
