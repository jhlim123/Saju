import { stems, branches, gapjaArray } from './translations';

/**
 * 만 나이 계산
 */
export const calculateInternationalAge = (birthDateStr) => {
  if (!birthDateStr || birthDateStr.length !== 8) return 0;
  const birthYear = parseInt(birthDateStr.substring(0, 4));
  const birthMonth = parseInt(birthDateStr.substring(4, 6));
  const birthDay = parseInt(birthDateStr.substring(6, 8));

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  let age = currentYear - birthYear;
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age--;
  }
  return age;
};

// ===== 절기(節氣) 정밀 계산 (20세기/21세기 보정) =====
const JEOL_INFO = [
  { name: '소한', sajuMonth: 1,  calMonth: 1,  C: [6.11, 5.4055] },
  { name: '입춘', sajuMonth: 2,  calMonth: 2,  C: [4.62, 3.87] },
  { name: '경칩', sajuMonth: 3,  calMonth: 3,  C: [6.11, 5.41] },
  { name: '청명', sajuMonth: 4,  calMonth: 4,  C: [5.15, 4.36] },
  { name: '입하', sajuMonth: 5,  calMonth: 5,  C: [5.90, 5.12] },
  { name: '망종', sajuMonth: 6,  calMonth: 6,  C: [6.13, 5.37] },
  { name: '소서', sajuMonth: 7,  calMonth: 7,  C: [7.05, 6.30] },
  { name: '입추', sajuMonth: 8,  calMonth: 8,  C: [7.35, 6.50] },
  { name: '백로', sajuMonth: 9,  calMonth: 9,  C: [8.12, 7.346] },
  { name: '한로', sajuMonth: 10, calMonth: 10, C: [8.27, 7.50] },
  { name: '입동', sajuMonth: 11, calMonth: 11, C: [7.30, 6.55] },
  { name: '대설', sajuMonth: 12, calMonth: 12, C: [7.08, 6.34] },
];

const BRANCH_TO_SAJU_MONTH = { '丑': 1, '寅': 2, '卯': 3,  '辰': 4,  '巳': 5,  '午': 6, '未': 7, '申': 8, '酉': 9,  '戌': 10, '亥': 11, '子': 12 };

const _isLeapYear = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

const getPreciseJeolDate = (year, sajuMonthNum) => {
  const jeol = JEOL_INFO[sajuMonthNum - 1];
  const is21stCentury = year >= 2000;
  const C = is21stCentury ? jeol.C[1] : jeol.C[0];
  const centuryBase = is21stCentury ? 2000 : 1900;
  const Y = year - centuryBase;
  const daysValue = (Y * 0.2422) + C - Math.floor(Y / 4);
  const day = Math.floor(daysValue);
  const hourValue = (daysValue - day) * 24;
  const hour = Math.floor(hourValue);
  const minute = Math.round((hourValue - hour) * 60);
  return { year, month: jeol.calMonth, day, hour, minute };
};

const dateToLinear = (year, month, day, hour = 0, minute = 0) => {
  const DIM = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let total = (year - 1) * 365 + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) + Math.floor((year - 1) / 400);
  for (let m = 1; m < month; m++) { total += DIM[m]; if (m === 2 && _isLeapYear(year)) total++; }
  return total + day + (hour / 24) + (minute / (24 * 60));
};

export const calculateDaewunStartAge = (birthDateStr, birthTimeStr, sajuData, gender) => {
  try {
    const birthYear  = parseInt(birthDateStr.substring(0, 4));
    const birthMonth = parseInt(birthDateStr.substring(4, 6));
    const birthDay   = parseInt(birthDateStr.substring(6, 8));
    const birthHour = birthTimeStr ? parseInt(birthTimeStr.substring(0, 2)) : 12;
    const birthMin  = birthTimeStr ? parseInt(birthTimeStr.substring(2, 4)) : 0;

    const yearStem    = sajuData?.yearPillarHanja?.[0];
    const monthBranch = sajuData?.monthPillarHanja?.[1];
    const sajuMonth = BRANCH_TO_SAJU_MONTH[monthBranch] || 1;
    
    const isYangYear = ['甲', '丙', '戊', '庚', '壬'].includes(yearStem);
    const isMale     = gender === 'male';
    const isForward  = (isYangYear && isMale) || (!isYangYear && !isMale);

    const jeolThisMonth = getPreciseJeolDate(birthYear, sajuMonth);
    const jeolThisMonthLinear = dateToLinear(jeolThisMonth.year, jeolThisMonth.month, jeolThisMonth.day, jeolThisMonth.hour, jeolThisMonth.minute);
    const birthLinear = dateToLinear(birthYear, birthMonth, birthDay, birthHour, birthMin);

    let currentJeolLinear, nextJeolLinear;
    if (birthLinear >= jeolThisMonthLinear) {
      currentJeolLinear = jeolThisMonthLinear;
      const nextMonth = (sajuMonth % 12) + 1;
      const nextYear = sajuMonth === 12 ? birthYear + 1 : birthYear;
      const nextJeolInfo = getPreciseJeolDate(nextYear, nextMonth);
      nextJeolLinear = dateToLinear(nextJeolInfo.year, nextJeolInfo.month, nextJeolInfo.day, nextJeolInfo.hour, nextJeolInfo.minute);
    } else {
      nextJeolLinear = jeolThisMonthLinear;
      const prevMonth = sajuMonth === 1 ? 12 : sajuMonth - 1;
      const prevYear = sajuMonth === 1 ? birthYear - 1 : birthYear;
      const prevJeolInfo = getPreciseJeolDate(prevYear, prevMonth);
      currentJeolLinear = dateToLinear(prevJeolInfo.year, prevJeolInfo.month, prevJeolInfo.day, prevJeolInfo.hour, prevJeolInfo.minute);
    }

    const dayDiff = Math.abs(isForward ? nextJeolLinear - birthLinear : birthLinear - currentJeolLinear);
    const totalMinutes = Math.round(dayDiff * 1440);
    const totalAddedDays = totalMinutes / 12;

    const years = Math.max(0, Math.floor(totalAddedDays / 360));
    let remainder = totalAddedDays % 360;
    const months = Math.max(0, Math.floor(remainder / 30));
    const days = Math.max(0, Math.floor(remainder % 30));

    const startDate = new Date(birthYear, birthMonth - 1, birthDay, birthHour, birthMin);
    startDate.setFullYear(startDate.getFullYear() + years);
    startDate.setMonth(startDate.getMonth() + months);
    startDate.setDate(startDate.getDate() + days);

    const startDateFormat = `${startDate.getFullYear()}년 ${startDate.getMonth() + 1}월 ${startDate.getDate()}일`;

    return {
      age: Math.max(1, Math.round(years + (months / 12) + (days / 360))),
      years, months, days,
      startDate: startDateFormat,
      details: `${years}년 ${months}개월 ${days}일`
    };
  } catch (e) {
    console.error("Daewun error:", e);
    return { age: 9, years: 9, months: 0, days: 0, startDate: "계산 오류", details: "오류" };
  }
};

export const calculateDaewun = (yearStemChar, monthPillar, gender, daewunStartAge) => {
  if (!yearStemChar || !monthPillar) return [];
  const isYangYear = ['甲', '丙', '戊', '庚', '壬'].includes(yearStemChar);
  const isMale = gender === 'male';
  const isForward = (isYangYear && isMale) || (!isYangYear && !isMale);

  let mIdx = gapjaArray.indexOf(monthPillar);
  if (mIdx === -1) return [];

  const list = [];
  for (let i = 1; i <= 11; i++) {
    mIdx = isForward ? (mIdx + 1) % 60 : (mIdx - 1 + 60) % 60;
    const p = gapjaArray[mIdx];
    list.push({ age: daewunStartAge + (i - 1) * 10, pillar: p, stem: p[0], branch: p[1] });
  }
  return list.reverse();
};

export const calculateSewun = (startYear) => {
  const list = [];
  const baseYear = 1984; 
  for (let i = 0; i < 11; i++) {
    const year = startYear + i;
    const diff = (year - baseYear) % 60;
    const idx = diff >= 0 ? diff : diff + 60;
    const p = gapjaArray[idx];
    list.push({ year, pillar: p, stem: p[0], branch: p[1] });
  }
  return list.reverse();
};

export const calculateWolun = (yearStemChar) => {
  let inStemIdx = 0;
  if (['甲', '己'].includes(yearStemChar)) inStemIdx = 2;
  else if (['乙', '庚'].includes(yearStemChar)) inStemIdx = 4;
  else if (['丙', '辛'].includes(yearStemChar)) inStemIdx = 6;
  else if (['丁', '壬'].includes(yearStemChar)) inStemIdx = 8;
  else if (['戊', '癸'].includes(yearStemChar)) inStemIdx = 0;

  const list = [];
  let sIdx = (inStemIdx - 1 + 10) % 10;
  let bIdx = 1;
  const names = ['소한', '입춘', '경칩', '청명', '입하', '망종', '소서', '입추', '백로', '한로', '입동', '대설'];

  for (let i = 0; i < 12; i++) {
    const p = stems[sIdx].char + branches[bIdx].char;
    list.push({ month: i + 1, jeolgi: names[i], pillar: p, stem: p[0], branch: p[1] });
    sIdx = (sIdx + 1) % 10; bIdx = (bIdx + 1) % 12;
  }
  return list;
};

export const getTenGods = (dm, target) => {
  const sMap = { '甲': 0, '乙': 0, '丙': 1, '丁': 1, '戊': 2, '己': 2, '庚': 3, '辛': 3, '壬': 4, '癸': 4 };
  const bMap = { '寅': 0, '卯': 0, '巳': 1, '午': 1, '辰': 2, '戌': 2, '丑': 2, '未': 2, '申': 3, '酉': 3, '亥': 4, '子': 4 };
  const sYY = { '甲': 1, '丙': 1, '戊': 1, '庚': 1, '壬': 1, '乙': 0, '丁': 0, '己': 0, '辛': 0, '癸': 0 };
  const bYY = { '寅': 1, '辰': 1, '巳': 1, '申': 1, '戌': 1, '亥': 1, '卯': 0, '午': 0, '未': 0, '酉': 0, '子': 0, '丑': 0 };
  
  const dg = sMap[dm];
  const tg = sMap[target] ?? bMap[target];
  const dY = sYY[dm];
  const tY = sYY[target] ?? bYY[target];
  
  if (dg === undefined || tg === undefined) return '';
  const diff = (tg - dg + 5) % 5;
  const same = dY === tY;
  const res = [['비견', '겁재'], ['식신', '상관'], ['편재', '정재'], ['편관', '정관'], ['편인', '정인']];
  return same ? res[diff][0] : res[diff][1];
};

export const getTwelveStages = (dm, b) => {
  const table = {
    '甲': { '亥': '장생', '子': '목욕', '丑': '관대', '寅': '건록', '卯': '제왕', '辰': '쇠', '巳': '병', '午': '사', '未': '묘', '申': '절', '酉': '태', '戌': '양' },
    '丙': { '寅': '장생', '卯': '목욕', '辰': '관대', '巳': '건록', '午': '제왕', '未': '쇠', '申': '병', '酉': '사', '戌': '묘', '亥': '절', '子': '태', '丑': '양' },
    '戊': { '寅': '장생', '卯': '목욕', '辰': '관대', '巳': '건록', '午': '제왕', '未': '쇠', '申': '병', '酉': '사', '戌': '묘', '亥': '절', '子': '태', '丑': '양' },
    '庚': { '巳': '장생', '午': '목욕', '未': '관대', '申': '건록', '酉': '제왕', '戌': '쇠', '亥': '병', '子': '사', '丑': '묘', '寅': '절', '卯': '태', '辰': '양' },
    '壬': { '申': '장생', '酉': '목욕', '戌': '관대', '亥': '건록', '子': '제왕', '丑': '쇠', '寅': '병', '卯': '사', '辰': '묘', '巳': '절', '午': '태', '未': '양' },
    '乙': { '午': '장생', '巳': '목욕', '辰': '관대', '卯': '건록', '寅': '제왕', '丑': '쇠', '자': '병', '亥': '사', '戌': '묘', '酉': '절', '申': '태', '미': '양' },
    '丁': { '酉': '장생', '申': '목욕', '未': '관대', '午': '건록', '巳': '제왕', '辰': '쇠', '卯': '병', '寅': '사', '丑': '묘', '子': '절', '亥': '태', '戌': '양' },
    '己': { '酉': '장생', '申': '목욕', '未': '관대', '午': '건록', '巳': '제왕', '辰': '쇠', '卯': '병', '寅': '사', '丑': '묘', '子': '절', '亥': '태', '戌': '양' },
    '辛': { '子': '장생', '亥': '목욕', '戌': '관대', '酉': '건록', '申': '제왕', '未': '쇠', '午': '병', '巳': '사', '辰': '묘', '卯': '절', '寅': '태', '丑': '양' },
    '癸': { '卯': '장생', '寅': '목욕', '丑': '관대', '子': '건록', '亥': '제왕', '戌': '쇠', '酉': '병', '申': '사', '未': '묘', '午': '절', '巳': '태', '辰': '양' }
  };
  return table[dm]?.[b] || '';
};

export const getShensha = (dm, ts, tb, yb) => {
  const res = [];
  const gMap = { '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'], '乙': ['子', '申'], '己': ['子', '申'], '丙': ['亥', '酉'], '丁': ['亥', '酉'], '壬': ['卯', '巳'], '癸': ['卯', '巳'], '辛': ['寅', '午'] };
  if (gMap[dm]?.includes(tb)) res.push('천을귀인');
  const groups = { 0: { '子': '장성살', '寅': '역마살', '酉': '도화살', '辰': '화개살', '巳': '겁살' }, 1: { '午': '장성살', '申': '역마살', '卯': '도화살', '戌': '화개살', '亥': '겁살' }, 2: { '卯': '장성살', '巳': '역마살', '子': '도화살', '未': '화개살', '申': '겁살' }, 3: { '酉': '장성살', '亥': '역마살', '午': '도화살', '丑': '화개살', '寅': '겁살' } };
  const getGrp = (b) => { if (['申', '子', '辰'].includes(b)) return 0; if (['寅', '午', '戌'].includes(b)) return 1; if (['亥', '卯', '未'].includes(b)) return 2; if (['巳', '酉', '丑'].includes(b)) return 3; return -1; };
  const g = getGrp(yb);
  if (g !== -1 && groups[g][tb]) res.push(groups[g][tb]);
  return res;
};

export const getElementClass = (c) => {
  const s = stems.find(x => x.char === c); if (s) return `element-${s.element}`;
  const b = branches.find(x => x.char === c); if (b) return `element-${b.element}`;
  return '';
};

/**
 * 오행별 텍스트 색상 (사용자 요청에 따라 검정색으로 통일)
 */
export const getElementColor = (char) => {
  return 'var(--text-primary)';
};

// Interpretation Logics
export const getInterpretation = (s) => {
  const ds = s.dayPillarHanja[0];
  const mb = s.monthPillarHanja[1];
  const god = getTenGods(ds, mb);
  
  const gMap = {
    '비견': '건록격(建祿格). 자수성가하고 주관이 뚜렷하며 독립심이 강한 명조입니다.',
    '겁재': '월겁격(月劫格). 경쟁심이 강하고 추진력이 좋으나 재물 관리에 유의해야 합니다.',
    '식신': '식신격(食神格). 의식주가 풍족하고 성격이 원만하며 창의적 능력이 뛰어납니다.',
    '상관': '상관격(傷官格). 두뇌가 총명하고 재주가 많으며 자기표현이 탁월한 명조입니다.',
    '편재': '편재격(偏財格). 사업적 수완이 좋고 활동 범위가 넓으며 큰 재물을 추구합니다.',
    '정재': '정재격(正財格). 성실하고 근검절약하며 안정적인 자산 형성에 강점이 있습니다.',
    '편관': '편관격(偏官格). 의협심이 강하고 책임감이 중하며 카리스마 있는 지도자형입니다.',
    '정관': '정관격(正官格). 인격이 고결하고 규범을 준수하며 명예와 관운이 따르는 명조입니다.',
    '편인': '편인격(偏印格). 직관력이 뛰어나고 신비로운 분야나 전문 기술에 재능이 있습니다.',
    '정인': '정인격(正印格). 학문과 인품이 높고 윗사람의 도움이 많으며 자비로운 성품입니다.'
  };

  const yeonhaeMap = {
    '비견': '사람이 강직하고 굽히지 않으며 동료와 협력하여 큰 뜻을 이룹니다.',
    '겁재': '재물을 다루는 데 과감하나 쟁투를 피하고 실리를 챙기는 지혜가 필요합니다.',
    '식신': '복록이 두터워 평생 배를 곯지 않으며 주변 사람들에게 덕을 베풉니다.',
    '상관': '재주가 넘쳐 세상에 이름을 날리나 구설수를 조심하고 겸손해야 합니다.',
    '편재': '사방으로 재물이 널려 있으니 부지런히 움직이면 큰 부를 이룰 것입니다.',
    '정재': '한 땀 한 땀 노력하여 쌓은 재물이니 잃지 않고 가문을 일으킬 상입니다.',
    '편관': '어려운 고난을 이겨내고 권위를 세우니 만인이 우러러보는 자리에 오릅니다.',
    '정관': '나라의 녹을 먹고 이름을 날리며 집안을 평안하게 할 귀한 명입니다.',
    '편인': '기예가 출중하여 한 가지 분야에서 일가를 이루니 명성이 높습니다.',
    '정인': '글문이 트여 지혜롭고 부모의 음덕이 깊어 평생이 안온할 것입니다.'
  };

  return { 
    gyeok: god || '일반', 
    japyung: gMap[god] || '자평진전 기준 분석 결과, 개성이 뚜렷한 명조입니다.', 
    yeonhae: yeonhaeMap[god] || '연해자평 기준 분석 결과, 타고난 기질이 조화롭습니다.' 
  };
};

export const getCurrentLuckInterpretation = (s, u, year) => {
  const ds = s.dayPillarHanja[0];
  const currentAge = calculateInternationalAge(u.birthDate);
  const dwList = calculateDaewun(s.yearPillarHanja[0], s.monthPillarHanja, u.gender, u.daewunInfo?.age || 9);
  
  // 현재 나이에 해당하는 대운 찾기
  const currentDaewun = dwList.find(d => currentAge >= d.age && currentAge < d.age + 10) || dwList[0];
  const dwGod = getTenGods(ds, currentDaewun.stem);
  const dwBranchGod = getTenGods(ds, currentDaewun.branch);

  // 세운(연운) 정보
  const baseYear = 1984; 
  const diff = (year - baseYear) % 60;
  const idx = diff >= 0 ? diff : diff + 60;
  const swPillar = gapjaArray[idx];
  const swGod = getTenGods(ds, swPillar[0]);
  const swBranchGod = getTenGods(ds, swPillar[1]);

  const godDesc = {
    '비견': '주체성이 강해지고 독립적인 일을 시작하기 좋은 시기입니다.',
    '겁재': '경쟁이 치열해지나 큰 에너지를 발휘하여 목표를 쟁취할 수 있습니다. 재물 지출에 유의하세요.',
    '식신': '활동 영역이 넓어지고 의식주가 풍족해지며 새로운 아이디어가 샘솟는 시기입니다.',
    '상관': '재능을 발휘하여 성과를 내기 좋으나 윗사람과의 마찰이나 구설을 조심해야 합니다.',
    '편재': '큰 재물의 기회가 오고 활동 범위가 글로벌하게 확장되는 역동적인 운세입니다.',
    '정재': '안정적인 수익이 발생하고 노력한 만큼 확실한 결실을 맺는 시기입니다.',
    '편관': '책임감이 커지고 명예를 얻을 수 있으나 과도한 스트레스 관리가 필요합니다.',
    '정관': '승진이나 합격 등 조직 내에서 지위가 상승하고 공적인 일이 잘 풀리는 운입니다.',
    '편인': '전문 지식을 습득하거나 내면을 성찰하기 좋으며 특수한 분야에서 기회를 잡습니다.',
    '정인': '문서 계약에 길하고 윗사람의 도움을 받으며 마음이 평안해지는 시기입니다.'
  };

  // 월운(절운) 정보
  const wolunList = calculateWolun(s.yearPillarHanja[0]);
  const monthlyLuck = wolunList.map(w => ({
    month: w.month,
    pillar: w.pillar,
    god: getTenGods(ds, w.stem),
    desc: `${getTenGods(ds, w.stem)}과 ${getTenGods(ds, w.branch)}의 기운이 교차하는 달입니다. ${godDesc[getTenGods(ds, w.stem)] || '조화로운 흐름이 예상됩니다.'}`
  }));

  return {
    daewun: { 
      age: currentDaewun.age, 
      pillar: currentDaewun.pillar, 
      god: dwGod, 
      japyung: `${dwGod}과 ${dwBranchGod}운이 들어오는 시기로, ${godDesc[dwGod]}`, 
      yeonhae: `대운의 흐름이 ${currentDaewun.pillar}로 흐르니 환경의 변화를 잘 살피어 대처하시기 바랍니다.` 
    },
    sewun: { 
      year: year, 
      pillar: swPillar, 
      god: swGod, 
      japyung: `${swGod}운이 주도하는 해로, ${godDesc[swGod]}`, 
      yeonhae: `${swPillar}의 기운이 명조와 어우러져 한 해의 길흉화복을 결정짓습니다.` 
    },
    monthlyLuck
  };
};
