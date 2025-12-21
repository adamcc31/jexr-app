import React from 'react';
import { Metadata } from 'next';
import VerificationDetailPage from './VerificationDetailPage';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    return {
        title: `Verification #${id} | Admin Dashboard`,
    };
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    const verificationId = parseInt(id, 10);

    if (isNaN(verificationId)) {
        return (
            <div className="container-fluid">
                <div className="text-center py-5">
                    <h5>Invalid Verification ID</h5>
                    <p className="text-muted">Please check the URL and try again.</p>
                </div>
            </div>
        );
    }

    return <VerificationDetailPage id={verificationId} />;
}
