'use client';

import React from 'react';

interface MetricCardProps {
    icon: string;
    value: number | string;
    label: string;
    severity?: 'critical' | 'high' | 'warning' | 'info' | 'success' | 'neutral';
    trend?: {
        value: number;
        label: string;
        direction: 'up' | 'down' | 'neutral';
    };
    pulse?: boolean;
    onClick?: () => void;
}

export default function MetricCard({
    icon,
    value,
    label,
    severity = 'neutral',
    trend,
    pulse = false,
    onClick,
}: MetricCardProps) {
    const getSeverityStyles = () => {
        const styles: Record<string, { border: string; glow: string; bg: string }> = {
            critical: {
                border: 'var(--sec-status-critical)',
                glow: 'rgba(255, 77, 79, 0.4)',
                bg: 'rgba(255, 77, 79, 0.08)',
            },
            high: {
                border: 'var(--sec-status-high)',
                glow: 'rgba(239, 68, 68, 0.3)',
                bg: 'rgba(239, 68, 68, 0.06)',
            },
            warning: {
                border: 'var(--sec-status-warning)',
                glow: 'rgba(250, 173, 20, 0.3)',
                bg: 'rgba(250, 173, 20, 0.06)',
            },
            info: {
                border: 'var(--sec-status-info)',
                glow: 'rgba(59, 130, 246, 0.3)',
                bg: 'rgba(59, 130, 246, 0.06)',
            },
            success: {
                border: 'var(--sec-status-success)',
                glow: 'rgba(82, 196, 26, 0.3)',
                bg: 'rgba(82, 196, 26, 0.06)',
            },
            neutral: {
                border: 'var(--sec-border)',
                glow: 'transparent',
                bg: 'var(--sec-bg-secondary)',
            },
        };
        return styles[severity] || styles.neutral;
    };

    const getTrendColor = () => {
        if (!trend) return 'var(--sec-text-secondary)';
        if (trend.direction === 'up') {
            return severity === 'success' ? 'var(--sec-status-success)' : 'var(--sec-status-critical)';
        }
        if (trend.direction === 'down') {
            return severity === 'success' ? 'var(--sec-status-critical)' : 'var(--sec-status-success)';
        }
        return 'var(--sec-text-secondary)';
    };

    const getTrendIcon = () => {
        if (!trend) return '';
        if (trend.direction === 'up') return '↑';
        if (trend.direction === 'down') return '↓';
        return '→';
    };

    const severityStyles = getSeverityStyles();

    return (
        <>
            <div
                className={`metric-card ${severity} ${pulse ? 'pulse' : ''} ${onClick ? 'clickable' : ''}`}
                onClick={onClick}
                style={{
                    '--border-color': severityStyles.border,
                    '--glow-color': severityStyles.glow,
                    '--bg-color': severityStyles.bg,
                } as React.CSSProperties}
            >
                <div className="metric-icon">{icon}</div>
                <div className="metric-content">
                    <div className="metric-value">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </div>
                    <div className="metric-label">{label}</div>
                    {trend && (
                        <div className="metric-trend" style={{ color: getTrendColor() }}>
                            <span className="trend-icon">{getTrendIcon()}</span>
                            <span className="trend-value">{trend.value}%</span>
                            <span className="trend-label">{trend.label}</span>
                        </div>
                    )}
                </div>
                {(severity === 'critical' || severity === 'high') && (
                    <div className="severity-indicator" />
                )}
            </div>

            <style jsx>{`
        .metric-card {
          position: relative;
          padding: 20px;
          background: var(--bg-color);
          border: 1px solid var(--border-color);
          border-left: 4px solid var(--border-color);
          border-radius: 12px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .metric-card.clickable {
          cursor: pointer;
        }

        .metric-card.clickable:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px -8px var(--glow-color);
        }

        .metric-card.pulse {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 var(--glow-color);
          }
          50% {
            box-shadow: 0 0 20px 4px var(--glow-color);
          }
        }

        .metric-icon {
          font-size: 32px;
          line-height: 1;
          flex-shrink: 0;
        }

        .metric-content {
          flex: 1;
          min-width: 0;
        }

        .metric-value {
          font-size: 32px;
          font-weight: 700;
          color: var(--sec-text-primary);
          line-height: 1.1;
          letter-spacing: -0.5px;
        }

        .metric-label {
          font-size: 13px;
          color: var(--sec-text-secondary);
          margin-top: 4px;
          font-weight: 500;
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
          font-size: 12px;
        }

        .trend-icon {
          font-weight: 600;
        }

        .trend-value {
          font-weight: 600;
        }

        .trend-label {
          opacity: 0.8;
        }

        .severity-indicator {
          position: absolute;
          top: 0;
          right: 0;
          width: 8px;
          height: 8px;
          background: var(--border-color);
          border-radius: 50%;
          margin: 12px;
          animation: blink 1.5s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        .metric-card.critical .severity-indicator {
          box-shadow: 0 0 8px var(--sec-status-critical);
        }

        .metric-card.high .severity-indicator {
          box-shadow: 0 0 8px var(--sec-status-high);
        }
      `}</style>
        </>
    );
}
