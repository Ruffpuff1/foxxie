import { Icons } from '@assets/images';
import useHover from '@hooks/useHover';
import useLocale from '@hooks/useLocale';
import { useClickOutside, useScroll } from '@reeseharlak/usehooks';
import Link from '@ui/Link/Link';
import { default as BaseNavbar } from '@ui/Navbar/Navbar';
import { useKeyPress } from 'ahooks';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { MdArrowDropDown } from 'react-icons/md';

const apiItems: MenuItem[] = [
    {
        href: '/developers/celestia',
        text: 'Celestia'
    },
    {
        href: '/developers/stardrop',
        text: 'Stardrop'
    },
    {
        href: '/developers/todo',
        text: 'Todo'
    }
];

const packageItems: MenuItem[] = [
    {
        href: '/developers/package/duration',
        text: 'Duration'
    },
    {
        href: '/developers/package/env',
        text: 'Env'
    },
    {
        href: '/developers/package/eslint-config',
        text: 'Eslint Config'
    },
    {
        href: '/developers/package/fetch',
        text: 'Fetch'
    },
    {
        href: '/developers/package/sanitize',
        text: 'Sanitize'
    },
    {
        href: '/developers/package/usehooks',
        text: 'Usehooks'
    },
    {
        href: '/developers/package/utilities',
        text: 'Utilities'
    }
];

export default function Navbar() {
    const [{ developers }] = useLocale();
    const [apisOpen, setApisOpen] = useState(false);
    const [packagesOpen, setPackagesOpen] = useState(false);

    const closeMenus = () => {
        setPackagesOpen(false);
        setApisOpen(false);
    };

    const toggleApiMenu = () => {
        closeMenus();
        setApisOpen(!apisOpen);
    };

    const togglePackagesMenu = () => {
        closeMenus();
        setPackagesOpen(!packagesOpen);
    };

    useHover('apis-button-nav', () => {
        toggleApiMenu();
    });

    useHover('packages-button-nav', () => {
        togglePackagesMenu();
    });

    useScroll(closeMenus, undefined, 'devsite-body');

    useClickOutside(
        () => {
            setApisOpen(false);
        },
        'devsite-apis-dropdown',
        [apisOpen]
    );

    useClickOutside(
        () => {
            setPackagesOpen(false);
        },
        'devsite-packages-dropdown',
        [packagesOpen]
    );

    const packageRef = useRef(null);
    useKeyPress(
        'downarrow',
        () => {
            setPackagesOpen(false);
        },
        {
            target: packageRef
        }
    );

    return (
        <BaseNavbar
            links={[
                {
                    path: '/developers/apis',
                    text: 'APIs'
                },
                {
                    path: '/developers/learn',
                    text: developers.nav.learn
                },
                {
                    path: '/developers/packages',
                    text: developers.nav.packages
                }
            ]}
            title=' Developers'
            home='/developers'
            border
            auth
            locale
            stat
            closeId='devsite-body'
            noHoverIndicators
            icon={Icons.Developers}
            menu={
                <>
                    <div
                        id='devsite-apis-dropdown'
                        className={clsx(
                            'fixed left-[16.5rem] z-[10] hidden overflow-y-hidden border bg-white px-8 py-4 shadow-lg duration-200 lg:block',
                            apisOpen ? 'top-[4rem]' : 'top-[-4rem] max-h-0'
                        )}
                    >
                        <div className='my-2 flex flex-col space-y-5 text-sm text-[.9rem] tracking-wide'>
                            {apiItems.map(item => {
                                return (
                                    <Link key={item.text} href={item.href} className='duration-200 hover:text-gray-500'>
                                        {item.text}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div
                        id='devsite-packages-dropdown'
                        className={clsx(
                            'fixed left-[29rem] z-[10] hidden overflow-y-hidden border bg-white px-5 py-4 shadow-lg duration-200 lg:block',
                            packagesOpen ? 'top-[4rem]' : 'top-[-4rem] max-h-0'
                        )}
                    >
                        <div
                            className={clsx('flex flex-col text-[.9rem] tracking-wide', {
                                'my-2 space-y-5': packagesOpen
                            })}
                        >
                            {packageItems.map(item => {
                                return (
                                    <Link key={item.text} href={item.href} className='duration-200 hover:text-gray-500'>
                                        {item.text}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </>
            }
        >
            <div className='space-x-10'>
                <Link href='/developers/apis' id='apis-button-nav' className='inline-flex items-center'>
                    <span>APIs</span>
                    <MdArrowDropDown className={clsx('text-2xl duration-200', apisOpen ? 'rotate-180' : '')} />
                </Link>

                <Link href='/developers/learn'>{developers.nav.learn}</Link>

                <Link ref={packageRef} role='combobox' href='/developers/packages' id='packages-button-nav' className='inline-flex items-center'>
                    <span>{developers.nav.packages}</span>
                    <MdArrowDropDown className={clsx('text-2xl duration-200', packagesOpen ? 'rotate-180' : '')} />
                </Link>
            </div>
        </BaseNavbar>
    );
}

interface MenuItem {
    href: string;
    text: string;
}
