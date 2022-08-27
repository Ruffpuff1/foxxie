import { Colors } from '@assets/images';
import { NextSeoProps } from 'next-seo';

export const BaseUrl = 'https://reese.cafe';

interface Img {
    image: string;
    alt: string;
    format: string;
}

export const DefaultSeoProps = (title: string, description: string, { image, alt, format }: Img, keywords: string[], subject: string, locale = 'en_us') => {
    return {
        title,
        description,
        openGraph: {
            title,
            url: BaseUrl,
            description,
            locale,
            images: [
                {
                    url: image,
                    alt,
                    type: format
                }
            ]
        },
        canonical: BaseUrl,
        additionalMetaTags: [
            { name: 'url', content: BaseUrl },
            { name: 'indentifier-URL', content: BaseUrl },
            { name: 'shortlink', content: BaseUrl },
            { name: 'keywords', content: (keywords || []).join(', ') },
            {
                name: 'summary',
                content: description
            },
            { name: 'subject', content: subject },
            { name: 'robots', content: 'archive,follow,imageindex,index,odp,snippet,translate' },
            { name: 'googlebot', content: 'index,follow' },
            { name: 'author', content: `Reese Harlak <reese@reese.cafe>` },
            { name: 'owner', content: `Reese Harlak <reese@reese.cafe>` },
            { name: 'designer', content: `Reese Harlak <reese@reese.cafe>` },
            { name: 'target', content: 'all' },
            { name: 'audience', content: 'all' },
            { name: 'coverage', content: 'Worldwide' },
            { name: 'distribution', content: 'Global' },
            { name: 'rating', content: 'safe for kids' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
            { name: 'HandheldFriendly', content: 'True' },
            { name: 'apple-mobile-web-app-title', content: 'Reese Harlak' },
            { name: 'application-name', content: title },
            { name: 'msapplication-TileColor', content: Colors.RuffGray },
            { name: 'theme-color', content: Colors.RuffGray },
            { name: 'revisit-after', content: '7 days' }
        ]
    } as NextSeoProps;
};

export const RobotBlockingProps = (title: string, description: string, { image, alt, format }: Img, locale = 'en_us') => {
    return {
        title,
        description,
        openGraph: {
            title,
            url: BaseUrl,
            description,
            locale,
            images: [
                {
                    url: image,
                    alt,
                    type: format
                }
            ]
        },
        noindex: true,
        nofollow: true,
        robotsProps: {
            nosnippet: true,
            notranslate: true,
            noimageindex: true,
            noarchive: true,
            maxSnippet: -1,
            maxImagePreview: 'none',
            maxVideoPreview: -1
        }
    } as NextSeoProps;
};
