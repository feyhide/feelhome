import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval } from 'date-fns';

const Calendar = ({ bookingDates }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button className="px-2 py-1" onClick={prevMonth}>Prev</button>
        <div className="text-lg font-semibold">{format(currentDate, 'MMMM yyyy')}</div>
        <button className="px-2 py-1" onClick={nextMonth}>Next</button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7">
        {daysOfWeek.map(day => (
          <div key={day} className="w-full text-center font-semibold">{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7">
        {days.map(day => {
          // Check if the day is within any booking date range
          const isWithinBookingRange = bookingDates.some(booking => {
            const bookingStartDate = new Date(booking.startDate);
            const bookingEndDate = new Date(booking.endDate);
            return isWithinInterval(day, { start: bookingStartDate, end: bookingEndDate });
          });

          // Apply different classes based on conditions
          const cellClasses = `
            py-1 text-center rounded-lg cursor-pointer
            ${!isSameMonth(day, currentDate) ? 'text-gray-400' : ''}
            ${isSameDay(day, new Date()) ? 'bg-black text-white' : ''}
            ${isWithinBookingRange ? 'bg-slate-200 text-white' : ''}
          `;

          return (
            <div
              key={day.toISOString()}
              className={cellClasses.trim()}
              onClick={() => handleDateClick(day)}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
    );
  };

  const nextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const handleDateClick = day => {
    console.log('Clicked on date:', day);
  };

  return (
    <div className="w-[300px] h-full bg-white flex flex-col p-2 rounded border shadow-lg">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
