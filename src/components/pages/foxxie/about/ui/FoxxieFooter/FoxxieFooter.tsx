import { MdArrowUpward } from 'react-icons/md';
import styles from './FoxxieFooter.module.css';

export default function FoxxieFooter() {
    return (
        <footer className={styles.wrapper}>
            <a href='#top' className={styles.top_link}>
                <MdArrowUpward />
                <span>Back to top</span>
            </a>

            <p className={styles.copyright}>
                <span>Copyright © 2021 - 2022 </span>
                <a href='/' className={styles.link}>
                    Reese Harlak{' '}
                </a>
                <span>&</span>
                <a href='mailto:rain.anguiano@reese.cafe' className={styles.link}>
                    {' '}
                    Rain Anguiano
                </a>
                <span>. All rights reserved.</span>
            </p>
        </footer>
    );
}
