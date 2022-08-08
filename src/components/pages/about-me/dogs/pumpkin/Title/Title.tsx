import { IParallax, ParallaxLayer } from '@react-spring/parallax';
import { ForwardedRef, forwardRef } from 'react';
import TrippleArrowButton from '../TrippleArrowButton/TrippleArrowButton';
import styles from './Title.module.css';

const Title = forwardRef(function Title(_: Record<never, never>, ref: ForwardedRef<IParallax>) {
    return (
        <ParallaxLayer offset={0} style={{ height: '90%' }}>
            <div className={styles.title_card}>
                <h1>Pumpkin</h1>

                <div className={styles.scroll_wrapper}>
                    <h2>Scroll to explore</h2>

                    <div className={styles.button_wrapper}>
                        <TrippleArrowButton ref={ref} scrollTo={1} />
                    </div>
                </div>
            </div>
        </ParallaxLayer>
    );
});

export default Title;
