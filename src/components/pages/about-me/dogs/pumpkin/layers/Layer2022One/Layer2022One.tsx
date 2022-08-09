import { ParallaxLayer } from '@react-spring/parallax';
import Arizona2022 from '../../pictures/Arizona2022/Arizona2022';
import LosAngeles2022 from '../../pictures/LosAngeles2022/LosAngeles2022';
import styles from './Layer2022One.module.css';

export default function Layer2022One() {
    return (
        <ParallaxLayer offset={4} style={{ height: '90%' }}>
            <div className={styles.wrap}>
                <Arizona2022 />
                <LosAngeles2022 />
            </div>
        </ParallaxLayer>
    );
}
