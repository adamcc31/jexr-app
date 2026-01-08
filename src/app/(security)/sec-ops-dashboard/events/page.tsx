import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled - completely prevents server-side rendering
const EventsContent = dynamic(() => import('./EventsContent'), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af'
    }}>
      Loading Events...
    </div>
  ),
});

export default function SecurityEventsPage() {
  return <EventsContent />;
}
