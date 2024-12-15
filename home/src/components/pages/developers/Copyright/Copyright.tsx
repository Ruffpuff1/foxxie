import useLocale from '@hooks/useLocale';
import Link from '@ui/Link/Link';
import styles from './Copyright.module.css';

export default function Copyright() {
    const [{ developers }] = useLocale();
    const { copyright } = developers;

    return (
        <p className={styles.copyright}>
            {copyright.start} <Link href='/'>Reeseharlak.com</Link>
            {'. '}
            {copyright.intl} <Link href='/intl'>{copyright.respectiveAuthors}</Link>
            {copyright.licensed} <a href='https://opensource.org/licenses/MIT'>{copyright.mitLicense}</a>.
        </p>
    );
}
