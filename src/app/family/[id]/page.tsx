'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Calendar from '@/components/Calendar';
import DinnerModal from '@/components/DinnerModal';
import ShareButton from '@/components/ShareButton';
import { subscribeToMonthRecords } from '@/lib/firestore';
import { DinnerRecord } from '@/lib/types';
import { format } from 'date-fns';

export default function FamilyCalendarPage() {
  const params = useParams();
  const calendarId = params.id as string;
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [records, setRecords] = useState<DinnerRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!calendarId) return;

    const yearMonth = format(currentMonth, 'yyyy-MM');
    const unsubscribe = subscribeToMonthRecords(
      calendarId,
      yearMonth,
      (newRecords) => {
        setRecords(newRecords);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [calendarId, currentMonth]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
        <div className="glass-effect p-8 rounded-2xl text-center animate-scale-in">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-muted-foreground">カレンダーを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="glass-effect rounded-3xl p-8 mb-8 card-hover animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  晩ごはんカレンダー
                </h1>
                <p className="text-muted-foreground mt-1">
                  家族の予定を共有して、みんなで確認しよう
                </p>
              </div>
            </div>
            <ShareButton calendarId={calendarId} />
          </div>
          
          <Calendar
            records={records}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            onDateClick={handleDateClick}
          />
        </div>

        <div className="glass-effect rounded-2xl p-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            使い方
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-xs">1</span>
              </div>
              <div>
                <span className="font-medium text-foreground">日付をタップ</span>
                <p>予定を入力したい日付をタップしてください</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-pink-600 dark:text-pink-400 font-bold text-xs">2</span>
              </div>
              <div>
                <span className="font-medium text-foreground">名前と予定を入力</span>
                <p>晩ごはんが必要かどうかを選択してください</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xs">3</span>
              </div>
              <div>
                <span className="font-medium text-foreground">URLを共有</span>
                <p>家族にURLを送って一緒に使いましょう</p>
              </div>
            </div>
          </div>
        </div>

        {selectedDate && (
          <DinnerModal
            calendarId={calendarId}
            date={selectedDate}
            records={records.filter(r => r.date === format(selectedDate, 'yyyy-MM-dd'))}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}