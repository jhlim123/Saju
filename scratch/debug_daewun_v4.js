// 독립형 디버그 스크립트 (sajuLogic 로직 포함)
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

function calculate(birthDateStr, birthTimeStr, yearStem, monthBranch, gender) {
  const birthYear  = parseInt(birthDateStr.substring(0, 4));
  const birthMonth = parseInt(birthDateStr.substring(4, 6));
  const birthDay   = parseInt(birthDateStr.substring(6, 8));
  const birthHour = birthTimeStr ? parseInt(birthTimeStr.substring(0, 2)) : 12;
  const birthMin  = birthTimeStr ? parseInt(birthTimeStr.substring(2, 4)) : 0;

  const sajuMonth = BRANCH_TO_SAJU_MONTH[monthBranch];
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

  const dayDiff = isForward ? nextJeolLinear - birthLinear : birthLinear - currentJeolLinear;
  const totalMinutes = Math.round(dayDiff * 1440);
  const totalAddedDays = totalMinutes / 12;

  const years = Math.floor(totalAddedDays / 360);
  let remainder = totalAddedDays % 360;
  const months = Math.floor(remainder / 30);
  const days = Math.floor(remainder % 30);

  const startDate = new Date(birthYear, birthMonth - 1, birthDay, birthHour, birthMin);
  startDate.setFullYear(startDate.getFullYear() + years);
  startDate.setMonth(startDate.getMonth() + months);
  startDate.setDate(startDate.getDate() + days);

  const startDateFormat = `${startDate.getFullYear()}년 ${startDate.getMonth() + 1}월 ${startDate.getDate()}일`;
  return { years, months, days, startDate: startDateFormat };
}

console.log(calculate('19881230', '1430', '戊', '子', 'male'));
