export interface NpmResult {
    _id: string;
    _rev: string;
    name: string;
    'dist-tags': { latest: string; }
    versions: Record<string, NpmPackage>;
    time: NpmTime;
    maintainers: NpmUser[];
    description: string;
    keywords: string[];
    author: NpmAuthor;
    license: string;
    readme: string;
    readmeFilename: string;
    error?: string;
    code?: string;
}

export interface NpmTime {
    created: string;
    modified: string;
    [key: string]: string;
}

export interface NpmPackage {
    name: string;
    version: string;
    description: string;
    main: string;
    scripts: Record<string, string>;
    keywords: string[];
    author: NpmAuthor;
    license: string;
    dependencies?: Record<string, string>;
    _id: string;
    _nodeVersion: string;
    _npmVersion: string;
    dist: Record<string, string>;
    _npmUser: NpmUser;
    directories: Record<string, unknown>;
    maintainers: NpmUser[];
    _npmOperationalInternal: { host: string; tmp: string; };
    _hasShrinkwrap: boolean;
}

export interface NpmAuthor {
    name: string;
}

export interface NpmUser {
    name: string;
    email: string;
}