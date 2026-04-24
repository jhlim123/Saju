import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/translations';
import { generateExpertPrompt } from '../../utils/aiPromptGenerator';

export default function AiPromptSection({ sajuData, luck }) {
  const { language } = useLanguage();
  const t = translations[language];
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!luck?.daewun) return null;

  const promptText = generateExpertPrompt(sajuData, luck);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ marginBottom: '25px', padding: '20px', background: 'var(--surface-color)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h4 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: '600', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {t.aiPromptTitle}
        </h4>
        <button
          onClick={() => setShowPrompt(!showPrompt)}
          style={{ padding: '6px 12px', fontSize: '0.85rem', background: 'var(--bg-color)', border: 'none', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: '500' }}
        >
          {showPrompt ? t.hidePrompt : t.showPrompt}
        </button>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px', lineHeight: '1.5' }}>
        챗GPT나 클로드(Claude)에게 아래 프롬프트를 복사하여 질문하면, 선택한 대운·세운·월운을 바탕으로 한 명리학 전문가 수준의 상세한 심층 분석을 받을 수 있습니다.
      </p>
      {showPrompt && (
        <div style={{ marginTop: '15px', position: 'relative' }}>
          <textarea
            readOnly
            value={promptText}
            style={{ width: '100%', height: '250px', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6', resize: 'vertical', fontFamily: 'monospace' }}
          />
          <button
            onClick={handleCopy}
            style={{ position: 'absolute', top: '10px', right: '10px', padding: '8px 16px', background: copied ? 'var(--text-primary)' : 'var(--bg-color)', color: copied ? 'white' : 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: '500', fontSize: '0.85rem', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
          >
            {copied ? t.copied : t.copyAll}
          </button>
        </div>
      )}
    </div>
  );
}
