'use client';

interface TimeSelectorProps {
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  inline?: boolean;
}

const DINNER_TIMES = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

export default function TimeSelector({ selectedTime, onTimeSelect, inline = false }: TimeSelectorProps) {
  return (
    <div className={`${inline ? '' : 'p-4'}`}>
      {!inline && (
        <p className="text-sm text-amber-700 mb-3">帰宅時間を選択してください</p>
      )}
      <div className="grid grid-cols-3 gap-2">
        {DINNER_TIMES.map((time) => (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className={`
              py-2 px-3 rounded-lg font-medium transition-all
              ${selectedTime === time
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
              }
            `}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}