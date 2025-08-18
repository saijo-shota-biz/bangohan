'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import TimeSelector from './TimeSelector';

interface TimeSelectorModalProps {
  date: Date;
  userName: string;
  defaultTime?: string;
  onClose: () => void;
  onConfirm: (time: string) => void;
}

export default function TimeSelectorModal({ 
  date, 
  userName, 
  defaultTime,
  onClose, 
  onConfirm 
}: TimeSelectorModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(defaultTime);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (defaultTime) {
      setSelectedTime(defaultTime);
    }
  }, [defaultTime]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleConfirm = () => {
    if (selectedTime) {
      onConfirm(selectedTime);
      handleClose();
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
        isVisible ? 'bg-amber-900/60 backdrop-blur-sm' : 'bg-amber-900/0'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`glass-effect rounded-3xl max-w-md w-full transition-all duration-300 ease-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold gradient-text mb-1">
                {format(date, 'M月d日(E)', { locale: ja })}
              </h2>
              <p className="text-amber-700 text-sm">
                {userName}さんの帰宅時間
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

          <TimeSelector 
            selectedTime={selectedTime}
            onTimeSelect={setSelectedTime}
          />

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleClose}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-800 font-medium transition-all hover-lift"
            >
              キャンセル
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedTime}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all hover-lift ${
                selectedTime 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              登録
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}