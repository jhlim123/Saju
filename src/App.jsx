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
    if (!formData.birthDate || formData.birthDate.length !== 8) {
      alert("생년월일 8자리를 입력해주세요. (예: 19881230)");
      return;
    }
    
    let year = parseInt(formData.birthDate.substring(0, 4));
    let month = parseInt(formData.birthDate.substring(4, 6));
    let day = parseInt(formData.birthDate.substring(6, 8));
    
    if (formData.calendarType === 'lunar') {
      try {
        const result = robustLunarToSolar(year, month, day, formData.leapMonth === 'leap');
        year = result.solar.year;
        month = result.solar.month;
        day = result.solar.day;
      } catch (e) {
        alert(e.message);
        return;
      }
    }
    
    let hour = undefined;
    let minute = undefined;
    
    if (formData.knowTime) {
      if (formData.birthTime && formData.birthTime.length >= 4) {
        hour = parseInt(formData.birthTime.substring(0, 2));
        minute = parseInt(formData.birthTime.substring(2, 4));
      }
    } else if (formData.birthBranch) {
      // 12지시를 시간으로 변환 (중간 시간 기준)
      const branchTimeMap = {
        '자': { h: 0, m: 0 },   // 23:30 ~ 01:30
        '축': { h: 2, m: 30 },  // 01:30 ~ 03:30
        '인': { h: 4, m: 30 },  // 03:30 ~ 05:30
        '묘': { h: 6, m: 30 },  // 05:30 ~ 07:30
        '진': { h: 8, m: 30 },  // 07:30 ~ 09:30
        '사': { h: 10, m: 30 }, // 09:30 ~ 11:30
        '오': { h: 12, m: 30 }, // 11:30 ~ 13:30
        '미': { h: 14, m: 30 }, // 13:30 ~ 15:30
        '신': { h: 16, m: 30 }, // 15:30 ~ 17:30
        '유': { h: 18, m: 30 }, // 17:30 ~ 19:30
        '술': { h: 20, m: 30 }, // 19:30 ~ 21:30
        '해': { h: 22, m: 30 }  // 21:30 ~ 23:30
      };
      const time = branchTimeMap[formData.birthBranch];
      if (time) {
        hour = time.h;
        minute = time.m;
      }
    }

    try {
      const saju = calculateSaju(year, month, day, hour, minute);
      setSajuData(saju);

      const currentYear = new Date().getFullYear();
      const currentAge = calculateInternationalAge(formData.birthDate);

      const solarDateStr = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
      
      // 시간 문자열 생성 (시주 계산용)
      const timeStr = hour !== undefined ? `${String(hour).padStart(2, '0')}${String(minute).padStart(2, '0')}` : '';
      
      const dInfo = calculateDaewunStartAge(
        solarDateStr,
        timeStr,
        saju,
        formData.gender
      );
      
      const activeDaewunAge = currentAge >= dInfo.age
        ? Math.floor((currentAge - dInfo.age) / 10) * 10 + dInfo.age
        : dInfo.age;
        
      setSelectedDaewunAge(activeDaewunAge);
      setSelectedSewunYear(currentYear);

      // 음력 변환 정보 포함
      let lunarInfo = null;
      if (formData.calendarType === 'solar') {
        // 양력 입력인 경우 음력 정보도 가져옴 (필요 시)
        // 여기서는 일단 입력된 타입을 존중
      }

      const newUserInfo = {
        ...formData,
        solarYear: year,
        solarMonth: month,
        solarDay: day,
        solarHour: hour,
        solarMinute: minute,
        daewunInfo: dInfo,
        version: "1.1.6-precise"
      };
      
      setUserInfo(newUserInfo);
      setView('result');
      saveToHistory(newUserInfo);
    } catch (e) {
      console.error("App Error:", e);
      alert("오류가 발생했습니다: " + e.message);
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
