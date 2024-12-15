import { InstrumentKey } from '@assets/music/performers';
import { AddBook, AddDescription, Join, Meta, Spread } from '@util/utility-types';

export type Locale = 'en_us' | 'es_mx';

export type Translations = Spread<
    {
        aboutMe: Meta<{
            nav: Join<'about' | 'contact' | 'myWork'>;
        }>;
        developers: Meta<{
            breadcrumbs: Join<'duration' | 'home' | 'packages'>;
            celestia: Meta<
                Spread<
                    {
                        api: Meta<Spread<AddDescription<'documentation'>, AddDescription<'getStarted'>>>;
                        villagerRefrence: Join<'coffee' | 'coffeeBeanEnum'>;
                    },
                    Join<'developers' | 'home' | 'refrence'>
                >
            >;
            copyright: Join<'intl' | 'licensed' | 'mitLicense' | 'respectiveAuthors' | 'start'>;
            footer: Join<'blog' | 'contactUs' | 'privacy' | 'terms'>;
            onThisPage: string;
            nav: Join<'learn' | 'packages'>;
        }>;
        filter: string;
        home: Meta<
            Spread<
                Join<'aboutMe' | 'aboutMeTag' | 'hi' | 'musician' | 'tag'>,
                {
                    nav: Join<'contact' | 'home'>;
                }
            >
        >;
        music: Meta<
            Spread<
                Join<'concertArchive' | 'music'>,
                {
                    orchestra: Join<'orchestra' | InstrumentKey | 'solo' | 'concertMaster'>;
                }
            >
        >;
        notFound: Join<'tag'>;
        readNow: string;
    },
    AddBook<
        | 'coffee'
        | 'coffeeBeansEnum'
        | 'coffeeMilkEnum'
        | 'coffeeSugarEnum'
        | 'errors'
        | 'gamesEnum'
        | 'genderEnum'
        | 'introduction'
        | 'kkSliderSongs'
        | 'personalitiesEnum'
        | 'speciesEnum'
        | 'methods'
        | 'overview'
        | 'types'
        | 'villager'
    >
>;
