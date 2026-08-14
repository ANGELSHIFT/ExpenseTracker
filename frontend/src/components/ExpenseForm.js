import React, { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';

const CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Education', 
  'Entertainment', 'Bills', 'Other'
];

function ExpenseForm({ selectedDate, onSuccess }) {
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');

  const formatDateToYMD = (date) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const [form, setForm] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: formatDateToYMD(selectedDate) || formatDateToYMD(new Date())
  });

  // When selected date changes, update the form date if not interacting
  useEffect(() => {
    if (!expanded && selectedDate) {
      setForm(prev => ({ ...prev, date: formatDateToYMD(selectedDate) }));
    }
  }, [selectedDate, expanded]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!form.amount || parseFloat(form.amount) <= 0) {
      setMessage('Amount must be a positive number.');
      setMsgType('error');
      return;
    }
    if (!form.date) {
      setMessage('Date is required.');
      setMsgType('error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await expenseAPI.create({
        amount: parseFloat(form.amount),
        category: form.category,
        description: form.description,
        date: form.date
      });
      
      // Reset form but keep the selected date
      setForm(prev => ({
        ...prev,
        amount: '',
        description: '',
        category: 'Food'
      }));
      
      setExpanded(false); // Close form
      
      // We could show a success message via a toast, but keeping it simple as requested
      // We will let the parent update data and trigger animations
      if (onSuccess) onSuccess(response.data);
      
    } catch (err) {
      setMessage('Could not add expense.');
      setMsgType('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!expanded) {
    return (
      <div className="add-expense-container">
        <button 
          className="expand-form-btn slide-up"
          onClick={() => setExpanded(true)}
        >
          + Add Expense
        </button>
      </div>
    );
  }

  return (
    <div className="add-expense-container">
      <div className="expense-form-card">
        <h2>Add Expense</h2>
        
        {message && (
          <div className={msgType === 'error' ? 'form-error' : 'form-success'}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="form-amount">Amount (₹)</label>
            <input
              id="form-amount"
              type="number"
              name="amount"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="e.g. 250"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="form-category">Category</label>
            <select
              id="form-category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="form-description">Description</label>
            <input
              id="form-description"
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Lunch"
            />
          </div>

          <div className="form-group">
            <label htmlFor="form-date">Date</label>
            <input
              id="form-date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-outline" 
              onClick={() => { setExpanded(false); setMessage(''); }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-black"
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseForm;
