import { useState, useEffect } from 'react';
import SajuInputForm from './components/SajuInputForm';
import ManseryeokDisplay from './components/ManseryeokDisplay';
import DaewunSewunDisplay from './components/DaewunSewunDisplay';
import SajuInterpretation from './components/SajuInterpretation';
import { calculateSaju, lunarToSolar } from '@fullstackfamily/manseryeok';
import { calculateInternationalAge, calculateDaewunStartAge } from './utils/sajuLogic';
import { saveToHistory } from './utils/storageUtils';
import SajuHistory from './components/SajuHistory';
import CreatorInfoModal from './components/CreatorInfoModal';
import { useLanguage } from './contexts/LanguageContext';
import { translations } from './utils/translations';
import './index.css';

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
        const result = lunarToSolar(year, month, day, formData.leapMonth === 'leap');
        year = result.solar.year;
        month = result.solar.month;
        day = result.solar.day;
      } catch {
        alert("유효하지 않은 음력 날짜입니다.");
        return;
      }
    }
    
    let hour = undefined;
    let minute = undefined;
    
    if (formData.knowTime && formData.birthTime && formData.birthTime.length >= 4) {
      hour = parseInt(formData.birthTime.substring(0, 2));
      minute = parseInt(formData.birthTime.substring(2, 4));
    }

    try {
      const saju = calculateSaju(year, month, day, hour, minute);
      setSajuData(saju);

      const currentYear = new Date().getFullYear();
      const currentAge = calculateInternationalAge(formData.birthDate);

      const solarDateStr = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
      const dInfo = calculateDaewunStartAge(
        solarDateStr,
        formData.knowTime ? formData.birthTime : '',
        saju,
        formData.gender
      );
      
      const activeDaewunAge = currentAge >= dInfo.age
        ? Math.floor((currentAge - dInfo.age) / 10) * 10 + dInfo.age
        : dInfo.age;
        
      setSelectedDaewunAge(activeDaewunAge);
      setSelectedSewunYear(currentYear);

      const newUserInfo = {
        ...formData,
        solarYear: year,
        solarMonth: month,
        solarDay: day,
        daewunInfo: dInfo,
        version: "1.1.5-precise"
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

  const headerButtons = (
    <div style={{ padding: '20px 20px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <button onClick={() => setView(view === 'history' ? 'input' : 'history')} className="btn-secondary">
        {view === 'history' ? t.back : (view === 'result' ? t.newLookup : t.savedHistory)}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={toggleLanguage} className="btn-lang">{language === 'ko' ? 'EN' : '한글'}</button>
        <div onClick={() => setShowCreatorInfo(true)} className="icon-info">i</div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <div className="portrait-alert">{t.portraitWarning}</div>
      
      {/* 전역 헤더 버튼 (입력 및 결과 화면 모두 표시) */}
      {view !== 'history' && headerButtons}

      {view === 'input' && (
        <SajuInputForm onSubmit={handleLookup} />
      )}

      {view === 'history' && (
        <>
          {headerButtons}
          <SajuHistory onSelect={handleSelectFromHistory} onBack={() => setView('input')} />
        </>
      )}
      
      {view === 'result' && sajuData && userInfo && (
        <>
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
