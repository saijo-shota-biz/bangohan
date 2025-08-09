'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { createCalendar } from '@/lib/firestore';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const createNewCalendar = async () => {
      const calendarId = nanoid(10);
      try {
        await createCalendar(calendarId);
        router.push(`/family/${calendarId}`);
      } catch (error) {
        console.error('カレンダーの作成に失敗しました:', error);
      }
    };

    createNewCalendar();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
      <div className="glass-effect p-12 rounded-3xl text-center animate-fade-in max-w-md mx-4">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-4">
            晩ごはんカレンダー
          </h1>
          <p className="text-muted-foreground text-lg">
            家族の予定を簡単に共有しよう
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-pink-500 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="text-muted-foreground font-medium">
            新しいカレンダーを作成中...
          </p>
        </div>
      </div>
    </div>
  );
}