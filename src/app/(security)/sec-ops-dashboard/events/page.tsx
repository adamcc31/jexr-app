'use client';

// Prevent static generation - requires runtime context
export const dynamic = 'force-dynamic';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSecurityAuth } from '@/contexts/SecurityDashboardContext';

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

// API base URL for security dashboard - uses hidden endpoint
// MUST match SECURITY_DASHBOARD_PATH in backend
const SECURITY_API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL + '/v1/sec-console-rahasia';

export default function SecurityEventsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, logout } = useSecurityAuth();

  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    severity: '',
    ip: '',
    eventType: '',
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
      'CRITICAL': '#dc2626',
      'HIGH': '#ef4444',
      'WARN': '#f59e0b',
      'MEDIUM': '#3b82f6',
      'INFO': '#10b981',
    };
    return colors[severity] || '#6b7280';
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="events-page">
      <header className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => router.push('/sec-ops-dashboard/dashboard')}>
            ← Dashboard
          </button>
          <h1>📋 Security Events</h1>
        </div>
        <div className="header-right">
          <span className="total-count">{total.toLocaleString()} events</span>
          <button onClick={fetchEvents} disabled={isLoading}>🔄 Refresh</button>
        </div>
      </header>

      {/* Filters */}
      <div className="filters">
        <select
          value={filters.severity}
          onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
        >
          <option value="">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="WARN">Warning</option>
          <option value="MEDIUM">Medium</option>
          <option value="INFO">Info</option>
        </select>
        <input
          type="text"
          placeholder="Filter by IP..."
          value={filters.ip}
          onChange={(e) => setFilters({ ...filters, ip: e.target.value })}
        />
        <button onClick={() => { setPage(1); fetchEvents(); }}>Apply Filters</button>
        <button onClick={() => { setFilters({ severity: '', ip: '', eventType: '' }); setPage(1); }}>
          Clear
        </button>
      </div>

      {/* Events Table */}
      <div className="events-table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Severity</th>
              <th>Event Type</th>
              <th>Subject</th>
              <th>IP Address</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td className="time-cell">
                  {new Date(event.timestamp).toLocaleString()}
                </td>
                <td>
                  <span
                    className="severity-badge"
                    style={{ backgroundColor: getSeverityColor(event.severity) }}
                  >
                    {event.severity}
                  </span>
                </td>
                <td className="event-type-cell">{event.eventType}</td>
                <td className="subject-cell">
                  {event.subjectType && (
                    <span className="subject-type">{event.subjectType}:</span>
                  )}
                  {event.subjectValue || '-'}
                </td>
                <td className="ip-cell">{event.ip || '-'}</td>
                <td className="details-cell">
                  {event.details && Object.keys(event.details).length > 0 && (
                    <code>{JSON.stringify(event.details).slice(0, 50)}...</code>
                  )}
                </td>
              </tr>
            ))}
            {events.length === 0 && !isLoading && (
              <tr>
                <td colSpan={6} className="empty-cell">No events found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          ← Previous
        </button>
        <span>Page {page} of {totalPages || 1}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next →
        </button>
      </div>

      <style jsx>{`
        .events-page {
          padding: 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
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

        .total-count {
          color: var(--sec-text-muted);
        }

        .header-right button {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid var(--sec-border);
          border-radius: 8px;
          color: var(--sec-text);
          cursor: pointer;
        }

        .filters {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filters select, .filters input {
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--sec-border);
          border-radius: 8px;
          color: #fff;
          min-width: 150px;
        }

        .filters button {
          padding: 10px 20px;
          background: var(--sec-primary);
          border: none;
          border-radius: 8px;
          color: #000;
          cursor: pointer;
        }

        .filters button:last-child {
          background: transparent;
          border: 1px solid var(--sec-border);
          color: var(--sec-text);
        }

        .events-table-container {
          background: var(--sec-bg-card);
          border: 1px solid var(--sec-border);
          border-radius: 12px;
          overflow: hidden;
        }

        .events-table {
          width: 100%;
          border-collapse: collapse;
        }

        .events-table th {
          padding: 14px 16px;
          text-align: left;
          background: rgba(255, 255, 255, 0.05);
          color: var(--sec-text-muted);
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
        }

        .events-table td {
          padding: 12px 16px;
          border-top: 1px solid var(--sec-border);
          font-size: 13px;
        }

        .events-table tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        .time-cell {
          font-family: monospace;
          color: var(--sec-text-muted);
          white-space: nowrap;
        }

        .severity-badge {
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          color: #fff;
        }

        .event-type-cell {
          font-family: monospace;
        }

        .subject-cell .subject-type {
          color: var(--sec-text-muted);
          margin-right: 4px;
        }

        .ip-cell {
          font-family: monospace;
        }

        .details-cell code {
          font-size: 11px;
          color: var(--sec-text-muted);
        }

        .empty-cell {
          text-align: center;
          color: var(--sec-text-muted);
          padding: 40px !important;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
        }

        .pagination button {
          padding: 10px 20px;
          background: transparent;
          border: 1px solid var(--sec-border);
          border-radius: 8px;
          color: var(--sec-text);
          cursor: pointer;
        }

        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination span {
          color: var(--sec-text-muted);
        }
      `}</style>
    </div>
  );
}
