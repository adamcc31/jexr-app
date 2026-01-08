'use client';

// Prevent static generation - requires runtime context
export const dynamic = 'force-dynamic';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSecurityAuth } from '@/contexts/SecurityDashboardContext';

export default function SecurityLoginPage() {
  const router = useRouter();
  const { login, verifyTOTP } = useSecurityAuth();

  const [step, setStep] = useState<'credentials' | 'totp'>('credentials');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      setError(err instanceof Error ? err.message : 'Login failed');
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
      setError(err instanceof Error ? err.message : 'TOTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="security-icon">🔒</div>
          <h1>Security Operations Center</h1>
          <p className="login-subtitle">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="error-alert">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="off"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="off"
              />
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Continue to MFA'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTOTPSubmit} className="login-form">
            <div className="totp-info">
              <span className="totp-icon">📱</span>
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
              />
            </div>

            <button type="submit" className="login-button" disabled={isLoading || totpCode.length !== 6}>
              {isLoading ? 'Verifying...' : 'Verify & Sign In'}
            </button>

            <button
              type="button"
              className="back-button"
              onClick={() => {
                setStep('credentials');
                setTotpCode('');
                setError('');
              }}
            >
              ← Back to credentials
            </button>
          </form>
        )}

        <div className="login-footer">
          <p>🔐 All access attempts are logged and monitored</p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .security-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .login-header h1 {
          font-size: 24px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 8px 0;
        }

        .login-subtitle {
          color: var(--sec-text-muted);
          font-size: 14px;
          margin: 0;
        }

        .error-alert {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 24px;
          color: #ef4444;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

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
          font-size: 14px;
          font-weight: 500;
          color: var(--sec-text);
        }

        .form-group input {
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #fff;
          font-size: 16px;
          transition: all 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--sec-primary);
          box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
        }

        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .totp-input {
          text-align: center;
          font-size: 32px !important;
          letter-spacing: 8px;
          font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
        }

        .totp-info {
          text-align: center;
          padding: 16px;
          background: rgba(0, 212, 255, 0.1);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .totp-icon {
          font-size: 32px;
        }

        .totp-info p {
          margin: 0;
          color: var(--sec-text-muted);
          font-size: 14px;
        }

        .login-button {
          padding: 14px 24px;
          background: linear-gradient(135deg, var(--sec-primary), var(--sec-secondary));
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 20px -10px rgba(0, 212, 255, 0.5);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .back-button {
          padding: 12px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: var(--sec-text-muted);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .login-footer {
          margin-top: 32px;
          text-align: center;
        }

        .login-footer p {
          margin: 0;
          color: var(--sec-text-muted);
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
