'use client';

import { useState } from 'react';

interface ShareButtonProps {
  calendarId: string;
}

export default function ShareButton({ calendarId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/family/${calendarId}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: '晩ごはんカレンダー',
          text: '家族の晩ごはん予定を共有しよう！',
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (err) {
      console.error('共有に失敗しました:', err);
      // フォールバック: クリップボードにコピー
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch {
        // 最後の手段: プロンプト表示
        prompt('URLをコピーしてください:', url);
      }
    }
  };

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
    <div className="flex items-center gap-2">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover-lift focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-lg"
        aria-label="カレンダーを共有"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
        </svg>
        <span className="hidden sm:inline">
          {copied ? 'コピーしました！' : '共有'}
        </span>
      </button>

      <button
        onClick={copyUrl}
        className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 hover-lift focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          copied 
            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground'
        }`}
        aria-label="URLをコピー"
        title="URLをクリップボードにコピー"
      >
        {copied ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}