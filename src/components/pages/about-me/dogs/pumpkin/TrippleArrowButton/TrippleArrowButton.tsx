import { IParallax } from '@react-spring/parallax';
import { ForwardedRef, forwardRef } from 'react';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import styles from './TrippleArrowButton.module.css';

const TrippleArrowButton = forwardRef(function TrippleArrowButton(props: Props, ref: ForwardedRef<IParallax>) {
    return (
        <button
            onClick={() => {
                if (typeof ref !== 'function' && ref?.current) ref?.current?.scrollTo(props.scrollTo);
            }}
            className={styles.button}
        >
            <MdOutlineKeyboardArrowRight className={styles.arrow} />
            <MdOutlineKeyboardArrowRight className={styles.arrow} />
            <MdOutlineKeyboardArrowRight className={styles.arrow} />
        </button>
    );
});

interface Props {
    scrollTo: number;
}

export default TrippleArrowButton;
