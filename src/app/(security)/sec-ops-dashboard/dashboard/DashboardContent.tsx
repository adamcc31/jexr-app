'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSecurityAuth } from '@/contexts/SecurityDashboardContext';
import Sidebar from '../components/Sidebar';
import MetricCard from '../components/MetricCard';
import ErrorPanel from '../components/ErrorPanel';

// Types
interface DashboardStats {
    totalEvents: number;
    eventsBySeverity: Record<string, number>;
    eventsByType: Record<string, number>;
    topIps: Array<{ ip: string; eventCount: number; failedLogins: number; highestSeverity: string }>;
    failedLogins24h: number;
    blockedAttempts24h: number;
    criticalEvents24h: number;
    activeBreakGlass: number;
    integrityStatus: string;
    lastAnchorDate?: string;
}

interface SecurityEvent {
    id: number;
    timestamp: string;
    eventType: string;
    severity: string;
    subjectType?: string;
    subjectValue?: string;
    ip?: string;
    details?: Record<string, any>;
}

// API base URL for security dashboard
const SECURITY_API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL + '/v1/sec-console-rahasia';

export default function DashboardContent() {
    const router = useRouter();
    const { user, logout, hasRole, isAuthenticated, isLoading: authLoading } = useSecurityAuth();

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [events, setEvents] = useState<SecurityEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
    const [nextRefresh, setNextRefresh] = useState(30);
    const [isRetrying, setIsRetrying] = useState(false);

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch(`${SECURITY_API_BASE}/stats`, { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch stats');
            const data = await res.json();
            setStats(data.data);
            setError('');
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load stats');
            return false;
        }
    }, []);

    const fetchEvents = useCallback(async () => {
        try {
            const res = await fetch(`${SECURITY_API_BASE}/events?limit=15`, { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch events');
            const data = await res.json();
            setEvents(data.data?.events || []);
            return true;
        } catch (err) {
            console.error('Failed to fetch events:', err);
            return false;
        }
    }, []);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        await Promise.all([fetchStats(), fetchEvents()]);
        setLastRefresh(new Date());
        setNextRefresh(30);
        setIsLoading(false);
    }, [fetchStats, fetchEvents]);

    const handleRetry = async () => {
        setIsRetrying(true);
        await refresh();
        setIsRetrying(false);
    };

    const handleReauth = async () => {
        await logout();
        router.replace('/sec-ops-dashboard/login');
    };

    // Countdown timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setNextRefresh(prev => {
                if (prev <= 1) {
                    refresh();
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [refresh]);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace('/sec-ops-dashboard/login');
            return;
        }
        if (isAuthenticated) {
            refresh();
        }
    }, [isAuthenticated, authLoading, router, refresh]);

    const getSeverityColor = (severity: string) => {
        const colors: Record<string, string> = {
            'CRITICAL': 'var(--sec-status-critical)',
            'HIGH': 'var(--sec-status-high)',
            'WARN': 'var(--sec-status-warning)',
            'MEDIUM': 'var(--sec-status-info)',
            'INFO': 'var(--sec-status-success)',
        };
        return colors[severity] || 'var(--sec-status-neutral)';
    };

    const getIntegrityConfig = (status: string) => {
        const configs: Record<string, { color: string; label: string; severity: 'success' | 'warning' | 'critical' }> = {
            'intact': { color: 'var(--sec-status-success)', label: 'INTACT', severity: 'success' },
            'degraded': { color: 'var(--sec-status-warning)', label: 'DEGRADED', severity: 'warning' },
            'compromised': { color: 'var(--sec-status-critical)', label: 'COMPROMISED', severity: 'critical' },
        };
        return configs[status] || { color: 'var(--sec-status-neutral)', label: 'UNKNOWN', severity: 'warning' as const };
    };

    if (authLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner" />
                <p>Loading Security Console...</p>
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
                    @keyframes spin { to { transform: rotate(360deg); } }
                    p { color: var(--sec-text-secondary); font-size: 14px; }
                `}</style>
            </div>
        );
    }

    const integrityConfig = getIntegrityConfig(stats?.integrityStatus || '');

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-left">
                        <h1>📊 Dashboard</h1>
                        <span className="header-subtitle">Security Operations Overview</span>
                    </div>
                    <div className="header-right">
                        <div className="refresh-info">
                            <span className="last-refresh">
                                Updated: {lastRefresh.toLocaleTimeString()}
                            </span>
                            <div className="refresh-progress">
                                <div
                                    className="refresh-bar"
                                    style={{ width: `${(nextRefresh / 30) * 100}%` }}
                                />
                            </div>
                            <span className="next-refresh">Next in {nextRefresh}s</span>
                        </div>
                        <button
                            className="refresh-btn"
                            onClick={refresh}
                            disabled={isLoading}
                        >
                            <span className={`refresh-icon ${isLoading ? 'spinning' : ''}`}>🔄</span>
                            Refresh
                        </button>
                    </div>
                </header>

                {/* Error Panel */}
                {error && (
                    <div className="error-container">
                        <ErrorPanel
                            title="Failed to Fetch Statistics"
                            message="Unable to connect to the security backend."
                            details={[
                                'Network connectivity issues',
                                'Backend service unavailable',
                                'Session expired or invalid',
                            ]}
                            onRetry={handleRetry}
                            onReauth={handleReauth}
                            timestamp={lastRefresh}
                            isRetrying={isRetrying}
                        />
                    </div>
                )}

                {/* Stats Grid */}
                <section className="stats-section">
                    <div className="stats-grid">
                        <MetricCard
                            icon="🚨"
                            value={stats?.criticalEvents24h || 0}
                            label="Critical Events (24h)"
                            severity={stats?.criticalEvents24h && stats.criticalEvents24h > 0 ? 'critical' : 'neutral'}
                            pulse={stats?.criticalEvents24h && stats.criticalEvents24h > 5}
                        />
                        <MetricCard
                            icon="🔐"
                            value={stats?.failedLogins24h || 0}
                            label="Failed Logins (24h)"
                            severity={stats?.failedLogins24h && stats.failedLogins24h > 10 ? 'warning' : 'info'}
                        />
                        <MetricCard
                            icon="🚫"
                            value={stats?.blockedAttempts24h || 0}
                            label="Blocked Attempts (24h)"
                            severity={stats?.blockedAttempts24h && stats.blockedAttempts24h > 0 ? 'high' : 'neutral'}
                        />
                        <MetricCard
                            icon="📈"
                            value={stats?.totalEvents || 0}
                            label="Total Events"
                            severity="neutral"
                        />
                        <MetricCard
                            icon="🛡️"
                            value={integrityConfig.label}
                            label="Log Integrity"
                            severity={integrityConfig.severity}
                        />
                        {stats?.activeBreakGlass && stats.activeBreakGlass > 0 && (
                            <MetricCard
                                icon="⚡"
                                value={stats.activeBreakGlass}
                                label="Active Break-Glass"
                                severity="critical"
                                pulse
                            />
                        )}
                    </div>
                </section>

                {/* Content Grid */}
                <section className="content-section">
                    <div className="content-grid">
                        {/* Recent Events */}
                        <div className="content-card events-card">
                            <div className="card-header">
                                <h2>📋 Recent Security Events</h2>
                                <span className="event-count">{events.length} events</span>
                            </div>
                            <div className="events-list">
                                {events.map((event) => (
                                    <div key={event.id} className="event-row">
                                        <span
                                            className="severity-badge"
                                            style={{
                                                backgroundColor: getSeverityColor(event.severity),
                                                boxShadow: `0 0 8px ${getSeverityColor(event.severity)}`
                                            }}
                                        >
                                            {event.severity}
                                        </span>
                                        <span className="event-type">{event.eventType}</span>
                                        <span className="event-ip mono">{event.ip || '-'}</span>
                                        <span className="event-time mono">
                                            {new Date(event.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                ))}
                                {events.length === 0 && (
                                    <div className="empty-state">
                                        <span className="empty-icon">📭</span>
                                        <p>No recent events</p>
                                    </div>
                                )}
                            </div>
                            <button
                                className="view-all-btn"
                                onClick={() => router.push('/sec-ops-dashboard/events')}
                            >
                                View All Events →
                            </button>
                        </div>

                        {/* Top IPs */}
                        <div className="content-card ips-card">
                            <div className="card-header">
                                <h2>🌐 Top IPs (24h)</h2>
                            </div>
                            <div className="ips-list">
                                {stats?.topIps?.map((ip, idx) => (
                                    <div key={idx} className="ip-row">
                                        <span className="ip-rank">#{idx + 1}</span>
                                        <span className="ip-address mono">{ip.ip}</span>
                                        <div className="ip-stats">
                                            <span className="ip-count">{ip.eventCount} events</span>
                                            <span
                                                className="ip-severity"
                                                style={{ color: getSeverityColor(ip.highestSeverity) }}
                                            >
                                                {ip.highestSeverity}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {(!stats?.topIps || stats.topIps.length === 0) && (
                                    <div className="empty-state">
                                        <span className="empty-icon">🌍</span>
                                        <p>No IP data available</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Severity Breakdown */}
                        <div className="content-card severity-card">
                            <div className="card-header">
                                <h2>📊 Events by Severity (7 days)</h2>
                            </div>
                            <div className="severity-bars">
                                {Object.entries(stats?.eventsBySeverity || {}).map(([severity, count]) => {
                                    const maxCount = Math.max(...Object.values(stats?.eventsBySeverity || { default: 1 })) || 1;
                                    const percentage = ((count as number) / maxCount) * 100;
                                    return (
                                        <div key={severity} className="severity-row">
                                            <span className="severity-label">{severity}</span>
                                            <div className="severity-bar-container">
                                                <div
                                                    className="severity-bar"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor: getSeverityColor(severity),
                                                        boxShadow: `0 0 12px ${getSeverityColor(severity)}`
                                                    }}
                                                />
                                            </div>
                                            <span className="severity-count mono">{(count as number).toLocaleString()}</span>
                                        </div>
                                    );
                                })}
                                {Object.keys(stats?.eventsBySeverity || {}).length === 0 && (
                                    <div className="empty-state">
                                        <span className="empty-icon">📉</span>
                                        <p>No severity data</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <style jsx>{`
                .dashboard-layout {
                    display: flex;
                    min-height: 100vh;
                }

                .dashboard-main {
                    flex: 1;
                    margin-left: 240px;
                    padding: 24px 32px;
                    position: relative;
                    z-index: 1;
                }

                @media (max-width: 768px) {
                    .dashboard-main {
                        margin-left: 70px;
                        padding: 16px;
                    }
                }

                /* Header */
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 28px;
                    flex-wrap: wrap;
                    gap: 16px;
                }

                .header-left h1 {
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0;
                    color: var(--sec-text-primary);
                }

                .header-subtitle {
                    color: var(--sec-text-secondary);
                    font-size: 14px;
                    margin-top: 4px;
                    display: block;
                }

                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .refresh-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 16px;
                    background: var(--sec-bg-card);
                    border: 1px solid var(--sec-border);
                    border-radius: 10px;
                }

                .last-refresh, .next-refresh {
                    font-size: 12px;
                    color: var(--sec-text-secondary);
                }

                .refresh-progress {
                    width: 60px;
                    height: 4px;
                    background: var(--sec-border);
                    border-radius: 2px;
                    overflow: hidden;
                }

                .refresh-bar {
                    height: 100%;
                    background: var(--sec-accent-primary);
                    border-radius: 2px;
                    transition: width 1s linear;
                }

                .refresh-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 18px;
                    background: var(--sec-bg-card);
                    border: 1px solid var(--sec-border);
                    border-radius: 10px;
                    color: var(--sec-text-primary);
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .refresh-btn:hover:not(:disabled) {
                    background: var(--sec-bg-elevated);
                    border-color: var(--sec-accent-primary);
                }

                .refresh-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .refresh-icon {
                    font-size: 14px;
                }

                .refresh-icon.spinning {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* Error Container */
                .error-container {
                    margin-bottom: 24px;
                }

                /* Stats Section */
                .stats-section {
                    margin-bottom: 28px;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 16px;
                }

                /* Content Section */
                .content-section {
                    margin-bottom: 28px;
                }

                .content-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
                    gap: 20px;
                }

                .content-card {
                    background: var(--sec-bg-card);
                    border: 1px solid var(--sec-border);
                    border-radius: 14px;
                    padding: 20px;
                    backdrop-filter: blur(10px);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .card-header h2 {
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--sec-text-primary);
                    margin: 0;
                }

                .event-count {
                    font-size: 12px;
                    color: var(--sec-text-secondary);
                    background: var(--sec-bg-elevated);
                    padding: 4px 10px;
                    border-radius: 12px;
                }

                /* Events List */
                .events-list {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    max-height: 360px;
                    overflow-y: auto;
                    padding-right: 8px;
                }

                .event-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 12px;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 8px;
                    transition: background 0.2s;
                }

                .event-row:hover {
                    background: rgba(255, 255, 255, 0.04);
                }

                .severity-badge {
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 600;
                    color: #fff;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .event-type {
                    flex: 1;
                    font-size: 13px;
                    color: var(--sec-text-primary);
                }

                .event-ip {
                    color: var(--sec-text-secondary);
                    font-size: 12px;
                }

                .event-time {
                    color: var(--sec-text-muted);
                    font-size: 11px;
                }

                .mono {
                    font-family: var(--font-mono);
                }

                .view-all-btn {
                    width: 100%;
                    padding: 12px;
                    margin-top: 16px;
                    background: rgba(0, 180, 255, 0.08);
                    border: 1px solid rgba(0, 180, 255, 0.2);
                    border-radius: 8px;
                    color: var(--sec-accent-primary);
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .view-all-btn:hover {
                    background: rgba(0, 180, 255, 0.15);
                    border-color: var(--sec-accent-primary);
                }

                /* IPs List */
                .ips-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .ip-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 8px;
                }

                .ip-rank {
                    width: 24px;
                    font-size: 11px;
                    font-weight: 600;
                    color: var(--sec-text-muted);
                }

                .ip-address {
                    flex: 1;
                    font-size: 13px;
                    color: var(--sec-text-primary);
                }

                .ip-stats {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 2px;
                }

                .ip-count {
                    font-size: 12px;
                    color: var(--sec-text-secondary);
                }

                .ip-severity {
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                /* Severity Bars */
                .severity-bars {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }

                .severity-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .severity-label {
                    width: 70px;
                    font-size: 11px;
                    font-weight: 500;
                    color: var(--sec-text-secondary);
                    text-transform: uppercase;
                }

                .severity-bar-container {
                    flex: 1;
                    height: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 5px;
                    overflow: hidden;
                }

                .severity-bar {
                    height: 100%;
                    border-radius: 5px;
                    transition: width 0.5s ease-out;
                }

                .severity-count {
                    width: 60px;
                    text-align: right;
                    font-size: 12px;
                    color: var(--sec-text-secondary);
                }

                /* Empty State */
                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 32px;
                    text-align: center;
                }

                .empty-icon {
                    font-size: 32px;
                    margin-bottom: 12px;
                    opacity: 0.5;
                }

                .empty-state p {
                    margin: 0;
                    color: var(--sec-text-muted);
                    font-size: 13px;
                }
            `}</style>
        </div>
    );
}
