import React, { useEffect, useState } from 'react';

function DailyTotal({ selectedDate, expenses }) {
  const [total, setTotal] = useState(0);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // Calculate total for the selected date
    const sum = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    setTotal(sum);

    // Trigger subtle animation on change
    setAnimationClass('');
    setTimeout(() => setAnimationClass('fade-in'), 10);
  }, [selectedDate, expenses]);

  const formatAmount = (val) => {
    return val.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formattedDate = selectedDate ? selectedDate.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  }) : '';

  return (
    <div className={`card daily-total-card ${animationClass}`}>
      <div className="daily-total-label">TOTAL SPENT ON {formattedDate.toUpperCase()}</div>
      <div className="daily-total-amount">₹{formatAmount(total)}</div>
    </div>
  );
}

export default DailyTotal;
