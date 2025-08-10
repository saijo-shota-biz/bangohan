'use client';

import { useState } from 'react';

interface ShareButtonProps {
  calendarId: string;
}

export default function ShareButton({ calendarId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    const url = `${window.location.origin}/family/${calendarId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('URLのコピーに失敗しました:', err);
      prompt('URLをコピーしてください:', url);
    }
  };

  return (
    <button
      onClick={copyUrl}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all duration-200 hover-lift focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95 ${
        copied 
          ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' 
          : 'bg-orange-50 hover:bg-orange-100 text-orange-600 hover:text-orange-700'
      }`}
      aria-label="URLをコピー"
      title="URLをクリップボードにコピー"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs">コピー済み</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">URLコピー</span>
        </>
      )}
    </button>
  );
}