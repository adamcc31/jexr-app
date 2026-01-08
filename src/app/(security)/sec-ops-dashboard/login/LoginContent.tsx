'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSecurityAuth } from '@/contexts/SecurityDashboardContext';

export default function LoginContent() {
  const router = useRouter();
  const { login, verifyTOTP, isAuthenticated, isLoading: authLoading } = useSecurityAuth();

  const [step, setStep] = useState<'credentials' | 'totp'>('credentials');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'online' | 'degraded' | 'offline'>('online');

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/sec-ops-dashboard/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(username, password);
      if (result.requiresTOTP) {
        setStep('totp');
      } else {
        router.push('/sec-ops-dashboard/dashboard');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(getReadableError(message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await verifyTOTP(username, password, totpCode);
      router.push('/sec-ops-dashboard/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'TOTP verification failed';
      setError(getReadableError(message));
    } finally {
      setIsLoading(false);
    }
  };

  const getReadableError = (message: string): string => {
    const errorMap: Record<string, string> = {
      'Login failed': 'Invalid credentials. Please check your username and password.',
      'TOTP verification failed': 'Invalid authentication code. Please try again.',
      'rate limit': 'Too many attempts. Please wait before trying again.',
      'network': 'Network error. Please check your connection.',
      'timeout': 'Request timed out. Please try again.',
    };

    for (const [key, value] of Object.entries(errorMap)) {
      if (message.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    return message;
  };

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Initializing secure connection...</p>
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
          }
          .loading-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid var(--sec-border);
            border-top-color: var(--sec-accent-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          p {
            color: var(--sec-text-secondary);
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="login-container">
      {/* Floating particles effect */}
      <div className="particles" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="particle" style={{ '--delay': `${i * 2}s`, '--duration': `${15 + i * 3}s` } as React.CSSProperties} />
        ))}
      </div>

      {/* System status banner */}
      <div className={`status-banner ${systemStatus}`}>
        <span className="status-dot" />
        <span className="status-text">
          {systemStatus === 'online' && 'All systems operational'}
          {systemStatus === 'degraded' && 'Degraded performance'}
          {systemStatus === 'offline' && 'System maintenance in progress'}
        </span>
      </div>

      <div className="login-card">
        {/* Security badge */}
        <div className="security-badge">
          <span className="badge-icon">🔒</span>
          <span className="badge-text">Secure Session</span>
        </div>

        <div className="login-header">
          <div className="logo-container">
            <div className="logo-shield">
              <span className="shield-icon">🛡️</span>
              <div className="shield-glow" />
            </div>
          </div>
          <h1>Security Operations Center</h1>
          <p className="login-subtitle">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="error-alert" role="alert">
            <span className="error-icon">⚠️</span>
            <div className="error-content">
              <span className="error-text">{error}</span>
            </div>
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">
                <span className="label-icon">👤</span>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="off"
                autoFocus
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon">🔑</span>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="off"
                disabled={isLoading}
              />
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="btn-spinner" />
                  Authenticating...
                </>
              ) : (
                <>
                  Continue to MFA
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTOTPSubmit} className="login-form">
            <div className="totp-info">
              <div className="totp-icon-container">
                <span className="totp-icon">📱</span>
              </div>
              <p>Enter the 6-digit code from your authenticator app</p>
            </div>

            <div className="form-group">
              <label htmlFor="totp">Authentication Code</label>
              <input
                id="totp"
                type="text"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                required
                autoComplete="off"
                autoFocus
                maxLength={6}
                pattern="[0-9]{6}"
                className="totp-input"
                disabled={isLoading}
              />
              <div className="totp-digits">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className={`digit ${totpCode[i] ? 'filled' : ''}`}>
                    {totpCode[i] || '·'}
                  </span>
                ))}
              </div>
            </div>

            <button type="submit" className="login-button" disabled={isLoading || totpCode.length !== 6}>
              {isLoading ? (
                <>
                  <span className="btn-spinner" />
                  Verifying...
                </>
              ) : (
                <>
                  <span className="btn-lock">🔓</span>
                  Verify & Sign In
                </>
              )}
            </button>

            <button
              type="button"
              className="back-button"
              onClick={() => {
                setStep('credentials');
                setTotpCode('');
                setError('');
              }}
              disabled={isLoading}
            >
              ← Back to credentials
            </button>
          </form>
        )}

        <div className="login-footer">
          <div className="security-notice">
            <span className="notice-icon">🔐</span>
            <span>All access attempts are logged and monitored</span>
          </div>
          <div className="encryption-badge">
            <span className="encryption-icon">🔒</span>
            <span>256-bit TLS encrypted</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          z-index: 1;
        }

        /* Floating particles */
        .particles {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--sec-accent-primary);
          border-radius: 50%;
          opacity: 0.3;
          animation: float var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }

        .particle:nth-child(1) { left: 10%; top: 20%; }
        .particle:nth-child(2) { left: 80%; top: 40%; }
        .particle:nth-child(3) { left: 30%; top: 70%; }
        .particle:nth-child(4) { left: 60%; top: 10%; }
        .particle:nth-child(5) { left: 90%; top: 80%; }
        .particle:nth-child(6) { left: 5%; top: 50%; }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-30px) translateX(15px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-40px) translateX(5px);
            opacity: 0.5;
          }
        }

        /* Status banner */
        .status-banner {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          z-index: 10;
        }

        .status-banner.online {
          background: rgba(82, 196, 26, 0.15);
          border: 1px solid rgba(82, 196, 26, 0.3);
          color: #52C41A;
        }

        .status-banner.degraded {
          background: rgba(250, 173, 20, 0.15);
          border: 1px solid rgba(250, 173, 20, 0.3);
          color: #FAAD14;
        }

        .status-banner.offline {
          background: rgba(255, 77, 79, 0.15);
          border: 1px solid rgba(255, 77, 79, 0.3);
          color: #FF4D4F;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* Login card */
        .login-card {
          position: relative;
          background: rgba(14, 17, 23, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid var(--sec-border);
          border-radius: 20px;
          padding: 48px 40px;
          width: 100%;
          max-width: 440px;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(0, 180, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        /* Security badge */
        .security-badge {
          position: absolute;
          top: -12px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--sec-bg-primary);
          border: 1px solid rgba(82, 196, 26, 0.3);
          border-radius: 20px;
          font-size: 11px;
          color: #52C41A;
        }

        .badge-icon {
          font-size: 12px;
        }

        /* Header */
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-container {
          margin-bottom: 20px;
        }

        .logo-shield {
          position: relative;
          display: inline-block;
        }

        .shield-icon {
          font-size: 56px;
          display: block;
          animation: shield-pulse 3s ease-in-out infinite;
        }

        @keyframes shield-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .shield-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, var(--sec-glow-primary) 0%, transparent 70%);
          animation: glow-pulse 3s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        .login-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: var(--sec-text-primary);
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .login-subtitle {
          color: var(--sec-text-secondary);
          font-size: 14px;
          margin: 0;
        }

        /* Error alert */
        .error-alert {
          display: flex;
          gap: 12px;
          padding: 14px 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 10px;
          margin-bottom: 24px;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }

        .error-icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        .error-text {
          color: #ef4444;
          font-size: 13px;
          line-height: 1.5;
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--sec-text-secondary);
        }

        .label-icon {
          font-size: 14px;
        }

        .form-group input {
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--sec-border);
          border-radius: 10px;
          color: var(--sec-text-primary);
          font-size: 15px;
          font-family: var(--font-primary);
          transition: all 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--sec-accent-primary);
          background: rgba(0, 180, 255, 0.03);
          box-shadow: 0 0 0 3px rgba(0, 180, 255, 0.1);
        }

        .form-group input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-group input::placeholder {
          color: var(--sec-text-muted);
        }

        /* TOTP Input */
        .totp-info {
          text-align: center;
          padding: 20px;
          background: rgba(0, 180, 255, 0.08);
          border: 1px solid rgba(0, 180, 255, 0.15);
          border-radius: 12px;
        }

        .totp-icon-container {
          margin-bottom: 12px;
        }

        .totp-icon {
          font-size: 36px;
        }

        .totp-info p {
          margin: 0;
          color: var(--sec-text-secondary);
          font-size: 14px;
        }

        .totp-input {
          text-align: center;
          font-size: 28px !important;
          letter-spacing: 12px;
          font-family: var(--font-mono) !important;
          color: transparent !important;
          caret-color: var(--sec-accent-primary);
        }

        .totp-digits {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: -48px;
          pointer-events: none;
        }

        .digit {
          width: 40px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-family: var(--font-mono);
          color: var(--sec-text-muted);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--sec-border);
          border-radius: 8px;
          transition: all 0.2s;
        }

        .digit.filled {
          color: var(--sec-accent-primary);
          border-color: var(--sec-accent-primary);
          background: rgba(0, 180, 255, 0.08);
        }

        /* Buttons */
        .login-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 24px;
          background: linear-gradient(135deg, var(--sec-accent-primary), var(--sec-accent-tertiary));
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: var(--font-primary);
          cursor: pointer;
          transition: all 0.3s;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 
            0 10px 30px -10px rgba(0, 180, 255, 0.5),
            0 0 20px rgba(0, 180, 255, 0.3);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .btn-arrow {
          transition: transform 0.2s;
        }

        .login-button:hover:not(:disabled) .btn-arrow {
          transform: translateX(4px);
        }

        .back-button {
          padding: 14px;
          background: transparent;
          border: 1px solid var(--sec-border);
          border-radius: 10px;
          color: var(--sec-text-secondary);
          font-size: 14px;
          font-family: var(--font-primary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.03);
          color: var(--sec-text-primary);
        }

        .back-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Footer */
        .login-footer {
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .security-notice, .encryption-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: var(--sec-text-muted);
        }

        .notice-icon, .encryption-icon {
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
