export type Locale = 'en_us' | 'es_mx';

export interface Translations {
    home: {
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
    };
    notFound: {
        tag: string;
    };
}
