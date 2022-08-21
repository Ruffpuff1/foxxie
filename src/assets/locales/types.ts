export type Locale = 'en_us' | 'es_mx';

export interface Translations {
    aboutMe: WithMeta<{
        nav: {
            about: string;
            contact: string;
            myWork: string;
        };
    }>;
    developers: WithMeta<{
        book: {
            methods: string;
            overview: string;
            types: string;
        };
        breadcrumbs: {
            duration: string;
            home: string;
            packages: string;
        };
        copyright: {
            intl: string;
            licensed: string;
            mitLicense: string;
            respectiveAuthors: string;
            start: string;
        };
        onThisPage: string;
        nav: {
            learn: string;
            packages: string;
        };
    }>;
    filter: string;
    home: WithMeta<{
        aboutMe: string;
        aboutMeTag: string;
        hi: string;
        musician: string;
        nav: {
            contact: string;
            home: string;
        };
        tag: string;
    }>;
    notFound: {
        tag: string;
    };
    readNow: string;
}

type WithMeta<T extends Record<string, unknown>> = T & {
    title: string;
    description: string;
};
