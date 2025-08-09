'use client';

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';
import { DinnerRecord } from '@/lib/types';

interface CalendarProps {
  records: DinnerRecord[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onDateClick: (date: Date) => void;
}

export default function Calendar({ records, currentMonth, onMonthChange, onDateClick }: CalendarProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const goToPreviousMonth = () => onMonthChange(subMonths(currentMonth, 1));
  const goToNextMonth = () => onMonthChange(addMonths(currentMonth, 1));

  const getRecordsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return records.filter(r => r.date === dateStr);
  };

  const getSkipCount = (date: Date) => {
    const dayRecords = getRecordsForDate(date);
    return dayRecords.filter(r => !r.needsDinner).length;
  };

  const getTotalCount = (date: Date) => {
    const dayRecords = getRecordsForDate(date);
    return dayRecords.length;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={goToPreviousMonth}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-accent transition-all hover-lift focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="前の月へ"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {format(currentMonth, 'yyyy年M月', { locale: ja })}
          </h2>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-accent transition-all hover-lift focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="次の月へ"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <div 
            key={day} 
            className={`text-center font-semibold py-3 text-sm rounded-lg ${
              index === 0 ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 
              index === 6 ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 
              'text-muted-foreground bg-muted/50'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((date) => {
          const skipCount = getSkipCount(date);
          const totalCount = getTotalCount(date);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isCurrentDay = isToday(date);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => isCurrentMonth && onDateClick(date)}
              disabled={!isCurrentMonth}
              className={`
                relative group rounded-xl p-3 min-h-24 text-left transition-all duration-300 ease-in-out
                ${!isCurrentMonth 
                  ? 'bg-muted/30 text-muted-foreground cursor-not-allowed opacity-40' 
                  : 'bg-card border border-border hover:border-primary/50 cursor-pointer hover:shadow-lg hover:scale-105'
                }
                ${isCurrentDay 
                  ? 'ring-2 ring-primary shadow-lg bg-gradient-to-br from-primary/10 to-pink-500/10' 
                  : ''
                }
                ${isWeekend && isCurrentMonth ? 'bg-gradient-to-br from-red-50 to-blue-50 dark:from-red-900/10 dark:to-blue-900/10' : ''}
              `}
              aria-label={`${format(date, 'M月d日')}の予定を確認・編集`}
            >
              <div className={`text-sm font-semibold mb-2 ${
                isCurrentDay ? 'text-primary' : 
                !isCurrentMonth ? 'text-muted-foreground' : 'text-foreground'
              }`}>
                {format(date, 'd')}
                {isCurrentDay && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                )}
              </div>
              
              {isCurrentMonth && (
                <div className="space-y-1">
                  {totalCount > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-xs text-muted-foreground">{totalCount}人</span>
                    </div>
                  )}
                  {skipCount > 0 && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium rounded-full">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {skipCount}人不要
                    </div>
                  )}
                </div>
              )}
              
              {isCurrentMonth && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}