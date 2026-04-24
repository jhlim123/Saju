// ================================================================
// localStorage 추상화 유틸리티
// ================================================================

const HISTORY_KEY = 'saju_history';
const MAX_HISTORY = 50;

/**
 * 사주 조회 이력 불러오기
 * @returns {Array} 저장된 사용자 정보 배열
 */
export const loadHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
};

/**
 * 사주 조회 이력에 새 항목 저장 (중복 제거 후 최대 50개)
 * @param {object} userInfo - 저장할 사용자 정보
 */
export const saveToHistory = (userInfo) => {
  try {
    const prev = loadHistory();
    const newEntry = { ...userInfo, id: Date.now() };
    const filtered = prev.filter(
      (item) => item.birthDate !== newEntry.birthDate || item.name !== newEntry.name
    );
    const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // 스토리지 오류 무시 (시크릿 모드 등)
  }
};

/**
 * 사주 조회 이력 전체 삭제
 */
export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // 무시
  }
};
