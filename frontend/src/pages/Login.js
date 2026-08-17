import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername]     = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const setMode = (registerMode) => {
    setIsRegister(registerMode);
    setError('');
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    if (isRegister && password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);

    if (isRegister) {
      const result = await register(username.trim(), password);
      setLoading(false);

      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error || 'Registration failed. Try a different username.');
      }
    } else {
      const result = await login(username.trim(), password);
      setLoading(false);

      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error || 'Invalid username or password.');
      }
    }
  }

  return (
    <div className="login-page">
      <div className="login-box slide-up">
        <h1>Personal Expense Tracker</h1>
        
        {/* Navigation Tabs for Login / Sign Up */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #eee',
          marginBottom: '20px',
          marginTop: '15px'
        }}>
          <button
            type="button"
            onClick={() => setMode(false)}
            style={{
              flex: 1,
              padding: '10px 0',
              background: 'none',
              border: 'none',
              borderBottom: !isRegister ? '2px solid #000' : '2px solid transparent',
              fontWeight: !isRegister ? '700' : '500',
              color: !isRegister ? '#000' : '#888',
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode(true)}
            style={{
              flex: 1,
              padding: '10px 0',
              background: 'none',
              border: 'none',
              borderBottom: isRegister ? '2px solid #000' : '2px solid transparent',
              fontWeight: isRegister ? '700' : '500',
              color: isRegister ? '#000' : '#888',
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            Sign Up
          </button>
        </div>

        <p className="login-subtitle" style={{ marginBottom: '16px' }}>
          {isRegister ? 'Create a new user account' : 'Sign in to access your expenses'}
        </p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-username">Username</label>
            <input
              id="login-username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </div>

          <button
            id="login-btn"
            type="submit"
            className="btn-black"
            disabled={loading}
            style={{ width: '100%', marginTop: '10px' }}
          >
            {loading ? (isRegister ? 'Creating Account...' : 'Logging in...') : (isRegister ? 'Create Account & Login' : 'Login')}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.88rem', color: '#555' }}>
          <span>{isRegister ? 'Already have an account?' : "Don't have an account?"} </span>
          <button
            type="button"
            onClick={() => setMode(!isRegister)}
            style={{
              background: 'none',
              border: 'none',
              color: '#000',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontWeight: '700',
              padding: '0 4px'
            }}
          >
            {isRegister ? 'Click to Login' : 'Click to Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
