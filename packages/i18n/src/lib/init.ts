import Collection from '@discordjs/collection';
import { Locale, LocaleString } from 'discord-api-types/v10';
import i18next, { type InitOptions, type TFunction, getFixedT } from 'i18next';
import type { PathLike } from 'node:fs';
import { opendir } from 'node:fs/promises';
import { join } from 'node:path';
import backend from 'i18next-fs-backend';

export const discordLocales = new Set(Object.values(Locale)) as ReadonlySet<LocaleString>;

export function isDiscordLocale(lng: string): lng is LocaleString {
    return discordLocales.has(lng as LocaleString);
}

export const loadedLocales = new Set<LocaleString>();
export const loadedNamespaces = new Set<string>();

export const loadedPaths = new Set<string>();
export const formatters: Formatter[] = [];

export interface Formatter {
    name: string;
    format: (value: any, lng: string | undefined, options: any) => string;
}

export function addFormatters(...formatters: Formatter[]): void {
    formatters.push(...formatters);
}

export async function init(options: InitOptions & { languageDirectory: string }) {
    i18next.use(backend);
    const languagesDir = options.languageDirectory;
    await load(join(languagesDir));

    await i18next.init({
        ns: [...loadedNamespaces],
        preload: [...loadedLocales],
        initImmediate: false,
        interpolation: {
            escapeValue: false,
            skipOnVariables: false,
            ...options.interpolation
        },
        ignoreJSONStructure: false,
        backend: {
            loadPath: join(languagesDir, '{{lng}}', '{{ns}}.json'),
            addPath: languagesDir
        },
        ...options
    });

    for (const { name, format } of formatters) {
        i18next.services.formatter!.add(name, format);
    }
}

export async function load(directory: PathLike) {
    const dir = await opendir(directory);
    for await (const entry of dir) {
        if (!entry.isDirectory()) continue;
        loadedLocales.add(entry.name as LocaleString);
        await loadLocale(join(dir.path, entry.name), '');
    }

    loadedPaths.add(dir.path);
}

async function loadLocale(directory: string, ns: string) {
    const dir = await opendir(directory);
    for await (const entry of dir) {
        if (entry.isDirectory()) {
            await loadLocale(join(dir.path, entry.name), `${ns}${entry.name}/`);
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
            loadedNamespaces.add(`${ns}${entry.name.slice(0, -5)}`);
        }
    }
}

const cache = new Collection<LocaleString, TFunction>();
export function getT(locale: LocaleString) {
    if (!loadedLocales.has(locale)) throw new ReferenceError(`invalid locale (${locale})`);
    return cache.ensure(locale, () => getFixedT(locale));
}
