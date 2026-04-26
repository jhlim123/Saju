import React, { useRef, useEffect } from 'react';
import { getTenGods, getTwelveStages, getElementClass, getElementColor, calculateInternationalAge, calculateDaewun } from '../utils/sajuLogic';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

export default function ManseryeokDisplay({ sajuData, userInfo, selectedDaewunAge, onSelectDaewun, onShowCreatorInfo }) {
  const { language } = useLanguage();
  const t = translations[language];
  const activeDaewunRef = useRef(null);

  if (!sajuData || !userInfo) return null;

  const dayStem = sajuData.dayPillarHanja?.[0] || '';
  const dayBranch = sajuData.dayPillarHanja?.[1] || '';
  const yearStem = sajuData.yearPillarHanja?.[0] || '';
  const yearBranch = sajuData.yearPillarHanja?.[1] || '';
  const monthStem = sajuData.monthPillarHanja?.[0] || '';
  const monthBranch = sajuData.monthPillarHanja?.[1] || '';
  const hourStem = sajuData.hourPillarHanja?.[0] || '';
  const hourBranch = sajuData.hourPillarHanja?.[1] || '';

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();
  const birthYear = parseInt(userInfo.birthDate.substring(0, 4)) || currentYear;
  const birthMonth = parseInt(userInfo.birthDate.substring(4, 6)) || 1;
  const birthDay = parseInt(userInfo.birthDate.substring(6, 8)) || 1;
  
  const age = calculateInternationalAge(userInfo.birthDate);
  const currentLinear = currentYear * 365 + currentMonth * 30 + currentDay;

  const dInfo = userInfo.daewunInfo;
  const dwStartAge = dInfo?.age || 9;

  const isActiveDaewun = (ageVal) => {
    if (!dInfo) return age >= ageVal && age < ageVal + 10;
    let ty = birthYear + ageVal;
    let tm = birthMonth + (dInfo.months || 0);
    let td = birthDay + (dInfo.days || 0);
    if (td > 30) { tm += 1; td -= 30; }
    if (tm > 12) { ty += 1; tm -= 12; }
    const sLinear = ty * 365 + tm * 30 + td;
    return currentLinear >= sLinear && currentLinear < sLinear + 10 * 365;
  };

  const inputDate = `${userInfo.birthDate.substring(0,4)}년 ${userInfo.birthDate.substring(4,6)}월 ${userInfo.birthDate.substring(6,8)}일`;
  const solarDate = `${userInfo.solarYear}년 ${userInfo.solarMonth}월 ${userInfo.solarDay}일`;
  
  const timeDisplay = userInfo.knowTime 
    ? (userInfo.birthTime ? `${userInfo.birthTime.substring(0,2)}:${userInfo.birthTime.substring(2,4)}` : '')
    : (userInfo.birthBranch ? `${userInfo.birthBranch}시` : '');
  
  const isYangYear = ['甲', '丙', '戊', '庚', '壬'].includes(yearStem);
  const isMale = userInfo.gender === 'male';
  const isForward = (isYangYear && isMale) || (!isYangYear && !isMale);

  const daewunList = calculateDaewun(yearStem, sajuData.monthPillarHanja, userInfo.gender, dwStartAge);

  useEffect(() => {
    if (activeDaewunRef.current) {
      activeDaewunRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [userInfo.birthDate]);

  return (
    <div className="manseryeok-container card animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{userInfo.name} {t.sajuResult}</h2>
          <div style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                {userInfo.calendarType === 'solar' ? t.solar : t.lunar}:
              </span>
              <span>{inputDate} {timeDisplay} {userInfo.calendarType === 'lunar' && userInfo.leapMonth === 'leap' ? `(${t.isLeapMonth})` : ''}</span>
            </div>
            {userInfo.calendarType === 'lunar' && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{t.solar}:</span>
                <span>{solarDate} {userInfo.solarHour !== undefined ? `${String(userInfo.solarHour).padStart(2, '0')}:${String(userInfo.solarMinute).padStart(2, '0')}` : ''}</span>
              </div>
            )}
            <div style={{ marginTop: '4px', fontSize: '0.9rem' }}>
              {userInfo.gender === 'male' ? t.male : t.female} / {age}{t.ageSuffix}
            </div>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto', marginBottom: '25px' }}>
        <table className="saju-table">
          <thead>
            <tr><th>{t.hourPillar}</th><th>{t.dayPillar}</th><th>{t.monthPillar}</th><th>{t.yearPillar}</th></tr>
          </thead>
          <tbody>
            <tr className="saju-row-label">
              <td style={{ color: getElementColor(hourStem), fontWeight: '700' }}>{getTenGods(dayStem, hourStem)}</td>
              <td style={{ color: 'var(--accent-color)', fontWeight: '800' }}>{t.dayMaster}</td>
              <td style={{ color: getElementColor(monthStem), fontWeight: '700' }}>{getTenGods(dayStem, monthStem)}</td>
              <td style={{ color: getElementColor(yearStem), fontWeight: '700' }}>{getTenGods(dayStem, yearStem)}</td>
            </tr>
            <tr>
              <td><div className={`saju-box ${getElementClass(hourStem)}`}>{hourStem}</div></td>
              <td><div className={`saju-box ${getElementClass(dayStem)}`}>{dayStem}</div></td>
              <td><div className={`saju-box ${getElementClass(monthStem)}`}>{monthStem}</div></td>
              <td><div className={`saju-box ${getElementClass(yearStem)}`}>{yearStem}</div></td>
            </tr>
            <tr>
              <td><div className={`saju-box ${getElementClass(hourBranch)}`}>{hourBranch}</div></td>
              <td><div className={`saju-box ${getElementClass(dayBranch)}`}>{dayBranch}</div></td>
              <td><div className={`saju-box ${getElementClass(monthBranch)}`}>{monthBranch}</div></td>
              <td><div className={`saju-box ${getElementClass(yearBranch)}`}>{yearBranch}</div></td>
            </tr>
            <tr className="saju-row-footer">
              <td style={{ fontSize: '0.85rem' }}>
                <span style={{ color: getElementColor(hourBranch), fontWeight: '700' }}>{getTenGods(dayStem, hourBranch)}</span><br/>
                <span style={{ color: 'var(--text-secondary)' }}>{getTwelveStages(dayStem, hourBranch)}</span>
              </td>
              <td style={{ fontSize: '0.85rem' }}>
                <span style={{ color: getElementColor(dayBranch), fontWeight: '700' }}>{getTenGods(dayStem, dayBranch)}</span><br/>
                <span style={{ color: 'var(--text-secondary)' }}>{getTwelveStages(dayStem, dayBranch)}</span>
              </td>
              <td style={{ fontSize: '0.85rem' }}>
                <span style={{ color: getElementColor(monthBranch), fontWeight: '700' }}>{getTenGods(dayStem, monthBranch)}</span><br/>
                <span style={{ color: 'var(--text-secondary)' }}>{getTwelveStages(dayStem, monthBranch)}</span>
              </td>
              <td style={{ fontSize: '0.85rem' }}>
                <span style={{ color: getElementColor(yearBranch), fontWeight: '700' }}>{getTenGods(dayStem, yearBranch)}</span><br/>
                <span style={{ color: 'var(--text-secondary)' }}>{getTwelveStages(dayStem, yearBranch)}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="daewun-header-section" style={{ textAlign: 'center', marginBottom: '15px' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
          {t.age} ({t.daewunTitle}: {dwStartAge}, {isForward ? (language === 'ko' ? '순행' : 'Forward') : (language === 'ko' ? '역행' : 'Reverse')})
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {language === 'ko' ? `정밀 대운수: ${dInfo?.details || dwStartAge + '년'}` : `Precise Daewun-su: ${dInfo?.details || dwStartAge}`}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: '600', marginTop: '3px' }}>
          {language === 'ko' 
            ? `첫대운 시작일: ${dInfo?.startDate || "계산중..."}` 
            : `First Daewun Starts: ${dInfo?.startDate || "Calculating..."}`}
        </div>
      </div>

      <div className="horizontal-scroll">
        <table className="saju-table" style={{ minWidth: '650px' }}>
          <thead>
            <tr style={{ fontSize: '0.9rem' }}>
              {daewunList.map((dw, idx) => {
                const active = isActiveDaewun(dw.age);
                return (
                  <th key={idx} onClick={() => onSelectDaewun(dw.age)} ref={active ? activeDaewunRef : null}
                      className={dw.age === selectedDaewunAge ? 'selected-dw' : ''}
                      style={{ color: active ? 'var(--text-primary)' : '#888' }}>
                    {dw.age}<br/>
                    <span style={{ color: active ? getElementColor(dw.stem) : '#aaa', fontSize: '0.8rem', fontWeight: active ? '700' : '400' }}>
                      {getTenGods(dayStem, dw.stem)}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              {daewunList.map((dw, idx) => (
                <td key={idx} onClick={() => onSelectDaewun(dw.age)} className={dw.age === selectedDaewunAge ? 'selected-dw' : ''}>
                  <div className={`saju-box ${getElementClass(dw.stem)}`}>{dw.stem}</div>
                </td>
              ))}
            </tr>
            <tr>
              {daewunList.map((dw, idx) => (
                <td key={idx} onClick={() => onSelectDaewun(dw.age)} className={dw.age === selectedDaewunAge ? 'selected-dw' : ''}>
                  <div className={`saju-box ${getElementClass(dw.branch)}`}>{dw.branch}</div>
                </td>
              ))}
            </tr>
            <tr style={{ fontSize: '0.85rem', color: '#666' }}>
              {daewunList.map((dw, idx) => (
                <td key={idx} onClick={() => onSelectDaewun(dw.age)} className={dw.age === selectedDaewunAge ? 'selected-dw' : ''}>
                  <span style={{ color: getElementColor(dw.branch), fontWeight: '700' }}>
                    {getTenGods(dayStem, dw.branch)}
                  </span><br/>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{getTwelveStages(dayStem, dw.branch)}</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
