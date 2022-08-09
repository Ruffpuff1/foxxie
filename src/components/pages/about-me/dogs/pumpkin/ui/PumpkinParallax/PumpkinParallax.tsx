import Navbar from '@about-me/Navbar';
import useWheel from '@hooks/useWheel';
import { IParallax, Parallax, ParallaxLayer } from '@react-spring/parallax';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Layer2022One from '../../layers/Layer2022One/Layer2022One';
import Layer2022Two from '../../layers/Layer2022Two/Layer2022Two';
import LayerButtons from '../../layers/LayerButtons/LayerButtons';
import Timeline from '../Timeline/Timeline';
import Title from '../Title/Title';
import styles from './PumpkinParallax.module.css';

export default function PumpkinParallax() {
    const ref = useRef<IParallax>(null);
    const [scroll, setScroll] = useState(0);
    const [direction, setDirection] = useState<'forward' | 'back'>('forward');

    useEffect(() => {
        const onScroll = () => {
            setScroll(ref.current!.current / ref.current!.space);

            if (scroll <= 0.95 && ref.current && direction !== 'forward') ref.current.scrollTo(0);
            if (scroll >= 0.25 && scroll < 0.95 && ref.current && direction === 'forward') ref.current.scrollTo(1);

            if (scroll < 0.2) setDirection('forward');
        };

        if (!ref.current || !ref.current.container) return;
        ref.current.container.current.onscroll = onScroll;
    }, [ref, scroll, direction]);

    const endOf2021 = 3.5;
    const endOf2022 = 6;

    useWheel(ev => {
        let past = 0;

        if (past !== ev.deltaY) {
            if (ev.deltaY > 0 && ref.current) {
                ref.current.scrollTo(scroll + 0.15);
                setDirection('forward');
            } else if (ev.deltaY < 0 && ref.current) {
                ref.current.scrollTo(scroll - 0.15);
                setDirection('back');
            }

            past = ev.deltaY;
        }
    });

    return (
        <>
            <Navbar hide={scroll >= 0.9} />

            <Parallax ref={ref} pages={6} className={styles.horizontal_container} horizontal>
                <ParallaxLayer className={styles.no_point} sticky={{ start: 1, end: 5 }}>
                    <Timeline ref={ref} scroll={scroll} />
                </ParallaxLayer>

                <ParallaxLayer className={styles.no_point} sticky={{ start: 1, end: endOf2021 }}>
                    <div className={clsx(styles.year, scroll > 0.9 && scroll < endOf2021 + 0.5 ? styles.year_show : styles.year_hide)}>
                        <span>2021</span>
                    </div>
                </ParallaxLayer>

                <ParallaxLayer className={styles.no_point} sticky={{ start: endOf2021, end: endOf2022 }}>
                    <div className={clsx(styles.year, scroll > 3.9 && scroll < endOf2022 + 0.5 ? styles.year_show : styles.year_hide)}>
                        <span>2022</span>
                    </div>
                </ParallaxLayer>

                <Title ref={ref} />

                <ParallaxLayer offset={1} style={{ height: '90%' }}>
                    <div
                        style={{
                            backgroundImage: `url('https://reese.cafe/images/assets/reese/pumpkin/timeline/timeline_2021_1.svg')`
                        }}
                        className='mx-20 flex h-screen items-center justify-center bg-cover bg-center bg-no-repeat lg:mx-0'
                    >
                        <Image src='https://reese.cafe/images/assets/reese/pumpkin/pumpkin_sep_19_2021.jpg' alt='' width={727} height={545} />
                    </div>
                </ParallaxLayer>

                <ParallaxLayer offset={2} style={{ height: '90%' }}>
                    <div
                        style={{
                            backgroundImage: `url('https://reese.cafe/images/assets/reese/pumpkin/timeline/timeline_2021_2.svg')`
                        }}
                        className='my-20 flex h-full items-center justify-between bg-cover bg-center bg-no-repeat px-10 lg:p-40'
                    >
                        <div className='p-2'>
                            <Image src='https://reese.cafe/images/assets/reese/pumpkin/pumpkin_oct_4_2021.jpg' alt='' className='' width={597 / 2} height={796 / 2} />
                        </div>

                        <div className='mb-60 p-2'>
                            <Image src='https://reese.cafe/cdn/assets/reese/pumpkin/pumpkin_oct_5_2021.jpg' alt='' width={727 / 2} height={561 / 2} />
                        </div>
                    </div>
                </ParallaxLayer>
                <ParallaxLayer offset={3} style={{ height: '90%' }}>
                    <div
                        style={{
                            backgroundImage: `url('https://reese.cafe/cdn/assets/reese/pumpkin/timeline/timeline_2021_3.svg')`
                        }}
                        className='my-20 flex h-full items-center justify-between bg-cover bg-center bg-no-repeat px-10 lg:p-40'
                    >
                        <div className='p-2'>
                            <Image src='https://reese.cafe/images/assets/reese/pumpkin/pumpkin_oct_31_2021.jpg' alt='' className='' width={597 / 2} height={796 / 2} />
                        </div>

                        <div className='mb-60 p-2'>
                            <Image src='https://reese.cafe/cdn/assets/reese/pumpkin/pumpkin_dec_23_2021.jpg' alt='' width={803 / 2} height={796 / 2} />
                        </div>
                    </div>
                </ParallaxLayer>

                <Layer2022One />
                <Layer2022Two />
                <LayerButtons scroll={scroll} ref={ref} />
            </Parallax>
        </>
    );
}
