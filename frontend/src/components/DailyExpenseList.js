import React, { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';

function DailyExpenseList({ selectedDate, expenses, onDelete }) {
  const [animationClass, setAnimationClass] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    // Re-trigger entrance animation when selectedDate changes
    setAnimationClass('');
    setTimeout(() => setAnimationClass('fade-in'), 10);
  }, [selectedDate]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await expenseAPI.destroy(id);
      if (onDelete) onDelete(id);
    } catch {
      alert("Could not delete expense.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatAmount = (val) => {
    return parseFloat(val).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Sort expenses by created_at time so they show chronologically
  // The API returns them ordered by '-date', '-created_at', we want oldest first for the day
  // Wait, if it's a daily list, chronological is typically oldest -> newest or newest -> oldest. 
  // Let's sort oldest -> newest (created_at ascending).
  const sortedExpenses = [...expenses].sort((a, b) => {
    return new Date(a.created_at) - new Date(b.created_at);
  });

  // Extract time from created_at (since there is no time field)
  const formatTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`daily-expenses ${animationClass}`}>
      {sortedExpenses.length === 0 ? (
        <div className="card no-expenses">
          No expenses recorded for this day.
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sortedExpenses.map((exp, index) => (
                  <tr 
                    key={exp.id} 
                    className={`expense-row ${deletingId === exp.id ? 'deleting' : ''}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td style={{ whiteSpace: 'nowrap', color: '#666' }}>{formatTime(exp.created_at)}</td>
                    <td>{exp.category}</td>
                    <td style={{ color: '#444' }}>{exp.description || '—'}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap', fontWeight: '600' }}>
                      ₹{formatAmount(exp.amount)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn-outline" 
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        onClick={() => handleDelete(exp.id)}
                        disabled={deletingId === exp.id}
                      >
                        {deletingId === exp.id ? '...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyExpenseList;
