import { useRef, useEffect } from 'react';
import { calculateSewun, calculateWolun, getTenGods, getTwelveStages, getShensha, getElementClass } from '../utils/sajuLogic';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, translateTenGods, translateTwelveStages } from '../utils/translations';

export default function DaewunSewunDisplay({ sajuData, userInfo, selectedDaewunAge, selectedSewunYear, onSelectSewun }) {
  const { language } = useLanguage();
  const t = translations[language];
  const monthEn = ["", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  
  const sewunRef = useRef(null);
  const wolunRef = useRef(null);

  useEffect(() => {
    if (sewunRef.current) {
      sewunRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedDaewunAge]);

  useEffect(() => {
    if (wolunRef.current) {
      wolunRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedSewunYear]);

  if (!sajuData || !userInfo) return null;

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const birthYear = parseInt(userInfo.birthDate.substring(0, 4)) || currentYear;
  
  // 대운이 선택되었을 때 보여줄 세운 리스트의 기준년도
  const sewunStartYear = selectedDaewunAge ? (birthYear + selectedDaewunAge) : (currentYear - 3);
  const sewunList = calculateSewun(sewunStartYear);
  
  // 선택된 세운 연도의 천간 찾기
  const targetSewun = sewunList.find(sw => sw.year === selectedSewunYear) || sewunList[sewunList.length - 1];
  const wolunList = [...calculateWolun(targetSewun?.stem || '甲')].reverse(); 
  
  const dayStem = sajuData.dayPillarHanja?.[0] || '';
  const targetBranch = targetSewun?.branch || '';
  const yearStem = sajuData.yearPillarHanja?.[0] || '';
  const birthYearBranch = sajuData.yearPillarHanja?.[1] || '';

  return (
    <div style={{ padding: '0 5px' }}>
      {/* Sewun Section */}
      <div style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', margin: '20px 0 15px' }}>
        {t.sewunTitle} ({selectedDaewunAge ? `${selectedDaewunAge}${t.ageSuffix} ${t.daewunTitle}` : (language === 'ko' ? '현재' : 'Current')})
      </div>
      <div className="horizontal-scroll" style={{ paddingBottom: '10px' }}>
        <table className="saju-table" style={{ minWidth: '650px' }}>
          <thead>
            <tr style={{ fontSize: '0.9rem' }}>
              {sewunList.map((sw, i) => (
                <th key={i} 
                    onClick={() => onSelectSewun(sw.year)}
                    ref={sw.year === currentYear ? sewunRef : null}
                    style={{ 
                      cursor: 'pointer', 
                      backgroundColor: sw.year === selectedSewunYear ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                      borderBottom: sw.year === selectedSewunYear ? '3px solid #3b82f6' : 'none',
                      transition: 'all 0.2s'
                    }}>
                  {sw.year}<br/>
                  <span style={{ color: `var(--${getElementClass(sw.stem).replace('element-', '')}-text)`, fontSize: '0.8rem' }}>
                    {getTenGods(dayStem, sw.stem)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {sewunList.map((sw, i) => (
                <td key={i} 
                    onClick={() => onSelectSewun(sw.year)}
                    style={{ cursor: 'pointer', backgroundColor: sw.year === selectedSewunYear ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }}>
                  <div className={`saju-box ${getElementClass(sw.stem)}`}>{sw.stem}</div>
                </td>
              ))}
            </tr>
            <tr>
              {sewunList.map((sw, i) => (
                <td key={i} 
                    onClick={() => onSelectSewun(sw.year)}
                    style={{ cursor: 'pointer', backgroundColor: sw.year === selectedSewunYear ? 'rgba(59, 130, 246, 0.05)' : 'transparent', transition: 'all 0.2s' }}>
                  <div className={`saju-box ${getElementClass(sw.branch)}`}>{sw.branch}</div>
                </td>
              ))}
            </tr>
            <tr style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.4' }}>
              {sewunList.map((sw, i) => {
                const ss = getShensha(dayStem, sw.stem, sw.branch, birthYearBranch);
                return (
                  <td key={i} 
                      onClick={() => onSelectSewun(sw.year)}
                      style={{ paddingTop: '8px', cursor: 'pointer', backgroundColor: sw.year === selectedSewunYear ? 'rgba(59, 130, 246, 0.05)' : 'transparent', transition: 'all 0.2s' }}>
                    <span style={{ color: `var(--${getElementClass(sw.branch).replace('element-', '')}-text)`, fontWeight: '600' }}>
                      {getTenGods(dayStem, sw.branch)}
                    </span><br/>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{getTwelveStages(dayStem, sw.branch)}</span><br/>
                    {ss.length > 0 ? ss.map((s, idx) => <div key={idx} style={{fontSize: '0.75rem', color: '#6366f1'}}>{s}</div>) : '-'}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <hr style={{ margin: '30px 20px', border: 'none', borderTop: '1px solid #e5e7eb' }} />

      {/* Wolun Section */}
      <div style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', margin: '20px 0 15px' }}>
        {language === 'ko' ? `${selectedSewunYear}년 월운` : `${selectedSewunYear} ${t.wolunTitle}`}
      </div>
      <div className="horizontal-scroll" style={{ paddingBottom: '10px' }}>
        <table className="saju-table" style={{ minWidth: '950px' }}>
          <thead>
            <tr style={{ fontSize: '0.85rem' }}>
              {wolunList.map((ww, i) => (
                <th key={i} ref={ww.month === currentMonth ? wolunRef : null}>
                  {language === 'ko' ? `${ww.month}월(${ww.jeolgi})` : `${monthEn[ww.month]}(${ww.jeolgi})`}<br/>
                  <span style={{ color: `var(--${getElementClass(ww.stem).replace('element-', '')}-text)`, fontSize: '0.8rem' }}>
                    {getTenGods(dayStem, ww.stem)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {wolunList.map((ww, i) => (
                <td key={i}><div className={`saju-box ${getElementClass(ww.stem)}`}>{ww.stem}</div></td>
              ))}
            </tr>
            <tr>
              {wolunList.map((ww, i) => (
                <td key={i}><div className={`saju-box ${getElementClass(ww.branch)}`}>{ww.branch}</div></td>
              ))}
            </tr>
            <tr style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: '1.4' }}>
              {wolunList.map((ww, i) => {
                const ss = getShensha(dayStem, ww.stem, ww.branch, birthYearBranch);
                return (
                  <td key={i} style={{ paddingTop: '8px' }}>
                    <span style={{ color: `var(--${getElementClass(ww.branch).replace('element-', '')}-text)`, fontWeight: '600' }}>
                      {getTenGods(dayStem, ww.branch)}
                    </span><br/>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{getTwelveStages(dayStem, ww.branch)}</span><br/>
                    {ss.length > 0 ? ss.map((s, idx) => <div key={idx} style={{fontSize: '0.7rem', color: '#6366f1'}}>{s}</div>) : '-'}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
