import { getInterpretation, getCurrentLuckInterpretation, getElementClass } from '../utils/sajuLogic';
import { getPersonalityAnalysis } from '../utils/personalityLogic';
import { getFullAnalysis } from '../utils/fullAnalysis';
import { generateExpertPrompt } from '../utils/aiPromptGenerator';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, translateTenGods } from '../utils/translations';

export default function SajuInterpretation({ sajuData, userInfo, selectedSewunYear, onReset }) {
  const { language } = useLanguage();
  const t = translations[language];
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);
  const monthEn = ["", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  const handleTranslate = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(t.copiedAndTranslate);
      window.open(`https://translate.google.com/?sl=ko&tl=${language === 'ko' ? 'en' : language}&text=${encodeURIComponent(text)}&op=translate`, '_blank');
    });
  };

  const elementColorMap = {
    '木': { bg: 'var(--wood-bg)', text: 'var(--wood-text)' },
    '火': { bg: 'var(--fire-bg)', text: 'var(--fire-text)' },
    '土': { bg: 'var(--earth-bg)', text: 'var(--earth-text)' },
    '金': { bg: 'var(--metal-bg)', text: 'var(--metal-text)' },
    '水': { bg: 'var(--water-bg)', text: 'var(--water-text)' }
  };

  const renderColoredHanja = (char, label) => {
    const elClass = getElementClass(char);
    return (
      <span style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-color)',
        border: '1px solid var(--border-color)',
        fontSize: '0.9rem'
      }}>
        <span className={`saju-box-mini ${elClass}`} style={{ 
          width: '24px', 
          height: '24px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          borderRadius: '6px',
          fontSize: '0.85rem',
          fontWeight: 'bold'
        }}>{char}</span>
        {label && <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '500' }}>{label}</span>}
      </span>
    );
  };

  if (!sajuData || !userInfo) return null;

  let interpretation = null;
  let luck = null;
  let personality = null;

  try { interpretation = getInterpretation(sajuData); } catch (e) { console.error('격국 해설 오류:', e); }
  try { luck = getCurrentLuckInterpretation(sajuData, userInfo, selectedSewunYear || new Date().getFullYear()); } catch (e) { console.error('운세 해설 오류:', e); }
  try { personality = getPersonalityAnalysis(sajuData); } catch (e) { console.error('성격 해설 오류:', e); }
  let fullAnalysis = null;
  try { fullAnalysis = getFullAnalysis(sajuData); } catch (e) { console.error('종합분석 오류:', e); }

  if (!interpretation && !luck && !personality) return null;

  return (
    <div className="interpretation-container" style={{ padding: '20px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', paddingBottom: '60px' }}>
      <h3 className="section-title" style={{ fontSize: '1.3rem', fontWeight: 'bold', borderLeft: '5px solid #3b82f6', paddingLeft: '12px', marginBottom: '20px', color: '#1e293b' }}>
        {t.analysisTitle}
      </h3>

      {/* ① 성격 풀이 - 일간 + 월지 + 조후 */}
      {personality && (
        <div style={{ marginBottom: '20px', padding: '24px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <h4 style={{ fontWeight: '600', fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>{t.personalityTitle}</h4>
            <span style={{ marginLeft: 'auto', background: 'var(--bg-color)', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>
              {personality.keyword}
            </span>
          </div>
          {language !== 'ko' && (
            <button onClick={() => handleTranslate(`나의 성격 풀이\n\n핵심 키워드: ${personality.keyword}\n\n[일간 - 타고난 본성]\n${personality.core}\n\n[월지 - 사회적 성격]\n${personality.social}\n\n[조후 - 계절의 기운]\n${personality.johu}\n\n[핵심 강점]\n${personality.traits.join('\n')}\n\n[그림자 - 주의 성향]\n${personality.shadow}`)} style={{ marginBottom: '15px', padding: '6px 12px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}>
              {t.translateBtn}
            </button>
          )}
          <div style={{ marginBottom: '14px', padding: '14px', background: 'var(--bg-color)', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '6px' }}>일간 {renderColoredHanja(personality.dayStem)} — 타고난 본성</div>
            <p style={{ margin: 0, lineHeight: '1.7', fontSize: '0.95rem', color: 'var(--text-secondary)', wordBreak: 'keep-all' }}>{personality.core}</p>
          </div>
          <div style={{ marginBottom: '14px', padding: '14px', background: 'var(--bg-color)', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '6px' }}>월지 {renderColoredHanja(personality.monthBranch, personality.season)} — 사회적 성격</div>
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
                {personality.traits.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
            <div style={{ flex: '1 1 200px', padding: '14px', background: 'var(--bg-color)', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '6px' }}>그림자 (주의 성향)</div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', wordBreak: 'keep-all' }}>{personality.shadow}</p>
            </div>
          </div>
        </div>
      )}

      {/* ② 명리학 전문가 6대 분석 */}
      {fullAnalysis && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0, color: 'var(--text-primary)' }}>{t.expertAnalysisTitle}</h4>
            {language !== 'ko' && (
              <button onClick={() => handleTranslate(`전문가 종합 분석\n\n[1. 일주 기질]\n${fullAnalysis.dayPillarInfo}\n\n[2. 십성 흐름]\n주도적 십성: ${fullAnalysis.dominantGod}\n직업 적성: ${fullAnalysis.lifeInfo.job}\n\n[3. 장단점]\n장점: ${fullAnalysis.lifeInfo.money}\n주의: ${fullAnalysis.excess.length > 0 ? fullAnalysis.excess.map(e => fullAnalysis.excessWarning[e]).join(' ') : '균형 잡힘'}\n\n[4. 핵심 조언]\n${fullAnalysis.dayPillarInfo} 균형 잡힌 삶을 위해 자신의 강점을 살리되, 부족한 기운을 의식적으로 보완해 나가는 것이 이 사주의 핵심 과제입니다.`)} style={{ padding: '6px 12px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}>
                {t.translateBtn}
              </button>
            )}
          </div>

          {/* 1. 일주 기질 */}
          <div style={{ marginBottom: '12px', padding: '16px', backgroundColor: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '6px' }}>① 일주 {renderColoredHanja(fullAnalysis.dayPillar[0])}{renderColoredHanja(fullAnalysis.dayPillar[1])} — 본연의 기질과 중심 성격</div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0, wordBreak: 'keep-all' }}>{fullAnalysis.dayPillarInfo}</p>
          </div>

          {/* 2. 십성 흐름 & 사회적 환경 */}
          <div style={{ marginBottom: '12px', padding: '16px', backgroundColor: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '8px' }}>② 십성 흐름 — 사회적 환경과 역량 발휘 방식</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {fullAnalysis.sortedGods.map(([god, cnt]) => (
                <span key={god} style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem', background: cnt >= 2 ? 'var(--text-primary)' : 'var(--bg-color)', color: cnt >= 2 ? 'var(--surface-color)' : 'var(--text-primary)', fontWeight: '600' }}>{god} ×{cnt}</span>
              ))}
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0, wordBreak: 'keep-all' }}>
              주도적 십성은 <strong style={{color: 'var(--text-primary)'}}>{fullAnalysis.dominantGod}</strong>으로, 이 기운이 삶의 방향성과 환경을 이끕니다.<br/>
              <strong style={{color: 'var(--text-primary)'}}>직업 적성:</strong> {fullAnalysis.lifeInfo.job}
            </p>
          </div>

          {/* 3. 장단점 & 인생 흐름 */}
          <div style={{ marginBottom: '12px', padding: '16px', backgroundColor: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '8px' }}>③ 특징적 장단점과 인생 흐름</div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0, wordBreak: 'keep-all' }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>장점:</span> {fullAnalysis.lifeInfo.money}<br/>
              <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>주의:</span> {fullAnalysis.excess.length > 0 ? fullAnalysis.excess.map(e => fullAnalysis.excessWarning[e]).join(' ') : '전반적으로 균형 잡혔으나 세심한 관리가 필요합니다.'}
            </p>
          </div>

          {/* 4. 오행 분포 & 보완책 */}
          <div style={{ marginBottom: '12px', padding: '16px', backgroundColor: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '10px' }}>④ 오행 분포 & 실생활 보완책</div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {Object.entries(fullAnalysis.elementDist).map(([el, cnt]) => (
                <div key={el} style={{ 
                  flex: '1 1 44px', 
                  textAlign: 'center', 
                  padding: '10px 4px', 
                  borderRadius: '12px', 
                  background: elementColorMap[el]?.bg || 'var(--bg-color)',
                  color: elementColorMap[el]?.text || 'var(--text-primary)',
                  border: el === '金' ? '1px solid #cbd5e1' : cnt === 0 ? '1px solid #ff3b30' : cnt >= 3 ? '1px solid #ffcc00' : '1px solid transparent' 
                }}>
                  <div style={{ fontSize: '1rem', fontWeight: '600' }}>{el}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '2px' }}>{cnt}개</div>
                </div>
              ))}
            </div>
            {fullAnalysis.remedies.filter(r => r.color).map(r => (
              <div key={r.el} style={{ 
                padding: '16px', 
                background: 'var(--surface-color)', 
                border: `1px solid ${elementColorMap[r.el]?.bg}`,
                borderLeft: `6px solid ${elementColorMap[r.el]?.bg}`,
                borderRadius: '16px', 
                fontSize: '0.9rem', 
                marginBottom: '10px', 
                color: 'var(--text-secondary)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '8px', 
                    background: elementColorMap[r.el]?.bg, 
                    color: elementColorMap[r.el]?.text,
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    border: r.el === '金' ? '1px solid #cbd5e1' : 'none'
                  }}>
                    {r.el}
                  </span>
                  <strong style={{ color: 'var(--text-primary)' }}>보완 조언</strong>
                </div>
                <p style={{ margin: '0 0 10px', lineHeight: '1.6', color: 'var(--text-primary)', fontWeight: '500' }}>{fullAnalysis.lackingAdvice[r.el]}</p>
                <div style={{ fontSize: '0.85rem' }}>
                  <span style={{color: 'var(--text-secondary)'}}>추천 색상:</span> <span style={{color: 'var(--text-primary)', fontWeight: '600'}}>{r.color}</span> &nbsp; 
                  <span style={{color: 'var(--text-secondary)', marginLeft: '10px'}}>추천 식품:</span> <span style={{color: 'var(--text-primary)', fontWeight: '600'}}>{r.food}</span><br/>
                  <div style={{marginTop: '6px'}}>
                    <span style={{color: 'var(--text-secondary)'}}>추천 습관:</span> <span style={{color: 'var(--text-primary)', fontWeight: '600'}}>{r.habits?.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 5. 주요 영역 종합 */}
          <div style={{ marginBottom: '12px', padding: '16px', backgroundColor: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '10px' }}>⑤ 종합 해석</div>
            {[
              { label: '재물운', value: fullAnalysis.lifeInfo.money },
              { label: '연애·결혼운', value: fullAnalysis.lifeInfo.love },
              { label: '직업 적성', value: fullAnalysis.lifeInfo.job },
              { label: '건강운', value: fullAnalysis.lifeInfo.health }
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'flex-start' }}>
                <span style={{ minWidth: '80px', fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem', flexShrink: 0 }}>{item.label}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', wordBreak: 'keep-all' }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* 6. 핵심 조언 */}
          <div style={{ padding: '20px', background: 'var(--text-primary)', borderRadius: '20px', color: 'var(--surface-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '10px' }}>⑥ 삶의 태도와 핵심 조언</div>
            <p style={{ lineHeight: '1.8', fontSize: '0.95rem', color: 'white', opacity: 0.9, margin: 0, wordBreak: 'keep-all' }}>
              <strong style={{ color: 'white' }}>{fullAnalysis.dayPillar}</strong> 일주는 {fullAnalysis.dayPillarInfo} {fullAnalysis.lacking.length > 0 && fullAnalysis.lackingAdvice[fullAnalysis.lacking[0]]} {fullAnalysis.excess.length > 0 && fullAnalysis.excessWarning[fullAnalysis.excess[0]]} 균형 잡힌 삶을 위해 자신의 강점을 살리되, 부족한 기운을 의식적으로 보완해 나가는 것이 이 사주의 핵심 과제입니다.
            </p>
          </div>
        </div>
      )}

      {/* ③ 자평진전 해설 */}
      {interpretation && (
        <>
          <div className="interpretation-card" style={{ marginBottom: '20px', padding: '20px', backgroundColor: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <h4 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: '600', display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                {t.japyungTitle}
              </h4>
              {language !== 'ko' && (
                <button onClick={() => handleTranslate(`자평진전 격국론\n\n[${interpretation.gyeok}격]: ${interpretation.japyung}`)} style={{ padding: '6px 12px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}>
                  {t.translateBtn}
                </button>
              )}
            </div>
            <p className="interpretation-text" style={{ lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '0.95rem', wordBreak: 'keep-all' }}>
              <strong>[{interpretation.gyeok}격]</strong>: {interpretation.japyung}
            </p>
          </div>

          <div className="interpretation-card" style={{ marginBottom: '20px', padding: '20px', backgroundColor: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <h4 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: '600', display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                {t.yeonhaeTitle}
              </h4>
              {language !== 'ko' && (
                <button onClick={() => handleTranslate(`연해자평 기준 성정 및 운세\n\n${interpretation.yeonhae}`)} style={{ padding: '6px 12px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}>
                  {t.translateBtn}
                </button>
              )}
            </div>
            <p className="interpretation-text" style={{ lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '0.95rem', wordBreak: 'keep-all' }}>
              {interpretation.yeonhae}
            </p>
          </div>
        </>
      )}

      {/* ③ 운세 흐름 해설 (luck null 체크) */}
      {luck && luck.daewun && (
        <div className="luck-flow-card" style={{ marginBottom: '20px', padding: '20px', backgroundColor: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <h4 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>
              {t.daewunDesc} — {luck.daewun.age}{t.ageSuffix} ({luck.daewun.pillar} {luck.daewun.god}운)
            </h4>
            {language !== 'ko' && (
              <button onClick={() => handleTranslate(`대운 해설\n\n[자평진전 관점]\n${luck.daewun.japyung}\n\n[연해자평 관점]\n${luck.daewun.yeonhae}`)} style={{ padding: '6px 12px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}>
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

      {luck && luck.sewun && (
        <div className="luck-flow-card" style={{ marginBottom: '20px', padding: '20px', backgroundColor: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <h4 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>
              {t.sewunDesc} — {luck.sewun.year}{language === 'ko' ? '년' : ''} ({luck.sewun.pillar} {luck.sewun.god}운)
            </h4>
            {language !== 'ko' && (
              <button onClick={() => handleTranslate(`세운 해설\n\n[자평진전 관점]\n${luck.sewun.japyung}\n\n[연해자평 관점]\n${luck.sewun.yeonhae}`)} style={{ padding: '6px 12px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}>
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

      {luck && luck.monthlyLuck && luck.monthlyLuck.length > 0 && (
        <div className="luck-flow-card" style={{ marginBottom: '25px', padding: '20px', backgroundColor: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <h4 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>
              {t.wolunDesc}
            </h4>
            {language !== 'ko' && (
              <button onClick={() => handleTranslate(`월운 상세 해설\n\n${luck.monthlyLuck.map(ml => `[${language === 'ko' ? `${ml.month}월` : monthEn[ml.month]}]\n${ml.desc}`).join('\n\n')}`)} style={{ padding: '6px 12px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}>
                {t.translateBtn}
              </button>
            )}
          </div>
          <div className="monthly-grid" style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto', paddingRight: '5px' }}>
            {luck.monthlyLuck.map((ml, idx) => (
              <div key={idx} style={{ padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '12px' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{language === 'ko' ? `${ml.month}월` : monthEn[ml.month]} ({ml.pillar} {ml.god}운)</strong>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0, wordBreak: 'keep-all' }}>
                    {ml.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🤖 AI 명리학 전문가 심층 분석 프롬프트 생성기 */}
      {luck && luck.daewun && (
        <div style={{ marginBottom: '25px', padding: '20px', background: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h4 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: '600', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {t.aiPromptTitle}
            </h4>
            <button
              onClick={() => setShowPrompt(!showPrompt)}
              style={{ padding: '6px 12px', fontSize: '0.85rem', background: 'var(--bg-color)', border: 'none', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: '500' }}
            >
              {showPrompt ? t.hidePrompt : t.showPrompt}
            </button>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px', lineHeight: '1.5' }}>
            챗GPT나 클로드(Claude)에게 아래 프롬프트를 복사하여 질문하면, 선택한 대운·세운·월운을 바탕으로 한 명리학 전문가 수준의 상세한 심층 분석을 받을 수 있습니다.
          </p>
          
          {showPrompt && (
            <div style={{ marginTop: '15px' }}>
              <div style={{ position: 'relative' }}>
                <textarea
                  readOnly
                  value={generateExpertPrompt(sajuData, luck)}
                  style={{ width: '100%', height: '250px', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6', resize: 'vertical', fontFamily: 'monospace' }}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateExpertPrompt(sajuData, luck));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  style={{ position: 'absolute', top: '10px', right: '10px', padding: '8px 16px', background: copied ? 'var(--text-primary)' : 'var(--bg-color)', color: copied ? 'white' : 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: '500', fontSize: '0.85rem', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                >
                  {copied ? t.copied : t.copyAll}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '50px', fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', padding: '10px' }}>
        {t.aiNotice}
      </div>
    </div>
  );
}
