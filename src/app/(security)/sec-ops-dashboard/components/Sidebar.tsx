'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSecurityAuth } from '@/contexts/SecurityDashboardContext';

interface NavItem {
    path: string;
    label: string;
    icon: string;
    minRole?: string;
}

const navItems: NavItem[] = [
    { path: '/sec-ops-dashboard/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/sec-ops-dashboard/events', label: 'Events', icon: '📋' },
    { path: '/sec-ops-dashboard/heatmap', label: 'Heatmap', icon: '🔥' },
    { path: '/sec-ops-dashboard/export', label: 'Export', icon: '📤', minRole: 'SECURITY_ANALYST' },
    { path: '/sec-ops-dashboard/admin', label: 'Admin', icon: '⚙️', minRole: 'SECURITY_ADMIN' },
];

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout, hasRole } = useSecurityAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.replace('/sec-ops-dashboard/login');
    };

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                {/* Header */}
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <span className="brand-icon">🛡️</span>
                        {!isCollapsed && <span className="brand-text">SECURITY OPS</span>}
                    </div>
                    <button
                        className="collapse-btn"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        title={isCollapsed ? 'Expand' : 'Collapse'}
                    >
                        {isCollapsed ? '→' : '←'}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        // Check role requirement
                        if (item.minRole && !hasRole(item.minRole)) {
                            return null;
                        }

                        return (
                            <button
                                key={item.path}
                                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => router.push(item.path)}
                                title={item.label}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {!isCollapsed && <span className="nav-label">{item.label}</span>}
                                {isActive(item.path) && <span className="active-indicator" />}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <div className="user-info">
                        <span className="user-avatar">👤</span>
                        {!isCollapsed && (
                            <div className="user-details">
                                <span className="username">{user?.username || 'Unknown'}</span>
                                <span className="role">{user?.role?.replace('SECURITY_', '')}</span>
                            </div>
                        )}
                    </div>
                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        {isCollapsed ? '🚪' : 'Logout'}
                    </button>
                </div>
            </aside>

            <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 240px;
          background: linear-gradient(180deg, rgba(11, 15, 20, 0.98) 0%, rgba(14, 17, 23, 0.98) 100%);
          border-right: 1px solid var(--sec-border);
          display: flex;
          flex-direction: column;
          z-index: 100;
          transition: width 0.3s ease;
          backdrop-filter: blur(20px);
        }

        .sidebar.collapsed {
          width: 70px;
        }

        .sidebar-header {
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--sec-border);
          min-height: 70px;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
        }

        .brand-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .brand-text {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1px;
          color: var(--sec-accent-primary);
          white-space: nowrap;
        }

        .collapse-btn {
          width: 28px;
          height: 28px;
          border: 1px solid var(--sec-border);
          background: transparent;
          border-radius: 6px;
          color: var(--sec-text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .collapse-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--sec-text-primary);
        }

        .sidebar.collapsed .collapse-btn {
          margin: 0 auto;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
        }

        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          border-radius: 8px;
          color: var(--sec-text-secondary);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--sec-text-primary);
        }

        .nav-item.active {
          background: rgba(0, 180, 255, 0.1);
          color: var(--sec-accent-primary);
        }

        .nav-icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        .nav-label {
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
        }

        .active-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 24px;
          background: var(--sec-accent-primary);
          border-radius: 0 3px 3px 0;
          box-shadow: 0 0 12px var(--sec-accent-primary);
        }

        .sidebar.collapsed .nav-item {
          justify-content: center;
          padding: 12px;
        }

        .sidebar.collapsed .active-indicator {
          left: 0;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--sec-border);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }

        .user-avatar {
          font-size: 20px;
          flex-shrink: 0;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .username {
          font-size: 13px;
          font-weight: 600;
          color: var(--sec-text-primary);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .role {
          font-size: 11px;
          color: var(--sec-accent-primary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sidebar.collapsed .user-info {
          justify-content: center;
          padding: 12px 8px;
        }

        .logout-btn {
          padding: 10px 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          color: #ef4444;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.4);
        }

        .sidebar.collapsed .logout-btn {
          padding: 10px;
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 70px;
          }
          .sidebar .brand-text,
          .sidebar .nav-label,
          .sidebar .user-details {
            display: none;
          }
          .sidebar .nav-item {
            justify-content: center;
            padding: 12px;
          }
          .sidebar .user-info {
            justify-content: center;
          }
          .sidebar .logout-btn {
            padding: 10px;
            font-size: 16px;
          }
          .collapse-btn {
            display: none;
          }
        }
      `}</style>
        </>
    );
}
