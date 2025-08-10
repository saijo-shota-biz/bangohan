'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { DinnerRecord } from '@/lib/types';

interface DinnerModalProps {
  date: Date;
  records: DinnerRecord[];
  currentUserName: string;
  onClose: () => void;
}

export default function DinnerModal({ date, records, currentUserName, onClose }: DinnerModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };



  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'bg-amber-900/60 backdrop-blur-sm' : 'bg-amber-900/0'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`glass-effect rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden transition-all duration-300 ease-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* ヘッダー */}
        <div className="sticky top-0 glass-effect border-b border-amber-200/50 p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold gradient-text">
                  {format(date, 'M月d日(E)', { locale: ja })}
                </h2>
              </div>
              <p className="text-amber-700 text-sm">
                晩ごはんが必要な人を確認しましょう
              </p>
            </div>
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-800 transition-all hover-lift"
              aria-label="閉じる"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* 現在の予定一覧 */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-amber-800">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
晩ごはんが必要な人 ({records.filter(r => r.needsDinner).length}人)
              </h3>
              
              {records.length === 0 ? (
                <div className="text-center py-12 text-amber-600">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>この日は晩ごはんが必要な人がいません</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {records.filter(r => r.needsDinner).map((record) => {
                    const isCurrentUser = record.name === currentUserName;
                    return (
                      <div
                        key={record.id}
                        className={`group p-4 rounded-2xl transition-all duration-200 bg-orange-50 dark:bg-orange-900/20 ${
                          isCurrentUser ? 'ring-2 ring-orange-200 dark:ring-orange-800' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                            <span className="font-semibold text-amber-900 flex items-center gap-2">
                              {record.name}
                              {isCurrentUser && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 text-xs font-medium rounded-full">
                                  あなた
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-orange-700 dark:text-orange-300">
                              必要
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}