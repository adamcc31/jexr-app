'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSecurityAuth } from '@/contexts/SecurityDashboardContext';
import Sidebar from '../components/Sidebar';

const EVENT_TYPES = [
    { key: 'LOGIN_FAILED', label: 'Failed Logins' },
    { key: 'RATE_LIMITED', label: 'Rate Limited' },
    { key: 'IP_BLOCKED', label: 'Blocked Attempts' },
    { key: 'BREAK_GLASS', label: 'Break-Glass Access' },
    { key: 'SUSPICIOUS_ACTIVITY', label: 'Suspicious Activity' },
];

const SEVERITIES = ['CRITICAL', 'HIGH', 'WARN', 'MEDIUM', 'INFO'];

const SECURITY_API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL + '/v1/sec-console-rahasia';

export default function ExportContent() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading, hasRole } = useSecurityAuth();

    const [dateFrom, setDateFrom] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().split('T')[0];
    });
    const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0]);
    const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(['LOGIN_FAILED', 'RATE_LIMITED', 'IP_BLOCKED']);
    const [selectedSeverities, setSelectedSeverities] = useState<string[]>(['CRITICAL', 'HIGH', 'WARN']);
    const [format, setFormat] = useState<'csv' | 'json'>('csv');
    const [isExporting, setIsExporting] = useState(false);
    const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [estimatedCount, setEstimatedCount] = useState<number | null>(null);

    // Role check - redirect if not analyst or admin
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace('/sec-ops-dashboard/login');
            return;
        }
        if (!authLoading && isAuthenticated && !hasRole('SECURITY_ANALYST')) {
            router.replace('/sec-ops-dashboard/dashboard');
        }
    }, [isAuthenticated, authLoading, hasRole, router]);

    // Estimate count when filters change
    useEffect(() => {
        // This would normally call an API endpoint to get estimated count
        // For now, just simulate it
        const simulatedCount = Math.floor(Math.random() * 5000) + 500;
        setEstimatedCount(simulatedCount);
    }, [dateFrom, dateTo, selectedEventTypes, selectedSeverities]);

    const toggleEventType = (type: string) => {
        setSelectedEventTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const toggleSeverity = (severity: string) => {
        setSelectedSeverities(prev =>
            prev.includes(severity) ? prev.filter(s => s !== severity) : [...prev, severity]
        );
    };

    const handleExport = async () => {
        setIsExporting(true);
        setExportStatus('idle');

        try {
            const params = new URLSearchParams({
                startDate: dateFrom,
                endDate: dateTo,
                format,
                eventTypes: selectedEventTypes.join(','),
                severities: selectedSeverities.join(','),
            });

            const res = await fetch(`${SECURITY_API_BASE}/export?${params}`, {
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Export failed');

            // Get the blob and trigger download
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `security-events-${dateFrom}-to-${dateTo}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setExportStatus('success');
        } catch (err) {
            console.error('Export failed:', err);
            setExportStatus('error');
        } finally {
            setIsExporting(false);
        }
    };

    if (authLoading || (!authLoading && !hasRole('SECURITY_ANALYST'))) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner" />
                <p>Checking permissions...</p>
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

    return (
        <div className="export-layout">
            <Sidebar />

            <main className="export-main">
                {/* Header */}
                <header className="page-header">
                    <div className="header-left">
                        <h1>📤 Export Security Data</h1>
                        <span className="header-subtitle">Forensic analysis & reporting</span>
                    </div>
                    <div className="role-badge">
                        <span className="badge-icon">🔐</span>
                        <span>Analyst+ Access</span>
                    </div>
                </header>

                {/* Warning Banner */}
                <div className="warning-banner">
                    <span className="warning-icon">⚠️</span>
                    <div className="warning-content">
                        <strong>Sensitive Data Warning</strong>
                        <p>Exported data may contain IP addresses, user identifiers, and detailed security event information. Handle according to your organization&apos;s data protection policies.</p>
                    </div>
                </div>

                {/* Export Form */}
                <div className="export-card">
                    <div className="form-section">
                        <h3>📅 Date Range</h3>
                        <div className="date-inputs">
                            <div className="date-group">
                                <label>From</label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    max={dateTo}
                                />
                            </div>
                            <span className="date-separator">to</span>
                            <div className="date-group">
                                <label>To</label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    min={dateFrom}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>📋 Event Types</h3>
                        <div className="checkbox-grid">
                            {EVENT_TYPES.map(({ key, label }) => (
                                <label key={key} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedEventTypes.includes(key)}
                                        onChange={() => toggleEventType(key)}
                                    />
                                    <span className="checkmark" />
                                    <span className="checkbox-label">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>🎯 Severity Filter</h3>
                        <div className="severity-chips">
                            {SEVERITIES.map((severity) => (
                                <button
                                    key={severity}
                                    className={`severity-chip ${severity.toLowerCase()} ${selectedSeverities.includes(severity) ? 'active' : ''}`}
                                    onClick={() => toggleSeverity(severity)}
                                >
                                    {severity}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>📄 Export Format</h3>
                        <div className="format-options">
                            <label className={`format-option ${format === 'csv' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="format"
                                    value="csv"
                                    checked={format === 'csv'}
                                    onChange={() => setFormat('csv')}
                                />
                                <div className="format-content">
                                    <span className="format-icon">📊</span>
                                    <span className="format-name">CSV</span>
                                    <span className="format-desc">Spreadsheet compatible</span>
                                </div>
                            </label>
                            <label className={`format-option ${format === 'json' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="format"
                                    value="json"
                                    checked={format === 'json'}
                                    onChange={() => setFormat('json')}
                                />
                                <div className="format-content">
                                    <span className="format-icon">🔧</span>
                                    <span className="format-name">JSON</span>
                                    <span className="format-desc">Machine readable</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Estimate */}
                    <div className="estimate-bar">
                        <div className="estimate-info">
                            <span className="estimate-label">Estimated:</span>
                            <span className="estimate-value">~{estimatedCount?.toLocaleString() || '...'} events</span>
                            <span className="estimate-size">• ~{((estimatedCount || 0) * 0.5 / 1024).toFixed(1)} MB</span>
                        </div>
                    </div>

                    {/* Status Messages */}
                    {exportStatus === 'success' && (
                        <div className="status-message success">
                            <span className="status-icon">✅</span>
                            <span>Export completed successfully! Check your downloads folder.</span>
                        </div>
                    )}
                    {exportStatus === 'error' && (
                        <div className="status-message error">
                            <span className="status-icon">❌</span>
                            <span>Export failed. Please try again or contact support.</span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="form-actions">
                        <button
                            className="cancel-btn"
                            onClick={() => router.push('/sec-ops-dashboard/dashboard')}
                        >
                            Cancel
                        </button>
                        <button
                            className="export-btn"
                            onClick={handleExport}
                            disabled={isExporting || selectedEventTypes.length === 0 || selectedSeverities.length === 0}
                        >
                            {isExporting ? (
                                <>
                                    <span className="btn-spinner" />
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    📥 Export Data
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>

            <style jsx>{`
        .export-layout {
          display: flex;
          min-height: 100vh;
        }

        .export-main {
          flex: 1;
          margin-left: 240px;
          padding: 24px 32px;
          position: relative;
          z-index: 1;
          max-width: 900px;
        }

        @media (max-width: 768px) {
          .export-main {
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

        .role-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: rgba(0, 180, 255, 0.1);
          border: 1px solid rgba(0, 180, 255, 0.3);
          border-radius: 20px;
          font-size: 12px;
          color: var(--sec-accent-primary);
        }

        /* Warning Banner */
        .warning-banner {
          display: flex;
          gap: 16px;
          padding: 16px 20px;
          background: rgba(250, 173, 20, 0.1);
          border: 1px solid rgba(250, 173, 20, 0.3);
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .warning-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .warning-content strong {
          display: block;
          font-size: 14px;
          color: var(--sec-status-warning);
          margin-bottom: 4px;
        }

        .warning-content p {
          margin: 0;
          font-size: 13px;
          color: var(--sec-text-secondary);
          line-height: 1.5;
        }

        /* Export Card */
        .export-card {
          background: var(--sec-bg-card);
          border: 1px solid var(--sec-border);
          border-radius: 16px;
          padding: 28px;
        }

        .form-section {
          margin-bottom: 28px;
        }

        .form-section h3 {
          font-size: 14px;
          font-weight: 600;
          color: var(--sec-text-primary);
          margin: 0 0 16px 0;
        }

        /* Date Inputs */
        .date-inputs {
          display: flex;
          align-items: flex-end;
          gap: 16px;
        }

        .date-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .date-group label {
          font-size: 11px;
          font-weight: 600;
          color: var(--sec-text-secondary);
          text-transform: uppercase;
        }

        .date-group input {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--sec-border);
          border-radius: 8px;
          color: var(--sec-text-primary);
          font-size: 14px;
          font-family: var(--font-primary);
        }

        .date-group input:focus {
          outline: none;
          border-color: var(--sec-accent-primary);
        }

        .date-separator {
          color: var(--sec-text-muted);
          padding-bottom: 12px;
        }

        /* Checkbox Grid */
        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--sec-border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .checkbox-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .checkbox-item input {
          display: none;
        }

        .checkmark {
          width: 18px;
          height: 18px;
          border: 2px solid var(--sec-border);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .checkbox-item input:checked + .checkmark {
          background: var(--sec-accent-primary);
          border-color: var(--sec-accent-primary);
        }

        .checkbox-item input:checked + .checkmark::after {
          content: '✓';
          color: #000;
          font-size: 12px;
          font-weight: 700;
        }

        .checkbox-label {
          font-size: 13px;
          color: var(--sec-text-primary);
        }

        /* Severity Chips */
        .severity-chips {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .severity-chip {
          padding: 10px 20px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.05);
          color: var(--sec-text-secondary);
        }

        .severity-chip:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .severity-chip.active.critical {
          background: rgba(255, 77, 79, 0.2);
          border-color: var(--sec-status-critical);
          color: var(--sec-status-critical);
        }

        .severity-chip.active.high {
          background: rgba(239, 68, 68, 0.2);
          border-color: var(--sec-status-high);
          color: var(--sec-status-high);
        }

        .severity-chip.active.warn {
          background: rgba(250, 173, 20, 0.2);
          border-color: var(--sec-status-warning);
          color: var(--sec-status-warning);
        }

        .severity-chip.active.medium {
          background: rgba(59, 130, 246, 0.2);
          border-color: var(--sec-status-info);
          color: var(--sec-status-info);
        }

        .severity-chip.active.info {
          background: rgba(82, 196, 26, 0.2);
          border-color: var(--sec-status-success);
          color: var(--sec-status-success);
        }

        /* Format Options */
        .format-options {
          display: flex;
          gap: 16px;
        }

        .format-option {
          flex: 1;
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--sec-border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .format-option:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .format-option.active {
          background: rgba(0, 180, 255, 0.1);
          border-color: var(--sec-accent-primary);
        }

        .format-option input {
          display: none;
        }

        .format-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .format-icon {
          font-size: 28px;
        }

        .format-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--sec-text-primary);
        }

        .format-desc {
          font-size: 11px;
          color: var(--sec-text-secondary);
        }

        /* Estimate Bar */
        .estimate-bar {
          padding: 16px 20px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .estimate-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .estimate-label {
          font-size: 13px;
          color: var(--sec-text-secondary);
        }

        .estimate-value {
          font-size: 14px;
          font-weight: 600;
          color: var(--sec-text-primary);
          font-family: var(--font-mono);
        }

        .estimate-size {
          font-size: 12px;
          color: var(--sec-text-muted);
        }

        /* Status Messages */
        .status-message {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 13px;
        }

        .status-message.success {
          background: rgba(82, 196, 26, 0.1);
          border: 1px solid rgba(82, 196, 26, 0.3);
          color: var(--sec-status-success);
        }

        .status-message.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: var(--sec-status-high);
        }

        .status-icon {
          font-size: 16px;
        }

        /* Actions */
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid var(--sec-border);
        }

        .cancel-btn,
        .export-btn {
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cancel-btn {
          background: transparent;
          border: 1px solid var(--sec-border);
          color: var(--sec-text-secondary);
        }

        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          color: var(--sec-text-primary);
        }

        .export-btn {
          background: var(--sec-accent-primary);
          border: none;
          color: #000;
        }

        .export-btn:hover:not(:disabled) {
          filter: brightness(1.1);
        }

        .export-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(0, 0, 0, 0.2);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
