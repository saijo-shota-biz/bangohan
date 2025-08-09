'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { DinnerRecord } from '@/lib/types';
import { addDinnerRecord } from '@/lib/firestore';

interface DinnerModalProps {
  calendarId: string;
  date: Date;
  records: DinnerRecord[];
  onClose: () => void;
}

export default function DinnerModal({ calendarId, date, records, onClose }: DinnerModalProps) {
  const [name, setName] = useState('');
  const [needsDinner, setNeedsDinner] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await addDinnerRecord(
        calendarId,
        format(date, 'yyyy-MM-dd'),
        name.trim(),
        needsDinner
      );
      setName('');
      setNeedsDinner(true);
    } catch (error) {
      console.error('記録の追加に失敗しました:', error);
      alert('記録の追加に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`glass-effect rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden transition-all duration-300 ease-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* ヘッダー */}
        <div className="sticky top-0 glass-effect border-b border-white/10 p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold gradient-text">
                  {format(date, 'M月d日(E)', { locale: ja })}
                </h2>
              </div>
              <p className="text-muted-foreground text-sm">
                晩ごはんの予定を入力・確認しましょう
              </p>
            </div>
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary hover:bg-accent transition-all hover-lift"
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
            {/* 既存の記録 */}
            {records.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  現在の予定 ({records.length}人)
                </h3>
                <div className="space-y-3">
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className={`group p-4 rounded-2xl transition-all duration-200 ${
                        record.needsDinner 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800' 
                          : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            record.needsDinner ? 'bg-green-400' : 'bg-red-400'
                          }`}></div>
                          <span className="font-semibold text-foreground">{record.name}</span>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          record.needsDinner 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' 
                            : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                        }`}>
                          <span>{record.needsDinner ? '⭕' : '❌'}</span>
                          <span>{record.needsDinner ? 'いる' : 'いらない'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 新規追加フォーム */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  お名前
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例: パパ、ママ、長女"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  晩ごはんは必要ですか？
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    needsDinner 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-border bg-background hover:border-green-200'
                  }`}>
                    <input
                      type="radio"
                      checked={needsDinner}
                      onChange={() => setNeedsDinner(true)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-2xl mb-1">⭕</div>
                      <div className={`font-medium ${needsDinner ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'}`}>
                        いる
                      </div>
                    </div>
                    {needsDinner && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>

                  <label className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    !needsDinner 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-border bg-background hover:border-red-200'
                  }`}>
                    <input
                      type="radio"
                      checked={!needsDinner}
                      onChange={() => setNeedsDinner(false)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-2xl mb-1">❌</div>
                      <div className={`font-medium ${!needsDinner ? 'text-red-700 dark:text-red-300' : 'text-muted-foreground'}`}>
                        いらない
                      </div>
                    </div>
                    {!needsDinner && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover-lift focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    追加中...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    追加する
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}