import useNavbarScroll from '@hooks/useNavbarScroll';
import Link from '@ui/Link/Link';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { MdClose, MdMenu } from 'react-icons/md';
import styles from './Navbar.module.css';

export default function Navbar({ links, title = '.cafe', hide, home = '/' }: Props) {
    const router = useRouter();
    const [stick, scrolled] = useNavbarScroll();
    const [showPanel, setShowPanel] = useState(false);

    return (
        <>
            <header
                id='navbar'
                className={clsx(styles.header, {
                    [styles.header_scrolled]: scrolled,
                    [styles.header_not_scrolled]: !scrolled,
                    [styles.header_stick]: stick,
                    [styles.header_not_stick]: !stick || hide
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

                    <Link href={home} className={styles.title_wrapper}>
                        <div style={{ marginRight: title.startsWith(' ') ? '8px' : '0px' }} className={styles.logo}>
                            Reese
                        </div>
                        <div className={styles.title}>{title}</div>
                    </Link>

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
                </div>
            </header>

            <div className={`fixed top-0 z-[50] h-full w-full bg-black bg-opacity-30 ${showPanel ? 'block' : 'hidden'}`} />

            <div className={`fixed top-0 left-0 z-[60] h-full overflow-x-hidden whitespace-nowrap bg-white duration-200 ${showPanel ? 'w-80' : 'w-0'}`}>
                <div className='flex items-center justify-start shadow-md'>
                    <button
                        onClick={() => {
                            setShowPanel(false);
                        }}
                        className='flex items-center pl-[20px]'
                    >
                        <div className='box-border flex h-[64px] items-center text-[22px] leading-[30px]' style={{ marginRight: title.startsWith(' ') ? '8px' : '0px' }}>
                            Reese
                        </div>
                        <div className={styles.title}>{title}</div>
                    </button>
                    <button
                        className='ml-24 block rounded-full p-2 duration-200 hover:bg-gray-100 lg:hidden'
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
        </>
    );
}

export interface Props {
    hide?: boolean;
    home?: string;
    links: Link[];
    title?: string;
}

export interface Link {
    path: string;
    text: string;
}
