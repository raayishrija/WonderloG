import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AuthPage.css'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, register, loading, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/explore'

  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    const result = mode === 'login'
      ? await login(email, password)
      : await register(email, password)
    if (!result.success) setError(result.error)
  }

  const fillTestCreds = () => {
    setEmail('eve.holt@reqres.in')
    setPassword('Shrija')
    setError('')
  }

  return (
    <div className="auth-page">
      {/* Left decorative panel */}
      <div className="auth-panel">
        <div className="auth-panel-content">
          <div className="panel-logo">✦</div>
          <h1 className="panel-title">Wander<br />Log</h1>
          <p className="panel-tagline">Your travel bucket list,<br />powered by real-world data.</p>
          <div className="panel-countries">
            {['🇯🇵', '🇮🇹', '🇧🇷', '🇳🇿', '🇲🇦', '🇮🇸', '🇵🇪', '🇬🇭'].map((flag, i) => (
              <span key={i} className="panel-flag" style={{ animationDelay: `${i * 0.1}s` }}>{flag}</span>
            ))}
          </div>
          <div className="panel-stats">
            <div className="panel-stat">
              <div className="panel-stat-num">250+</div>
              <div className="panel-stat-label">Countries</div>
            </div>
            <div className="panel-stat">
              <div className="panel-stat-num">∞</div>
              <div className="panel-stat-label">Adventures</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-form-wrap">
        <div className="auth-form-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError('') }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError('') }}
            >
              Sign Up
            </button>
          </div>

          <div className="auth-header">
            <h2>{mode === 'login' ? 'Welcome back' : 'Start your journey'}</h2>
            <p className="text-muted text-sm">
              {mode === 'login'
                ? 'Sign in to access your travel bucket list.'
                : 'Create an account and start tracking your travel dreams.'}
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-fields">
            <div className="field-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <span className="spinner" style={{width:18,height:18,borderWidth:2}} /> : null}
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-hint">
            <p className="text-sm text-muted">For demo, use the test credentials:</p>
            <button className="hint-btn" onClick={fillTestCreds}>
              Use <code>eve.holt@reqres.in</code> / Shrija
            </button>
            <p className="text-xs text-muted" style={{marginTop:6}}>
              Note: Reqres.in only accepts certain test emails for success responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}





