'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Security Dashboard Context Types
interface SecurityUser {
    id: string;
    username: string;
    email: string;
    role: 'SECURITY_OBSERVER' | 'SECURITY_ANALYST' | 'SECURITY_ADMIN';
    totpEnabled: boolean;
}

interface SecuritySession {
    sessionId: string;
    expiresAt: string;
    role: string;
}

interface SecurityContextType {
    user: SecurityUser | null;
    session: SecuritySession | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<{ requiresTOTP: boolean; userId?: string }>;
    verifyTOTP: (username: string, password: string, code: string) => Promise<void>;
    logout: () => Promise<void>;
    hasRole: (minRole: string) => boolean;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

// API base URL for security dashboard - uses hidden endpoint
// MUST match SECURITY_DASHBOARD_PATH in backend
const SECURITY_API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL + '/v1/sec-console-rahasia';

// Security Dashboard Provider
export function SecurityDashboardProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<SecurityUser | null>(null);
    const [session, setSession] = useState<SecuritySession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!session && !!user;

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch(`${SECURITY_API_BASE}/stats`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    // Session is valid - we can proceed
                    setIsLoading(false);
                } else {
                    setUser(null);
                    setSession(null);
                    setIsLoading(false);
                }
            } catch {
                setUser(null);
                setSession(null);
                setIsLoading(false);
            }
        };
        checkSession();
    }, []);

    const login = useCallback(async (username: string, password: string) => {
        const res = await fetch(`${SECURITY_API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await res.json();
        if (data.data?.totpRequired) {
            return { requiresTOTP: true, userId: data.data.userId };
        }

        return { requiresTOTP: false };
    }, []);

    const verifyTOTP = useCallback(async (username: string, password: string, code: string) => {
        const res = await fetch(`${SECURITY_API_BASE}/auth/verify-totp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password, totpCode: code }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'TOTP verification failed');
        }

        const data = await res.json();
        setSession({
            sessionId: data.data.sessionId,
            expiresAt: data.data.expiresAt,
            role: data.data.role,
        });
        setUser({
            id: data.data.userId || '',
            username: username,
            email: '',
            role: data.data.role,
            totpEnabled: true,
        });
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch(`${SECURITY_API_BASE}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch {
            // Ignore errors
        }
        setUser(null);
        setSession(null);
    }, []);

    const hasRole = useCallback((minRole: string) => {
        if (!user) return false;
        const roleHierarchy: Record<string, number> = {
            'SECURITY_OBSERVER': 1,
            'SECURITY_ANALYST': 2,
            'SECURITY_ADMIN': 3,
        };
        const userLevel = roleHierarchy[user.role] || 0;
        const requiredLevel = roleHierarchy[minRole] || 999;
        return userLevel >= requiredLevel;
    }, [user]);

    return (
        <SecurityContext.Provider value={{
            user,
            session,
            isAuthenticated,
            isLoading,
            login,
            verifyTOTP,
            logout,
            hasRole,
        }}>
            {children}
        </SecurityContext.Provider>
    );
}

export function useSecurityAuth() {
    const context = useContext(SecurityContext);
    if (!context) {
        throw new Error('useSecurityAuth must be used within SecurityDashboardProvider');
    }
    return context;
}
