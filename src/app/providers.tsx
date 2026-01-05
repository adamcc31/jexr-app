'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import I18nProvider from '@/components/I18nProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
    // Create a client - useState ensures it's stable across rerenders
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Data is considered fresh for 1 minute
                        staleTime: 60 * 1000,
                        // Retry failed requests once
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <I18nProvider>
                {children}
            </I18nProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

