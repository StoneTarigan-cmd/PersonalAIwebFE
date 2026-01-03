import React from 'react';

const Calendar: React.FC = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 35 }, (_, i) => i - 2); // Mulai dari hari sebelum tanggal 1
  const today = 23;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">October 2022</h3>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-600 mb-2">
        {days.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {dates.map(date => (
          <div
            key={date}
            className={`p-2 rounded cursor-pointer transition-colors ${
              date === today
                ? 'bg-blue-500 text-white font-semibold'
                : date > 0 && date <= 31
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-300'
            }`}
          >
            {date > 0 && date <= 31 ? date : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;