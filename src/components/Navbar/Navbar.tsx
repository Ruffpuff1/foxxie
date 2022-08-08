import clsx from 'clsx';
import styles from './Navbar.module.css';
import { useRouter } from 'next/router';
import { MdClose, MdMenu } from 'react-icons/md';
import { detectLocale } from 'src/util/intl';
import useNavbarScroll from '@hooks/useNavbarScroll';
import { useState } from 'react';

export default function Navbar({ links, title = '.cafe', home = '/' }: Props) {
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
                    [styles.header_not_stick]: !stick
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

                    <button onClick={() => router.push(home)} className={styles.title_wrapper}>
                        <div style={{ marginRight: title.startsWith(' ') ? '8px' : '0px' }} className={styles.logo}>
                            Reese
                        </div>
                        <div className={styles.title}>{title}</div>
                    </button>

                    <div className={styles.links_wrapper}>
                        <nav className={styles.links_nav}>
                            <ul className={styles.links_ul}>
                                {links.map(link => {
                                    const loc = detectLocale(router.asPath);
                                    const href = loc ? `/intl/${loc}${link.path}` : link.path;

                                    return (
                                        <li
                                            key={link.path}
                                            className={clsx(styles.nav_item, {
                                                [styles.nav_item_active]: link.path === router.pathname
                                            })}
                                        >
                                            <a href={href}>{link.text}</a>
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
                        <div className='box-border flex h-[64px] items-center pr-[8px] text-[22px] leading-[30px]'>Reese</div>
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
                                <a href={link.path} className='h-full w-full'>
                                    {link.text}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}

export interface Props {
    home?: string;
    links: Link[];
    title?: string;
}

export interface Link {
    path: string;
    text: string;
}
