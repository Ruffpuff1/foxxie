import { Translations } from '@assets/locales/types';
import useLocale from '@hooks/useLocale';
import Link from '@ui/Link/Link';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import styles from './Book.module.css';

export default function Book({ links }: Props) {
    const [translations] = useLocale();
    const router = useRouter();

    return (
        <div id='devsite-book' className={styles.wrapper}>
            <div className={styles.input_wrapper}>
                <input type='text' placeholder={translations.filter} role='searchbox' />
            </div>
            <nav>
                <div>
                    <div role='navigation'>
                        <ul className={styles.book_ul}>
                            {links.map(link => {
                                return (
                                    <li key={link.key}>
                                        <Link
                                            href={link.href}
                                            className={clsx(styles.book_link, {
                                                [styles.book_link_selected]: link.href === router.pathname
                                            })}
                                        >
                                            <span>{translations.developers.book[link.key]}</span>
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
}

export interface Booklink {
    key: keyof Translations['developers']['book'];
    href: string;
}
