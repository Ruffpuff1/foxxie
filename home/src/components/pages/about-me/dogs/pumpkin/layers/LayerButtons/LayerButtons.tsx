import { IParallax, ParallaxLayer } from '@react-spring/parallax';
import clsx from 'clsx';
import { ForwardedRef, forwardRef } from 'react';
import TrippleArrowButton from '../../ui/TrippleArrowButton/TrippleArrowButton';
import styles from './LayerButtons.module.css';

const LayerButtons = forwardRef(function LayerButtons({ scroll }: Props, ref: ForwardedRef<IParallax>) {
    return (
        <>
            <ParallaxLayer offset={0.9} className={styles.no_point}>
                <div className={clsx(styles.button_wrap, scroll > 0.9 && scroll < 1.5 ? styles.wrap_visible : styles.wrap_no_vis)}>
                    <TrippleArrowButton ref={ref} scrollTo={2} />
                </div>
            </ParallaxLayer>
            <ParallaxLayer offset={2} className={styles.no_point}>
                <div className={clsx(styles.button_wrap, scroll > 1.9 && scroll < 2.5 ? styles.wrap_visible : styles.wrap_no_vis)}>
                    <TrippleArrowButton ref={ref} scrollTo={3} />
                </div>
            </ParallaxLayer>
            <ParallaxLayer offset={3} className={styles.no_point}>
                <div className={clsx(styles.button_wrap, scroll > 2.9 && scroll < 3.5 ? styles.wrap_visible : styles.wrap_no_vis)}>
                    <TrippleArrowButton ref={ref} scrollTo={4} />
                </div>
            </ParallaxLayer>
            <ParallaxLayer offset={4} className={styles.no_point}>
                <div className={clsx(styles.button_wrap, scroll > 3.9 && scroll < 4.5 ? styles.wrap_visible : styles.wrap_no_vis)}>
                    <TrippleArrowButton ref={ref} scrollTo={5} />
                </div>
            </ParallaxLayer>
        </>
    );
});

interface Props {
    scroll: number;
}

export default LayerButtons;
