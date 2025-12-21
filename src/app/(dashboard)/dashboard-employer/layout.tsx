import React from 'react';
import { EmployerSidebar, EmployerHeader } from '@/components/employer';

export default function EmployerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            <EmployerSidebar />

            <main className="flex-grow-1 bg-light d-flex flex-column">
                <EmployerHeader />

                <div className="p-4 flex-grow-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
