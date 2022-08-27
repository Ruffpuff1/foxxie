import useNavbarScroll from '@hooks/useNavbarScroll';
import { useClickOutside } from '@reeseharlak/usehooks';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { MdClose, MdMenu } from 'react-icons/md';
import styles from './Navbar.module.css';

const NavbarLanguageSelector = dynamic(() => import('./NavbarLanguageSelector'), { ssr: false });
const Image = dynamic(() => import('next/image'), { ssr: false });
const Link = dynamic(() => import('@ui/Link/Link'), { ssr: false });
const AuthInformation = dynamic(() => import('@auth/AuthInformation/AuthInformation'), { ssr: false });

export default function Navbar({
    links,
    stat,
    closeId,
    title = '.cafe',
    hide,
    home = '/',
    noReese,
    auth,
    children,
    locale,
    menu,
    border,
    icon,
    noHoverIndicators
}: Props) {
    const router = useRouter();
    const [stick, scrolled] = useNavbarScroll();
    const [showPanel, setShowPanel] = useState(false);

    useClickOutside(
        () => {
            setShowPanel(false);
        },
        'navbar-popout-panel',
        [showPanel]
    );

    return (
        <>
            <header
                id='navbar'
                className={clsx(styles.header, {
                    [styles.header_scrolled]: scrolled,
                    [styles.header_not_scrolled]: !scrolled || stat,
                    [styles.header_stick]: stick || stat,
                    [styles.header_not_stick]: (!stick || hide) && !stat,
                    [styles.header_border_bottom]: border
                })}
            >
                <div className={styles.header_content}>
                    <div className={styles.button_wrapper}>
                        <button
                            onClick={() => {
                                setShowPanel(true);
                            }}
                        >
                            <MdMenu />
                        </button>
                    </div>

                    <Link
                        href={home}
                        className={clsx(
                            styles.title_wrapper,
                            {
                                [styles.title_wrapper_no_hov]: noHoverIndicators
                            },
                            'w-full max-w-[19rem] duration-200 sm:max-w-[50rem]'
                        )}
                    >
                        {icon && (
                            <div className='mr-[12px] flex items-center'>
                                <Image height={32} width={32} src={icon} alt={title?.toString()} />
                            </div>
                        )}
                        {!noReese && (
                            <div style={{ marginRight: title?.toString().startsWith(' ') ? '8px' : '0px' }} className={styles.logo}>
                                Reese
                            </div>
                        )}
                        <div
                            className={clsx(
                                styles.title,
                                {
                                    [styles.title_no_underline]: noHoverIndicators
                                },
                                'h-[64px] w-[110px] overflow-hidden text-ellipsis whitespace-nowrap duration-200 sm:w-auto'
                            )}
                        >
                            {title}
                        </div>
                    </Link>

                    {!children && (
                        <div className={styles.links_wrapper}>
                            <nav className={styles.links_nav}>
                                <ul className={styles.links_ul}>
                                    {links.map(link => {
                                        return (
                                            <li
                                                key={link.path}
                                                className={clsx(styles.nav_item, {
                                                    [styles.nav_item_active]: link.path === router.pathname
                                                })}
                                            >
                                                <Link href={link.path}>{link.text}</Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        </div>
                    )}

                    {children && <div className={styles.links_wrapper}>{children}</div>}
                </div>

                {locale || auth ? (
                    <div className='flex items-center space-x-2'>
                        {locale && <NavbarLanguageSelector closeId={closeId} />}

                        {auth && (
                            <div className='flex items-center'>
                                <AuthInformation signOutPath='/developers' />
                            </div>
                        )}
                    </div>
                ) : null}
            </header>

            <div className={`fixed top-0 z-[50] h-full w-full bg-black bg-opacity-30 ${showPanel ? 'block lg:hidden' : 'hidden'}`} />

            <div
                id='navbar-popout-panel'
                className={`fixed top-0 z-[60] h-full overflow-x-hidden whitespace-nowrap bg-white duration-300 ${
                    showPanel ? 'left-0 w-80 lg:left-[-20rem] lg:w-0' : 'left-[-20rem] w-0'
                }`}
            >
                <div className='flex items-center justify-between shadow-md'>
                    <button
                        onClick={() => {
                            setShowPanel(false);
                        }}
                        className='flex items-center pl-[20px]'
                    >
                        {!noReese && (
                            <div
                                className='box-border flex h-[64px] items-center text-[22px] leading-[30px]'
                                style={{ marginRight: title?.toString().startsWith(' ') ? '8px' : '0px' }}
                            >
                                Reese
                            </div>
                        )}
                        <div
                            className={clsx(
                                styles.title,
                                {
                                    [styles.title_no_underline]: noHoverIndicators
                                },
                                'h-[64px]'
                            )}
                        >
                            {title}
                        </div>
                    </button>
                    <button
                        className='mr-4 block rounded-full p-2 duration-200 hover:bg-gray-100 lg:hidden'
                        onClick={() => {
                            setShowPanel(false);
                        }}
                    >
                        <MdClose className='text-2xl' />
                    </button>
                </div>

                <ul className='flex w-80 flex-col items-start pt-5'>
                    {links.map(link => {
                        return (
                            <li key={link.text} className='h-full w-full py-5 pl-5 duration-200 hover:bg-gray-100'>
                                <Link href={link.path} className='h-full'>
                                    {link.text}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {menu && <>{typeof menu === 'function' ? menu(stick) : menu}</>}
        </>
    );
}

export interface Props {
    hide?: boolean;
    home?: string;
    border?: boolean;
    icon?: string;
    noHoverIndicators?: boolean;
    auth?: boolean;
    links: Link[];
    noReese?: boolean;
    title?: string | ReactNode;
    stat?: boolean;
    closeId?: string;
    locale?: boolean;
    menu?: ReactNode | ((stick: boolean) => ReactNode);
    children?: ReactNode;
}

export interface Link {
    path: string;
    text: string;
}
