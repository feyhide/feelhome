import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

const SetCalender = ({ onAddBookingDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null); // Track hovered date for in-range highlighting

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
    const startDateObj = startOfWeek(monthStart);
    const endDateObj = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDateObj, end: endDateObj });

    return (
      <div className="grid grid-cols-7">
        {days.map(day => {
          const isStart = isSameDay(day, startDate);
          const isEnd = isSameDay(day, endDate);
          const isInRange = startDate && endDate && day > startDate && day < endDate;

          let cellClass = 'py-1 text-center rounded-lg cursor-pointer';
          if (!isSameMonth(day, currentDate)) {
            cellClass += ' text-gray-400';
          } else if (isStart || isEnd) {
            cellClass += ' bg-black text-white';
          } else if (isInRange || (startDate && hoverDate && day > startDate && day <= hoverDate)) {
            cellClass += ' bg-gray-400 text-white';
          }

          return (
            <div
              key={day.toISOString()}
              className={cellClass}
              onClick={() => handleDateClick(day)}
              onMouseEnter={() => handleDateHover(day)}
              onMouseLeave={() => setHoverDate(null)}
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
    if (!startDate) {
      setStartDate(day);
    } else if (!endDate && day > startDate) {
      setEndDate(day);
      onAddBookingDate(startDate, day); // Notify parent component with selected dates
      setStartDate(null);
      setEndDate(null);
    } else {
      setStartDate(day);
      setEndDate(null);
    }
  };

  const handleDateHover = day => {
    if (startDate && !endDate && day > startDate) {
      setHoverDate(day);
    }
  };

  return (
    <div className="w-[300px] h-full bg-white flex flex-col p-2 rounded border shadow-lg">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}
    </div>
  );
};

export default SetCalender;
