'use client';

import React from 'react';

interface ErrorPanelProps {
    title?: string;
    message: string;
    details?: string[];
    onRetry?: () => void;
    onReauth?: () => void;
    timestamp?: Date;
    isRetrying?: boolean;
}

export default function ErrorPanel({
    title = 'Failed to Load Data',
    message,
    details,
    onRetry,
    onReauth,
    timestamp,
    isRetrying = false,
}: ErrorPanelProps) {
    return (
        <>
            <div className="error-panel">
                <div className="error-icon-container">
                    <span className="error-icon">⚠️</span>
                </div>
                <div className="error-content">
                    <h4 className="error-title">{title}</h4>
                    <p className="error-message">{message}</p>

                    {details && details.length > 0 && (
                        <div className="error-details">
                            <p className="details-label">This may indicate:</p>
                            <ul>
                                {details.map((detail, idx) => (
                                    <li key={idx}>{detail}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="error-actions">
                        {onRetry && (
                            <button
                                className="action-btn retry-btn"
                                onClick={onRetry}
                                disabled={isRetrying}
                            >
                                {isRetrying ? (
                                    <>
                                        <span className="spinner" />
                                        Retrying...
                                    </>
                                ) : (
                                    <>🔄 Retry</>
                                )}
                            </button>
                        )}
                        {onReauth && (
                            <button className="action-btn reauth-btn" onClick={onReauth}>
                                🔐 Re-authenticate
                            </button>
                        )}
                    </div>

                    {timestamp && (
                        <span className="error-timestamp">
                            Last attempt: {timestamp.toLocaleTimeString()}
                        </span>
                    )}
                </div>
            </div>

            <style jsx>{`
        .error-panel {
          display: flex;
          gap: 20px;
          padding: 24px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 12px;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }

        .error-icon-container {
          flex-shrink: 0;
        }

        .error-icon {
          font-size: 32px;
          display: block;
        }

        .error-content {
          flex: 1;
          min-width: 0;
        }

        .error-title {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #ef4444;
        }

        .error-message {
          margin: 0;
          font-size: 14px;
          color: var(--sec-text-secondary);
          line-height: 1.5;
        }

        .error-details {
          margin-top: 12px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
        }

        .details-label {
          margin: 0 0 8px 0;
          font-size: 12px;
          font-weight: 500;
          color: var(--sec-text-secondary);
        }

        .error-details ul {
          margin: 0;
          padding-left: 20px;
        }

        .error-details li {
          font-size: 12px;
          color: var(--sec-text-secondary);
          line-height: 1.6;
        }

        .error-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .retry-btn {
          background: var(--sec-accent-primary);
          border: none;
          color: #000;
        }

        .retry-btn:hover:not(:disabled) {
          filter: brightness(1.1);
        }

        .reauth-btn {
          background: transparent;
          border: 1px solid var(--sec-border);
          color: var(--sec-text-primary);
        }

        .reauth-btn:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-timestamp {
          display: block;
          margin-top: 12px;
          font-size: 11px;
          color: var(--sec-text-secondary);
          opacity: 0.7;
        }
      `}</style>
        </>
    );
}
