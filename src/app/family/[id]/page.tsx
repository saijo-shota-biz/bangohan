'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Calendar from '@/components/Calendar';
import ShareButton from '@/components/ShareButton';
import DinnerModal from '@/components/DinnerModal';
import UserSetup from '@/components/UserSetup';
import { subscribeToMonthRecords, addDinnerRecord, deleteDinnerRecord } from '@/lib/firestore';
import { UserNameManager } from '@/lib/userName';
import { DinnerRecord } from '@/lib/types';
import { format } from 'date-fns';

export default function FamilyCalendarPage() {
  const params = useParams();
  const calendarId = params.id as string;
  const [userName, setUserName] = useState<string | null>(null);
  const [records, setRecords] = useState<DinnerRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showUserSetup, setShowUserSetup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const storedName = UserNameManager.getUserName();
    if (storedName) {
      setUserName(storedName);
    } else {
      setShowUserSetup(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!calendarId || !userName) return;

    const yearMonth = format(currentMonth, 'yyyy-MM');
    const unsubscribe = subscribeToMonthRecords(
      calendarId,
      yearMonth,
      (newRecords) => {
        setRecords(newRecords);
      }
    );

    return () => unsubscribe();
  }, [calendarId, currentMonth, userName]);

  const handleUserSetup = (name: string) => {
    UserNameManager.setUserName(name);
    setUserName(name);
    setShowUserSetup(false);
  };

  const handleDateClick = async (date: Date) => {
    if (!userName) return;

    const dateStr = format(date, 'yyyy-MM-dd');
    const existingRecord = records.find(r => r.date === dateStr && r.name === userName);
    
    if (existingRecord && existingRecord.id) {
      // 既存の記録がある場合は削除
      try {
        await deleteDinnerRecord(calendarId, existingRecord.id);
      } catch (error) {
        console.error('記録の削除に失敗しました:', error);
      }
    } else {
      // 新規の場合は「いる」として追加
      try {
        await addDinnerRecord(calendarId, dateStr, userName, true);
      } catch (error) {
        console.error('記録の追加に失敗しました:', error);
      }
    }
  };

  const handleDateLongPress = (date: Date) => {
    setSelectedDate(date);
  };

  const handleUserNameChange = () => {
    setShowUserSetup(true);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
        <div className="glass-effect p-8 rounded-2xl text-center animate-scale-in">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (showUserSetup) {
    return <UserSetup onComplete={handleUserSetup} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
      <div className="container mx-auto px-3 py-4">
        <div className="glass-effect rounded-2xl p-4 mb-6 card-hover animate-fade-in">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl font-bold gradient-text truncate">
                    晩ごはんカレンダー
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <span className="truncate">{userName}さん</span>
                    <button
                      onClick={handleUserNameChange}
                      className="text-xs px-2 py-0.5 bg-secondary hover:bg-accent rounded-md transition-colors flex-shrink-0"
                      title="名前を変更"
                    >
                      変更
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 ml-2">
                <ShareButton calendarId={calendarId} />
              </div>
            </div>
          </div>
          
          <Calendar
            records={records}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            onDateClick={handleDateClick}
            onDateLongPress={handleDateLongPress}
            currentUserName={userName!}
          />
        </div>

        <div className="glass-effect rounded-2xl p-4 animate-fade-in">
          <div className="text-center text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">日付をタップ</span>で晩ごはん必要日を追加・削除</p>
            <p className="mt-1"><span className="font-medium text-foreground">URLコピー</span>で家族と共有</p>
          </div>
        </div>

        {selectedDate && (
          <DinnerModal
            date={selectedDate}
            records={records.filter(r => r.date === format(selectedDate, 'yyyy-MM-dd'))}
            currentUserName={userName!}
            onClose={handleCloseModal}
          />
        )}

      </div>
    </div>
  );
}