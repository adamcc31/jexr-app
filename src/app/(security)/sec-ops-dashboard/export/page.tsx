import dynamic from 'next/dynamic';

const ExportContent = dynamic(() => import('./ExportContent'), { ssr: false });

export default function ExportPage() {
    return <ExportContent />;
}
