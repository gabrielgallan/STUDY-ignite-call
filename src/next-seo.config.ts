import type { DefaultSeoProps } from 'next-seo/pages';

export const defaultSEO: DefaultSeoProps = {
    defaultTitle: 'Ignite Call',
    titleTemplate: '%s | Ignite Call',
    description: 'Agende reuniões de maneira simples e rápida.',

    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        url: 'https://ignitecall.com',
        siteName: 'Ignite Call',
        title: 'Ignite Call',
        description: 'Agende reuniões de maneira simples e rápida.',
    },

    twitter: {
        cardType: 'summary_large_image',
    },
};