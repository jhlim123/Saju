import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/translations';

const elementColorMap = {
  '木': { bg: 'var(--wood-bg)', text: 'var(--wood-text)' },
  '火': { bg: 'var(--fire-bg)', text: 'var(--fire-text)' },
  '土': { bg: 'var(--earth-bg)', text: 'var(--earth-text)' },
  '金': { bg: 'var(--metal-bg)', text: 'var(--metal-text)' },
  '水': { bg: 'var(--water-bg)', text: 'var(--water-text)' },
};

export default function ExpertAnalysisSection({ fullAnalysis, onTranslate }) {
  const { language } = useLanguage();
  const t = translations[language];

  if (!fullAnalysis) return null;

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <h4 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0, color: 'var(--text-primary)' }}>{t.expertAnalysisTitle}</h4>
        {language !== 'ko' && (
          <button
            onClick={() => onTranslate(`전문가 종합 분석\n\n[1. 일주 기질]\n${fullAnalysis.dayPillarInfo}\n\n[2. 십성 흐름]\n주도적 십성: ${fullAnalysis.dominantGod}\n직업 적성: ${fullAnalysis.lifeInfo.job}`)}
            style={{ padding: '6px 12px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}
          >
            {t.translateBtn}
          </button>
        )}
      </div>

      {/* ① 일주 기질 */}
      <div style={{ marginBottom: '12px', padding: '16px', backgroundColor: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '6px' }}>① 일주({fullAnalysis.dayPillar}) — 본연의 기질과 중심 성격</div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0, wordBreak: 'keep-all' }}>{fullAnalysis.dayPillarInfo}</p>
      </div>

      {/* ② 십성 흐름 */}
      <div style={{ marginBottom: '12px', padding: '16px', backgroundColor: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '8px' }}>② 십성 흐름 — 사회적 환경과 역량 발휘 방식</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {fullAnalysis.sortedGods.map(([god, cnt]) => (
            <span key={god} style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem', background: cnt >= 2 ? 'var(--text-primary)' : 'var(--bg-color)', color: cnt >= 2 ? 'var(--surface-color)' : 'var(--text-secondary)', fontWeight: '500' }}>
              {god} ×{cnt}
            </span>
          ))}
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0, wordBreak: 'keep-all' }}>
          주도적 십성은 <strong style={{ color: 'var(--text-primary)' }}>{fullAnalysis.dominantGod}</strong>으로, 이 기운이 삶의 방향성과 환경을 이끕니다.<br />
          <strong style={{ color: 'var(--text-primary)' }}>직업 적성:</strong> {fullAnalysis.lifeInfo.job}
        </p>
      </div>

      {/* ③ 장단점 */}
      <div style={{ marginBottom: '12px', padding: '16px', backgroundColor: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '8px' }}>③ 특징적 장단점과 인생 흐름</div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0, wordBreak: 'keep-all' }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>장점:</span> {fullAnalysis.lifeInfo.money}<br />
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>주의:</span> {fullAnalysis.excess.length > 0
            ? fullAnalysis.excess.map(e => fullAnalysis.excessWarning[e]).join(' ')
            : '전반적으로 균형 잡혔으나 세심한 관리가 필요합니다.'}
        </p>
      </div>

      {/* ④ 오행 분포 & 보완책 */}
      <div style={{ marginBottom: '12px', padding: '16px', backgroundColor: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '10px' }}>④ 오행 분포 & 실생활 보완책</div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {Object.entries(fullAnalysis.elementDist).map(([el, cnt]) => (
            <div key={el} style={{
              flex: '1 1 44px', textAlign: 'center', padding: '10px 4px', borderRadius: '12px',
              background: elementColorMap[el]?.bg || 'var(--bg-color)',
              color: elementColorMap[el]?.text || 'var(--text-primary)',
              border: el === '金' ? '1px solid #cbd5e1' : cnt === 0 ? '1px solid #ff3b30' : cnt >= 3 ? '1px solid #ffcc00' : '1px solid transparent',
            }}>
              <div style={{ fontSize: '1rem', fontWeight: '600' }}>{el}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '2px' }}>{cnt}개</div>
            </div>
          ))}
        </div>
        {fullAnalysis.remedies.filter(r => r.color).map(r => (
          <div key={r.el} style={{
            padding: '16px', background: 'var(--surface-color)',
            border: `1px solid ${elementColorMap[r.el]?.bg}`,
            borderLeft: `6px solid ${elementColorMap[r.el]?.bg}`,
            borderRadius: '16px', fontSize: '0.9rem', marginBottom: '10px',
            color: 'var(--text-secondary)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                padding: '4px 10px', borderRadius: '8px',
                background: elementColorMap[r.el]?.bg, color: elementColorMap[r.el]?.text,
                fontWeight: 'bold', fontSize: '0.85rem',
                border: r.el === '金' ? '1px solid #cbd5e1' : 'none',
              }}>{r.el}</span>
              <strong style={{ color: 'var(--text-primary)' }}>보완 조언</strong>
            </div>
            <p style={{ margin: '0 0 10px', lineHeight: '1.6', color: 'var(--text-primary)', fontWeight: '500' }}>{fullAnalysis.lackingAdvice[r.el]}</p>
            <div style={{ fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>추천 색상:</span>{' '}
              <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{r.color}</span>&nbsp;&nbsp;
              <span style={{ color: 'var(--text-secondary)', marginLeft: '10px' }}>추천 식품:</span>{' '}
              <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{r.food}</span>
              <div style={{ marginTop: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>추천 습관:</span>{' '}
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{r.habits?.join(', ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ⑤ 종합 해석 */}
      <div style={{ marginBottom: '12px', padding: '16px', backgroundColor: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '10px' }}>⑤ 종합 해석</div>
        {[
          { label: '재물운', value: fullAnalysis.lifeInfo.money },
          { label: '연애·결혼운', value: fullAnalysis.lifeInfo.love },
          { label: '직업 적성', value: fullAnalysis.lifeInfo.job },
          { label: '건강운', value: fullAnalysis.lifeInfo.health },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'flex-start' }}>
            <span style={{ minWidth: '80px', fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem', flexShrink: 0 }}>{item.label}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', wordBreak: 'keep-all' }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* ⑥ 핵심 조언 */}
      <div style={{ padding: '20px', background: 'var(--text-primary)', borderRadius: '20px', color: 'var(--surface-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '10px' }}>⑥ 삶의 태도와 핵심 조언</div>
        <p style={{ lineHeight: '1.8', fontSize: '0.95rem', color: '#e5e5ea', margin: 0, wordBreak: 'keep-all' }}>
          <strong style={{ color: 'white' }}>{fullAnalysis.dayPillar}</strong> 일주는 {fullAnalysis.dayPillarInfo}{' '}
          {fullAnalysis.lacking.length > 0 && fullAnalysis.lackingAdvice[fullAnalysis.lacking[0]]}{' '}
          {fullAnalysis.excess.length > 0 && fullAnalysis.excessWarning[fullAnalysis.excess[0]]}{' '}
          균형 잡힌 삶을 위해 자신의 강점을 살리되, 부족한 기운을 의식적으로 보완해 나가는 것이 이 사주의 핵심 과제입니다.
        </p>
      </div>
    </div>
  );
}
