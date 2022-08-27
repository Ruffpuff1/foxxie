import { CelestiaPackagePageList, CelestiaRefrenceBoxes, CelestiaRefrenceBreadCrumbs, CelestiaRefrenceLinks } from '@assets/developers/celestia/refrence/links';
import { exclude } from '@assets/developers/links';
import { Icons } from '@assets/images';
import VillagerRefrenceFieldsTable from '@developers/celestia/api/refrence/villager/VillagerRefrenceFieldsTable';
import Refrence from '@developers/celestia/Refrence/Refrence';
import Code from '@developers/Code';
import Subsection from '@developers/Subsection';
import useLocale from '@hooks/useLocale';
import Link from '@ui/Link/Link';
import Meta from '@ui/Meta';
import { celestiaRefrenceFuzzySearchEnUS, celestiaRefrenceFuzzySearchEsMX } from '@util/searching';
import type { NextPage } from 'next';

const Villager: NextPage = () => {
    const [, hl] = useLocale();

    return (
        <>
            <Meta title='Celestia Villager API | Reese Developers' description='' icon={Icons.Celestia} noRobots />

            <Refrence
                book={CelestiaRefrenceLinks}
                boxes={exclude(CelestiaRefrenceBoxes, 'title', 'villager')}
                crumbs={CelestiaRefrenceBreadCrumbs}
                description='Overview of the how a villager is represented in the API.'
                header='Resource: Villager'
                pageList={CelestiaPackagePageList}
                search={hl === 'en_us' ? celestiaRefrenceFuzzySearchEnUS : celestiaRefrenceFuzzySearchEsMX}
            >
                <Subsection id='villager' header='Villager'>
                    <p className='my-[16px]'>Object representing a Villager.</p>
                    <Code lang='json'>
                        {'{'}
                        {'<tab>'}key: string;
                        {'<tab>'}keyJp: string;
                        {'<tab>'}gender:{' '}
                        <Link href='#gender-enum' className='hover:underline'>
                            GenderEnum;
                        </Link>
                        {'<tab>'}personality:{' '}
                        <Link href='#personalities-enum' className='hover:underline'>
                            PersonalitiesEnum;
                        </Link>
                        {'<tab>'}species:{' '}
                        <Link href='#species-enum' className='hover:underline'>
                            SpeciesEnum;
                        </Link>
                        {'<tab>'}favoriteSaying: string;
                        {'<tab>'}catchphrase: string;
                        {'<tab>'}description: string;
                        {'<tab>'}games:{' '}
                        <Link href='#games-enum' className='hover:underline'>
                            GamesEnum[];
                        </Link>
                        {'<tab>'}art: string;
                        {'<tab>'}song:{' '}
                        <Link href='#games-enum' className='hover:underline'>
                            KKSliderSongs;
                        </Link>
                        {'<tab>'}siblings: string | undefined;
                        {'<tab>'}skill: string | undefined;
                        {'<tab>'}goal: string | undefined;
                        {'<tab>'}coffeeRequest:{' '}
                        <Link noBr={true} href='#games-enum' className='hover:underline'>
                            Coffee
                        </Link>{' '}
                        | undefined;
                        {'}'}
                    </Code>

                    <VillagerRefrenceFieldsTable />
                </Subsection>
                <Subsection id='coffee' header='Coffee'>
                    <Code lang='json'>
                        {'{'}
                        {'<tab>'}beans:{' '}
                        <Link href='#gender-enum' className='hover:underline'>
                            CoffeeBeansEnum;
                        </Link>
                        {'<tab>'}milk:{' '}
                        <Link href='#personalities-enum' className='hover:underline'>
                            CoffeeMilkEnum;
                        </Link>
                        {'<tab>'}sugar:{' '}
                        <Link noBr={true} href='#coffee-sugar-enum' className='hover:underline'>
                            CoffeeSugarEnum;
                        </Link>
                        {'}'}
                    </Code>
                </Subsection>
                {/* <Subsection id='coffee-beans-enum' header='CoffeeBeansEnum'></Subsection>
                <Subsection id='coffee-milk-enum' header='CoffeeMilkEnum'></Subsection>
                <Subsection id='coffee-sugar-enum' header='CoffeeSugarEnum'></Subsection>
                <Subsection id='games-enum' header='GamesEnum'></Subsection>
                <Subsection id='gender-enum' header='GenderEnum'></Subsection>
                <Subsection id='kk-slider-songs' header='KKSliderSongs'></Subsection>
                <Subsection id='personalities-enum' header='PersonalitiesEnum'></Subsection>
                <Subsection id='species-enum' header='SpeciesEnum'></Subsection> */}
            </Refrence>
        </>
    );
};

export default Villager;
