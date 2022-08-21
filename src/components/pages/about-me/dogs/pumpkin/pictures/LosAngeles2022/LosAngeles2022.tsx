import { useHover } from '@reeseharlak/usehooks';
import clsx from 'clsx';
import { MdAdd } from 'react-icons/md';
import styles from './LosAngeles2022.module.css';

export default function LosAngeles2022() {
    const laHover = useHover('pumpkin_apr_24_2022');
    const showMoreLa = useHover('more-la-btn');

    return (
        <div>
            <div className={clsx(styles.button_wrap, laHover ? styles.button_wrap_skew : styles.button_wrap_base)}>
                <div className={styles.dot} />
                <h2 className={styles.header}>Visit to L.A.</h2>

                <div id='more-la-btn' className={clsx(styles.button, showMoreLa ? styles.button_more : styles.button_less)}>
                    <MdAdd
                        className={clsx(styles.plus, {
                            [styles.plus_hide]: showMoreLa
                        })}
                    />
                    <p
                        className={clsx(styles.p, {
                            [styles.p_hide]: !showMoreLa
                        })}
                    >
                        On April 24th 2022, we went up to Los Angeles for the day with Pumpkin.
                    </p>
                </div>
            </div>

            <div className={styles.img_wrap}>
                <div id='pumpkin_apr_24_2022' className={clsx(styles.img, laHover ? styles.img_skew : styles.img_base)} />
            </div>
        </div>
    );
}
