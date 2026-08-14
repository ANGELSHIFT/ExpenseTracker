import React, { useState, useEffect } from 'react';

function Calendar({ currentMonth, selectedDate, expensesByDate, onSelectDate, onChangeMonth }) {
  const [animationClass, setAnimationClass] = useState('');

  // Helper to format Date to YYYY-MM-DD (local timezone)
  const formatDateToYMD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setAnimationClass('');
    setTimeout(() => {
      onChangeMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
      setAnimationClass('calendar-month-transition');
    }, 10);
  };

  const handleNextMonth = () => {
    setAnimationClass('');
    setTimeout(() => {
      onChangeMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
      setAnimationClass('calendar-month-transition');
    }, 10);
  };

  const renderCells = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const cells = [];
    
    // Blank cells before first day
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-date empty"></div>);
    }

    const todayYMD = formatDateToYMD(new Date());
    const selectedYMD = selectedDate ? formatDateToYMD(selectedDate) : null;

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const currentDateYMD = formatDateToYMD(currentDate);
      
      const isToday = currentDateYMD === todayYMD;
      const isSelected = currentDateYMD === selectedYMD;
      const hasExpense = expensesByDate[currentDateYMD] && expensesByDate[currentDateYMD].length > 0;

      let className = 'calendar-date';
      if (isToday) className += ' today';
      if (isSelected) className += ' selected';

      cells.push(
        <div
          key={`day-${day}`}
          className={className}
          onClick={() => onSelectDate(currentDate)}
        >
          {day}
          {hasExpense && <span className="expense-dot"></span>}
        </div>
      );
    }
    
    return cells;
  };

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  return (
    <div className="card calendar-container">
      <div className="calendar-header">
        <button className="calendar-nav" onClick={handlePrevMonth}>&lt;</button>
        <span>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
        <button className="calendar-nav" onClick={handleNextMonth}>&gt;</button>
      </div>

      <div className={`calendar-grid ${animationClass}`}>
        <div className="calendar-day-name">SUN</div>
        <div className="calendar-day-name">MON</div>
        <div className="calendar-day-name">TUE</div>
        <div className="calendar-day-name">WED</div>
        <div className="calendar-day-name">THU</div>
        <div className="calendar-day-name">FRI</div>
        <div className="calendar-day-name">SAT</div>
        
        {renderCells()}
      </div>
    </div>
  );
}

export default Calendar;
