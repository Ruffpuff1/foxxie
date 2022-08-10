export type Locale = 'en_us' | 'es_mx';

export interface Translations {
    home: WithMeta<{
        hi: string;
        musician: string;
        nav: {
            about: string;
            projects: string;
        };
        tag: string;
        tooltips: {
            email: string;
            github: string;
            twitter: string;
        };
    }>;
    notFound: {
        tag: string;
    };
}

type WithMeta<T extends Record<string, unknown>> = T & {
    title: string;
    description: string;
};
