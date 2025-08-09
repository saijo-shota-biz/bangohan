'use client';

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';
import { DinnerRecord } from '@/lib/types';

interface CalendarProps {
  records: DinnerRecord[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onDateClick: (date: Date) => void;
  onDateLongPress: (date: Date) => void;
  currentUserName: string;
}

export default function Calendar({ records, currentMonth, onMonthChange, onDateClick, onDateLongPress, currentUserName }: CalendarProps) {
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


  const getCurrentUserRecord = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return records.find(r => r.date === dateStr && r.name === currentUserName);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={goToPreviousMonth}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary hover:bg-accent transition-all hover-lift focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="前の月へ"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {format(currentMonth, 'yyyy年M月', { locale: ja })}
          </h2>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary hover:bg-accent transition-all hover-lift focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="次の月へ"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <div 
            key={day} 
            className={`text-center font-semibold py-2 text-sm rounded-lg ${
              index === 0 ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 
              index === 6 ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 
              'text-muted-foreground bg-muted/50'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date) => {
          const currentUserRecord = getCurrentUserRecord(date);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isCurrentDay = isToday(date);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          
          let longPressTimer: NodeJS.Timeout;
          
          const handleMouseDown = () => {
            if (!isCurrentMonth) return;
            longPressTimer = setTimeout(() => {
              onDateLongPress(date);
            }, 500);
          };
          
          const handleMouseUp = () => {
            clearTimeout(longPressTimer);
          };
          
          const handleClick = () => {
            if (isCurrentMonth) {
              onDateClick(date);
            }
          };
          
          return (
            <button
              key={date.toISOString()}
              onClick={handleClick}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              disabled={!isCurrentMonth}
              className={`
                relative group rounded-lg aspect-square transition-all duration-300 ease-in-out
                ${!isCurrentMonth 
                  ? 'bg-muted/30 text-muted-foreground cursor-not-allowed opacity-40' 
                  : currentUserRecord && currentUserRecord.needsDinner
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 cursor-pointer hover:shadow-lg active:scale-95'
                  : 'bg-card border border-border hover:border-primary/50 cursor-pointer hover:shadow-lg active:scale-95'
                }
                ${isCurrentDay 
                  ? 'ring-2 ring-primary shadow-lg bg-gradient-to-br from-primary/10 to-pink-500/10' 
                  : ''
                }
                ${isWeekend && isCurrentMonth && !currentUserRecord ? 'bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/10 dark:to-blue-900/10' : ''}
              `}
              aria-label={`${format(date, 'M月d日')}${currentUserRecord ? '（晩ごはん必要）をクリックして削除、長押しで詳細表示' : 'をクリックして晩ごはん必要に設定、長押しで詳細表示'}`}
            >
              {/* スマホ版レイアウト：日付は左上、人数は右下 */}
              <div className="absolute inset-1 overflow-hidden sm:hidden">
                {/* 日付を左上に */}
                <div className={`absolute top-0 left-0 text-sm font-semibold leading-none ${
                  isCurrentDay ? 'text-primary' : 
                  !isCurrentMonth ? 'text-muted-foreground' : 'text-foreground'
                }`}>
                  {format(date, 'd')}
                </div>
                
                {/* 人数を右下に */}
                {isCurrentMonth && ((() => {
                  const needsDinnerCount = getRecordsForDate(date).filter(r => r.needsDinner).length;
                  const currentUserRecord = getCurrentUserRecord(date);
                  
                  if (needsDinnerCount > 0) {
                    return (
                      <div className="absolute bottom-0 right-0">
                        <div className={`text-xs font-semibold leading-none ${
                          currentUserRecord?.needsDinner 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {needsDinnerCount}人
                        </div>
                      </div>
                    );
                  }
                  return null;
                })())}
              </div>
              
              {/* PC版レイアウト：日付は左上、人数は中央 */}
              <div className="hidden sm:block absolute inset-1 overflow-hidden">
                {/* 日付を左上に */}
                <div className={`absolute top-0 left-0 text-sm font-semibold leading-none ${
                  isCurrentDay ? 'text-primary' : 
                  !isCurrentMonth ? 'text-muted-foreground' : 'text-foreground'
                }`}>
                  {format(date, 'd')}
                </div>
                
                {/* 人数を中央に */}
                {isCurrentMonth && ((() => {
                  const needsDinnerCount = getRecordsForDate(date).filter(r => r.needsDinner).length;
                  const currentUserRecord = getCurrentUserRecord(date);
                  
                  if (needsDinnerCount > 0) {
                    return (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`text-sm font-semibold leading-none truncate ${
                          currentUserRecord?.needsDinner 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {needsDinnerCount}人
                        </div>
                      </div>
                    );
                  }
                  return null;
                })())}
              </div>
              
              {isCurrentDay && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
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