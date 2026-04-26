const { calculateSaju, lunarToSolar } = require('@fullstackfamily/manseryeok');

try {
    const result = lunarToSolar(1988, 12, 21, false);
    console.log('Solar Date:', result.solar);
} catch (e) {
    console.error('Error:', e);
}
