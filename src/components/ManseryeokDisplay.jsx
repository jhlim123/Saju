import { useState, useEffect, useRef } from 'react';
import { getTenGods, calculateDaewun, getTwelveStages, calculateInternationalAge } from '../utils/sajuLogic';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, translateTenGods, translateTwelveStages } from '../utils/translations';

const getElementClass = (char) => {
  const wood = ['甲', '乙', '寅', '卯'];
  const fire = ['丙', '丁', '巳', '午'];
  const earth = ['戊', '己', '辰', '戌', '丑', '未'];
  const metal = ['庚', '辛', '申', '酉'];
  const water = ['壬', '癸', '亥', '子'];
  
  if (wood.includes(char)) return 'wood';
  if (fire.includes(char)) return 'fire';
  if (earth.includes(char)) return 'earth';
  if (metal.includes(char)) return 'metal';
  if (water.includes(char)) return 'water';
  return '';
};

export default function ManseryeokDisplay({ sajuData, userInfo, selectedDaewunAge, onSelectDaewun, onShowCreatorInfo }) {
  const { language } = useLanguage();
  const t = translations[language];
  const activeDaewunRef = useRef(null);

  useEffect(() => {
    if (activeDaewunRef.current) {
      activeDaewunRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [userInfo.birthDate]);

  if (!sajuData || !userInfo) return null;

  const yearStem = sajuData.yearPillarHanja?.[0] || '';
  const yearBranch = sajuData.yearPillarHanja?.[1] || '';
  const monthStem = sajuData.monthPillarHanja?.[0] || '';
  const monthBranch = sajuData.monthPillarHanja?.[1] || '';
  const dayStem = sajuData.dayPillarHanja?.[0] || '';
  const dayBranch = sajuData.dayPillarHanja?.[1] || '';
  const hourStem = sajuData.hourPillarHanja?.[0] || '';
  const hourBranch = sajuData.hourPillarHanja?.[1] || '';

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();
  const birthYear = parseInt(userInfo.birthDate.substring(0, 4)) || currentYear;
  const birthMonth = parseInt(userInfo.birthDate.substring(4, 6)) || 1;
  const birthDay = parseInt(userInfo.birthDate.substring(6, 8)) || 1;
  
  const age = calculateInternationalAge(userInfo.birthDate);

  // 현재 날짜를 선형 일수로 변환
  const currentLinear = currentYear * 365 + currentMonth * 30 + currentDay; // 근사치 비교용

  /**
   * 특정 대운이 현재 활성 상태인지 판별
   * @param {number} dwAge - 대운수 (예: 8, 18, 28...)
   */
  const isActiveDaewun = (dwAge) => {
    // 대운 시작 날짜 계산: 생일 + (대운수 - 1) * 10년? No, 대운수는 만 나이 기준 시작점임.
    // 대운수가 8이면 만 8세가 되는 시점(근사)에 시작.
    const startYear = birthYear + dwAge;
    // 좀 더 정밀하게 하려면 userInfo.daewunInfo의 개월/일수까지 더해야 함
    const dInfo = userInfo.daewunInfo;
    let targetYear = birthYear + dwAge;
    let targetMonth = birthMonth + (dInfo.months || 0);
    let targetDay = birthDay + (dInfo.days || 0);
    
    if (targetDay > 30) { targetMonth += 1; targetDay -= 30; }
    if (targetMonth > 12) { targetYear += 1; targetMonth -= 12; }

    const startLinear = targetYear * 365 + targetMonth * 30 + targetDay;
    const endLinear = (targetYear + 10) * 365 + targetMonth * 30 + targetDay;

    return currentLinear >= startLinear && currentLinear < endLinear;
  };

  const formattedDate = `${userInfo.birthDate.substring(0,4)}년${userInfo.birthDate.substring(4,6)}월${userInfo.birthDate.substring(6,8)}일`;
  const formattedDateEn = `${userInfo.birthDate.substring(0,4)}.${userInfo.birthDate.substring(4,6)}.${userInfo.birthDate.substring(6,8)}`;
  const formattedTime = userInfo.knowTime && userInfo.birthTime ? `${userInfo.birthTime.substring(0,2)}:${userInfo.birthTime.substring(2,4)}` : '';

  // Calculate Ten Gods
  const yearStemGod = getTenGods(dayStem, yearStem);
  const yearBranchGod = getTenGods(dayStem, yearBranch);
  const monthStemGod = getTenGods(dayStem, monthStem);
  const monthBranchGod = getTenGods(dayStem, monthBranch);
  const hourStemGod = getTenGods(dayStem, hourStem);
  const hourBranchGod = getTenGods(dayStem, hourBranch);
  const dayBranchGod = getTenGods(dayStem, dayBranch);

  // 대운 목록 계산 (정밀 대운 정보 적용)
  const daewunInfo = userInfo.daewunInfo;
  if (!daewunInfo) return null;
  const daewunStartAge = daewunInfo.age;
  const daewunList = calculateDaewun(yearStem, sajuData.monthPillarHanja, userInfo.gender, daewunStartAge);
  const yearInfo = ['甲','丙','戊','庚','壬'].includes(yearStem) ? 1 : 0;
  const isMale = userInfo.gender === 'male';
  const isForward = (yearInfo === 1 && isMale) || (yearInfo === 0 && !isMale);

  return (
    <div>
      {/* Header Profile Area */}
      <div className="profile-area" style={{ backgroundColor: 'var(--bg-color)', padding: '24px 20px', borderRadius: '24px', margin: '20px 20px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 auto' }}>
          <div>
            <div className="profile-name" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {userInfo.name || t.unknown} <span style={{fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-secondary)'}}>{userInfo.gender === 'male' ? (language === 'ko' ? '남(乾命)' : 'Male') : (language === 'ko' ? '여(坤命)' : 'Female')}</span> ({t.age} {age}{t.ageSuffix})
            </div>
            <div className="profile-date" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              ({userInfo.calendarType === 'solar' ? t.solar : t.lunar}) {language === 'ko' ? formattedDate : formattedDateEn} {formattedTime}
            </div>
          </div>
        </div>
        <div 
          onClick={onShowCreatorInfo}
          title={t.creatorInfo}
          style={{ width: '28px', height: '28px', border: '1px solid var(--border-color)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '500', fontSize: '1rem', cursor: 'pointer', flexShrink: 0, transition: 'background-color 0.2s', backgroundColor: 'transparent', color: 'var(--text-secondary)' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-color)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          i
        </div>
      </div>

      {/* Main Saju Grid (Four Pillars) */}
      <div className="horizontal-scroll" style={{ width: '100%', padding: '0' }}>
        <table className="saju-table" style={{ minWidth: '350px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ borderRight: '1px solid var(--border-color)', paddingBottom: '8px' }}>{t.hourPillar}</th>
              <th style={{ borderRight: '1px solid var(--border-color)', paddingBottom: '8px' }}>{t.dayPillar}</th>
              <th style={{ borderRight: '1px solid var(--border-color)', paddingBottom: '8px' }}>{t.monthPillar}</th>
              <th style={{ paddingBottom: '8px' }}>{t.yearPillar}</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: 'var(--bg-color)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <td style={{ padding: '12px 5px', borderRight: '1px solid var(--border-color)' }}>{sajuData.hourPillar || t.unknown}<br/><span style={{color: 'var(--text-primary)'}}>{hourStemGod}</span></td>
              <td style={{ padding: '12px 5px', borderRight: '1px solid var(--border-color)' }}>{sajuData.dayPillar}<br/><span style={{color: 'var(--text-primary)', fontWeight: '600'}}>{t.dayMaster}</span></td>
              <td style={{ padding: '12px 5px', borderRight: '1px solid var(--border-color)' }}>{sajuData.monthPillar}<br/><span style={{color: 'var(--text-primary)'}}>{monthStemGod}</span></td>
              <td style={{ padding: '12px 5px' }}>{sajuData.yearPillar}<br/><span style={{color: 'var(--text-primary)'}}>{yearStemGod}</span></td>
            </tr>
            <tr>
              <td style={{ paddingTop: '15px' }}>{hourStem && <div className={`saju-box ${getElementClass(hourStem)}`}>{hourStem}</div>}</td>
              <td style={{ paddingTop: '15px' }}><div className={`saju-box ${getElementClass(dayStem)}`}>{dayStem}</div></td>
              <td style={{ paddingTop: '15px' }}><div className={`saju-box ${getElementClass(monthStem)}`}>{monthStem}</div></td>
              <td style={{ paddingTop: '15px' }}><div className={`saju-box ${getElementClass(yearStem)}`}>{yearStem}</div></td>
            </tr>
            <tr>
              <td>{hourBranch && <div className={`saju-box ${getElementClass(hourBranch)}`}>{hourBranch}</div>}</td>
              <td><div className={`saju-box ${getElementClass(dayBranch)}`}>{dayBranch}</div></td>
              <td><div className={`saju-box ${getElementClass(monthBranch)}`}>{monthBranch}</div></td>
              <td><div className={`saju-box ${getElementClass(yearBranch)}`}>{yearBranch}</div></td>
            </tr>
            <tr style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <td style={{ padding: '8px 0 15px' }}>{hourBranchGod}</td>
              <td style={{ padding: '8px 0 15px' }}>{dayBranchGod}</td>
              <td style={{ padding: '8px 0 15px' }}>{monthBranchGod}</td>
              <td style={{ padding: '8px 0 15px' }}>{yearBranchGod}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Daewun Header */}
      <div className="daewun-header" style={{ textAlign: 'center', margin: '15px 0 10px', fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.5' }}>
        <div style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>
          {t.age} ({t.daewunTitle} : {daewunStartAge} , {isForward ? (language === 'ko' ? '순행' : 'Forward') : (language === 'ko' ? '역행' : 'Reverse')})
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
          {language === 'ko' 
            ? `정밀 대운수: ${daewunInfo.details || daewunStartAge + '년'}` 
            : `Precise Daewun-su: ${daewunInfo.details || daewunStartAge + ' years'}`}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#3b82f6', marginTop: '2px' }}>
          {language === 'ko' 
            ? `첫대운 시작일: ${birthYear + daewunStartAge}년 ${userInfo.solarMonth}월 ${userInfo.solarDay}일경` 
            : `First Daewun Starts: Around ${userInfo.solarMonth}/${userInfo.solarDay}/${birthYear + daewunStartAge}`}
        </div>
      </div>

      {/* Daewun Grid */}
      <div className="horizontal-scroll" style={{ padding: '0 5px' }}>
        <table className="saju-table" style={{ minWidth: '650px' }}>
          <thead>
            <tr style={{ fontSize: '0.9rem' }}>
              {daewunList.map((dw, idx) => {
                const active = isActiveDaewun(dw.age);
                return (
                  <th key={idx} 
                      onClick={() => onSelectDaewun(dw.age)}
                      ref={active ? activeDaewunRef : null}
                      style={{ 
                        cursor: 'pointer',
                        backgroundColor: dw.age === selectedDaewunAge ? '#ebf5ff' : 'transparent',
                        borderBottom: dw.age === selectedDaewunAge ? '3px solid #3b82f6' : 'none',
                        color: active ? '#1d1d1f' : '#86868b',
                        fontWeight: active ? 'bold' : 'normal'
                      }}>
                    {dw.age}<br/>{getTenGods(dayStem, dw.stem)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              {daewunList.map((dw, idx) => (
                <td key={idx} 
                    onClick={() => onSelectDaewun(dw.age)}
                    style={{ cursor: 'pointer', backgroundColor: dw.age === selectedDaewunAge ? '#ebf5ff' : 'transparent' }}>
                  <div className={`saju-box ${getElementClass(dw.stem)}`}>{dw.stem}</div>
                </td>
              ))}
            </tr>
            <tr>
              {daewunList.map((dw, idx) => (
                <td key={idx} 
                    onClick={() => onSelectDaewun(dw.age)}
                    style={{ cursor: 'pointer', backgroundColor: dw.age === selectedDaewunAge ? '#ebf5ff' : 'transparent' }}>
                  <div className={`saju-box ${getElementClass(dw.branch)}`}>{dw.branch}</div>
                </td>
              ))}
            </tr>
            <tr style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.4' }}>
              {daewunList.map((dw, idx) => (
                <td key={idx} 
                    onClick={() => onSelectDaewun(dw.age)}
                    style={{ paddingTop: '8px', cursor: 'pointer', backgroundColor: dw.age === selectedDaewunAge ? '#ebf5ff' : 'transparent' }}>
                  {getTenGods(dayStem, dw.branch)}<br/>{getTwelveStages(dayStem, dw.branch)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
