const { calculateSaju, lunarToSolar } = require('@fullstackfamily/manseryeok');

try {
    const lunar = { year: 1987, month: 12, day: 21, isLeap: false };
    const result = lunarToSolar(lunar.year, lunar.month, lunar.day, lunar.isLeap);
    console.log('Solar Date:', result.solar);
    
    const saju = calculateSaju(result.solar.year, result.solar.month, result.solar.day, 18, 0);
    console.log('Saju Pillars:', saju.yearPillarHanja, saju.monthPillarHanja, saju.dayPillarHanja, saju.hourPillarHanja);
} catch (e) {
    console.error('Error:', e);
}
