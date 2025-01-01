import useLocale from '@hooks/useLocale';
import Link from '@ui/Link/Link';
import clsx from 'clsx';
import styles from './Footer.module.css';

export default function Footer({ full }: Props) {
    const [{ developers }] = useLocale();

    return (
        <footer
            className={clsx(styles.footer, {
                [styles.not_full]: !full
            })}
        >
            <div className={styles.link_wrap}>
                <h3>{developers.footer.contactUs}</h3>
                <Link href='/blog' className={styles.link}>
                    {developers.footer.blog}
                </Link>
                <a href='/github' className={styles.link}>
                    Github
                </a>
                <a href='/twitter' className={styles.link}>
                    Twitter
                </a>
            </div>

            <div className='flex items-center justify-start space-x-3 border-b'>
                <Link href='/' className='my-1 rounded-md py-6 px-8 text-xl font-medium text-gray-600'>
                    Reese Harlak
                </Link>
            </div>

            <div className='flex items-center justify-start space-x-3 py-7 px-8 text-[14.5px] text-gray-500'>
                <Link href='/policies/developers/terms' className='hover:text-blue-500'>
                    {developers.footer.terms}
                </Link>
                <span>|</span>
                <Link href='/policies/privacy' className='hover:text-blue-500'>
                    {developers.footer.privacy}
                </Link>
            </div>
        </footer>
    );
}

interface Props {
    full?: boolean;
}
