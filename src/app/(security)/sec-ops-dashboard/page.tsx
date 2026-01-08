'use client';

// Prevent static generation - requires runtime context
export const dynamic = 'force-dynamic';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSecurityAuth } from '@/contexts/SecurityDashboardContext';

// Security dashboard index redirects to login or dashboard
export default function SecurityIndexPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSecurityAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/sec-ops-dashboard/dashboard');
      } else {
        router.replace('/sec-ops-dashboard/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Initializing Security Console...</p>

      <style jsx>{`
        .loading-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: var(--sec-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        p {
          color: var(--sec-text-muted);
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
