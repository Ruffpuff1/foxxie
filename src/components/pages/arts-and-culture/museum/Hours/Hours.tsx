import { Hour, Museum } from '@assets/arts-and-culture/structures/Museum';
import styles from './Hours.module.css';

export default function Hours({ museum }: { museum: Museum }) {
    const hourArr = Object.keys(museum.hours);
    // @ts-expect-error ksjdj
    const find = (k: string) => museum.hours[hourArr.find(i => i === k)] as Hour;

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.header}>Hours</h2>

            <div className={styles.days_wrapper}>
                <span className={styles.day_wrapper}>
                    <span className={styles.header}>Monday</span>
                    <span>{formatHour(find('mon'))}</span>
                </span>

                <span className={styles.day_wrapper}>
                    <span className={styles.header}>Tuesday</span>
                    <span>{formatHour(find('tues'))}</span>
                </span>
                <span className={styles.day_wrapper}>
                    <span className={styles.header}>Wednesday</span>
                    <span>{formatHour(find('wed'))}</span>
                </span>
                <span className={styles.day_wrapper}>
                    <span className={styles.header}>Thursday</span>
                    <span>{formatHour(find('thur'))}</span>
                </span>
                <span className={styles.day_wrapper}>
                    <span className={styles.header}>Friday</span>
                    <span>{formatHour(find('fri'))}</span>
                </span>
                <span className={styles.day_wrapper}>
                    <span className={styles.header}>Saturday</span>
                    <span>{formatHour(find('sat'))}</span>
                </span>
                <span className={styles.day_wrapper}>
                    <span className={styles.header}>Sunday</span>
                    <span>{formatHour(find('sun'))}</span>
                </span>
            </div>
        </div>
    );
}

function formatHour(hr: Hour): string {
    if (!hr) return 'Closed';
    const { open, close } = hr;
    return `${open} - ${close}`;
}
