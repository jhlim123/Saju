const { getMonthlyIndex } = require('@fullstackfamily/manseryeok');

function robustLunarToSolar(lunarYear, lunarMonth, lunarDay, isLeapMonth = false) {
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
            if (entry) {
                return {
                    solar: entry.solar,
                    lunar: { year: lunarYear, month: lunarMonth, day: lunarDay, isLeapMonth }
                };
            }
        }
    }
    return null;
}

const result = robustLunarToSolar(1987, 12, 21, false);
console.log('Robust Result:', result);
