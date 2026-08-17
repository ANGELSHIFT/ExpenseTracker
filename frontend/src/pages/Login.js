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
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading]       = useState(false);

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setSuccessMsg('');
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

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
        <p className="login-subtitle">
          {isRegister ? 'Create a new account' : 'Login to your account'}
        </p>

        {error && <div className="form-error">{error}</div>}
        {successMsg && <div className="form-success">{successMsg}</div>}

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
            style={{ width: '100%', marginTop: '15px' }}
          >
            {loading ? (isRegister ? 'Creating Account...' : 'Logging in...') : (isRegister ? 'Sign Up' : 'Login')}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
          <span>{isRegister ? 'Already have an account?' : "Don't have an account?"} </span>
          <button
            type="button"
            onClick={toggleMode}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontWeight: '600',
              padding: '0 5px'
            }}
          >
            {isRegister ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
