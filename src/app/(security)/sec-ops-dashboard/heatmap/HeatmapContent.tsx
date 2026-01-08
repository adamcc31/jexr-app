'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSecurityAuth } from '@/contexts/SecurityDashboardContext';

interface HeatmapBucket {
    timestamp: string;
    count: number;
    bySeverity?: Record<string, number>;
}

interface HeatmapData {
    buckets: HeatmapBucket[];
    maxCount: number;
    bucketSize: string;
}

// API base URL for security dashboard - uses hidden endpoint
// MUST match SECURITY_DASHBOARD_PATH in backend
const SECURITY_API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL + '/v1/sec-console-rahasia';

export default function HeatmapContent() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useSecurityAuth();

    const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('24h');

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
        if (count === 0) return 'rgba(255, 255, 255, 0.05)';
        const intensity = Math.min(count / maxCount, 1);
        // Go from green (low) to yellow to red (high)
        if (intensity < 0.33) {
            return `rgba(16, 185, 129, ${0.3 + intensity * 1.5})`; // Green
        } else if (intensity < 0.66) {
            return `rgba(245, 158, 11, ${0.3 + intensity * 1.2})`; // Yellow/Orange
        } else {
            return `rgba(239, 68, 68, ${0.5 + intensity * 0.5})`; // Red
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        if (timeRange === '24h') {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    return (
        <div className="heatmap-page">
            <header className="page-header">
                <div className="header-left">
                    <button className="back-btn" onClick={() => router.push('/sec-ops-dashboard/dashboard')}>
                        ← Dashboard
                    </button>
                    <h1>🔥 Auth Failure Heatmap</h1>
                </div>
                <div className="header-right">
                    <div className="time-selector">
                        <button
                            className={timeRange === '24h' ? 'active' : ''}
                            onClick={() => setTimeRange('24h')}
                        >
                            24 Hours
                        </button>
                        <button
                            className={timeRange === '7d' ? 'active' : ''}
                            onClick={() => setTimeRange('7d')}
                        >
                            7 Days
                        </button>
                        <button
                            className={timeRange === '30d' ? 'active' : ''}
                            onClick={() => setTimeRange('30d')}
                        >
                            30 Days
                        </button>
                    </div>
                    <button onClick={fetchHeatmap} disabled={isLoading}>🔄 Refresh</button>
                </div>
            </header>

            {isLoading ? (
                <div className="loading">Loading heatmap data...</div>
            ) : !heatmapData || heatmapData.buckets.length === 0 ? (
                <div className="no-data">
                    <p>No auth failure data for selected period</p>
                </div>
            ) : (
                <>
                    {/* Legend */}
                    <div className="legend">
                        <span>Low</span>
                        <div className="legend-gradient"></div>
                        <span>High ({heatmapData.maxCount} max)</span>
                    </div>

                    {/* Heatmap Grid */}
                    <div className="heatmap-container">
                        <div className="heatmap-grid">
                            {heatmapData.buckets.map((bucket, idx) => (
                                <div
                                    key={idx}
                                    className="heatmap-cell"
                                    style={{ backgroundColor: getHeatColor(bucket.count, heatmapData.maxCount) }}
                                    title={`${formatTime(bucket.timestamp)}: ${bucket.count} events`}
                                >
                                    <span className="cell-count">{bucket.count > 0 ? bucket.count : ''}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Severity Breakdown */}
                    <div className="severity-section">
                        <h2>Severity Distribution</h2>
                        <div className="severity-cards">
                            {['CRITICAL', 'HIGH', 'WARN'].map((severity) => {
                                const total = heatmapData.buckets.reduce((sum, b) =>
                                    sum + (b.bySeverity?.[severity] || 0), 0);
                                return (
                                    <div key={severity} className={`severity-card ${severity.toLowerCase()}`}>
                                        <div className="severity-count">{total}</div>
                                        <div className="severity-label">{severity}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
        .heatmap-page {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .page-header {
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

        .back-btn {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid var(--sec-border);
          border-radius: 8px;
          color: var(--sec-text);
          cursor: pointer;
        }

        h1 {
          margin: 0;
          font-size: 24px;
          color: #fff;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .time-selector {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          overflow: hidden;
        }

        .time-selector button {
          padding: 10px 20px;
          background: transparent;
          border: none;
          color: var(--sec-text);
          cursor: pointer;
          transition: all 0.2s;
        }

        .time-selector button.active {
          background: var(--sec-primary);
          color: #000;
        }

        .header-right > button {
          padding: 10px 16px;
          background: transparent;
          border: 1px solid var(--sec-border);
          border-radius: 8px;
          color: var(--sec-text);
          cursor: pointer;
        }

        .loading, .no-data {
          text-align: center;
          padding: 60px;
          color: var(--sec-text-muted);
        }

        .legend {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
          color: var(--sec-text-muted);
          font-size: 12px;
        }

        .legend-gradient {
          width: 200px;
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(to right, rgba(16, 185, 129, 0.5), rgba(245, 158, 11, 0.7), rgba(239, 68, 68, 1));
        }

        .heatmap-container {
          background: var(--sec-bg-card);
          border: 1px solid var(--sec-border);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .heatmap-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
          gap: 4px;
        }

        .heatmap-cell {
          aspect-ratio: 1;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
          cursor: pointer;
        }

        .heatmap-cell:hover {
          transform: scale(1.1);
          z-index: 1;
        }

        .cell-count {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .severity-section {
          background: var(--sec-bg-card);
          border: 1px solid var(--sec-border);
          border-radius: 12px;
          padding: 24px;
        }

        .severity-section h2 {
          margin: 0 0 16px 0;
          font-size: 16px;
          color: #fff;
        }

        .severity-cards {
          display: flex;
          gap: 16px;
        }

        .severity-card {
          flex: 1;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }

        .severity-card.critical { background: rgba(220, 38, 38, 0.2); }
        .severity-card.high { background: rgba(239, 68, 68, 0.2); }
        .severity-card.warn { background: rgba(245, 158, 11, 0.2); }

        .severity-count {
          font-size: 32px;
          font-weight: 700;
          color: #fff;
        }

        .severity-label {
          font-size: 12px;
          color: var(--sec-text-muted);
          margin-top: 4px;
        }
      `}</style>
        </div>
    );
}
