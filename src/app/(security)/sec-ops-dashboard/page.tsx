'use client';

import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled - completely prevents server-side rendering
const IndexContent = dynamic(() => import('./IndexContent'), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af'
    }}>
      Initializing Security Console...
    </div>
  ),
});

export default function SecurityIndexPage() {
  return <IndexContent />;
}
