import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { globalStyles } from '../styles/global';

import '@/src/lib/dayjs';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/react-query';

import Head from 'next/head';
import { generateDefaultSeo } from 'next-seo/pages';
import { defaultSEO } from '@/src/next-seo.config';

globalStyles();

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider session={session}>
                <Head>{generateDefaultSeo(defaultSEO)}</Head>

                <Component {...pageProps} />
            </SessionProvider>
        </QueryClientProvider>
    );
}
