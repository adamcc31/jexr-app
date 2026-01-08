import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled - completely prevents server-side rendering
const HeatmapContent = dynamic(() => import('./HeatmapContent'), {
    ssr: false,
    loading: () => (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af'
        }}>
            Loading Heatmap...
        </div>
    ),
});

export default function SecurityHeatmapPage() {
    return <HeatmapContent />;
}
