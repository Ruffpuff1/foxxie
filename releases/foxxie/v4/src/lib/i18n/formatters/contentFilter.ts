import { container } from '@sapphire/framework';
import { languageKeys } from '..';

export type ContentFilters = 'DISABLED' | 'MEMBERS_WITHOUT_ROLES' | 'ALL_MEMBERS';

export function contentFilter(value: ContentFilters, lng: string): string {
    const { i18n } = container;
    return i18n.format(lng, languageKeys.guilds.contentFilters[value]);
}