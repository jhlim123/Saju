import { useState } from 'react';
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
  const [view, setView] = useState('input'); // 'input', 'result', 'history'
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
    } else if (!formData.knowTime && formData.birthBranch) {
      const branchTimeMap = {
        '자': { h: 0, m: 0 },
        '축': { h: 2, m: 0 },
        '인': { h: 4, m: 0 },
        '묘': { h: 6, m: 0 },
        '진': { h: 8, m: 0 },
        '사': { h: 10, m: 0 },
        '오': { h: 12, m: 0 },
        '미': { h: 14, m: 0 },
        '신': { h: 16, m: 0 },
        '유': { h: 18, m: 0 },
        '술': { h: 20, m: 0 },
        '해': { h: 22, m: 0 }
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

      // 정밀 대운수 계산 (입절일시 기반)
      const daewunInfo = calculateDaewunStartAge(
        formData.birthDate,
        formData.knowTime ? formData.birthTime : '',
        saju,
        formData.gender
      );

      // 현재 나이 기준 활성 대운 선택
      const activeDaewunAge = currentAge >= daewunInfo.age
        ? Math.floor((currentAge - daewunInfo.age) / 10) * 10 + daewunInfo.age
        : daewunInfo.age;
      setSelectedDaewunAge(activeDaewunAge);
      setSelectedSewunYear(currentYear);

      const newUserInfo = {
        ...formData,
        solarYear: year,
        solarMonth: month,
        solarDay: day,
        daewunInfo,
      };
      setUserInfo(newUserInfo);
      setView('result');

      // localStorage 추상화 유틸 사용
      saveToHistory(newUserInfo);
    } catch (e) {
      alert("사주 계산 중 오류가 발생했습니다: " + e.message);
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

  return (
    <div className="app-container">
      <div className="portrait-alert">
        {t.portraitWarning}
      </div>
      {view === 'input' && (
        <>
          <div style={{ padding: '15px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
              onClick={() => setView('history')}
              style={{ 
                padding: '8px 16px', 
                background: '#f5f5f7', 
                color: '#1d1d1f', 
                border: 'none', 
                borderRadius: '16px', 
                cursor: 'pointer', 
                fontSize: '0.9rem', 
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e5ea'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f5f5f7'}
              >
              {t.savedHistory}
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={toggleLanguage}
                style={{
                  padding: '6px 12px',
                  background: 'transparent',
                  border: '1px solid #e5e5ea',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  color: '#1d1d1f',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f7'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {language === 'ko' ? 'EN' : 'KO'}
              </button>

              <div 
                onClick={() => setShowCreatorInfo(true)}
                title={t.creatorInfo}
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  border: '1px solid #e5e5ea', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  fontWeight: '500', 
                  fontSize: '1rem', 
                  cursor: 'pointer', 
                  color: '#86868b',
                  transition: 'background-color 0.2s',
                  backgroundColor: 'transparent'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f7'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                i
              </div>
            </div>
          </div>
          <SajuInputForm onSubmit={handleLookup} />
        </>
      )}

      {view === 'history' && (
        <SajuHistory 
          onSelect={handleSelectFromHistory} 
          onBack={() => setView('input')} 
        />
      )}
      
      {view === 'result' && sajuData && (
        <>
          <ManseryeokDisplay 
            sajuData={sajuData} 
            userInfo={userInfo} 
            selectedDaewunAge={selectedDaewunAge}
            onSelectDaewun={handleSelectDaewun}
            onShowCreatorInfo={() => setShowCreatorInfo(true)}
          />
          <hr style={{ border: 'none', borderTop: '2px dashed #e5e7eb', margin: '20px' }} />
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
    </div>
  );
}

export default App;
