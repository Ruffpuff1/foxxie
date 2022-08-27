import { DurationPackageBoxes, DurationPackageBreadCrumbs, DurationPackageLinks, DurationPackageMethodPageList, exclude } from '@assets/developers/links';
import { Icons } from '@assets/images';
import Code from '@developers/Code';
import Package from '@developers/Package/Package';
import Subsection from '@developers/Subsection';
import useLocale from '@hooks/useLocale';
import Link from '@ui/Link/Link';
import Meta from '@ui/Meta';
import { durationPackageFuzzySearchEnUS, durationPackageFuzzySearchEsMX } from '@util/searching';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

const Methods: NextPage = () => {
    const [{ book }, hl] = useLocale();
    const [dateString, setDateString] = useState('');

    useEffect(() => {
        setDateString(new Date(Date.now() + 3600000).toISOString());
    }, []);

    return (
        <>
            <Meta title='Duration Methods | Reese Developers' description='' icon={Icons.Developers} noRobots />

            <Package
                book={DurationPackageLinks}
                boxes={exclude(DurationPackageBoxes, 'title', 'methods')}
                crumbs={DurationPackageBreadCrumbs}
                description='This page goes over the methods that exist on the Duration class. They can be imported from the package and used on the class.'
                header={book.methods}
                pageList={DurationPackageMethodPageList}
                search={hl === 'en_us' ? durationPackageFuzzySearchEnUS : durationPackageFuzzySearchEsMX}
            >
                <Subsection id='to-duration' header='toDuration()'>
                    <p className='my-[16px]'>
                        The toDuration() method returns the total amount of miliseconds parsed from the input. For example when wanting the duration of 2 weeks:
                    </p>
                    <Code>
                        import {'{ Duration }'} from {"'@reeseharlak/duration';"} {"Duration.toDuration('2 weeks')"}
                        {`// 1209600000`}
                    </Code>

                    <div>
                        <h3 className='mt-[40px] mb-[20px] text-[18px] text-[#202124]'>Parameters</h3>

                        <div className='ml-5'>
                            <h4 className='mt-[18px] mb-[8px] text-[15px] text-[#2b2d31]'>
                                Pattern -{' '}
                                <a
                                    target='_blank'
                                    rel='noreferrer'
                                    className='text-blue-500'
                                    href='https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String'
                                >
                                    String
                                </a>
                            </h4>

                            <p className='text-[13px]'>
                                The input pattern to parse the duration from. This can be a shortened string like {'"2d"'} for two days. Or be a written out string like{' '}
                                {'"1 week"'} for one week.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className='mt-[40px] mb-[20px] text-[18px] text-[#202124]'>Returns</h3>

                        <div className='ml-5'>
                            <h4 className='mt-[18px] mb-[8px] text-[16px] text-[#2b2d31]'>
                                <a
                                    target='_blank'
                                    rel='noreferrer'
                                    className='text-blue-500'
                                    href='https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number'
                                >
                                    Number
                                </a>
                            </h4>
                        </div>
                    </div>
                </Subsection>
                <Subsection id='to-date' header='toDate()'>
                    <p className='my-[16px]'>
                        The toDate() method acts the same as the other methods but returns a JavaScript{' '}
                        <a href='https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date' className='text-blue-500'>
                            Date
                        </a>{' '}
                        object.
                    </p>
                    <Code>
                        import {'{ Duration }'} from {"'@reeseharlak/duration';"} {"Duration.toDate('1h')"}
                        {`// ${dateString}`}
                    </Code>

                    <div>
                        <h3 className='mt-[40px] mb-[20px] text-[18px] text-[#202124]'>Parameters</h3>

                        <div className='ml-5'>
                            <h4 className='mt-[18px] mb-[8px] text-[15px] text-[#2b2d31]'>
                                Pattern -{' '}
                                <a
                                    target='_blank'
                                    rel='noreferrer'
                                    className='text-blue-500'
                                    href='https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String'
                                >
                                    String
                                </a>
                            </h4>

                            <p className='text-[13px]'>
                                The input pattern to parse the duration from. This can be a shortened string like {'"2d"'} for two days. Or be a written out string like{' '}
                                {'"1 week"'} for one week.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className='mt-[40px] mb-[20px] text-[18px] text-[#202124]'>Returns</h3>

                        <div className='ml-5'>
                            <h4 className='mt-[18px] mb-[8px] text-[16px] text-[#2b2d31]'>
                                <a
                                    target='_blank'
                                    rel='noreferrer'
                                    className='text-blue-500'
                                    href='https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date'
                                >
                                    Date
                                </a>
                            </h4>
                        </div>
                    </div>
                </Subsection>
                <Subsection id='to-unix' header='toUnix()'>
                    <p className='my-[16px]'>
                        The methods included with this package all exist on the Duration class. This can be imported from the module: or assigned to a variable using the
                        require() syntax.
                    </p>
                    <Code>
                        import {'{ Duration }'} from {"'@reeseharlak/duration';"} {"Duration.toUnix('1 month')"}
                        {`// ${'{ miliseconds: 2628000000, seconds: 2628000 }'}`}
                    </Code>

                    <div>
                        <h3 className='mt-[40px] mb-[20px] text-[18px] text-[#202124]'>Parameters</h3>

                        <div className='ml-5'>
                            <h4 className='mt-[18px] mb-[8px] text-[15px] text-[#2b2d31]'>
                                Pattern -{' '}
                                <a
                                    target='_blank'
                                    rel='noreferrer'
                                    className='text-blue-500'
                                    href='https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String'
                                >
                                    String
                                </a>
                            </h4>

                            <p className='text-[13px]'>
                                The input pattern to parse the duration from. This can be a shortened string like {'"2d"'} for two days. Or be a written out string like{' '}
                                {'"1 week"'} for one week.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className='mt-[40px] mb-[20px] text-[18px] text-[#202124]'>Returns</h3>

                        <div className='ml-5'>
                            <h4 className='mt-[18px] mb-[8px] text-[16px] text-[#2b2d31]'>
                                <Link className='text-blue-500' href='/developers/package/duration/types#unix'>
                                    Unix
                                </Link>
                            </h4>
                        </div>
                    </div>
                </Subsection>
            </Package>
        </>
    );
};

export default Methods;
