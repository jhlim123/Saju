import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/translations';

export default function PersonalitySection({ personality, onTranslate }) {
  const { language } = useLanguage();
  const t = translations[language];

  if (!personality) return null;

  return (
    <div style={{ marginBottom: '20px', padding: '24px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <h4 style={{ fontWeight: '600', fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>{t.personalityTitle}</h4>
        <span style={{ marginLeft: 'auto', background: 'var(--bg-color)', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>
          {personality.keyword}
        </span>
      </div>
      {language !== 'ko' && (
        <button
          onClick={() => onTranslate(`나의 성격 풀이\n\n핵심 키워드: ${personality.keyword}\n\n[일간 - 타고난 본성]\n${personality.core}\n\n[월지 - 사회적 성격]\n${personality.social}\n\n[조후 - 계절의 기운]\n${personality.johu}\n\n[핵심 강점]\n${personality.traits.join('\n')}\n\n[그림자 - 주의 성향]\n${personality.shadow}`)}
          style={{ marginBottom: '15px', padding: '6px 12px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}
        >
          {t.translateBtn}
        </button>
      )}
      <div style={{ marginBottom: '14px', padding: '14px', background: 'var(--bg-color)', borderRadius: '16px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '6px' }}>일간({personality.dayStem}) — 타고난 본성</div>
        <p style={{ margin: 0, lineHeight: '1.7', fontSize: '0.95rem', color: 'var(--text-secondary)', wordBreak: 'keep-all' }}>{personality.core}</p>
      </div>
      <div style={{ marginBottom: '14px', padding: '14px', background: 'var(--bg-color)', borderRadius: '16px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '6px' }}>월지({personality.monthBranch} · {personality.season}) — 사회적 성격</div>
        <p style={{ margin: 0, lineHeight: '1.7', fontSize: '0.95rem', color: 'var(--text-secondary)', wordBreak: 'keep-all' }}>{personality.social}</p>
      </div>
      <div style={{ marginBottom: '14px', padding: '14px', background: 'var(--bg-color)', borderRadius: '16px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '6px' }}>조후(調候) — 계절의 기운 (궁통보감)</div>
        <p style={{ margin: 0, lineHeight: '1.7', fontSize: '0.95rem', color: 'var(--text-secondary)', wordBreak: 'keep-all' }}>{personality.johu}</p>
      </div>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', padding: '14px', background: 'var(--bg-color)', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '6px' }}>핵심 강점</div>
          <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.8' }}>
            {personality.traits.map((tr, i) => <li key={i}>{tr}</li>)}
          </ul>
        </div>
        <div style={{ flex: '1 1 200px', padding: '14px', background: 'var(--bg-color)', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '6px' }}>그림자 (주의 성향)</div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', wordBreak: 'keep-all' }}>{personality.shadow}</p>
        </div>
      </div>
    </div>
  );
}
