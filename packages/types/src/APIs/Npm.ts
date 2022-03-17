export namespace Npm {
    interface DistTags {
        latest: string;
    }

    export interface Result {
        _id: string;
        _rev: string;
        name: string;
        'dist-tags': DistTags;
        versions: Record<string, Package>;
        time: Time;
        maintainers: User[];
        description: string;
        keywords: string[];
        author: Author;
        license: string;
        readme: string;
        readmeFilename: string;
        error?: string;
        code?: string;
    }

    export interface Time {
        created: string;
        modified: string;
        [key: string]: string;
    }

    export interface Package {
        name: string;
        version: string;
        description: string;
        main: string;
        scripts: Record<string, string>;
        keywords: string[];
        author: Author;
        license: string;
        dependencies?: Record<string, string>;
        _id: string;
        _nodeVersion: string;
        _npmVersion: string;
        dist: Record<string, string>;
        _npmUser: User;
        directories: Record<string, unknown>;
        maintainers: User[];
        _npmOperationalInternal: { host: string; tmp: string };
        _hasShrinkwrap: boolean;
    }

    export interface Author {
        name: string;
    }

    export interface User {
        name: string;
        email: string;
    }
}
