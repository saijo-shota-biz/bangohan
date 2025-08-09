'use client';

import { useState } from 'react';

interface UserSetupProps {
  onComplete: (name: string) => void;
}

export default function UserSetup({ onComplete }: UserSetupProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    onComplete(name.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
      <div className="glass-effect p-6 rounded-3xl text-center animate-fade-in max-w-sm mx-4">
        <div className="mb-6">
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold gradient-text mb-3">
            はじめまして！
          </h1>
          <p className="text-muted-foreground text-base mb-2">
            晩ごはんカレンダーへようこそ
          </p>
          <p className="text-muted-foreground text-sm">
            お名前を教えてください
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：パパ、ママ、長女"
              className="w-full px-4 py-3 text-base text-center bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover-lift focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center gap-2 active:scale-95"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                設定中...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                はじめる
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>お名前は30日間記憶されます</p>
        </div>
      </div>
    </div>
  );
}