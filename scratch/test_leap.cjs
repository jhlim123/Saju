const { calculateSaju, lunarToSolar } = require('@fullstackfamily/manseryeok');

try {
    // 1987 has a leap 6th month
    const lunar = { year: 1987, month: 6, day: 21, isLeap: true };
    const result = lunarToSolar(lunar.year, lunar.month, lunar.day, lunar.isLeap);
    console.log('Solar Date:', result.solar);
} catch (e) {
    console.error('Error:', e);
}
