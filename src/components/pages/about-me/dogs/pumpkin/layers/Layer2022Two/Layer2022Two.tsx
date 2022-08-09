import { ParallaxLayer } from '@react-spring/parallax';
import Hawaii2022 from '../../pictures/Hawaii2022/Hawaii2022';
import styles from './Layer2022Two.module.css';

export default function Layer2022Two() {
    return (
        <ParallaxLayer offset={5} style={{ height: '90%' }}>
            <div className={styles.wrap}>
                <div className='mb-60 flex items-center'>
                    <div className='h-3 w-3 rounded-full bg-blue-500' />
                    <h2 className='ml-2 inline whitespace-nowrap text-lg font-[400] leading-[1.3] text-[#333333]'>Pumpkin&apos;s first Birthday</h2>
                </div>

                <Hawaii2022 />
            </div>
        </ParallaxLayer>
    );
}
