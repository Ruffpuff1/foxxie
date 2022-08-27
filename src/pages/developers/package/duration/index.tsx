import { DurationPackageBoxes, DurationPackageBreadCrumbs, DurationPackageLinks, DurationPackagePageList, exclude } from '@assets/developers/links';
import { Icons } from '@assets/images';
import Code from '@developers/Code';
import Package from '@developers/Package/Package';
import Subsection from '@developers/Subsection';
import useLocale from '@hooks/useLocale';
import Meta from '@ui/Meta';
import { durationPackageFuzzySearchEnUS, durationPackageFuzzySearchEsMX, durationPackageSearchEnUS, durationPackageSearchEsMX } from '@util/searching';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

const Duration: NextPage = () => {
    const [{ book }, hl] = useLocale();
    const [dateString, setDateString] = useState('');
    const [dateString2, setDateString2] = useState('');

    useEffect(() => {
        setDateString(new Date(Date.now() + 3600000).toISOString());
        setDateString2(new Date(Date.now() + 3600000 * 24 * 2).toISOString());
    }, []);

    return (
        <>
            <Meta title='Package: Duration | Reese Developers' description='' icon={Icons.Developers} noRobots />

            <Package
                book={DurationPackageLinks}
                boxes={exclude(DurationPackageBoxes, 'title', 'overview')}
                crumbs={DurationPackageBreadCrumbs}
                description='Duration is a formatting package that takes natural date strings and converts them to JavaScript Dates or timestamps.'
                header={book.overview}
                pageList={DurationPackagePageList}
                search={hl === 'en_us' ? durationPackageFuzzySearchEnUS : durationPackageFuzzySearchEsMX}
            >
                <Subsection id='installation' header='Installation'>
                    <p className='my-[16px]'>With yarn:</p>
                    <Code commandLine>yarn add @reeseharlak/duration</Code>
                    <p className='my-[16px]'>With NPM:</p>
                    <Code commandLine>npm install @reeseharlak/duration</Code>
                </Subsection>
                <Subsection id='usage' header='Usage'>
                    <p className='my-[16px]'>
                        The methods included with this package all exist on the Duration class. This can be imported from the module: or assigned to a variable using the
                        require() syntax.
                    </p>
                    <Code>
                        import {'{ Duration }'} from {"'@reeseharlak/duration';"} {"Duration.toDate('1h')"}
                        {`// ${dateString}`}
                    </Code>
                    <p className='my-[16px]'>Or assigned to a variable using the require() syntax:</p>
                    <Code>
                        const {'{ Duration }'} = {"require('@reeseharlak/duration');"} {"Duration.toDate('2d')"}
                        {`// ${dateString2}`}
                    </Code>
                </Subsection>
            </Package>
        </>
    );
};

export default Duration;
