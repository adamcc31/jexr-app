import React from 'react';
import VerificationTable from './components/VerificationTable';

export const metadata = {
    title: 'Account Verification | Admin Dashboard',
};

export default function AccountVerificationPage() {
    return (
        <div className="container-fluid px-0">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h1 className="h3 mb-0 text-gray-800">Account Verification</h1>
                    <p className="text-muted mt-1">Review and verify employer and candidate accounts.</p>
                </div>
            </div>

            <VerificationTable />
        </div>
    );
}
