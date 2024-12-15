import { Translations } from '@assets/locales/types';
import type { Booklink } from '@developers/Book/Book';
import { ListItem } from '@developers/PageList/PageList';
import { Box } from '@developers/Preview/Preview';
import { Crumb } from '@ui/BreadCrumbs/BreadCrumbs';

export const DurationPackageLinks: Booklink[] = [
    {
        href: '/developers/package/duration',
        key: 'overview'
    },
    {
        href: '/developers/package/duration/methods',
        key: 'methods'
    },
    {
        href: '/developers/package/duration/types',
        key: 'types'
    }
];

export const DurationPackagePageList: ListItem[] = [
    {
        href: '#installation',
        title: 'Installation',
        start: 130,
        end: 460
    },
    {
        href: '#usage',
        title: 'Usage',
        start: 460,
        end: 900
    }
];

export const DurationPackageMethodPageList: ListItem[] = [
    {
        href: '#to-duration',
        title: 'toDuration()',
        start: 230,
        end: 820
    },
    {
        href: '#to-date',
        title: 'toDate()',
        start: 820,
        end: 1300
    },
    {
        href: '#to-unix',
        title: 'toUnix()',
        start: 1300,
        end: 1800
    }
];

export const DurationPackageTypesPageList: ListItem[] = [
    {
        href: '#unix',
        title: 'Unix',
        start: 230,
        end: 820
    }
];

export const DurationPackageBreadCrumbs: (translations: Translations) => Crumb[] = translations => [
    {
        href: '/developers',
        title: translations.developers.breadcrumbs.home
    },
    {
        href: '/developers/packages',
        title: translations.developers.breadcrumbs.packages
    },
    {
        href: '/developers/package/duration',
        title: translations.developers.breadcrumbs.duration
    }
];

export const DurationPackageBoxes: Box[] = [
    {
        title: 'overview',
        description: '',
        href: '/developers/package/duration'
    },
    {
        title: 'methods',
        description: '',
        href: '/developers/package/duration/methods'
    },
    {
        title: 'types',
        description: '',
        href: '/developers/package/duration/types'
    }
];

export function exclude<T extends Record<string, any>, K extends keyof T>(arr: T[], indexKey: K, ...keys: string[]) {
    const filtered = arr.filter(box => !keys.includes(box[indexKey]));
    return filtered;
}
