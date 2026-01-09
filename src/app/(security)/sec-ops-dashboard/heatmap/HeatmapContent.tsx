'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSecurityAuth } from '@/contexts/SecurityDashboardContext';
import Sidebar from '../components/Sidebar';

interface HeatmapBucket {
    timestamp: string;
    count: number;
    bySeverity?: Record<string, number>;
    topIps?: Array<{ ip: string; count: number }>;
}

interface HeatmapData {
    buckets: HeatmapBucket[];
    maxCount: number;
    bucketSize: string;
}

const SECURITY_API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL + '/v1/sec-console-rahasia';

export default function HeatmapContent() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useSecurityAuth();

    const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('24h');
    const [hoveredBucket, setHoveredBucket] = useState<{ bucket: HeatmapBucket; x: number; y: number } | null>(null);

    const fetchHeatmap = useCallback(async () => {
        setIsLoading(true);
        try {
            const now = new Date();
            let startTime: Date;

            switch (timeRange) {
                case '24h':
                    startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    break;
                case '7d':
                    startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case '30d':
                    startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            }

            const params = new URLSearchParams({
                startTime: startTime.toISOString(),
                endTime: now.toISOString(),
            });

            const res = await fetch(`${SECURITY_API_BASE}/heatmap?${params}`, { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch heatmap');

            const data = await res.json();
            setHeatmapData(data.data);
        } catch (err) {
            console.error('Failed to fetch heatmap:', err);
        } finally {
            setIsLoading(false);
        }
    }, [timeRange]);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace('/sec-ops-dashboard/login');
            return;
        }
        if (isAuthenticated) {
            fetchHeatmap();
        }
    }, [isAuthenticated, authLoading, router, fetchHeatmap]);

    const getHeatColor = (count: number, maxCount: number) => {
        if (count === 0) return 'rgba(255, 255, 255, 0.03)';
        const intensity = Math.min(count / maxCount, 1);

        if (intensity < 0.25) {
            return `rgba(82, 196, 26, ${0.3 + intensity * 2})`; // Green
        } else if (intensity < 0.5) {
            return `rgba(250, 173, 20, ${0.4 + intensity * 1.2})`; // Yellow
        } else if (intensity < 0.75) {
            return `rgba(239, 68, 68, ${0.5 + intensity * 0.6})`; // Orange-red
        } else {
            return `rgba(255, 77, 79, ${0.7 + intensity * 0.3})`; // Critical red
        }
    };

    const getHeatGlow = (count: number, maxCount: number) => {
        if (count === 0) return 'none';
        const intensity = Math.min(count / maxCount, 1);

        if (intensity < 0.25) {
            return `0 0 12px rgba(82, 196, 26, ${intensity * 2})`;
        } else if (intensity < 0.5) {
            return `0 0 15px rgba(250, 173, 20, ${intensity * 1.5})`;
        } else if (intensity < 0.75) {
            return `0 0 18px rgba(239, 68, 68, ${intensity})`;
        } else {
            return `0 0 24px rgba(255, 77, 79, ${intensity})`;
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        if (timeRange === '24h') {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit' });
    };

    const formatFullTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const handleCellHover = (bucket: HeatmapBucket, e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoveredBucket({
            bucket,
            x: rect.left + rect.width / 2,
            y: rect.top - 10
        });
    };

    const severityTotals = heatmapData?.buckets.reduce((acc, bucket) => {
        if (bucket.bySeverity) {
            Object.entries(bucket.bySeverity).forEach(([severity, count]) => {
                acc[severity] = (acc[severity] || 0) + count;
            });
        }
        return acc;
    }, {} as Record<string, number>) || {};

    const totalEvents = heatmapData?.buckets.reduce((sum, b) => sum + b.count, 0) || 0;

    // Show loading while checking authentication
    if (authLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner" />
                <p>Loading Security Console...</p>
                <style jsx>{`
                    .loading-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
                    .loading-spinner { width: 48px; height: 48px; border: 3px solid var(--sec-border); border-top-color: var(--sec-accent-primary); border-radius: 50%; animation: spin 1s linear infinite; }
                    @keyframes spin { to { transform: rotate(360deg); } }
                    p { color: var(--sec-text-secondary); font-size: 14px; }
                `}</style>
            </div>
        );
    }

    // Prevent rendering while redirecting to login
    if (!isAuthenticated) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner" />
                <p>Redirecting to login...</p>
                <style jsx>{`
                    .loading-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
                    .loading-spinner { width: 48px; height: 48px; border: 3px solid var(--sec-border); border-top-color: var(--sec-accent-primary); border-radius: 50%; animation: spin 1s linear infinite; }
                    @keyframes spin { to { transform: rotate(360deg); } }
                    p { color: var(--sec-text-secondary); font-size: 14px; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="heatmap-layout">
            <Sidebar />

            <main className="heatmap-main">
                {/* Header */}
                <header className="page-header">
                    <div className="header-left">
                        <h1>🔥 Auth Failure Heatmap</h1>
                        <span className="header-subtitle">Visual threat pattern detection</span>
                    </div>
                    <div className="header-right">
                        <div className="time-selector">
                            {['24h', '7d', '30d'].map((range) => (
                                <button
                                    key={range}
                                    className={`time-btn ${timeRange === range ? 'active' : ''}`}
                                    onClick={() => setTimeRange(range)}
                                >
                                    {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days'}
                                </button>
                            ))}
                        </div>
                        <button
                            className="refresh-btn"
                            onClick={fetchHeatmap}
                            disabled={isLoading}
                        >
                            <span className={`refresh-icon ${isLoading ? 'spinning' : ''}`}>🔄</span>
                            Refresh
                        </button>
                    </div>
                </header>

                {isLoading ? (
                    <div className="loading-state">
                        <div className="loading-spinner" />
                        <p>Generating heatmap...</p>
                    </div>
                ) : !heatmapData || heatmapData.buckets.length === 0 ? (
                    <div className="empty-state-card">
                        <div className="empty-icon">🛡️</div>
                        <h3>No Authentication Failures Detected</h3>
                        <p>No failed login attempts have been recorded in the selected time period.</p>
                        <div className="empty-reasons">
                            <span>This could indicate:</span>
                            <ul>
                                <li>✓ Healthy security posture</li>
                                <li>• No login activity in this period</li>
                                <li>• Auth event logging not configured</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stats Summary */}
                        <div className="stats-row">
                            <div className="stat-box">
                                <span className="stat-value">{totalEvents.toLocaleString()}</span>
                                <span className="stat-label">Total Failures</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-value">{heatmapData.maxCount}</span>
                                <span className="stat-label">Peak (per bucket)</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-value">{heatmapData.buckets.length}</span>
                                <span className="stat-label">Time Buckets</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="legend">
                            <span className="legend-label">Intensity:</span>
                            <div className="legend-scale">
                                <span className="scale-label">Low</span>
                                <div className="legend-gradient" />
                                <span className="scale-label">High ({heatmapData.maxCount} max)</span>
                            </div>
                        </div>

                        {/* Heatmap Grid */}
                        <div className="heatmap-card">
                            <div className="heatmap-grid">
                                {heatmapData.buckets.map((bucket, idx) => (
                                    <div
                                        key={idx}
                                        className="heatmap-cell"
                                        style={{
                                            backgroundColor: getHeatColor(bucket.count, heatmapData.maxCount),
                                            boxShadow: getHeatGlow(bucket.count, heatmapData.maxCount)
                                        }}
                                        onMouseEnter={(e) => handleCellHover(bucket, e)}
                                        onMouseLeave={() => setHoveredBucket(null)}
                                    >
                                        {bucket.count > 0 && (
                                            <span className="cell-count">{bucket.count}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="heatmap-axis">
                                <span>{formatTime(heatmapData.buckets[0]?.timestamp || '')}</span>
                                <span>→ Time →</span>
                                <span>{formatTime(heatmapData.buckets[heatmapData.buckets.length - 1]?.timestamp || '')}</span>
                            </div>
                        </div>

                        {/* Severity Distribution */}
                        <div className="severity-section">
                            <h2>📊 Severity Distribution</h2>
                            <div className="severity-cards">
                                {[
                                    { key: 'CRITICAL', color: 'var(--sec-status-critical)', bg: 'rgba(255, 77, 79, 0.15)' },
                                    { key: 'HIGH', color: 'var(--sec-status-high)', bg: 'rgba(239, 68, 68, 0.15)' },
                                    { key: 'WARN', color: 'var(--sec-status-warning)', bg: 'rgba(250, 173, 20, 0.15)' },
                                ].map(({ key, color, bg }) => (
                                    <div
                                        key={key}
                                        className="severity-card"
                                        style={{
                                            background: bg,
                                            borderColor: color
                                        }}
                                    >
                                        <div className="severity-count" style={{ color }}>
                                            {(severityTotals[key] || 0).toLocaleString()}
                                        </div>
                                        <div className="severity-label">{key}</div>
                                        <div
                                            className="severity-indicator"
                                            style={{ backgroundColor: color }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Tooltip */}
                {hoveredBucket && (
                    <div
                        className="tooltip"
                        style={{
                            left: hoveredBucket.x,
                            top: hoveredBucket.y
                        }}
                    >
                        <div className="tooltip-header">
                            {formatFullTime(hoveredBucket.bucket.timestamp)}
                        </div>
                        <div className="tooltip-divider" />
                        <div className="tooltip-content">
                            <div className="tooltip-row total">
                                <span>Total Events</span>
                                <span className="tooltip-value">{hoveredBucket.bucket.count}</span>
                            </div>
                            {hoveredBucket.bucket.bySeverity && Object.entries(hoveredBucket.bucket.bySeverity).map(([severity, count]) => (
                                <div key={severity} className="tooltip-row">
                                    <span className="severity-dot" style={{
                                        backgroundColor:
                                            severity === 'CRITICAL' ? 'var(--sec-status-critical)' :
                                                severity === 'HIGH' ? 'var(--sec-status-high)' :
                                                    severity === 'WARN' ? 'var(--sec-status-warning)' : 'var(--sec-status-neutral)'
                                    }} />
                                    <span>{severity}</span>
                                    <span className="tooltip-value">{count}</span>
                                </div>
                            ))}
                            {hoveredBucket.bucket.topIps && hoveredBucket.bucket.topIps.length > 0 && (
                                <>
                                    <div className="tooltip-divider" />
                                    <div className="tooltip-section">Top IP</div>
                                    <div className="tooltip-ip mono">
                                        {hoveredBucket.bucket.topIps[0].ip} ({hoveredBucket.bucket.topIps[0].count})
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <style jsx>{`
                .heatmap-layout {
                    display: flex;
                    min-height: 100vh;
                }

                .heatmap-main {
                    flex: 1;
                    margin-left: 240px;
                    padding: 24px 32px;
                    position: relative;
                    z-index: 1;
                }

                @media (max-width: 768px) {
                    .heatmap-main {
                        margin-left: 70px;
                        padding: 16px;
                    }
                }

                /* Header */
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 24px;
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
                    gap: 16px;
                }

                .time-selector {
                    display: flex;
                    background: var(--sec-bg-card);
                    border: 1px solid var(--sec-border);
                    border-radius: 10px;
                    overflow: hidden;
                }

                .time-btn {
                    padding: 10px 20px;
                    background: transparent;
                    border: none;
                    color: var(--sec-text-secondary);
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .time-btn:hover {
                    background: rgba(255, 255, 255, 0.03);
                    color: var(--sec-text-primary);
                }

                .time-btn.active {
                    background: var(--sec-accent-primary);
                    color: #000;
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

                .refresh-icon.spinning {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* Loading & Empty States */
                .loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px;
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

                .loading-state p {
                    color: var(--sec-text-secondary);
                    font-size: 14px;
                }

                .empty-state-card {
                    background: var(--sec-bg-card);
                    border: 1px solid var(--sec-border);
                    border-radius: 16px;
                    padding: 60px 40px;
                    text-align: center;
                    max-width: 500px;
                    margin: 40px auto;
                }

                .empty-icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                }

                .empty-state-card h3 {
                    font-size: 20px;
                    color: var(--sec-text-primary);
                    margin: 0 0 12px 0;
                }

                .empty-state-card p {
                    color: var(--sec-text-secondary);
                    font-size: 14px;
                    margin: 0 0 24px 0;
                }

                .empty-reasons {
                    text-align: left;
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 10px;
                }

                .empty-reasons span {
                    font-size: 12px;
                    color: var(--sec-text-muted);
                    display: block;
                    margin-bottom: 8px;
                }

                .empty-reasons ul {
                    margin: 0;
                    padding-left: 0;
                    list-style: none;
                }

                .empty-reasons li {
                    font-size: 13px;
                    color: var(--sec-text-secondary);
                    padding: 4px 0;
                }

                /* Stats Row */
                .stats-row {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 24px;
                }

                .stat-box {
                    flex: 1;
                    padding: 20px;
                    background: var(--sec-bg-card);
                    border: 1px solid var(--sec-border);
                    border-radius: 12px;
                    text-align: center;
                }

                .stat-value {
                    display: block;
                    font-size: 28px;
                    font-weight: 700;
                    color: var(--sec-text-primary);
                }

                .stat-label {
                    display: block;
                    font-size: 12px;
                    color: var(--sec-text-secondary);
                    margin-top: 4px;
                }

                /* Legend */
                .legend {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    margin-bottom: 24px;
                }

                .legend-label {
                    font-size: 12px;
                    color: var(--sec-text-muted);
                }

                .legend-scale {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .scale-label {
                    font-size: 11px;
                    color: var(--sec-text-secondary);
                }

                .legend-gradient {
                    width: 200px;
                    height: 14px;
                    border-radius: 7px;
                    background: linear-gradient(
                        to right,
                        rgba(82, 196, 26, 0.5),
                        rgba(250, 173, 20, 0.7),
                        rgba(239, 68, 68, 0.85),
                        rgba(255, 77, 79, 1)
                    );
                    box-shadow: 0 0 20px rgba(255, 77, 79, 0.3);
                }

                /* Heatmap Card */
                .heatmap-card {
                    background: var(--sec-bg-card);
                    border: 1px solid var(--sec-border);
                    border-radius: 16px;
                    padding: 24px;
                    margin-bottom: 24px;
                }

                .heatmap-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
                    gap: 6px;
                }

                .heatmap-cell {
                    aspect-ratio: 1;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    cursor: pointer;
                    border: 1px solid transparent;
                }

                .heatmap-cell:hover {
                    transform: scale(1.15);
                    z-index: 10;
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .cell-count {
                    font-size: 11px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.9);
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
                }

                .heatmap-axis {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 16px;
                    padding-top: 12px;
                    border-top: 1px solid var(--sec-border);
                    font-size: 11px;
                    color: var(--sec-text-muted);
                    font-family: var(--font-mono);
                }

                /* Severity Section */
                .severity-section {
                    background: var(--sec-bg-card);
                    border: 1px solid var(--sec-border);
                    border-radius: 16px;
                    padding: 24px;
                }

                .severity-section h2 {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--sec-text-primary);
                    margin: 0 0 20px 0;
                }

                .severity-cards {
                    display: flex;
                    gap: 16px;
                }

                .severity-card {
                    flex: 1;
                    padding: 24px;
                    border-radius: 12px;
                    text-align: center;
                    border: 1px solid;
                    position: relative;
                    overflow: hidden;
                }

                .severity-count {
                    font-size: 36px;
                    font-weight: 700;
                }

                .severity-label {
                    font-size: 12px;
                    color: var(--sec-text-secondary);
                    margin-top: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .severity-indicator {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                }

                /* Tooltip */
                .tooltip {
                    position: fixed;
                    transform: translate(-50%, -100%);
                    background: var(--sec-bg-secondary);
                    border: 1px solid var(--sec-border);
                    border-radius: 10px;
                    padding: 0;
                    min-width: 200px;
                    z-index: 1000;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    pointer-events: none;
                }

                .tooltip-header {
                    padding: 12px 16px;
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--sec-text-primary);
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 10px 10px 0 0;
                }

                .tooltip-divider {
                    height: 1px;
                    background: var(--sec-border);
                }

                .tooltip-content {
                    padding: 12px 16px;
                }

                .tooltip-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 4px 0;
                    font-size: 12px;
                    color: var(--sec-text-secondary);
                }

                .tooltip-row.total {
                    font-weight: 600;
                    color: var(--sec-text-primary);
                    padding-bottom: 8px;
                    margin-bottom: 4px;
                    border-bottom: 1px solid var(--sec-border);
                }

                .tooltip-value {
                    margin-left: auto;
                    font-weight: 600;
                    color: var(--sec-text-primary);
                    font-family: var(--font-mono);
                }

                .severity-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                .tooltip-section {
                    font-size: 10px;
                    font-weight: 600;
                    color: var(--sec-text-muted);
                    text-transform: uppercase;
                    margin-top: 8px;
                    margin-bottom: 4px;
                }

                .tooltip-ip {
                    font-size: 12px;
                    color: var(--sec-text-primary);
                }

                .mono {
                    font-family: var(--font-mono);
                }
            `}</style>
        </div>
    );
}
