import React, { useState, useEffect, useCallback } from 'react';
import { expenseAPI } from '../services/api';

// Shows the total amount spent in the current calendar month
// refreshTrigger is a number passed from the parent — when it changes, we re-fetch
function MonthlyTotal({ refreshTrigger }) {
  const [data, setData] = useState(null);   // { month, total }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTotal = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await expenseAPI.monthlyTotal();
      setData(res.data);
    } catch {
      setError('Could not load monthly total.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch whenever the parent signals a refresh
  useEffect(() => {
    fetchTotal();
  }, [fetchTotal, refreshTrigger]);

  // Format number as Indian currency style: 8250 -> 8,250
  function formatAmount(val) {
    const num = parseFloat(val || 0);
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="monthly-card">
      <div className="monthly-label">Total Spent This Month</div>

      {loading && <p className="loading-text">Loading...</p>}
      {error   && <p className="error-text">{error}</p>}

      {!loading && !error && data && (
        <>
          <div className="monthly-amount">₹{formatAmount(data.total)}</div>
          <div className="monthly-month">{data.month}</div>
        </>
      )}
    </div>
  );
}

export default MonthlyTotal;
