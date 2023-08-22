import { useHover } from '@reeseharlak/usehooks';
import clsx from 'clsx';
import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
    const hover = useHover('about-me-banner-img');

    return (
        <section className={styles.header}>
            <Image
                width={510}
                id='about-me-banner-img'
                height={380}
                className={styles.banner_img}
                src='https://rsehrk.com/images/assets/reese/reese-and-rain.jpeg'
                alt='My friend and I at the park - 2021'
            />
            <span
                className={clsx({
                    [styles.no_hover]: !hover
                })}
            >
                My friend and I at the park - 2021
            </span>
        </section>
    );
}
