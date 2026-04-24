import { calculateSaju } from '@fullstackfamily/manseryeok';
import { calculateDaewunStartAge } from '../src/utils/sajuLogic.js';

const birthDate = "19881230";
const birthTime = "1430";
const gender = "male";

const saju = calculateSaju(1988, 12, 30, 14, 30);
const daewunInfo = calculateDaewunStartAge(birthDate, birthTime, saju, gender);

console.log("Saju Data:", JSON.stringify(saju, null, 2));
console.log("Daewun Info:", JSON.stringify(daewunInfo, null, 2));
