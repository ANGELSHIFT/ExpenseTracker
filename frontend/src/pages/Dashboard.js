import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { expenseAPI } from '../services/api';

import Calendar from '../components/Calendar';
import MonthlySummary from '../components/MonthlySummary';
import DailyTotal from '../components/DailyTotal';
import DailyExpenseList from '../components/DailyExpenseList';
import ExpenseForm from '../components/ExpenseForm';

function Dashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // ----- STATE -----
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ----- FETCH INITIAL DATA -----
  // We fetch ALL expenses once (or on refresh). The API handles user-isolation.
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await expenseAPI.list();
      setExpenses(res.data);
      setError('');
    } catch (err) {
      setError('Could not load expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ----- CALCULATE expensesByDate -----
  // Group expenses by YYYY-MM-DD for the calendar indicators
  const expensesByDate = useMemo(() => {
    const map = {};
    expenses.forEach(exp => {
      // exp.date is already YYYY-MM-DD
      const d = exp.date;
      if (!map[d]) map[d] = [];
      map[d].push(exp);
    });
    return map;
  }, [expenses]);

  // ----- HANDLERS -----
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  const handleChangeMonth = (newMonthDate) => {
    setCurrentMonth(newMonthDate);
  };

  const handleExpenseAdded = (newExpense) => {
    // Optimistically update the list so we don't have to fetch everything again
    // But to keep it simple and ensure we have correct IDs/timestamps, we can just fetch again
    // Or we can just append it:
    setExpenses(prev => [...prev, newExpense]);
  };

  const handleExpenseDeleted = (deletedId) => {
    setExpenses(prev => prev.filter(e => e.id !== deletedId));
  };

  // Helper to format JS Date into YYYY-MM-DD
  const formatDateToYMD = (date) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Get expenses for the specifically selected date
  const selectedDateYMD = formatDateToYMD(selectedDate);
  const selectedDateExpenses = expensesByDate[selectedDateYMD] || [];

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="header fade-in slide-down">
        <span className="header-title">Personal Expense Tracker</span>
        <button className="btn-outline" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        {loading ? (
          <p className="fade-in" style={{ textAlign: 'center', marginTop: '40px' }}>Loading expenses...</p>
        ) : error ? (
          <div className="form-error fade-in">{error}</div>
        ) : (
          <>
            {/* Monthly Summary (Top) */}
            <MonthlySummary 
              currentMonth={currentMonth} 
              expenses={expenses} 
            />

            <div className="dashboard-grid">
              
              {/* LEFT COLUMN: Calendar */}
              <div className="slide-up" style={{ animationDelay: '0.1s' }}>
                <Calendar 
                  currentMonth={currentMonth}
                  selectedDate={selectedDate}
                  expensesByDate={expensesByDate}
                  onSelectDate={handleSelectDate}
                  onChangeMonth={handleChangeMonth}
                />
              </div>

              {/* RIGHT COLUMN: Daily Info */}
              <div className="slide-up" style={{ animationDelay: '0.2s' }}>
                <DailyTotal 
                  selectedDate={selectedDate}
                  expenses={selectedDateExpenses}
                />

                <DailyExpenseList 
                  selectedDate={selectedDate}
                  expenses={selectedDateExpenses}
                  onDelete={handleExpenseDeleted}
                />

                <ExpenseForm 
                  selectedDate={selectedDate}
                  onSuccess={handleExpenseAdded}
                />
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
