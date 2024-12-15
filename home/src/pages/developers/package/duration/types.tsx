import { DurationPackageBoxes, DurationPackageBreadCrumbs, DurationPackageLinks, DurationPackageTypesPageList, exclude } from '@assets/developers/links';
import { Icons } from '@assets/images';
import Code from '@developers/Code';
import Package from '@developers/Package/Package';
import Subsection from '@developers/Subsection';
import useLocale from '@hooks/useLocale';
import Meta from '@ui/Meta';
import { durationPackageFuzzySearchEnUS, durationPackageFuzzySearchEsMX } from '@util/searching';
import type { NextPage } from 'next';

const Types: NextPage = () => {
    const [{ book }, hl] = useLocale();

    return (
        <>
            <Meta title='Duration Types | Reese Developers' description='' icon={Icons.Developers} noRobots />

            <Package
                book={DurationPackageLinks}
                boxes={exclude(DurationPackageBoxes, 'title', 'types')}
                crumbs={DurationPackageBreadCrumbs}
                description=''
                header={book.types}
                pageList={DurationPackageTypesPageList}
                search={hl === 'en_us' ? durationPackageFuzzySearchEnUS : durationPackageFuzzySearchEsMX}
            >
                <Subsection id='unix' header='Unix'>
                    <Code>
                        interface Unix {'{'} {'<tab>'}seconds: number;
                        {'<tab>'}milliseconds: number;
                        {'}'}
                    </Code>
                </Subsection>
            </Package>
        </>
    );
};

export default Types;
