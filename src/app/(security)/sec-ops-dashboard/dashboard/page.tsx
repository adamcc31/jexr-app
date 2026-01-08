'use client';

// Prevent static generation - requires runtime context
export const dynamic = 'force-dynamic';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSecurityAuth } from '@/contexts/SecurityDashboardContext';

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

// API base URL for security dashboard - uses hidden endpoint
// MUST match SECURITY_DASHBOARD_PATH in backend
const SECURITY_API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL + '/v1/sec-console-rahasia';

export default function SecurityDashboardPage() {
    const router = useRouter();
    const { user, logout, hasRole, isAuthenticated, isLoading: authLoading } = useSecurityAuth();

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [events, setEvents] = useState<SecurityEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch(`${SECURITY_API_BASE}/stats`, { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch stats');
            const data = await res.json();
            setStats(data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load stats');
        }
    }, []);

    const fetchEvents = useCallback(async () => {
        try {
            const res = await fetch(`${SECURITY_API_BASE}/events?limit=20`, { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch events');
            const data = await res.json();
            setEvents(data.data?.events || []);
        } catch (err) {
            console.error('Failed to fetch events:', err);
        }
    }, []);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        await Promise.all([fetchStats(), fetchEvents()]);
        setLastRefresh(new Date());
        setIsLoading(false);
    }, [fetchStats, fetchEvents]);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace('/sec-ops-dashboard/login');
            return;
        }
        if (isAuthenticated) {
            refresh();
            // Auto-refresh every 30 seconds
            const interval = setInterval(refresh, 30000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, authLoading, router, refresh]);

    const getSeverityColor = (severity: string) => {
        const colors: Record<string, string> = {
            'CRITICAL': '#dc2626',
            'HIGH': '#ef4444',
            'WARN': '#f59e0b',
            'MEDIUM': '#3b82f6',
            'INFO': '#10b981',
        };
        return colors[severity] || '#6b7280';
    };

    const getIntegrityStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'intact': '#10b981',
            'degraded': '#f59e0b',
            'compromised': '#dc2626',
        };
        return colors[status] || '#6b7280';
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/sec-ops-dashboard/login');
    };

    if (authLoading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-left">
                    <h1>🔒 Security Operations Center</h1>
                    <span className="role-badge">{user?.role}</span>
                </div>
                <div className="header-right">
                    <span className="last-refresh">
                        Last refresh: {lastRefresh.toLocaleTimeString()}
                    </span>
                    <button onClick={refresh} className="refresh-btn" disabled={isLoading}>
                        🔄 Refresh
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </header>

            {/* Navigation */}
            <nav className="dashboard-nav">
                <button className="nav-btn active">📊 Dashboard</button>
                <button className="nav-btn" onClick={() => router.push('/sec-ops-dashboard/events')}>
                    📋 Events
                </button>
                <button className="nav-btn" onClick={() => router.push('/sec-ops-dashboard/heatmap')}>
                    🔥 Heatmap
                </button>
                {hasRole('SECURITY_ANALYST') && (
                    <button className="nav-btn" onClick={() => router.push('/sec-ops-dashboard/export')}>
                        📤 Export
                    </button>
                )}
                {hasRole('SECURITY_ADMIN') && (
                    <button className="nav-btn" onClick={() => router.push('/sec-ops-dashboard/admin')}>
                        ⚙️ Admin
                    </button>
                )}
            </nav>

            {error && <div className="error-banner">{error}</div>}

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card critical">
                    <div className="stat-icon">🚨</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.criticalEvents24h || 0}</div>
                        <div className="stat-label">Critical Events (24h)</div>
                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-icon">🔐</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.failedLogins24h || 0}</div>
                        <div className="stat-label">Failed Logins (24h)</div>
                    </div>
                </div>

                <div className="stat-card danger">
                    <div className="stat-icon">🚫</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.blockedAttempts24h || 0}</div>
                        <div className="stat-label">Blocked Attempts (24h)</div>
                    </div>
                </div>

                <div className="total-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <div className="stat-value">{stats?.totalEvents?.toLocaleString() || 0}</div>
                        <div className="stat-label">Total Events</div>
                    </div>
                </div>

                <div className={`integrity-card ${stats?.integrityStatus || 'unknown'}`}>
                    <div className="stat-icon">🛡️</div>
                    <div className="stat-content">
                        <div className="stat-value" style={{ color: getIntegrityStatusColor(stats?.integrityStatus || '') }}>
                            {stats?.integrityStatus?.toUpperCase() || 'UNKNOWN'}
                        </div>
                        <div className="stat-label">Log Integrity</div>
                    </div>
                </div>

                {stats?.activeBreakGlass && stats.activeBreakGlass > 0 && (
                    <div className="stat-card break-glass">
                        <div className="stat-icon">⚡</div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.activeBreakGlass}</div>
                            <div className="stat-label">Active Break-Glass</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content - Two Columns */}
            <div className="content-grid">
                {/* Recent Events */}
                <div className="content-card events-card">
                    <h2>📋 Recent Security Events</h2>
                    <div className="events-list">
                        {events.map((event) => (
                            <div key={event.id} className="event-row">
                                <span
                                    className="severity-badge"
                                    style={{ backgroundColor: getSeverityColor(event.severity) }}
                                >
                                    {event.severity}
                                </span>
                                <span className="event-type">{event.eventType}</span>
                                <span className="event-ip">{event.ip || '-'}</span>
                                <span className="event-time">
                                    {new Date(event.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                        {events.length === 0 && (
                            <p className="no-events">No recent events</p>
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
                    <h2>🌐 Top IPs (24h)</h2>
                    <div className="ips-list">
                        {stats?.topIps?.map((ip, idx) => (
                            <div key={idx} className="ip-row">
                                <span className="ip-address">{ip.ip}</span>
                                <span className="ip-count">{ip.eventCount} events</span>
                                <span
                                    className="ip-severity"
                                    style={{ color: getSeverityColor(ip.highestSeverity) }}
                                >
                                    {ip.highestSeverity}
                                </span>
                            </div>
                        ))}
                        {(!stats?.topIps || stats.topIps.length === 0) && (
                            <p className="no-events">No IP data available</p>
                        )}
                    </div>
                </div>

                {/* Severity Breakdown */}
                <div className="content-card severity-card">
                    <h2>📊 Events by Severity (7 days)</h2>
                    <div className="severity-bars">
                        {Object.entries(stats?.eventsBySeverity || {}).map(([severity, count]) => (
                            <div key={severity} className="severity-row">
                                <span className="severity-label">{severity}</span>
                                <div className="severity-bar-container">
                                    <div
                                        className="severity-bar"
                                        style={{
                                            width: `${Math.min((count as number) / (stats?.totalEvents || 1) * 100 * 10, 100)}%`,
                                            backgroundColor: getSeverityColor(severity)
                                        }}
                                    />
                                </div>
                                <span className="severity-count">{(count as number).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .dashboard {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--sec-text-muted);
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-left h1 {
          font-size: 24px;
          margin: 0;
          color: #fff;
        }

        .role-badge {
          padding: 4px 12px;
          background: var(--sec-primary);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .last-refresh {
          color: var(--sec-text-muted);
          font-size: 12px;
        }

        .refresh-btn, .logout-btn {
          padding: 8px 16px;
          border: 1px solid var(--sec-border);
          background: transparent;
          border-radius: 8px;
          color: var(--sec-text);
          cursor: pointer;
          transition: all 0.2s;
        }

        .refresh-btn:hover, .logout-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .dashboard-nav {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .nav-btn {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--sec-border);
          border-radius: 8px;
          color: var(--sec-text);
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-btn:hover, .nav-btn.active {
          background: var(--sec-primary);
          border-color: var(--sec-primary);
          color: #000;
        }

        .error-banner {
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: #ef4444;
          margin-bottom: 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card, .total-card, .integrity-card {
          padding: 20px;
          background: var(--sec-bg-card);
          border: 1px solid var(--sec-border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-card.critical { border-left: 4px solid #dc2626; }
        .stat-card.warning { border-left: 4px solid #f59e0b; }
        .stat-card.danger { border-left: 4px solid #ef4444; }
        .stat-card.break-glass { border-left: 4px solid #7c3aed; }

        .stat-icon { font-size: 32px; }
        .stat-value { font-size: 28px; font-weight: 700; color: #fff; }
        .stat-label { font-size: 13px; color: var(--sec-text-muted); }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        .content-card {
          padding: 20px;
          background: var(--sec-bg-card);
          border: 1px solid var(--sec-border);
          border-radius: 12px;
        }

        .content-card h2 {
          font-size: 16px;
          margin: 0 0 16px 0;
          color: #fff;
        }

        .events-list, .ips-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 400px;
          overflow-y: auto;
        }

        .event-row, .ip-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }

        .severity-badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          color: #fff;
        }

        .event-type { flex: 1; font-size: 13px; }
        .event-ip { color: var(--sec-text-muted); font-size: 12px; }
        .event-time { color: var(--sec-text-muted); font-size: 12px; }

        .ip-address { flex: 1; font-family: monospace; }
        .ip-count { color: var(--sec-text-muted); font-size: 12px; }

        .no-events {
          color: var(--sec-text-muted);
          text-align: center;
          padding: 20px;
        }

        .view-all-btn {
          width: 100%;
          padding: 12px;
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid var(--sec-primary);
          border-radius: 8px;
          color: var(--sec-primary);
          cursor: pointer;
          margin-top: 16px;
          transition: all 0.2s;
        }

        .view-all-btn:hover {
          background: var(--sec-primary);
          color: #000;
        }

        .severity-bars {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .severity-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .severity-label {
          width: 80px;
          font-size: 12px;
          color: var(--sec-text-muted);
        }

        .severity-bar-container {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .severity-bar {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .severity-count {
          width: 60px;
          text-align: right;
          font-size: 12px;
          color: var(--sec-text-muted);
        }
      `}</style>
        </div>
    );
}
