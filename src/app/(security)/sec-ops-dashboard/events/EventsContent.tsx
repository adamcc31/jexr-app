'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSecurityAuth } from '@/contexts/SecurityDashboardContext';
import Sidebar from '../components/Sidebar';

interface SecurityEvent {
  id: number;
  timestamp: string;
  eventType: string;
  severity: string;
  subjectType?: string;
  subjectValue?: string;
  ip?: string;
  userAgent?: string;
  requestId?: string;
  details?: Record<string, any>;
}

const SECURITY_API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL + '/v1/sec-console-rahasia';

const EVENT_TYPES = [
  'LOGIN_FAILED',
  'LOGIN_SUCCESS',
  'RATE_LIMITED',
  'IP_BLOCKED',
  'CSRF_VIOLATION',
  'BRUTE_FORCE',
  'BREAK_GLASS',
  'SUSPICIOUS_ACTIVITY',
];

export default function EventsContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useSecurityAuth();

  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState({
    severity: '',
    ip: '',
    eventType: '',
    timeRange: '24h',
  });

  const pageSize = 50;

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        offset: ((page - 1) * pageSize).toString(),
      });
      if (filters.severity) params.append('severity', filters.severity);
      if (filters.ip) params.append('ip', filters.ip);

      const res = await fetch(`${SECURITY_API_BASE}/events?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch events');

      const data = await res.json();
      setEvents(data.data?.events || []);
      setTotal(data.data?.total || 0);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, filters, pageSize]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/sec-ops-dashboard/login');
      return;
    }
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated, authLoading, router, fetchEvents]);

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

  const getSeverityBg = (severity: string) => {
    const colors: Record<string, string> = {
      'CRITICAL': 'rgba(255, 77, 79, 0.15)',
      'HIGH': 'rgba(239, 68, 68, 0.12)',
      'WARN': 'rgba(250, 173, 20, 0.12)',
      'MEDIUM': 'rgba(59, 130, 246, 0.12)',
      'INFO': 'rgba(82, 196, 26, 0.12)',
    };
    return colors[severity] || 'rgba(107, 114, 128, 0.12)';
  };

  const toggleRow = (id: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="events-layout">
      <Sidebar />

      <main className="events-main">
        {/* Header */}
        <header className="page-header">
          <div className="header-left">
            <h1>📋 Security Events</h1>
            <span className="header-subtitle">SOC-style event investigation</span>
          </div>
          <div className="header-right">
            <span className="total-count">
              <span className="count-value">{total.toLocaleString()}</span>
              <span className="count-label">total events</span>
            </span>
            <button
              className="refresh-btn"
              onClick={fetchEvents}
              disabled={isLoading}
            >
              <span className={`refresh-icon ${isLoading ? 'spinning' : ''}`}>🔄</span>
              Refresh
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="filters-card">
          <div className="filters-row">
            <div className="filter-group">
              <label>Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              >
                <option value="">All Severities</option>
                <option value="CRITICAL">🔴 Critical</option>
                <option value="HIGH">🟠 High</option>
                <option value="WARN">🟡 Warning</option>
                <option value="MEDIUM">🔵 Medium</option>
                <option value="INFO">🟢 Info</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Event Type</label>
              <select
                value={filters.eventType}
                onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
              >
                <option value="">All Types</option>
                {EVENT_TYPES.map(type => (
                  <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Time Range</label>
              <select
                value={filters.timeRange}
                onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>

            <div className="filter-group">
              <label>IP Address</label>
              <input
                type="text"
                placeholder="Filter by IP..."
                value={filters.ip}
                onChange={(e) => setFilters({ ...filters, ip: e.target.value })}
              />
            </div>

            <div className="filter-actions">
              <button
                className="apply-btn"
                onClick={() => { setPage(1); fetchEvents(); }}
              >
                Apply Filters
              </button>
              <button
                className="clear-btn"
                onClick={() => {
                  setFilters({ severity: '', ip: '', eventType: '', timeRange: '24h' });
                  setPage(1);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="events-table-wrapper">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading events...</p>
            </div>
          ) : (
            <table className="events-table">
              <thead>
                <tr>
                  <th className="th-expand"></th>
                  <th className="th-timestamp">Timestamp</th>
                  <th className="th-severity">Severity</th>
                  <th className="th-type">Event Type</th>
                  <th className="th-subject">Subject</th>
                  <th className="th-ip">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <React.Fragment key={event.id}>
                    <tr
                      className={`event-row ${expandedRows.has(event.id) ? 'expanded' : ''}`}
                      onClick={() => toggleRow(event.id)}
                      style={{
                        borderLeft: `3px solid ${getSeverityColor(event.severity)}`,
                        background: expandedRows.has(event.id) ? getSeverityBg(event.severity) : 'transparent'
                      }}
                    >
                      <td className="td-expand">
                        <span className="expand-icon">
                          {expandedRows.has(event.id) ? '▼' : '▶'}
                        </span>
                      </td>
                      <td className="td-timestamp mono">
                        {new Date(event.timestamp).toLocaleString()}
                      </td>
                      <td className="td-severity">
                        <span
                          className="severity-badge"
                          style={{
                            backgroundColor: getSeverityColor(event.severity),
                            boxShadow: `0 0 8px ${getSeverityColor(event.severity)}`
                          }}
                        >
                          {event.severity}
                        </span>
                      </td>
                      <td className="td-type mono">{event.eventType}</td>
                      <td className="td-subject">
                        {event.subjectType && (
                          <span className="subject-type">{event.subjectType}: </span>
                        )}
                        <span className="subject-value">{event.subjectValue || '-'}</span>
                      </td>
                      <td className="td-ip mono">{event.ip || '-'}</td>
                    </tr>

                    {/* Expanded Details Row */}
                    {expandedRows.has(event.id) && (
                      <tr className="details-row">
                        <td colSpan={6}>
                          <div className="event-details">
                            <div className="details-grid">
                              <div className="detail-item">
                                <span className="detail-label">Event ID</span>
                                <span className="detail-value mono">#{event.id}</span>
                              </div>
                              {event.requestId && (
                                <div className="detail-item">
                                  <span className="detail-label">Request ID</span>
                                  <span className="detail-value mono copyable" onClick={(e) => { e.stopPropagation(); copyToClipboard(event.requestId!); }}>
                                    {event.requestId}
                                    <span className="copy-icon">📋</span>
                                  </span>
                                </div>
                              )}
                              {event.userAgent && (
                                <div className="detail-item full-width">
                                  <span className="detail-label">User Agent</span>
                                  <span className="detail-value mono">{event.userAgent}</span>
                                </div>
                              )}
                              {event.details && Object.keys(event.details).length > 0 && (
                                <div className="detail-item full-width">
                                  <span className="detail-label">Additional Details</span>
                                  <pre className="detail-json">{JSON.stringify(event.details, null, 2)}</pre>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {events.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={6} className="empty-cell">
                      <div className="empty-state">
                        <span className="empty-icon">📭</span>
                        <p>No events found matching your filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage(1)}
          >
            ⏮ First
          </button>
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            ← Previous
          </button>
          <div className="page-info">
            <span className="page-current">Page {page}</span>
            <span className="page-total">of {totalPages || 1}</span>
          </div>
          <button
            className="page-btn"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next →
          </button>
          <button
            className="page-btn"
            disabled={page >= totalPages}
            onClick={() => setPage(totalPages)}
          >
            Last ⏭
          </button>
        </div>
      </main>

      <style jsx>{`
        .events-layout {
          display: flex;
          min-height: 100vh;
        }

        .events-main {
          flex: 1;
          margin-left: 240px;
          padding: 24px 32px;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .events-main {
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

        .total-count {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .count-value {
          font-size: 20px;
          font-weight: 700;
          color: var(--sec-text-primary);
        }

        .count-label {
          font-size: 11px;
          color: var(--sec-text-secondary);
          text-transform: uppercase;
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

        /* Filters */
        .filters-card {
          background: var(--sec-bg-card);
          border: 1px solid var(--sec-border);
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        }

        .filters-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: flex-end;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-group label {
          font-size: 11px;
          font-weight: 600;
          color: var(--sec-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-group select,
        .filter-group input {
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--sec-border);
          border-radius: 8px;
          color: var(--sec-text-primary);
          font-size: 13px;
          min-width: 160px;
          font-family: var(--font-primary);
        }

        .filter-group select:focus,
        .filter-group input:focus {
          outline: none;
          border-color: var(--sec-accent-primary);
        }

        .filter-actions {
          display: flex;
          gap: 8px;
          margin-left: auto;
        }

        .apply-btn,
        .clear-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .apply-btn {
          background: var(--sec-accent-primary);
          border: none;
          color: #000;
        }

        .apply-btn:hover {
          filter: brightness(1.1);
        }

        .clear-btn {
          background: transparent;
          border: 1px solid var(--sec-border);
          color: var(--sec-text-secondary);
        }

        .clear-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          color: var(--sec-text-primary);
        }

        /* Table */
        .events-table-wrapper {
          background: var(--sec-bg-card);
          border: 1px solid var(--sec-border);
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          gap: 16px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--sec-border);
          border-top-color: var(--sec-accent-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-state p {
          color: var(--sec-text-secondary);
          font-size: 14px;
        }

        .events-table {
          width: 100%;
          border-collapse: collapse;
        }

        .events-table th {
          padding: 14px 16px;
          text-align: left;
          background: rgba(255, 255, 255, 0.03);
          color: var(--sec-text-secondary);
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid var(--sec-border);
        }

        .th-expand { width: 40px; }
        .th-timestamp { width: 180px; }
        .th-severity { width: 100px; }
        .th-type { width: 160px; }

        .events-table td {
          padding: 14px 16px;
          font-size: 13px;
          border-bottom: 1px solid var(--sec-border);
          vertical-align: middle;
        }

        .event-row {
          cursor: pointer;
          transition: all 0.2s;
        }

        .event-row:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }

        .expand-icon {
          font-size: 10px;
          color: var(--sec-text-muted);
          transition: transform 0.2s;
        }

        .mono {
          font-family: var(--font-mono);
        }

        .td-timestamp {
          color: var(--sec-text-secondary);
          white-space: nowrap;
          font-size: 12px;
        }

        .severity-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .subject-type {
          color: var(--sec-text-muted);
          font-size: 11px;
        }

        .subject-value {
          color: var(--sec-text-primary);
        }

        .td-ip {
          color: var(--sec-text-secondary);
          font-size: 12px;
        }

        /* Details Row */
        .details-row td {
          padding: 0;
          background: rgba(0, 0, 0, 0.2);
        }

        .event-details {
          padding: 20px 24px 20px 56px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-label {
          font-size: 10px;
          font-weight: 600;
          color: var(--sec-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 13px;
          color: var(--sec-text-primary);
        }

        .detail-value.copyable {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .detail-value.copyable:hover {
          color: var(--sec-accent-primary);
        }

        .copy-icon {
          font-size: 12px;
          opacity: 0.5;
        }

        .detail-json {
          margin: 0;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          font-size: 11px;
          color: var(--sec-text-secondary);
          overflow-x: auto;
        }

        /* Empty State */
        .empty-cell {
          padding: 40px !important;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .empty-icon {
          font-size: 40px;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .empty-state p {
          margin: 0;
          color: var(--sec-text-muted);
          font-size: 14px;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .page-btn {
          padding: 10px 16px;
          background: var(--sec-bg-card);
          border: 1px solid var(--sec-border);
          border-radius: 8px;
          color: var(--sec-text-primary);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .page-btn:hover:not(:disabled) {
          background: var(--sec-bg-elevated);
          border-color: var(--sec-accent-primary);
        }

        .page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .page-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--sec-bg-elevated);
          border-radius: 8px;
        }

        .page-current {
          font-weight: 600;
          color: var(--sec-text-primary);
        }

        .page-total {
          color: var(--sec-text-secondary);
        }
      `}</style>
    </div>
  );
}
