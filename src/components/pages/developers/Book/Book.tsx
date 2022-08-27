import { Translations } from '@assets/locales/types';
import useLocale from '@hooks/useLocale';
import Link from '@ui/Link/Link';
import { FuzzySearch } from '@util/FuzzySearch';
import { search } from '@util/searching';
import { MapEntry } from '@util/utils';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import styles from './Book.module.css';

export default function Book({ links, search: terms }: Props) {
    const [translations] = useLocale();
    const router = useRouter();

    const [hash, setHash] = useState<string | null>(null);

    useEffect(() => {
        setHash(window.location.hash);
    }, []);

    const [searchValue, setSearchValue] = useState('');
    const searchResults = search<MapEntry>(terms, searchValue, 'value');
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div id='devsite-book' className={styles.wrapper}>
            {Boolean(searchResults.length) && (
                <button
                    onClick={() => {
                        setSearchValue('');
                        if (inputRef.current) inputRef.current.value = '';
                    }}
                    className={clsx('fixed top-[5.67rem] left-[13.7rem] rounded-full p-1 hover:bg-gray-100', 'flex items-center justify-start')}
                >
                    <MdClose className='text-lg' />
                </button>
            )}
            <div className={styles.input_wrapper}>
                <input
                    className='focus:rounded-md focus:border focus:bg-white focus:shadow-xl focus:outline-none'
                    ref={inputRef}
                    type='text'
                    onChange={e => {
                        setSearchValue(e.target.value);
                    }}
                    placeholder={translations.filter}
                    role='searchbox'
                />
            </div>
            <nav>
                <div>
                    <div role='navigation'>
                        <ul className={styles.book_ul}>
                            {(searchResults.length ? searchResults.map(res => ({ href: res.link, key: res.value } as Booklink)) : links).map(link => {
                                return (
                                    <li
                                        key={link.key}
                                        className={clsx({
                                            'border-t-[1.5px]': link.separate
                                        })}
                                    >
                                        <Link
                                            href={link.href}
                                            className={clsx(styles.book_link, {
                                                [styles.book_link_selected]: (router.pathname === link.href || hash === link.href) && !searchResults.length
                                            })}
                                        >
                                            <span>{searchResults.length ? bold(link.key) : translations.book[link.key]}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

interface Props {
    links: Booklink[];
    search: FuzzySearch<string, MapEntry>;
}

export interface Booklink {
    key: keyof Translations['book'];
    separate?: boolean;
    href: string;
}

function bold(input: string) {
    const str = input.trimEnd();

    const reg = /<(?<text>[\w '&\.]+)>/g;
    const res = reg.exec(str);

    if (res === null) return <>{str}</>;

    const { text } = res.groups!;

    const index = str.indexOf(text);
    const front = str.slice(0, index - 1);
    const end = str.slice(index + text.length + 1);

    return (
        <>
            <span>{front}</span>
            <b>{text}</b>
            <span>{end}</span>
        </>
    );
}
