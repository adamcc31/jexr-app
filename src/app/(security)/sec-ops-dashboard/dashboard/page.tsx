'use client';

import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled - completely prevents server-side rendering
const DashboardContent = dynamic(() => import('./DashboardContent'), {
    ssr: false,
    loading: () => (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af'
        }}>
            Loading Security Dashboard...
        </div>
    ),
});

export default function SecurityDashboardPage() {
    return <DashboardContent />;
}
