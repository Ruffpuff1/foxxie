/* eslint-disable @next/next/no-img-element */
import { Museum } from '@assets/arts-and-culture/structures/Museum';
import styles from './Banner.module.css';

export default function Banner({ museum }: { museum: Museum }) {
    return (
        <div className={styles.wrapper}>
            <img className={styles.img} height={650} width={970} loading='eager' src={museum.bannerUrl} alt={museum.name} />
        </div>
    );
}
