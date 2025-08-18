'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { DinnerRecord } from '@/lib/types';

interface TodaysDinnerProps {
  records: DinnerRecord[];
}

export default function TodaysDinner({ records }: TodaysDinnerProps) {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const todayRecords = records.filter(r => r.date === todayStr && r.needsDinner);
  
  if (todayRecords.length === 0) {
    return (
      <div className="glass-effect rounded-2xl p-4 animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-400 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-amber-900">
              今日の晩ごはん
            </h2>
            <p className="text-xs text-amber-600">
              {format(today, 'M月d日(E)', { locale: ja })}
            </p>
          </div>
        </div>
        
        <div className="text-center py-6 text-amber-600">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">今日は晩ごはんの予定がありません</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="glass-effect rounded-2xl p-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-400 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="font-bold text-amber-900">
            今日の晩ごはん
          </h2>
          <p className="text-xs text-amber-600">
            {format(today, 'M月d日(E)', { locale: ja })} • {todayRecords.length}人
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        {todayRecords
          .sort((a, b) => {
            const timeA = a.dinnerTime || '99:99';
            const timeB = b.dinnerTime || '99:99';
            return timeA.localeCompare(timeB);
          })
          .map((record, index) => (
          <div key={record.id || index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span className="font-medium text-amber-900">{record.name}</span>
            <span className="text-sm text-amber-700 ml-auto">
              {record.dinnerTime || '時間未定'}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-amber-100 rounded-xl">
        <div className="flex items-center gap-2 text-sm text-amber-800">
          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">
            今日は{todayRecords.length}人分の晩ごはんを準備
          </span>
        </div>
      </div>
    </div>
  );
}