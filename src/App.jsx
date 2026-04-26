import { useState, useEffect } from 'react';
import SajuInputForm from './components/SajuInputForm';
import ManseryeokDisplay from './components/ManseryeokDisplay';
import DaewunSewunDisplay from './components/DaewunSewunDisplay';
import SajuInterpretation from './components/SajuInterpretation';
import { calculateSaju, getMonthlyIndex } from '@fullstackfamily/manseryeok';
import { calculateInternationalAge, calculateDaewunStartAge } from './utils/sajuLogic';
import { saveToHistory } from './utils/storageUtils';
import SajuHistory from './components/SajuHistory';
import CreatorInfoModal from './components/CreatorInfoModal';
import { useLanguage } from './contexts/LanguageContext';
import { translations } from './utils/translations';
import './index.css';

// 라이브러리의 lunarToSolar 버그 보완 (연말 음력이 다음해 양력으로 넘어가는 경우 대응)
const robustLunarToSolar = (lunarYear, lunarMonth, lunarDay, isLeapMonth = false) => {
  for (const y of [lunarYear, lunarYear + 1]) {
    for (let m = 1; m <= 12; m++) {
      const monthIndex = getMonthlyIndex(y, m);
      if (!monthIndex) continue;
      const entry = monthIndex.entries.find(e => 
        e.lunar.year === lunarYear &&
        e.lunar.month === lunarMonth &&
        e.lunar.day === lunarDay &&
        e.lunar.isLeap === isLeapMonth
      );
      if (entry) return entry;
    }
  }
  throw new Error("유효하지 않은 음력 날짜입니다.");
};

function App() {
  const [view, setView] = useState('input');
  const [sajuData, setSajuData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedDaewunAge, setSelectedDaewunAge] = useState(null);
  const [selectedSewunYear, setSelectedSewunYear] = useState(null);
  const [showCreatorInfo, setShowCreatorInfo] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  const handleLookup = (formData) => {
    let birthDate = formData.birthDate;
    let birthTime = formData.birthTime;

    // Legacy format support: convert YYYYMMDD to YYYY-MM-DD
    if (birthDate && birthDate.length === 8 && !birthDate.includes('-')) {
      birthDate = `${birthDate.substring(0, 4)}-${birthDate.substring(4, 6)}-${birthDate.substring(6, 8)}`;
    }
    // Legacy format support: convert HHMM to HH:mm
    if (birthTime && birthTime.length === 4 && !birthTime.includes(':')) {
      birthTime = `${birthTime.substring(0, 2)}:${birthTime.substring(2, 4)}`;
    }

    const dateParts = birthDate ? birthDate.split('-') : [];
    if (dateParts.length !== 3) {
      alert(language === 'ko' ? "생년월일을 정확히 선택해주세요." : "Please select birth date correctly.");
      return;
    }
    
    let year = parseInt(dateParts[0]);
    let month = parseInt(dateParts[1]);
    let day = parseInt(dateParts[2]);
    
    // Internal 8-digit string for some utility functions
    const internalBirthDateStr = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;

    if (formData.calendarType === 'lunar') {
      try {
        const result = robustLunarToSolar(year, month, day, formData.leapMonth === 'leap');
        year = result.solar.year;
        month = result.solar.month;
        day = result.solar.day;
      } catch (e) {
        alert(language === 'ko' ? `음력 변환 오류: ${e.message}` : `Lunar conversion error: ${e.message}`);
        return;
      }
    }
    
    let hour = undefined;
    let minute = undefined;
    let internalBirthTimeStr = '';
    
    if (formData.knowTime) {
      const timeParts = birthTime ? birthTime.split(':') : [];
      if (timeParts.length === 2) {
        hour = parseInt(timeParts[0]);
        minute = parseInt(timeParts[1]);
        internalBirthTimeStr = `${String(hour).padStart(2, '0')}${String(minute).padStart(2, '0')}`;
      }
    } else if (formData.birthBranch) {
      const branchTimeMap = {
        '자': { h: 0, m: 0 },
        '축': { h: 2, m: 30 },
        '인': { h: 4, m: 30 },
        '묘': { h: 6, m: 30 },
        '진': { h: 8, m: 30 },
        '사': { h: 10, m: 30 },
        '오': { h: 12, m: 30 },
        '미': { h: 14, m: 30 },
        '신': { h: 16, m: 30 },
        '유': { h: 18, m: 30 },
        '술': { h: 20, m: 30 },
        '해': { h: 22, m: 30 }
      };
      const time = branchTimeMap[formData.birthBranch];
      if (time) {
        hour = time.h;
        minute = time.m;
        internalBirthTimeStr = `${String(hour).padStart(2, '0')}${String(minute).padStart(2, '0')}`;
      }
    }

    try {
      const saju = calculateSaju(year, month, day, hour, minute);
      setSajuData(saju);

      const currentYear = new Date().getFullYear();
      // Use internal format for utility functions
      const currentAge = calculateInternationalAge(internalBirthDateStr);

      const solarDateStr = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
      
      const dInfo = calculateDaewunStartAge(
        solarDateStr,
        internalBirthTimeStr,
        saju,
        formData.gender
      );
      
      const activeDaewunAge = currentAge >= dInfo.age
        ? Math.floor((currentAge - dInfo.age) / 10) * 10 + dInfo.age
        : dInfo.age;
        
      setSelectedDaewunAge(activeDaewunAge);
      setSelectedSewunYear(currentYear);

      const branchNames = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
      let zodiacSign = formData.birthBranch || "";
      if (formData.knowTime && hour !== undefined) {
          const h = (hour * 60 + minute + 30) % 1440; 
          const idx = Math.floor(h / 120);
          zodiacSign = branchNames[idx];
      }

      // 음력 정보 추출 (양력 입력 시에도 계산)
      let lunarDateStr = "";
      try {
        const mIdx = getMonthlyIndex(year, month);
        const entry = mIdx?.entries.find(e => e.solar.year === year && e.solar.month === month && e.solar.day === day);
        if (entry) {
          const l = entry.lunar;
          lunarDateStr = `${l.year}-${String(l.month).padStart(2, '0')}-${String(l.day).padStart(2, '0')}${l.isLeap ? '(윤)' : ''}`;
        }
      } catch (err) {
        console.error("Lunar conversion error for history:", err);
      }

      const newUserInfo = {
        ...formData,
        birthDate: internalBirthDateStr,
        birthTime: internalBirthTimeStr,
        solarYear: year,
        solarMonth: month,
        solarDay: day,
        solarHour: hour,
        solarMinute: minute,
        lunarDateStr: lunarDateStr,
        zodiacSign: zodiacSign,
        daewunInfo: dInfo,
        version: "1.1.9-history-complete"
      };
      
      setUserInfo(newUserInfo);
      setView('result');
      saveToHistory(newUserInfo);
    } catch (e) {
      console.error("App Error:", e);
      alert(language === 'ko' ? "사주 분석 중 오류가 발생했습니다: " + e.message : "Error during analysis: " + e.message);
    }
  };

  const handleSelectDaewun = (age) => {
    setSelectedDaewunAge(age);
    if (userInfo) {
      // 만 나이 기준으로 세운 연도 계산
      const birthYear = parseInt(userInfo.birthDate.substring(0, 4));
      setSelectedSewunYear(birthYear + age);
    }
  };

  const handleReset = () => {
    setSajuData(null);
    setUserInfo(null);
    setSelectedDaewunAge(null);
    setSelectedSewunYear(null);
    setView('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFromHistory = (item) => {
    handleLookup(item);
  };

  // 결과 화면 상단 통합 메뉴 컴포넌트
  const NavigationMenu = () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '15px 20px', flexWrap: 'nowrap' }}>
      <button 
        onClick={() => { setView('input'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
        className="btn-secondary"
        style={{ padding: '8px 12px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
      >
        {language === 'ko' ? '돌아가기' : t.back}
      </button>
      <button 
        onClick={handleReset} 
        className="btn-secondary"
        style={{ padding: '8px 12px', fontSize: '0.85rem', whiteSpace: 'nowrap', background: 'var(--text-primary)', color: 'white' }}
      >
        {language === 'ko' ? '새로운 사주보기' : t.newLookup}
      </button>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button onClick={toggleLanguage} className="btn-lang" style={{ padding: '6px 10px', fontSize: '0.8rem' }}>
          {language === 'ko' ? 'EN' : '한글'}
        </button>
        <div onClick={() => setShowCreatorInfo(true)} className="icon-info" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>i</div>
      </div>
    </div>
  );

  const headerButtons = (
    <div style={{ padding: '20px 20px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <button onClick={() => setView(view === 'history' ? 'input' : 'history')} className="btn-secondary">
        {view === 'history' ? t.back : t.savedHistory}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={toggleLanguage} className="btn-lang">{language === 'ko' ? 'EN' : '한글'}</button>
        <div onClick={() => setShowCreatorInfo(true)} className="icon-info">i</div>
      </div>
    </div>
  );

  useEffect(() => {
    if (view === 'result') {
      // 렌더링 완료 후 최상단으로 스크롤
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [view]);

  return (
    <div className="app-container">
      <div className="portrait-alert">{t.portraitWarning}</div>
      
      {/* 전역 헤더 버튼 (결과 및 히스토리 화면 제외) */}
      {view !== 'history' && view !== 'result' && headerButtons}

      {view === 'input' && (
        <SajuInputForm onSubmit={handleLookup} />
      )}

      {view === 'history' && (
        <>
          <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setView('input')} className="btn-secondary">{t.back}</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={toggleLanguage} className="btn-lang">{language === 'ko' ? 'EN' : '한글'}</button>
              <div onClick={() => setShowCreatorInfo(true)} className="icon-info">i</div>
            </div>
          </div>
          <SajuHistory onSelect={handleSelectFromHistory} onBack={() => setView('input')} />
        </>
      )}
      
      {view === 'result' && sajuData && userInfo && (
        <>
          <NavigationMenu />
          <ManseryeokDisplay 
            sajuData={sajuData} 
            userInfo={userInfo} 
            selectedDaewunAge={selectedDaewunAge}
            onSelectDaewun={handleSelectDaewun}
            onShowCreatorInfo={() => setShowCreatorInfo(true)}
          />
          <hr className="divider" />
          <DaewunSewunDisplay 
            sajuData={sajuData} 
            userInfo={userInfo} 
            selectedDaewunAge={selectedDaewunAge}
            selectedSewunYear={selectedSewunYear}
            onSelectSewun={setSelectedSewunYear}
          />
          <SajuInterpretation 
            sajuData={sajuData} 
            userInfo={userInfo} 
            selectedSewunYear={selectedSewunYear}
            selectedDaewunAge={selectedDaewunAge}
            onReset={handleReset}
          />
          <div style={{ padding: '0 20px 40px', display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => { setView('input'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="btn-secondary"
              style={{ flex: 1, padding: '15px', borderRadius: '16px', textAlign: 'center', justifyContent: 'center' }}
            >
              {language === 'ko' ? '돌아가기' : t.back}
            </button>
            <button 
              onClick={handleReset} 
              className="btn-secondary"
              style={{ flex: 1, padding: '15px', borderRadius: '16px', background: 'var(--text-primary)', color: 'white', textAlign: 'center', justifyContent: 'center' }}
            >
              {language === 'ko' ? '새로운 사주보기' : t.newLookup}
            </button>
          </div>
        </>
      )}
      
      {showCreatorInfo && <CreatorInfoModal onClose={() => setShowCreatorInfo(false)} />}
      <div style={{ position: 'fixed', bottom: 5, right: 5, fontSize: '0.6rem', color: '#ccc', pointerEvents: 'none' }}>
        {userInfo?.version || "1.1.5-idle"}
      </div>
    </div>
  );
}

export default App;
