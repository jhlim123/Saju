export const stems = [
  { char: '甲', element: 0, yinYang: 1 },
  { char: '乙', element: 0, yinYang: 0 },
  { char: '丙', element: 1, yinYang: 1 },
  { char: '丁', element: 1, yinYang: 0 },
  { char: '戊', element: 2, yinYang: 1 },
  { char: '己', element: 2, yinYang: 0 },
  { char: '庚', element: 3, yinYang: 1 },
  { char: '辛', element: 3, yinYang: 0 },
  { char: '壬', element: 4, yinYang: 1 },
  { char: '癸', element: 4, yinYang: 0 },
];

export const branches = [
  { char: '子', element: 4, yinYang: 0 },
  { char: '丑', element: 2, yinYang: 0 },
  { char: '寅', element: 0, yinYang: 1 },
  { char: '卯', element: 0, yinYang: 0 },
  { char: '辰', element: 2, yinYang: 1 },
  { char: '巳', element: 1, yinYang: 1 },
  { char: '午', element: 1, yinYang: 0 },
  { char: '未', element: 2, yinYang: 0 },
  { char: '申', element: 3, yinYang: 1 },
  { char: '酉', element: 3, yinYang: 0 },
  { char: '戌', element: 2, yinYang: 1 },
  { char: '亥', element: 4, yinYang: 1 },
];

export const getCharInfo = (char) => {
  const stemInfo = stems.find(s => s.char === char);
  if (stemInfo) return { ...stemInfo, type: 'stem' };
  const branchInfo = branches.find(b => b.char === char);
  if (branchInfo) return { ...branchInfo, type: 'branch' };
  return null;
};

// 십성 계산 로직
export const getTenGods = (dayStemChar, targetChar) => {
  if (dayStemChar === targetChar) return '비견'; // 일간 자신은 표기법에 따라 다름, 외부에서는 '일간(나)'로 덮어씌움
  if (!dayStemChar || !targetChar) return '';
  
  const dayInfo = getCharInfo(dayStemChar);
  const targetInfo = getCharInfo(targetChar);
  
  if (!dayInfo || !targetInfo) return '';
  
  const diff = (targetInfo.element - dayInfo.element + 5) % 5;
  const sameYinYang = dayInfo.yinYang === targetInfo.yinYang;
  
  switch (diff) {
    case 0: return sameYinYang ? '비견' : '겁재';
    case 1: return sameYinYang ? '식신' : '상관';
    case 2: return sameYinYang ? '편재' : '정재';
    case 3: return sameYinYang ? '편관' : '정관';
    case 4: return sameYinYang ? '편인' : '정인';
    default: return '';
  }
};

// 60갑자
export const gapjaArray = [];
for (let i = 0; i < 60; i++) {
  gapjaArray.push(stems[i % 10].char + branches[i % 12].char);
}

// 대운 계산 (전달받은 대운수 기반으로 60갑자 나열)
export const calculateDaewun = (yearStemChar, monthPillar, gender, daewunStartAge) => {
  if (!yearStemChar || !monthPillar || daewunStartAge === undefined) return [];

  const yearInfo = getCharInfo(yearStemChar);
  if (!yearInfo) return [];

  const isYangYear = yearInfo.yinYang === 1;
  const isMale = gender === 'male';
  const isForward = (isYangYear && isMale) || (!isYangYear && !isMale);

  let monthIndex = gapjaArray.indexOf(monthPillar);
  if (monthIndex === -1) return [];

  const daewuns = [];
  // 110세 정도까지 커버하기 위해 11개 대운 생성
  for (let i = 1; i <= 11; i++) {
    monthIndex = isForward ? (monthIndex + 1) % 60 : (monthIndex - 1 + 60) % 60;
    const pillar = gapjaArray[monthIndex];
    daewuns.push({
      age: daewunStartAge + (i - 1) * 10, // 정밀 대운수 기반 (예: 3, 13, 23...)
      pillar: pillar,
      stem: pillar[0],
      branch: pillar[1]
    });
  }
  return daewuns.reverse(); // 화면에 우측부터(큰나이->작은나이) 배치하기 위해 뒤집음
};

// 세운 계산 (특정 시작년도부터 10년치 계산)
export const calculateSewun = (startYear) => {
  const baseYear = 1984; // 갑자년
  const sewuns = [];
  for (let i = 9; i >= 0; i--) {
    const year = startYear + i;
    const diff = (year - baseYear) % 60;
    const index = diff >= 0 ? diff : diff + 60;
    const pillar = gapjaArray[index];
    sewuns.push({
      year: year,
      pillar: pillar,
      stem: pillar[0],
      branch: pillar[1]
    });
  }
  return sewuns;
};

// 월운 계산 (오호둔법 적용)
export const calculateWolun = (yearStemChar) => {
  if (!yearStemChar) return [];

  // 오호둔법: 해당 년도의 '인(寅)'월 천간 인덱스 계산
  let inStemIdx = 0;
  if (['甲', '己'].includes(yearStemChar)) inStemIdx = 2;      // 丙寅
  else if (['乙', '庚'].includes(yearStemChar)) inStemIdx = 4; // 戊寅
  else if (['丙', '辛'].includes(yearStemChar)) inStemIdx = 6; // 庚寅
  else if (['丁', '壬'].includes(yearStemChar)) inStemIdx = 8; // 壬寅
  else if (['戊', '癸'].includes(yearStemChar)) inStemIdx = 0; // 甲寅

  const woluns = [];
  // 양력 1월(축월)부터 시작하기 위해 인월(2월)에서 한 칸 뒤로 계산
  let currentStemIdx = (inStemIdx - 1 + 10) % 10;
  let currentBranchIdx = 1; // 축(丑)월부터 시작

  // 절기명 매핑 (1월 소한 ~ 12월 대설)
  const jeolgiNames = [
    '소한', '입춘', '경칩', '청명', '입하', '망종', 
    '소서', '입추', '백로', '한로', '입동', '대설'
  ];

  for (let i = 0; i < 12; i++) {
    const monthNum = i + 1;
    woluns.push({
      month: monthNum,
      jeolgi: jeolgiNames[i],
      pillar: stems[currentStemIdx].char + branches[currentBranchIdx].char,
      stem: stems[currentStemIdx].char,
      branch: branches[currentBranchIdx].char
    });
    currentStemIdx = (currentStemIdx + 1) % 10;
    currentBranchIdx = (currentBranchIdx + 1) % 12;
  }
  
  return woluns;
};

export const getTwelveStages = (dayStem, targetBranch) => {
  const stages = ['장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양'];
  const baseMap = {
    '甲': '亥', '乙': '午', '丙': '寅', '戊': '寅', '丁': '酉', '己': '酉',
    '庚': '巳', '辛': '子', '壬': '申', '癸': '卯'
  };
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  const isYang = ['甲', '丙', '戊', '庚', '壬'].includes(dayStem);
  const startBranch = baseMap[dayStem];
  
  if (!startBranch || !targetBranch) return '';
  
  const startIndex = branches.indexOf(startBranch);
  const targetIndex = branches.indexOf(targetBranch);
  
  let diff = 0;
  if (isYang) {
    diff = (targetIndex - startIndex + 12) % 12;
  } else {
    diff = (startIndex - targetIndex + 12) % 12;
  }
  
  return stages[diff];
};

export const getJapyungInterpretation = (gyeokName) => {
  const japyungTexts = {
    '비견': '월지 비견은 건록격(建祿格)에 해당합니다. 자평진전에서는 "건록은 관성을 귀하게 여기며, 재성과 인성이 뒤를 받쳐주어야 성격(成格)된다"고 보았습니다. 본신의 기운이 매우 강하므로 스스로의 힘으로 가문을 일으킬 수 있는 자수성가형 명조입니다. 다만 관성이 없으면 기운이 흩어지기 쉬우니 사회적인 틀을 잘 활용해야 하며, 재성을 만날 때 비로소 큰 부를 이룰 수 있는 잠재력이 큽니다.',
    '겁재': '월지 겁재는 양인격(陽刃格) 또는 월겁격으로, 기운의 강렬함이 극치에 달한 명입니다. 자평진전에서는 "양인은 반드시 관성으로 제어하거나 상관으로 설기해야 대귀한다"고 강조했습니다. 성격이 매우 과단성 있고 강하며 추진력이 독보적입니다. 경쟁 사회에서 남다른 승부사 기질을 발휘하여 큰 조직의 수장이 되거나, 고난을 뚫고 성공하는 영웅적인 면모를 지니고 있습니다.',
    '식신': '식신격(食神格)은 4길신 중 으뜸으로, "재성을 생하거나 편관을 제어하는 공이 매우 크다"고 평합니다. 자평진전 관점에서는 일간이 강하고 식신이 수려할 때 이를 식신생재(食神生財)라 하여 평생 부유하고 안락한 삶을 보장받는 격으로 봅니다. 성품이 원만하고 창의적이며, 타인에게 베푸는 마음이 깊어 주변의 존경을 한 몸에 받는 복이 많은 사주입니다.',
    '상관': '상관격(傷官格)은 기운이 밖으로 뿜어져 나오는 수려함의 상징입니다. 자평진전에서는 "정관을 보면 화가 되나, 재성을 보거나 인성을 보면 귀하게 된다"고 하였습니다. 머리 회전이 매우 빠르고 예술적, 기술적 재능이 타의 추종을 불허합니다. 기존의 틀을 깨고 새로운 가치를 창출하는 혁신가적 기질이 강하며, 적절한 인성의 제어가 있다면 문학이나 예술 분야에서 이름을 널리 떨칠 대귀격입니다.',
    '편재': '편재격(偏財格)은 큰 재물과 넓은 무대를 다루는 통제력의 격입니다. 자평진전에서는 "재성은 일간이 강할 때 비로소 내 것이 된다"고 하여 신강함을 중시했습니다. 고정된 수입보다는 유동적인 큰 재물을 운용하는 능력이 탁월하며, 사회적 수완이 좋아 대인관계에서 이득을 취하는 기술이 뛰어납니다. 활동 범위가 전 세계를 무대로 할 만큼 넓고 호탕한 성격을 지니고 있습니다.',
    '정재': '정재격(正財格)은 가장 안정적이고 정당한 결실을 상징합니다. 자평진전에서는 "재성은 관성을 생하거나 식상의 생조를 받는 것을 좋아한다"고 보았습니다. 성실함과 꼼꼼함을 바탕으로 한 단계씩 자산을 쌓아 올리는 능력이 일품이며, 가정적이고 책임감이 강합니다. 일확천금보다는 확실한 결과를 추구하여 사회적으로 신용을 얻고, 노후가 매우 안정되고 평안한 전형적인 복록의 명입니다.',
    '편관': '편관격(偏官格)은 칠살격이라고도 하며, 다듬어지지 않은 원석과 같은 강력한 권위의 기운입니다. 자평진전에서는 "칠살은 제복(制伏)되면 대귀하고, 제복되지 않으면 흉이 된다"고 하하였습니다. 삶의 굴곡과 고난이 있을 수 있으나 이를 인내와 지략으로 극복해 낼 때 장군이나 고위 관직과 같은 강력한 리더십을 발휘하게 됩니다. 의리가 깊고 정의감이 투철하여 약자를 돕는 대장부 기질을 지닙니다.',
    '정관': '정관격(正官格)은 명리학에서 가장 귀하게 여기는 길격 중의 길격입니다. 자평진전에서는 "정관은 형충파해를 꺼리며, 재인(財印)이 보좌하면 만인이 우러러보는 지위에 오른다"고 보았습니다. 원칙과 도덕을 중시하며 사회적 규범 안에서 최고의 명예를 얻는 공직자나 지도자의 명입니다. 품위가 있고 단정하며, 합리적인 판단력으로 조직을 안정적으로 이끌어가는 능력이 탁월합니다.',
    '편인': '편인격(偏印格)은 남들이 보지 못하는 이면을 꿰뚫어 보는 통찰력과 기발한 지략의 격입니다. 자평진전에서는 "편인은 식신을 극하는 도식(倒食)을 경계해야 하나, 편재로 제어하면 오히려 큰 재능이 된다"고 보았습니다. 예술, 종교, 심리, 철학 등 특수 분야에서 독보적인 전문성을 발휘하며, 직관력이 예리하여 위기 상황에서 빛을 발하는 기획력과 아이디어가 매우 돋보이는 명입니다.',
    '정인': '정인격(正인格)은 학문과 자비, 그리고 윗사람의 덕을 상징하는 고결한 격입니다. 자평진전에서는 "정인은 관성을 만나 관인상생(官印상생)하는 것을 최상으로 치며, 평생 학덕을 쌓는다"고 하였습니다. 성품이 온화하고 지적 호기심이 강하며, 주변으로부터 끊임없는 도움과 지지를 받는 복이 있습니다. 교육자나 학자로서 명성을 쌓기에 적합하며, 정신적인 풍요로움이 가득한 삶을 영위하게 됩니다.'
  };

  const yeonhaeTexts = {
    '비견': '연해자평에서는 비견이 많은 자는 독립심이 강하고 동료와의 의리가 깊다고 보았습니다. 일상에서는 경쟁을 즐기며 자기 주관대로 일을 추진하는 힘이 강합니다. 특히 천월귀인이 임하면 주변의 시샘 속에서도 결국 자신의 자리를 지켜내는 굳건함이 돋보입니다. 성격은 다소 고집스러울 수 있으나 한 번 믿은 사람은 끝까지 책임지는 인간미가 있습니다.',
    '겁재': '연해자평의 관점에서 겁재는 투쟁과 쟁취의 기운입니다. "양인이 겹치면 성정이 강포할 수 있으나 큰 그릇을 채우는 힘이 된다"고 평했습니다. 남에게 지기 싫어하는 자존심이 성공의 원동력이 되며, 위기에 처했을 때 더욱 강해지는 면모를 보입니다. 재물의 출입이 잦으나 그만큼 베푸는 통도 커서 주변에 사람이 모이는 기질이 있습니다.',
    '식신': '연해자평에서 식신은 낙천성과 풍요를 상징합니다. "식신이 하나만 있고 잘 보존되면 평생 의식주 걱정이 없다"고 하하였습니다. 미식가적인 기질이 있고 예술과 유희를 즐길 줄 아는 멋쟁이입니다. 성품이 원만하여 적을 만들지 않으며, 자녀 복이 많고 노년에 이를수록 삶의 질이 높아지는 평안한 운세를 타고났습니다.',
    '상관': '연해자평에서는 상관의 재능을 매우 높게 평가하면서도 구설수를 경계했습니다. "총명함이 세상에 드러나니 문장과 기술로 이름을 떨친다"고 하였습니다. 언변이 화려하고 임기응변에 능하여 어떤 어려운 질문에도 막힘이 없습니다. 다소 냉소적일 수 있으나 자신의 재능을 인정받을 때 최고의 성과를 내는 스타일로, 현대 사회에서 가장 빛나는 천재적 기질을 가졌습니다.',
    '편재': '연해자평에서 편재는 "천하의 재물을 논하는 호탕한 운"으로 묘사됩니다. 고향을 떠나 타지나 해외에서 자수성가하는 경우가 많으며, 재물을 다루는 감각이 타고났습니다. 대인관계에서 큰 손으로 통하며, 호기심이 많아 새로운 사업이나 모험에 주저함이 없습니다. 연애운도 화려하여 주변에 이성이 따르며 활동적인 삶을 즐깁니다.',
    '정재': '연해자평의 정재는 "성실과 신용의 화신"입니다. 정당하지 않은 이득은 쳐다보지도 않으며, 약속을 목숨처럼 아킵니다. 아내의 내조를 잘 받거나 남편으로서 책임을 다하는 가정적인 명입니다. 절약 정신이 투철하여 티끌 모아 태산을 이루는 끈기가 있으며, 중년 이후에는 반드시 지역 사회의 유지나 안정적인 자산가로 자리 잡게 되는 실속 있는 운입니다.',
    '편관': '연해자평에서 편관은 의리와 명예를 중시하는 카리스마의 상징입니다. "칠살이 칼을 차고 있는 것과 같으니 다스리면 영웅이요, 다스리지 못하면 화근이다"라고 하였습니다. 성격이 불같으나 뒤끝이 없고 약자의 고통을 외면하지 못하는 협객의 기질이 있습니다. 큰 어려움을 겪을수록 그 이름값이 높아지며, 사회 정의를 구현하는 분야에서 대성할 수 있는 기운입니다.',
    '정관': '연해자평의 정관은 품격 있는 귀족의 기운입니다. "정관은 단정한 복장을 하고 대궐에 서 있는 선비와 같다"고 표현했습니다. 원칙을 지키는 정직함이 최고의 자산이며, 부모의 명예를 드높이고 자손까지 번창하게 하는 힘이 있습니다. 사회적 지위가 안정적이며, 누구에게나 신뢰를 주는 성품 덕분에 큰 다툼 없이 순탄하게 부귀를 누리는 명입니다.',
    '편인': '연해자평에서 편인은 신비로움과 비범한 재주의 상징입니다. "한 가지 재주로 세상을 놀라게 하니 전문 기술이 남다르다"고 하였습니다. 직관력이 매우 뛰어나 남들이 보지 못하는 기회를 포착하는 능력이 일품입니다. 고독을 즐기며 사색에 잠기는 것을 좋아하고, 종교나 철학, 고차원적 예술 분야에서 일반인은 도저히 따라올 수 없는 깊은 경지를 보여주는 예술가적 혼이 있습니다.',
    '정인': '연해자평의 정인은 자비로운 어머니와 같은 따뜻한 인품을 상징합니다. "인성이 임하면 평생 학문에 힘쓰고 귀인의 도움을 받는다"고 하였습니다. 문서운이 매우 강력하여 부동산이나 저술 활동으로 큰 성과를 거두며, 정신적인 지도자로서 많은 이들의 귀감이 되는 품격 있는 삶을 삽니다.'
  };

  return {
    gyeok: gyeokName,
    japyung: japyungTexts[gyeokName] || '격국 분석을 진행 중입니다.',
    yeonhae: yeonhaeTexts[gyeokName] || '성향 분석을 진행 중입니다.'
  };
};

export const getInterpretation = (sajuData) => {
  const dayStem = sajuData.dayPillarHanja?.[0];
  const monthBranch = sajuData.monthPillarHanja?.[1];
  if (!dayStem || !monthBranch) return null;
  const gyeokName = getTenGods(dayStem, monthBranch);
  return getJapyungInterpretation(gyeokName);
};

// ===== 절기(節氣) 정밀 계산 (20세기/21세기 보정) =====
// 12 절(節) 정보: 사주 월 시작점 기준 (양력 기준)
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

const BRANCH_TO_SAJU_MONTH = {
  '丑': 1, '寅': 2, '卯': 3,  '辰': 4,  '巳': 5,  '午': 6,
  '未': 7, '申': 8, '酉': 9,  '戌': 10, '亥': 11, '子': 12,
};

const _isLeapYear = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/**
 * 절기 근사 일자 및 시간 계산 (정밀도 개선)
 * @param {number} year - 연도
 * @param {number} sajuMonthNum - 사주 월 (1~12)
 * @returns {object} { year, month, day, hour, minute }
 */
const getPreciseJeolDate = (year, sajuMonthNum) => {
  const jeol = JEOL_INFO[sajuMonthNum - 1];
  const is21stCentury = year >= 2000;
  const C = is21stCentury ? jeol.C[1] : jeol.C[0];
  const centuryBase = is21stCentury ? 2000 : 1900;
  
  const Y = year - centuryBase;
  // 천문학적 근사식 (절기 시각까지 포함)
  const daysValue = (Y * 0.2422) + C - Math.floor(Y / 4);
  const day = Math.floor(daysValue);
  const hourValue = (daysValue - day) * 24;
  const hour = Math.floor(hourValue);
  const minute = Math.round((hourValue - hour) * 60);

  return { year, month: jeol.calMonth, day, hour, minute };
};

const dateToLinear = (year, month, day, hour = 0, minute = 0) => {
  const DIM = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let total = (year - 1) * 365
    + Math.floor((year - 1) / 4)
    - Math.floor((year - 1) / 100)
    + Math.floor((year - 1) / 400);
  for (let m = 1; m < month; m++) {
    total += DIM[m];
    if (m === 2 && _isLeapYear(year)) total++;
  }
  return total + day + (hour / 24) + (minute / (24 * 60));
};

export const calculateDaewunStartAge = (birthDateStr, birthTimeStr, sajuData, gender) => {
  try {
    if (!birthDateStr || birthDateStr.length !== 8) {
      return { age: 9, preciseAge: 9, details: "기본값(9)" };
    }

    const birthYear  = parseInt(birthDateStr.substring(0, 4));
    const birthMonth = parseInt(birthDateStr.substring(4, 6));
    const birthDay   = parseInt(birthDateStr.substring(6, 8));
    const birthHour = birthTimeStr ? parseInt(birthTimeStr.substring(0, 2)) : 12;
    const birthMin  = birthTimeStr ? parseInt(birthTimeStr.substring(2, 4)) : 0;

    const yearStem    = sajuData?.yearPillarHanja?.[0];
    const monthBranch = sajuData?.monthPillarHanja?.[1];
    if (!yearStem || !monthBranch) return { age: 9, preciseAge: 9, details: "데이터 부족" };

    const sajuMonth = BRANCH_TO_SAJU_MONTH[monthBranch];
    if (!sajuMonth) return { age: 9, preciseAge: 9, details: "월 정보 오류" };

    const isYangYear = ['甲', '丙', '戊', '庚', '壬'].includes(yearStem);
    const isMale     = gender === 'male';
    const isForward  = (isYangYear && isMale) || (!isYangYear && !isMale);

    // [개선] 생일 기준 가장 가까운 앞뒤 절기 탐색
    // 1. 생일이 속한 달의 절기 시각 계산
    const jeolThisMonth = getPreciseJeolDate(birthYear, sajuMonth);
    const jeolThisMonthLinear = dateToLinear(jeolThisMonth.year, jeolThisMonth.month, jeolThisMonth.day, jeolThisMonth.hour, jeolThisMonth.minute);
    const birthLinear = dateToLinear(birthYear, birthMonth, birthDay, birthHour, birthMin);

    let currentJeolLinear, nextJeolLinear;
    let currentJeolInfo, nextJeolInfo;

    if (birthLinear >= jeolThisMonthLinear) {
      // 생일이 이번 달 절기 이후인 경우: 이전 절기 = 이번 달, 다음 절기 = 다음 달
      currentJeolLinear = jeolThisMonthLinear;
      currentJeolInfo = jeolThisMonth;
      
      const nextMonth = (sajuMonth % 12) + 1;
      const nextYear = sajuMonth === 12 ? birthYear + 1 : birthYear;
      nextJeolInfo = getPreciseJeolDate(nextYear, nextMonth);
      nextJeolLinear = dateToLinear(nextJeolInfo.year, nextJeolInfo.month, nextJeolInfo.day, nextJeolInfo.hour, nextJeolInfo.minute);
    } else {
      // 생일이 이번 달 절기 이전인 경우: 이전 절기 = 지난 달, 다음 절기 = 이번 달
      nextJeolLinear = jeolThisMonthLinear;
      nextJeolInfo = jeolThisMonth;

      const prevMonth = sajuMonth === 1 ? 12 : sajuMonth - 1;
      const prevYear = sajuMonth === 1 ? birthYear - 1 : birthYear;
      currentJeolInfo = getPreciseJeolDate(prevYear, prevMonth);
      currentJeolLinear = dateToLinear(currentJeolInfo.year, currentJeolInfo.month, currentJeolInfo.day, currentJeolInfo.hour, currentJeolInfo.minute);
    }

    const dayDiff = isForward
      ? nextJeolLinear - birthLinear
      : birthLinear - currentJeolLinear;

    const preciseAgeValue = dayDiff / 3;
    // 대운수가 100을 넘는 것은 로직 오류이므로 캡핑 (하지만 근본 원인은 위에서 해결됨)
    const finalPreciseAge = Math.min(120, Math.max(0, preciseAgeValue));
    const roundedAge = Math.round(finalPreciseAge);
    
    const years = Math.floor(finalPreciseAge);
    const remainingDays = (finalPreciseAge - years) * 3;
    const months = Math.floor(remainingDays * 4);
    const days = Math.floor(((remainingDays * 4) - months) * 30);

    return {
      age: Math.max(1, roundedAge),
      preciseAge: finalPreciseAge,
      years,
      months,
      days,
      details: `${years}년 ${months}개월 ${days}일`
    };
  } catch (e) {
    console.error("Daewun calculation error:", e);
    return { age: 9, preciseAge: 9, details: "계산 오류" };
  }
};

// ===== 신살(神殺) 실제 계산 =====

// 삼합 그룹 → 신살 대응표
const SHENSHA_BY_GROUP = {
  0: { '子': '장성살', '寅': '역마살', '酉': '도화살', '辰': '화개살', '巳': '겁살' }, // 申子辰
  1: { '午': '장성살', '申': '역마살', '卯': '도화살', '戌': '화개살', '亥': '겁살' }, // 寅午戌
  2: { '卯': '장성살', '巳': '역마살', '子': '도화살', '未': '화개살', '申': '겁살' }, // 亥卯未
  3: { '酉': '장성살', '亥': '역마살', '午': '도화살', '丑': '화개살', '寅': '겁살' }, // 巳酉丑
};

const getSamhapGroup = (branch) => {
  if (['申', '子', '辰'].includes(branch)) return 0;
  if (['寅', '午', '戌'].includes(branch)) return 1;
  if (['亥', '卯', '未'].includes(branch)) return 2;
  if (['巳', '酉', '丑'].includes(branch)) return 3;
  return -1;
};

// 천을귀인 (일간 기준)
const CHUNEUL_GWIIN = {
  '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
  '乙': ['子', '申'], '己': ['子', '申'],
  '丙': ['亥', '酉'], '丁': ['亥', '酉'],
  '壬': ['卯', '巳'], '癸': ['卯', '巳'],
  '辛': ['寅', '午'],
};

// 문창귀인 (일간 기준)
const MUNCHANG_GWIIN = {
  '甲': '巳', '乙': '午', '丙': '申', '戊': '申',
  '丁': '酉', '己': '酉', '庚': '亥', '辛': '子',
  '壬': '寅', '癸': '卯',
};

/**
 * 신살 계산 (기존 Mock 대체)
 * @param {string} dayStem    - 일간 (예: '甲')
 * @param {string} yearStem   - 대상 연/월의 천간
 * @param {string} targetBranch - 대상 연/월의 지지
 * @param {string} birthYearBranch - 생년 지지
 * @returns {string[]} 활성 신살 목록 (최대 2개)
 */
export const getShensha = (dayStem, yearStem, targetBranch, birthYearBranch) => {
  const result = [];

  // 1. 삼합 기반 신살 (생년 지지 그룹 vs 대상 지지)
  const group = getSamhapGroup(birthYearBranch);
  if (group >= 0 && SHENSHA_BY_GROUP[group]?.[targetBranch]) {
    result.push(SHENSHA_BY_GROUP[group][targetBranch]);
  }

  // 2. 천을귀인 (일간 vs 대상 지지)
  if (CHUNEUL_GWIIN[dayStem]?.includes(targetBranch)) {
    result.push('천을귀인');
  }

  // 3. 문창귀인 (일간 vs 대상 지지)
  if (result.length < 2 && MUNCHANG_GWIIN[dayStem] === targetBranch) {
    result.push('문창귀인');
  }

  return result.slice(0, 2);
};

// 하위 호환용 (삭제 예정)
export const getShenshaMock = () => '';

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

// 선택된 운세 해설 로직 (대운, 세운, 월운)
export const getCurrentLuckInterpretation = (sajuData, userInfo, targetYear) => {
  const dayStem = sajuData.dayPillarHanja?.[0];
  const yearStem = sajuData.yearPillarHanja?.[0];
  const birthYear = parseInt(userInfo.birthDate.substring(0, 4));
  const birthMonth = parseInt(userInfo.birthDate.substring(4, 6));
  const birthDay = parseInt(userInfo.birthDate.substring(6, 8));
  
  // 해당 연도의 생일 기준으로 만나이 계산
  let age = targetYear - birthYear;
  // targetYear의 생일이 지나지 않았으면 -1 (여기서는 단순 비교를 위해 월/일만 체크)
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  
  // 만약 targetYear가 현재 연도라면 실제 만나이 적용, 아니면 연도 차이만 적용 (또는 정밀 계산)
  if (targetYear === today.getFullYear()) {
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
      age--;
    }
  }

  if (!dayStem || !yearStem) return null;

  // 1. 현재 대운 찾기 (userInfo에 저장된 정밀 대운 정보 사용)
  const daewunInfo = userInfo.daewunInfo;
  if (!daewunInfo) return null; // 대운 정보가 없으면 대기
  const daewunStartAge = daewunInfo.age;
  const daewunList = calculateDaewun(yearStem, sajuData.monthPillarHanja, userInfo.gender, daewunStartAge);
  // daewunList는 [큰나이... 작은나이] 순서임
  const currentDaewun = daewunList.find(dw => age >= dw.age) || daewunList[daewunList.length - 1];
  
  // 2. 선택된 세운 계산
  const baseYear = 1984; // 갑자년
  const diff = (targetYear - baseYear) % 60;
  const index = diff >= 0 ? diff : diff + 60;
  const sewunPillar = gapjaArray[index];
  const sewunStem = sewunPillar[0];

  // 3. 현재 월운(절운) 계산 - 실제 현재 월 기준이거나 연운의 전반적 흐름
  const allWoluns = calculateWolun(sewunStem); 
  
  const daewunGod = getTenGods(dayStem, currentDaewun.stem);
  const sewunGod = getTenGods(dayStem, sewunStem);
  
  const daewunStage = getTwelveStages(dayStem, currentDaewun.branch);
  const sewunStage = getTwelveStages(dayStem, sewunPillar[1]);

  const japyungLuck = {
    '비견': { daewun: '자평진전에서는 비견 대운을 \"본신의 기운이 왕성해져 자립의 기틀을 다지는 시기\"로 봅니다. 관성이 있으면 건록용관(建祿用官)의 이치로 사회적 입지가 굳건해지며, 재성을 만나면 자수성가의 큰 발판이 됩니다.', sewun: '비견 세운은 경쟁과 동업의 기운이 강합니다. 자평진전에서는 \"비겁이 겹치면 재성을 쟁탈하니 독자적 판단이 중요하다\"고 경고합니다. 파트너십보다 독립적 행보가 유리합니다.', wolun: '비견 절운은 자기 주관이 강해지는 달입니다. 독립적 추진이 길하며 투자나 동업은 신중을 기해야 합니다.' },
    '겁재': { daewun: '자평진전에서 겁재 대운은 \"양인(陽刃)의 기운이 일어나 반드시 관성으로 제복해야 귀하게 된다\"고 봅니다. 이 시기는 강렬한 추진력으로 어려운 국면을 타개하되, 지나친 욕심을 경계해야 합니다.', sewun: '겁재 세운은 재물의 출입이 격렬한 해입니다. 자평진전에서는 \"양인이 세운에 임하면 큰 변동이 있으니 인성으로 화기를 풀어야 한다\"고 조언합니다.', wolun: '겁재 절운은 경쟁이 치열해지는 달입니다. 과감한 결단이 필요하나 재물 손실에 유의해야 합니다.' },
    '식신': { daewun: '자평진전에서 식신 대운은 \"식신생재(食神生財)의 이치로 풍요와 안락이 따르는 최상의 길운\"으로 봅니다. 전문성을 키우고 창의적 활동을 펼치면 재물이 자연스레 모입니다.', sewun: '식신 세운은 창작과 발전의 해입니다. 자평진전에서는 \"식신이 일위를 생하면 복록이 자연히 따른다\"고 하여, 새로운 기술이나 사업 확장에 최적입니다.', wolun: '식신 절운은 의식주가 풍족해지고 아이디어가 풍부한 달입니다. 창작과 기획에 매우 길합니다.' },
    '상관': { daewun: '자평진전에서 상관 대운은 \"상관이 재를 생하면 부귀하고, 상관이 인을 만나면 명예를 얻는다\"고 봅니다. 기존의 틀을 깨는 혁신의 시기이며 변화를 두려워하지 않아야 합니다.', sewun: '상관 세운은 변화와 표현의 해입니다. 자평진전에서는 \"상관이 정관을 보면 화(禍)가 되니 관직자는 조심하라\"고 경고합니다. 언행에 신중을 기해야 합니다.', wolun: '상관 절운은 재능이 빛나나 구설수를 조심해야 하는 달입니다. 창의적 활동은 길하나 대인관계에 주의가 필요합니다.' },
    '편재': { daewun: '자평진전에서 편재 대운은 \"신강하면 큰 재물을 다루는 호운이나 신약하면 재다신약(財多身弱)으로 감당이 어렵다\"고 봅니다. 사업 확장과 투자의 적기이나 체력 관리가 중요합니다.', sewun: '편재 세운은 유동적 재물의 기회가 오는 해입니다. 자평진전에서는 \"편재는 활동적인 재물이니 적극 경영하라\"고 권합니다. 새로운 사업이나 투자에 과감히 도전할 때입니다.', wolun: '편재 절운은 재물 기회가 오는 달입니다. 활동 범위를 넓히고 적극적으로 기회를 잡아야 합니다.' },
    '정재': { daewun: '자평진전에서 정재 대운은 \"정당한 노력의 결실이 맺어지는 안정의 시기\"로 봅니다. 재성이 관을 생하여 직장에서의 승진이나 안정적 수입 증가가 기대됩니다.', sewun: '정재 세운은 착실한 성과를 거두는 해입니다. 자평진전에서는 \"정재가 투명하면 가정이 화목하고 재물이 쌓인다\"고 하여 저축과 안정적 투자에 길합니다.', wolun: '정재 절운은 성실함이 보상받는 달입니다. 안정적 수입과 가정의 평화가 함께 찾아옵니다.' },
    '편관': { daewun: '자평진전에서 편관 대운은 \"칠살이 제복되면 대귀하나 제복되지 않으면 재앙이 따른다\"고 경고합니다. 시련을 통해 성장하는 시기이며, 인내와 지략으로 극복하면 큰 권위를 얻습니다.', sewun: '편관 세운은 압박과 도전의 해입니다. 자평진전에서는 \"살중용인(殺重用印)하여 화살(化殺)하라\"고 조언합니다. 학문이나 자기 수양으로 위기를 기회로 전환해야 합니다.', wolun: '편관 절운은 책임이 무거워지는 달입니다. 스트레스 관리에 유의하고 인내하면 명예가 상승합니다.' },
    '정관': { daewun: '자평진전에서 정관 대운은 \"관인상생(官印相生)의 이치로 학문과 명예가 함께 빛나는 최고의 길운\"으로 봅니다. 승진, 합격, 사회적 지위 상승이 기대되는 시기입니다.', sewun: '정관 세운은 명예와 인정의 해입니다. 자평진전에서는 \"정관이 청수하면 만인이 우러러본다\"고 하여, 공식적 직함이나 자격에서 경사가 따릅니다.', wolun: '정관 절운은 사회적 인정을 받는 달입니다. 시험, 승진, 계약 등에서 좋은 결과가 기대됩니다.' },
    '편인': { daewun: '자평진전에서 편인 대운은 \"편인이 편재를 만나면 편인의 흉이 제거되어 특수한 재능이 빛난다\"고 봅니다. 전문 기술이나 학술 분야에서 독보적 성과를 내는 시기입니다.', sewun: '편인 세운은 직관과 영감의 해입니다. 자평진전에서는 \"도식(倒食)을 경계하되 편재로 제어하면 길하다\"고 하여, 기존 사업보다 새로운 분야의 도전이 유리합니다.', wolun: '편인 절운은 직관력이 돋보이는 달입니다. 특수 분야 공부나 기술 습득에 최적의 시기입니다.' },
    '정인': { daewun: '자평진전에서 정인 대운은 \"관인상생의 이치로 평생 학덕이 쌓이고 귀인의 도움이 끊이지 않는 복운\"으로 봅니다. 문서운과 학업운이 극대화되며, 부동산 취득에도 매우 유리합니다.', sewun: '정인 세운은 학업과 문서의 해입니다. 자평진전에서는 \"정인이 관을 보면 관인상생으로 대길하다\"고 하여, 자격증 취득, 계약, 부동산 거래에 최적입니다.', wolun: '정인 절운은 문서운이 좋은 달입니다. 윗사람의 도움과 학업 성취가 돋보입니다.' }
  };

  const yeonhaeLuck = {
    '비견': { daewun: '연해자평에서는 비견 대운을 \"스스로의 힘으로 세상에 홀로 서는 시기\"로 봅니다. 독립심이 극에 달하며, 형제나 동료와의 관계에서 갈등과 협력이 교차합니다. 자신만의 영역을 확보하면 대성의 기회가 열립니다.', sewun: '연해자평에서 비견 세운은 \"내 것을 지키려는 마음이 강해지는 해\"입니다. 재물의 분배나 공유에서 갈등이 있을 수 있으며, 자기 주장을 명확히 하되 독선은 삼가야 합니다.', wolun: '자기 확신이 강해지는 시기이므로, 독자적 판단으로 행동하되 주변과의 소통을 잊지 마십시오.' },
    '겁재': { daewun: '연해자평에서 겁재 대운은 \"투쟁과 쟁취의 기운이 최고조에 달하는 시기\"입니다. 남에게 지기 싫어하는 승부사 기질이 성공의 원동력이 되며, 위기에 처했을 때 더욱 강해집니다.', sewun: '연해자평에서 겁재 세운은 \"재물이 오고 가는 변동이 큰 해\"입니다. 도박이나 투기성 투자는 절대 금하고, 확실한 기회만 잡으면 큰 이득을 볼 수 있습니다.', wolun: '경쟁 심리가 강해지므로, 지출 관리를 철저히 하고 충동적인 결정을 삼가는 것이 좋습니다.' },
    '식신': { daewun: '연해자평에서 식신 대운은 \"의식주 걱정 없이 풍요를 누리는 낙천의 시기\"입니다. 미식가적 기질이 발현되고 예술·창작 활동이 활발해지며, 자녀와 관련된 경사가 따릅니다.', sewun: '연해자평에서 식신 세운은 \"타고난 재능을 세상에 펼치는 해\"입니다. 성품이 원만해져 적을 만들지 않으며, 먹고 마시는 즐거움과 함께 삶의 질이 높아집니다.', wolun: '풍족하고 여유로운 마음이 들며, 맛집 탐방이나 문화생활 등 일상의 즐거움을 누리기에 좋습니다.' },
    '상관': { daewun: '연해자평에서 상관 대운은 \"총명함이 세상에 드러나 문장과 기술로 이름을 떨치는 시기\"입니다. 언변이 화려하고 임기응변에 능하며, 기존 체제에 대한 불만이 혁신의 에너지로 전환됩니다.', sewun: '연해자평에서 상관 세운은 \"입이 칼보다 날카로워지는 해\"입니다. 냉소적 언행이 늘 수 있으나 자신의 재능을 인정받으면 최고의 성과를 냅니다. 구설에 각별히 조심해야 합니다.', wolun: '재능과 표현력이 빛을 발하지만 자칫 말실수가 생길 수 있으니, 에너지를 창의적 프로젝트에 집중하는 것이 유리합니다.' },
    '편재': { daewun: '연해자평에서 편재 대운은 \"천하의 재물을 논하며 호탕하게 사업을 벌이는 시기\"입니다. 고향을 떠나 타지나 해외에서 기회를 잡으며, 대인관계에서 큰 손으로 통합니다.', sewun: '연해자평에서 편재 세운은 \"예상치 못한 재물의 기회가 오는 해\"입니다. 새로운 사업이나 모험에 과감히 도전하면 큰 성과를 거둘 수 있습니다. 이성과의 인연도 활발합니다.', wolun: '새로운 재물 창출의 기회가 열리므로, 활동적으로 움직이고 다양한 인맥을 넓히는 것이 길합니다.' },
    '정재': { daewun: '연해자평에서 정재 대운은 \"성실과 신용의 화신으로서 정당한 노력의 대가를 받는 시기\"입니다. 절약 정신이 투철하여 티끌 모아 태산을 이루는 끈기가 빛을 발합니다.', sewun: '연해자평에서 정재 세운은 \"약속을 지키는 자에게 신뢰가 따르는 해\"입니다. 가정의 화목과 안정적인 수입이 보장되며, 무리한 욕심보다 착실한 실속이 중요합니다.', wolun: '안정과 실속을 챙길 수 있으니, 무리한 변화보다는 저축과 가정의 평안을 도모하는 것이 좋습니다.' },
    '편관': { daewun: '연해자평에서 편관 대운은 \"칠살이 칼을 차고 있으니 다스리면 영웅이요, 다스리지 못하면 화근\"이라고 합니다. 큰 어려움을 겪을수록 그 이름값이 높아지며, 의리와 정의감이 빛납니다.', sewun: '연해자평에서 편관 세운은 \"시련과 압박 속에서 진가가 드러나는 해\"입니다. 불의를 보면 참지 못하는 협객의 기질이 발현되며, 인내하면 반드시 보상이 따릅니다.', wolun: '강한 의지력이 시험받는 시기이니, 힘든 과제라도 인내하고 정면 돌파하면 더 큰 성취가 뒤따릅니다.' },
    '정관': { daewun: '연해자평에서 정관 대운은 \"단정한 선비가 대궐에 서듯 품격 있는 지위를 얻는 시기\"입니다. 원칙을 지키는 정직함이 최고의 자산이 되며, 자손까지 번창하게 합니다.', sewun: '연해자평에서 정관 세운은 \"공식적인 지위와 명예가 빛나는 해\"입니다. 누구에게나 신뢰를 주는 성품 덕분에 큰 다툼 없이 순탄하게 부귀를 누립니다.', wolun: '개인의 명예와 품격이 높아지는 시기이므로, 공식적인 자리나 업무에서 긍정적인 인정을 받게 됩니다.' },
    '편인': { daewun: '연해자평에서 편인 대운은 \"한 가지 재주로 세상을 놀라게 하는 시기\"입니다. 남들이 보지 못하는 기회를 포착하는 직관력이 일품이며, 종교·철학·예술 분야에서 깊은 경지에 도달합니다.', sewun: '연해자평에서 편인 세운은 \"고독 속에서 영감을 얻는 해\"입니다. 사색과 연구에 몰두하면 남들이 따라올 수 없는 독창적 성과를 거둡니다.', wolun: '영감과 직관력이 특히 예리해지는 시기이니, 혼자만의 사색을 통해 깊은 통찰과 아이디어를 얻으십시오.' },
    '정인': { daewun: '연해자평에서 정인 대운은 \"평생 학문에 힘쓰고 귀인의 도움이 끊이지 않는 복운\"입니다. 문서운이 강력하여 부동산이나 저술 활동에서 큰 성과를 거두며, 정신적 지도자로서 존경받습니다.', sewun: '연해자평에서 정인 세운은 \"배움과 가르침이 동시에 빛나는 해\"입니다. 자격증 취득, 학업 성취, 부동산 계약 등 문서와 관련된 모든 일에 대길합니다.', wolun: '새로운 지식을 습득하거나 자격증에 도전하기 좋은 학습과 내적 성장의 달입니다.' }
  };

  const monthlyLuck = allWoluns.map(w => {
    const god = getTenGods(dayStem, w.stem);
    const stage = getTwelveStages(dayStem, w.branch);
    
    const jp = japyungLuck[god]?.wolun || '';
    const yh = yeonhaeLuck[god]?.wolun || '';
    
    return {
      month: w.month,
      pillar: w.pillar,
      god: god,
      stage: stage,
      desc: jp + ' ' + yh
    };
  }); 

  return {
    daewun: {
      age: currentDaewun.age,
      pillar: currentDaewun.pillar,
      god: daewunGod,
      stage: daewunStage,
      japyung: japyungLuck[daewunGod]?.daewun || '장기적인 환경의 변화가 예상됩니다.',
      yeonhae: yeonhaeLuck[daewunGod]?.daewun || '장기적인 성정의 변화가 있습니다.'
    },
    sewun: {
      year: targetYear,
      pillar: sewunPillar,
      god: sewunGod,
      stage: sewunStage,
      japyung: japyungLuck[sewunGod]?.sewun || '올해의 주요 흐름을 나타냅니다.',
      yeonhae: yeonhaeLuck[sewunGod]?.sewun || '올해의 성정 흐름입니다.'
    },
    monthlyLuck: monthlyLuck
  };
};
