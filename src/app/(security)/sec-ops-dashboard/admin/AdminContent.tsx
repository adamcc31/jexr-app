'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSecurityAuth } from '@/contexts/SecurityDashboardContext';
import Sidebar from '../components/Sidebar';

interface SecurityUser {
    id: string;
    username: string;
    email: string;
    role: string;
    status: 'active' | 'disabled';
    lastLogin?: string;
}

interface AuditLogEntry {
    id: number;
    timestamp: string;
    actor: string;
    action: string;
    details?: string;
}

const SECURITY_API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL + '/v1/sec-console-rahasia';

export default function AdminContent() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading, hasRole, user: currentUser } = useSecurityAuth();

    const [users, setUsers] = useState<SecurityUser[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'policies' | 'audit' | 'danger'>('users');

    // Policy settings (simulated)
    const [policies, setPolicies] = useState({
        loginAttemptsPerIP: 5,
        loginWindowMinutes: 5,
        lockoutAttempts: 3,
        lockoutDurationMinutes: 15,
        sessionTimeoutMinutes: 30,
    });

    const [showConfirmDialog, setShowConfirmDialog] = useState<{ action: string; callback: () => void } | null>(null);

    // Role check - redirect if not admin
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace('/sec-ops-dashboard/login');
            return;
        }
        if (!authLoading && isAuthenticated && !hasRole('SECURITY_ADMIN')) {
            router.replace('/sec-ops-dashboard/dashboard');
        }
    }, [isAuthenticated, authLoading, hasRole, router]);

    // Fetch data
    useEffect(() => {
        if (isAuthenticated && hasRole('SECURITY_ADMIN')) {
            // Simulated data - in production, this would call the API
            setUsers([
                { id: '1', username: 'sec_observer', email: 'observer@example.com', role: 'SECURITY_OBSERVER', status: 'active', lastLogin: '2026-01-08T21:30:00Z' },
                { id: '2', username: 'sec_analyst', email: 'analyst@example.com', role: 'SECURITY_ANALYST', status: 'active', lastLogin: '2026-01-08T20:15:00Z' },
                { id: '3', username: 'sec_admin', email: 'admin@example.com', role: 'SECURITY_ADMIN', status: 'active', lastLogin: '2026-01-08T22:00:00Z' },
            ]);

            setAuditLogs([
                { id: 1, timestamp: '2026-01-08T22:00:15Z', actor: 'sec_admin', action: 'Updated rate limit policy', details: 'Changed from 10 to 5 attempts per 5 minutes' },
                { id: 2, timestamp: '2026-01-08T21:45:32Z', actor: 'sec_admin', action: 'Disabled user', details: 'User: attacker_test' },
                { id: 3, timestamp: '2026-01-08T20:12:08Z', actor: 'sec_analyst', action: 'Exported events', details: '500 events, CSV format' },
                { id: 4, timestamp: '2026-01-08T19:30:00Z', actor: 'sec_admin', action: 'Created new user', details: 'User: sec_observer' },
                { id: 5, timestamp: '2026-01-08T18:15:22Z', actor: 'sec_admin', action: 'Modified session timeout', details: 'Changed from 60 to 30 minutes' },
            ]);

            setIsLoading(false);
        }
    }, [isAuthenticated, hasRole]);

    const handlePolicyChange = (key: string, value: number) => {
        setPolicies(prev => ({ ...prev, [key]: value }));
    };

    const handleSavePolicies = () => {
        // In production, this would call the API
        console.log('Saving policies:', policies);
        // Show success message
    };

    const handleDangerAction = (action: string, callback: () => void) => {
        setShowConfirmDialog({ action, callback });
    };

    const executeConfirmedAction = () => {
        if (showConfirmDialog) {
            showConfirmDialog.callback();
            setShowConfirmDialog(null);
        }
    };

    const getRoleColor = (role: string) => {
        const colors: Record<string, string> = {
            'SECURITY_ADMIN': 'var(--sec-status-critical)',
            'SECURITY_ANALYST': 'var(--sec-status-warning)',
            'SECURITY_OBSERVER': 'var(--sec-status-info)',
        };
        return colors[role] || 'var(--sec-text-secondary)';
    };

    if (authLoading || (!authLoading && !hasRole('SECURITY_ADMIN'))) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner" />
                <p>Checking admin permissions...</p>
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
        <div className="admin-layout">
            <Sidebar />

            <main className="admin-main">
                {/* Header */}
                <header className="page-header">
                    <div className="header-left">
                        <h1>⚙️ Admin Panel</h1>
                        <span className="header-subtitle">System control & configuration</span>
                    </div>
                    <div className="admin-badge">
                        <span className="badge-icon">🔴</span>
                        <span>Admin-Only Area</span>
                    </div>
                </header>

                {/* Tab Navigation */}
                <div className="tab-nav">
                    {[
                        { key: 'users', label: 'Users', icon: '👥' },
                        { key: 'policies', label: 'Security Policies', icon: '🔒' },
                        { key: 'audit', label: 'Audit Log', icon: '📜' },
                        { key: 'danger', label: 'Danger Zone', icon: '⚠️' },
                    ].map(({ key, label, icon }) => (
                        <button
                            key={key}
                            className={`tab-btn ${activeTab === key ? 'active' : ''} ${key === 'danger' ? 'danger' : ''}`}
                            onClick={() => setActiveTab(key as typeof activeTab)}
                        >
                            <span className="tab-icon">{icon}</span>
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="content-card">
                            <div className="card-header">
                                <h2>👥 User Management</h2>
                                <button className="add-btn">+ Add User</button>
                            </div>
                            <div className="users-table-wrapper">
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Last Login</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="user-cell">
                                                        <span className="user-avatar">👤</span>
                                                        <div className="user-info">
                                                            <span className="user-name">{user.username}</span>
                                                            <span className="user-email">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span
                                                        className="role-badge"
                                                        style={{ color: getRoleColor(user.role), borderColor: getRoleColor(user.role) }}
                                                    >
                                                        {user.role.replace('SECURITY_', '')}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${user.status}`}>
                                                        {user.status === 'active' ? '● Active' : '○ Disabled'}
                                                    </span>
                                                </td>
                                                <td className="mono">
                                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                                                </td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button className="action-btn edit" title="Edit">✏️</button>
                                                        {user.username !== currentUser?.username && (
                                                            <button
                                                                className="action-btn disable"
                                                                title={user.status === 'active' ? 'Disable' : 'Enable'}
                                                            >
                                                                {user.status === 'active' ? '🚫' : '✅'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Policies Tab */}
                    {activeTab === 'policies' && (
                        <div className="content-card">
                            <div className="card-header">
                                <h2>🔒 Security Policies</h2>
                            </div>

                            <div className="policy-sections">
                                <div className="policy-section">
                                    <h3>Rate Limiting</h3>
                                    <div className="policy-row">
                                        <label>Login attempts per IP:</label>
                                        <div className="policy-input-group">
                                            <input
                                                type="number"
                                                value={policies.loginAttemptsPerIP}
                                                onChange={(e) => handlePolicyChange('loginAttemptsPerIP', parseInt(e.target.value))}
                                                min={1}
                                                max={20}
                                            />
                                            <span>per</span>
                                            <input
                                                type="number"
                                                value={policies.loginWindowMinutes}
                                                onChange={(e) => handlePolicyChange('loginWindowMinutes', parseInt(e.target.value))}
                                                min={1}
                                                max={60}
                                            />
                                            <span>minutes</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="policy-section">
                                    <h3>Account Lockout</h3>
                                    <div className="policy-row">
                                        <label>Lockout after:</label>
                                        <div className="policy-input-group">
                                            <input
                                                type="number"
                                                value={policies.lockoutAttempts}
                                                onChange={(e) => handlePolicyChange('lockoutAttempts', parseInt(e.target.value))}
                                                min={1}
                                                max={10}
                                            />
                                            <span>failed attempts for</span>
                                            <input
                                                type="number"
                                                value={policies.lockoutDurationMinutes}
                                                onChange={(e) => handlePolicyChange('lockoutDurationMinutes', parseInt(e.target.value))}
                                                min={1}
                                                max={1440}
                                            />
                                            <span>minutes</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="policy-section">
                                    <h3>Session Management</h3>
                                    <div className="policy-row">
                                        <label>Inactive session expires after:</label>
                                        <div className="policy-input-group">
                                            <input
                                                type="number"
                                                value={policies.sessionTimeoutMinutes}
                                                onChange={(e) => handlePolicyChange('sessionTimeoutMinutes', parseInt(e.target.value))}
                                                min={5}
                                                max={480}
                                            />
                                            <span>minutes</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="policy-actions">
                                    <button className="save-btn" onClick={handleSavePolicies}>
                                        💾 Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Audit Log Tab */}
                    {activeTab === 'audit' && (
                        <div className="content-card">
                            <div className="card-header">
                                <h2>📜 Audit Log</h2>
                                <span className="log-count">{auditLogs.length} entries</span>
                            </div>
                            <div className="audit-list">
                                {auditLogs.map((log) => (
                                    <div key={log.id} className="audit-entry">
                                        <div className="audit-time mono">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </div>
                                        <div className="audit-content">
                                            <span className="audit-actor">{log.actor}</span>
                                            <span className="audit-action">{log.action}</span>
                                            {log.details && <span className="audit-details">{log.details}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="view-more-btn">View Full Audit Log →</button>
                        </div>
                    )}

                    {/* Danger Zone Tab */}
                    {activeTab === 'danger' && (
                        <div className="content-card danger-card">
                            <div className="card-header">
                                <h2>⚠️ Danger Zone</h2>
                            </div>

                            <div className="danger-warning">
                                <span className="warning-icon">⚠️</span>
                                <p>These actions are irreversible and may impact security logging. Proceed with extreme caution.</p>
                            </div>

                            <div className="danger-actions">
                                <div className="danger-action">
                                    <div className="danger-info">
                                        <h4>Purge Old Events</h4>
                                        <p>Delete all security events older than 90 days. This action cannot be undone.</p>
                                    </div>
                                    <button
                                        className="danger-btn"
                                        onClick={() => handleDangerAction('Purge events older than 90 days', () => {
                                            console.log('Purging old events...');
                                        })}
                                    >
                                        🗑️ Purge Events
                                    </button>
                                </div>

                                <div className="danger-action">
                                    <div className="danger-info">
                                        <h4>Force Re-anchor Logs</h4>
                                        <p>Reset the log integrity anchor. Only use if the current anchor is compromised.</p>
                                    </div>
                                    <button
                                        className="danger-btn"
                                        onClick={() => handleDangerAction('Force re-anchor security logs', () => {
                                            console.log('Re-anchoring logs...');
                                        })}
                                    >
                                        🔗 Re-anchor Logs
                                    </button>
                                </div>

                                <div className="danger-action">
                                    <div className="danger-info">
                                        <h4>Reset All IP Blocks</h4>
                                        <p>Clear all blocked IP addresses. May allow previously blocked attackers to retry.</p>
                                    </div>
                                    <button
                                        className="danger-btn"
                                        onClick={() => handleDangerAction('Reset all IP blocks', () => {
                                            console.log('Resetting IP blocks...');
                                        })}
                                    >
                                        🌐 Reset IP Blocks
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirmation Dialog */}
                {showConfirmDialog && (
                    <div className="dialog-overlay">
                        <div className="dialog">
                            <div className="dialog-icon">⚠️</div>
                            <h3>Confirm Dangerous Action</h3>
                            <p>You are about to: <strong>{showConfirmDialog.action}</strong></p>
                            <p className="dialog-warning">This action cannot be undone. Are you absolutely sure?</p>
                            <div className="dialog-actions">
                                <button className="dialog-cancel" onClick={() => setShowConfirmDialog(null)}>
                                    Cancel
                                </button>
                                <button className="dialog-confirm" onClick={executeConfirmedAction}>
                                    Yes, I understand
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
        }

        .admin-main {
          flex: 1;
          margin-left: 240px;
          padding: 24px 32px;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .admin-main {
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

        .admin-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: rgba(255, 77, 79, 0.1);
          border: 1px solid rgba(255, 77, 79, 0.3);
          border-radius: 20px;
          font-size: 12px;
          color: var(--sec-status-critical);
        }

        /* Tab Navigation */
        .tab-nav {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: var(--sec-bg-card);
          border: 1px solid var(--sec-border);
          border-radius: 10px;
          color: var(--sec-text-secondary);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          background: var(--sec-bg-elevated);
          color: var(--sec-text-primary);
        }

        .tab-btn.active {
          background: var(--sec-accent-primary);
          border-color: var(--sec-accent-primary);
          color: #000;
        }

        .tab-btn.danger {
          border-color: rgba(255, 77, 79, 0.3);
        }

        .tab-btn.danger.active {
          background: var(--sec-status-critical);
          border-color: var(--sec-status-critical);
        }

        .tab-icon {
          font-size: 14px;
        }

        /* Content Card */
        .content-card {
          background: var(--sec-bg-card);
          border: 1px solid var(--sec-border);
          border-radius: 16px;
          padding: 24px;
        }

        .content-card.danger-card {
          border-color: rgba(255, 77, 79, 0.3);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-header h2 {
          font-size: 16px;
          font-weight: 600;
          color: var(--sec-text-primary);
          margin: 0;
        }

        .add-btn {
          padding: 8px 16px;
          background: var(--sec-accent-primary);
          border: none;
          border-radius: 8px;
          color: #000;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }

        /* Users Table */
        .users-table-wrapper {
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table th {
          padding: 12px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: var(--sec-text-secondary);
          text-transform: uppercase;
          border-bottom: 1px solid var(--sec-border);
        }

        .users-table td {
          padding: 16px;
          border-bottom: 1px solid var(--sec-border);
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          font-size: 24px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--sec-text-primary);
        }

        .user-email {
          font-size: 12px;
          color: var(--sec-text-secondary);
        }

        .role-badge {
          padding: 4px 10px;
          border: 1px solid;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .status-badge {
          font-size: 12px;
        }

        .status-badge.active {
          color: var(--sec-status-success);
        }

        .status-badge.disabled {
          color: var(--sec-text-muted);
        }

        .mono {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--sec-text-secondary);
        }

        .action-btns {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border: 1px solid var(--sec-border);
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        /* Policy Sections */
        .policy-sections {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .policy-section h3 {
          font-size: 14px;
          font-weight: 600;
          color: var(--sec-text-primary);
          margin: 0 0 16px 0;
        }

        .policy-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .policy-row label {
          font-size: 13px;
          color: var(--sec-text-secondary);
          min-width: 200px;
        }

        .policy-input-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .policy-input-group input {
          width: 70px;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--sec-border);
          border-radius: 8px;
          color: var(--sec-text-primary);
          font-size: 14px;
          font-family: var(--font-mono);
          text-align: center;
        }

        .policy-input-group input:focus {
          outline: none;
          border-color: var(--sec-accent-primary);
        }

        .policy-input-group span {
          font-size: 13px;
          color: var(--sec-text-secondary);
        }

        .policy-actions {
          padding-top: 20px;
          border-top: 1px solid var(--sec-border);
        }

        .save-btn {
          padding: 12px 24px;
          background: var(--sec-accent-primary);
          border: none;
          border-radius: 10px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        /* Audit Log */
        .log-count {
          font-size: 12px;
          color: var(--sec-text-secondary);
          background: var(--sec-bg-elevated);
          padding: 4px 12px;
          border-radius: 12px;
        }

        .audit-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
        }

        .audit-entry {
          display: flex;
          gap: 20px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }

        .audit-time {
          flex-shrink: 0;
          width: 160px;
        }

        .audit-content {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .audit-actor {
          font-size: 13px;
          font-weight: 600;
          color: var(--sec-accent-primary);
        }

        .audit-action {
          font-size: 13px;
          color: var(--sec-text-primary);
        }

        .audit-details {
          font-size: 12px;
          color: var(--sec-text-secondary);
          font-style: italic;
        }

        .view-more-btn {
          width: 100%;
          padding: 12px;
          margin-top: 16px;
          background: transparent;
          border: 1px solid var(--sec-border);
          border-radius: 8px;
          color: var(--sec-text-secondary);
          font-size: 13px;
          cursor: pointer;
        }

        .view-more-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          color: var(--sec-text-primary);
        }

        /* Danger Zone */
        .danger-warning {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 77, 79, 0.1);
          border: 1px solid rgba(255, 77, 79, 0.3);
          border-radius: 10px;
          margin-bottom: 24px;
        }

        .danger-warning .warning-icon {
          font-size: 24px;
        }

        .danger-warning p {
          margin: 0;
          font-size: 13px;
          color: var(--sec-status-critical);
          line-height: 1.5;
        }

        .danger-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .danger-action {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--sec-border);
          border-radius: 12px;
          gap: 20px;
        }

        .danger-info h4 {
          font-size: 14px;
          font-weight: 600;
          color: var(--sec-text-primary);
          margin: 0 0 4px 0;
        }

        .danger-info p {
          font-size: 12px;
          color: var(--sec-text-secondary);
          margin: 0;
        }

        .danger-btn {
          padding: 10px 20px;
          background: rgba(255, 77, 79, 0.1);
          border: 1px solid rgba(255, 77, 79, 0.5);
          border-radius: 8px;
          color: var(--sec-status-critical);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .danger-btn:hover {
          background: rgba(255, 77, 79, 0.2);
        }

        /* Confirmation Dialog */
        .dialog-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .dialog {
          background: var(--sec-bg-secondary);
          border: 1px solid var(--sec-border);
          border-radius: 16px;
          padding: 32px;
          max-width: 400px;
          text-align: center;
        }

        .dialog-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .dialog h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--sec-text-primary);
          margin: 0 0 12px 0;
        }

        .dialog p {
          font-size: 14px;
          color: var(--sec-text-secondary);
          margin: 0 0 8px 0;
        }

        .dialog-warning {
          color: var(--sec-status-critical) !important;
          font-weight: 500;
        }

        .dialog-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .dialog-cancel,
        .dialog-confirm {
          flex: 1;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .dialog-cancel {
          background: transparent;
          border: 1px solid var(--sec-border);
          color: var(--sec-text-secondary);
        }

        .dialog-confirm {
          background: var(--sec-status-critical);
          border: none;
          color: #fff;
        }
      `}</style>
        </div>
    );
}
