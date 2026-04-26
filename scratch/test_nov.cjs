const { calculateSaju, lunarToSolar } = require('@fullstackfamily/manseryeok');

try {
    for (let d = 1; d <= 29; d++) {
        try {
            const result = lunarToSolar(1987, 11, d, false);
            console.log(`1987-11-${d} -> ${result.solar.year}-${result.solar.month}-${result.solar.day}`);
            break;
        } catch (e) {
            console.log(`1987-11-${d} FAILED: ${e.message}`);
        }
    }
} catch (e) {
    console.error('Error:', e);
}
