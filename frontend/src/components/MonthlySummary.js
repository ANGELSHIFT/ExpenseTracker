import React, { useEffect, useState } from 'react';

function MonthlySummary({ currentMonth, expenses }) {
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // Filter expenses that belong to the current month & year
    const targetYear = currentMonth.getFullYear();
    const targetMonth = currentMonth.getMonth(); // 0-11

    const monthlyExpenses = expenses.filter(exp => {
      // Create a local date from the string YYYY-MM-DD
      const expDate = new Date(exp.date + 'T00:00:00');
      return expDate.getFullYear() === targetYear && expDate.getMonth() === targetMonth;
    });

    const sum = monthlyExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    setTotal(sum);
    setCount(monthlyExpenses.length);

    // Trigger subtle animation
    setAnimationClass('');
    setTimeout(() => setAnimationClass('fade-in'), 10);
  }, [currentMonth, expenses]);

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  const monthName = monthNames[currentMonth.getMonth()];
  const year = currentMonth.getFullYear();

  const formatAmount = (val) => {
    return val.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className={`monthly-card slide-up ${animationClass}`}>
      <div className="monthly-label">TOTAL SPENT THIS MONTH</div>
      <div className="monthly-amount">₹{formatAmount(total)}</div>
      <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
        {monthName} {year} &nbsp;|&nbsp; {count} expenses
      </div>
    </div>
  );
}

export default MonthlySummary;
