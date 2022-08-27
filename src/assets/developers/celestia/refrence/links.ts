import { Translations } from '@assets/locales/types';
import type { Booklink } from '@developers/Book/Book';
import { ListItem } from '@developers/PageList/PageList';
import { Box } from '@developers/Preview/Preview';
import { Crumb } from '@ui/BreadCrumbs/BreadCrumbs';

export const CelestiaRefrenceLinks: Booklink[] = [
    {
        href: '/developers/celestia/api/refrence',
        key: 'introduction'
    },
    {
        href: '#villager',
        key: 'villager',
        separate: true
    },
    {
        href: '#coffee',
        key: 'coffee'
    },
    {
        href: '#coffee-beans-enum',
        key: 'coffeeBeansEnum'
    },
    {
        href: '#coffee-milk-enum',
        key: 'coffeeMilkEnum'
    },
    {
        href: '#coffee-sugar-enum',
        key: 'coffeeSugarEnum'
    },
    {
        href: '#games-enum',
        key: 'gamesEnum'
    },
    {
        href: '#gender-enum',
        key: 'genderEnum'
    },
    {
        href: '#kk-slider-songs',
        key: 'kkSliderSongs'
    },
    {
        href: '#personalities-enum',
        key: 'personalitiesEnum'
    },
    {
        href: '#species-enum',
        key: 'speciesEnum'
    },
    {
        href: '/developers/celestia/api/refrence/villager/errors',
        key: 'errors',
        separate: true
    }
];

export const CelestiaPackagePageList: ListItem[] = [
    {
        href: '#villager',
        title: 'Villager',
        start: 200,
        end: 1900
    },
    {
        href: '#coffee',
        title: 'Coffee',
        start: 1900,
        end: 900
    }
];

export const CelestiaRefrenceBreadCrumbs: (translations: Translations) => Crumb[] = translations => [
    {
        href: '/developers',
        title: translations.developers.breadcrumbs.home
    },
    {
        href: '/developers/apis',
        title: 'APIs'
    },
    {
        href: '/developers/celestia',
        title: 'Celestia'
    },
    {
        href: '/developers/celestia/api',
        title: 'API'
    },
    {
        href: '/developers/celestia/api/refrence',
        title: 'Refrence'
    }
];

export const CelestiaRefrenceBoxes: Box[] = [
    {
        title: 'introduction',
        description: '',
        href: '/developers/celestia/api/refrence'
    },
    {
        title: 'villager',
        description: '',
        href: '/developers/celestia/api/refrence/villager'
    },
    {
        title: 'errors',
        description: '',
        href: '/developers/celestia/api/refrence/errors'
    }
];
