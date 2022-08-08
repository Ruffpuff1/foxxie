import { ForwardedRef, forwardRef } from 'react';
import { IParallax } from '@react-spring/parallax';
import styles from './Timeline.module.css';
import clsx from 'clsx';

const Timeline = forwardRef(function Timeline({ scroll }: Props, ref: ForwardedRef<IParallax>) {
    if (typeof ref === 'function' || !ref) return null;

    return (
        <div className={clsx(styles.wrap, scroll > 0.9 && scroll < 5 ? styles.wrap_pop : styles.wrap_down)}>
            <div className={styles.inner_wrap}>
                <button
                    className={clsx(styles.year_2021, {
                        [styles.year_selected]: scroll >= 1 && scroll < 2
                    })}
                    onClick={() => ref.current?.scrollTo(1)}
                >
                    2021
                </button>
                <button
                    onClick={() => ref.current?.scrollTo(2)}
                    className={clsx(styles.point, {
                        [styles.point_select]: scroll >= 2 && scroll < 3,
                        [styles.point_no_select]: !(scroll >= 2 && scroll < 3)
                    })}
                />
                <button
                    onClick={() => ref.current?.scrollTo(3)}
                    className={clsx(styles.point, {
                        [styles.point_select]: scroll >= 3 && scroll < 4,
                        [styles.point_no_select]: !(scroll >= 3 && scroll < 4)
                    })}
                />
                <button
                    className={clsx(styles.year_2022, {
                        [styles.year_selected]: scroll >= 4 && scroll < 5
                    })}
                    onClick={() => ref.current?.scrollTo(4)}
                >
                    2022
                </button>
                <button
                    onClick={() => ref.current?.scrollTo(5)}
                    className={clsx(styles.point, {
                        [styles.point_select]: scroll >= 5 && scroll < 6,
                        [styles.point_no_select]: !(scroll >= 5 && scroll < 6)
                    })}
                />
            </div>
        </div>
    );
});

interface Props {
    scroll: number;
}

export default Timeline;
