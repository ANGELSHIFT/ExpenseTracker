import React, { useState, useEffect, useCallback } from 'react';
import { expenseAPI } from '../services/api';

// ExpenseList shows all expenses for the logged-in user in a simple table
// refreshTrigger: when this changes (from the parent), we re-fetch the list
// onDelete: called after a delete, so the parent can refresh the monthly total
function ExpenseList({ refreshTrigger, onDelete }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [deletingId, setDeletingId] = useState(null); // which row is being deleted

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await expenseAPI.list();
      setExpenses(res.data);
    } catch {
      setError('Could not load expenses.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch whenever the parent tells us to refresh
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses, refreshTrigger]);

  // Delete a single expense
  async function handleDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this expense?');
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await expenseAPI.destroy(id);
      // Remove from local state immediately (no need to re-fetch)
      setExpenses(prev => prev.filter(e => e.id !== id));
      // Tell parent to refresh the monthly total too
      if (onDelete) onDelete();
    } catch {
      alert('Could not delete expense. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  // Format a date string like "2026-08-14" into "14 Aug"
  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  // Format amount: 8250 -> 8,250.00
  function formatAmount(val) {
    return parseFloat(val).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="card">
      <div className="section-title">Recent Expenses</div>

      {loading && <p className="loading-text">Loading expenses...</p>}
      {error   && <p className="error-text">{error}</p>}

      {!loading && !error && expenses.length === 0 && (
        <p className="no-expenses">No expenses found.</p>
      )}

      {!loading && !error && expenses.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(exp.date)}</td>
                  <td>{exp.category}</td>
                  <td style={{ color: '#444' }}>{exp.description || '—'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>₹{formatAmount(exp.amount)}</td>
                  <td>
                    <button
                      className="btn-outline"
                      onClick={() => handleDelete(exp.id)}
                      disabled={deletingId === exp.id}
                      aria-label={`Delete expense ${exp.id}`}
                    >
                      {deletingId === exp.id ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
