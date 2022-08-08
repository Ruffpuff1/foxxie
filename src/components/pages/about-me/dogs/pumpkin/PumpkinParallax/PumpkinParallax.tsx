import useHover from '@hooks/useHover';
import useWheel from '@hooks/useWheel';
import { IParallax, Parallax, ParallaxLayer } from '@react-spring/parallax';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import Timeline from '../Timeline/Timeline';
import Title from '../Title/Title';
import TrippleArrowButton from '../TrippleArrowButton/TrippleArrowButton';
import styles from './PumpkinParallax.module.css';

export default function PumpkinParallax() {
    const ref = useRef<IParallax>(null);
    const [scroll, setScroll] = useState(0);

    const [azHover, setAzHover] = useState(false);
    const [showMoreAz, setShowMoreAz] = useState(false);
    const [showMoreLa, setShowMoreLa] = useState(false);
    const [laHover, setLaHover] = useState(false);

    const [direction, setDirection] = useState<'forward' | 'back'>('forward');

    useHover(
        'pumpkin_mar_28_2022',
        () => {
            setAzHover(true);
        },
        () => {
            setAzHover(false);
        }
    );

    useHover(
        'pumpkin_apr_24_2022',
        () => {
            setLaHover(true);
        },
        () => {
            setLaHover(false);
        }
    );

    useHover(
        'more-arizona-btn',
        () => {
            setShowMoreAz(true);
        },
        () => {
            setShowMoreAz(false);
        }
    );

    useHover(
        'more-la-btn',
        () => {
            setShowMoreLa(true);
        },
        () => {
            setShowMoreLa(false);
        }
    );

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
    const endOf2022 = 5;

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
        <Parallax ref={ref} pages={6} className={styles.horizontal_container} horizontal>
            <ParallaxLayer className={styles.no_point} sticky={{ start: 1, end: 5 }}>
                <Timeline ref={ref} scroll={scroll} />
            </ParallaxLayer>
            <ParallaxLayer className={styles.no_point} sticky={{ start: 1, end: endOf2021 }}>
                <div
                    className={`fixed top-20 left-[calc(50%-70px)] flex h-12 w-36 select-none items-center justify-center rounded-full bg-blue-500 text-center align-middle text-4xl text-white duration-300 ${
                        scroll > 0.9 && scroll < endOf2021 ? 'scale-100' : 'scale-0'
                    }`}
                >
                    <span>2021</span>
                </div>
            </ParallaxLayer>
            <ParallaxLayer className={styles.no_point} sticky={{ start: 4, end: endOf2022 }}>
                <div
                    className={`fixed top-20 left-[calc(50%-70px)] flex h-12 w-36 select-none items-center justify-center rounded-full bg-blue-500 text-center align-middle text-4xl text-white duration-300 ${
                        scroll > 3.9 && scroll < endOf2022 ? 'scale-100' : 'scale-0'
                    }`}
                >
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
            <ParallaxLayer offset={4} style={{ height: '90%' }}>
                <div
                    style={{
                        backgroundImage: `url('https://reese.cafe/cdn/assets/reese/pumpkin/timeline/timeline_2022_1.svg')`
                    }}
                    className='my-20 flex h-full items-center justify-between bg-cover bg-center bg-no-repeat px-10 lg:p-40'
                >
                    <div>
                        <div
                            style={{
                                transform: azHover ? 'translate(2px, -5px) ' : 'translate(0px, 0px)'
                            }}
                            className='absolute top-[17rem] z-40 flex select-none items-center duration-[800ms]'
                        >
                            <div className='h-3 w-3 rounded-full bg-blue-500' />
                            <h2 className='ml-2 inline text-lg font-[400] leading-[1.3] text-[#333333]'>Trip to Arizona</h2>

                            <div
                                id='more-arizona-btn'
                                className={clsx(
                                    'ml-2 origin-top-right border border-blue-200 duration-[600ms] ',
                                    showMoreAz ? 'h-8 w-12 scale-[6] rounded-md bg-blue-200' : 'h-8 w-8 rounded-xl bg-transparent'
                                )}
                            >
                                <MdAdd
                                    className={clsx('mt-1 ml-1 text-xl text-blue-500 delay-500 duration-500', {
                                        'hidden opacity-0': showMoreAz
                                    })}
                                />
                                <p
                                    className={clsx('p-1 text-[.125rem] text-[#4F4F4F]', {
                                        invisible: !showMoreAz
                                    })}
                                >
                                    Lorem ipsum dolor sit amet consectetur
                                </p>
                            </div>
                        </div>

                        <div className='p-2'>
                            <Image
                                style={{
                                    transform: azHover ? 'skew(.8deg, .8deg) scale(.95) translate(2px, -5px) ' : 'scale(1) translate(0px, 0px)'
                                }}
                                id='pumpkin_mar_28_2022'
                                src='https://reese.cafe/images/assets/reese/pumpkin/pumpkin_mar_28_2022.jpg'
                                alt=''
                                className='z-10 duration-[800ms]'
                                width={868 / 2}
                                height={651 / 2}
                            />
                        </div>
                    </div>

                    <div>
                        <div
                            style={{
                                transform: laHover ? 'translate(-2px, 5px) ' : 'translate(0px, 0px)'
                            }}
                            className='absolute right-44 bottom-[15rem] z-40 flex select-none items-center duration-[800ms]'
                        >
                            <div className='h-3 w-3 rounded-full bg-purple-500' />
                            <h2 className='ml-2 inline text-lg font-[400] leading-[1.3] text-[#333333]'>Visit to L.A.</h2>

                            <div
                                id='more-la-btn'
                                className={clsx(
                                    'ml-2 origin-bottom border border-purple-200 duration-[600ms] ',
                                    showMoreLa ? 'h-10 w-14 scale-[6] rounded-md bg-purple-200' : 'h-8 w-8 rounded-xl bg-transparent'
                                )}
                            >
                                <MdAdd
                                    className={clsx('mt-1 ml-1 text-xl text-purple-500 delay-500 duration-500', {
                                        'hidden opacity-0': showMoreLa
                                    })}
                                />
                                <p
                                    className={clsx('p-1 text-[.125rem] text-[#4F4F4F]', {
                                        invisible: !showMoreLa
                                    })}
                                >
                                    Lorem ipsum dolor sit amet consectetur
                                </p>
                            </div>
                        </div>

                        <div className='mb-60 p-2'>
                            <Image
                                src='https://reese.cafe/images/assets/reese/pumpkin/pumpkin_apr_24_2022.jpg'
                                alt=''
                                style={{
                                    transform: laHover ? 'skew(-.8deg, -.8deg) scale(.95) translate(-2px, 5px) ' : 'scale(1) translate(0px, 0px)'
                                }}
                                id='pumpkin_apr_24_2022'
                                className='z-10 duration-[800ms]'
                                width={867 / 2}
                                height={651 / 2}
                            />
                        </div>
                    </div>
                </div>
            </ParallaxLayer>

            <ParallaxLayer offset={0.9}>
                <div
                    className={`fixed right-3 top-96 z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-[2.5px] border-blue-500 bg-white duration-500 hover:h-[4rem] hover:w-[4rem] lg:right-20 ${
                        scroll > 0.9 && scroll < 1.5 ? 'scale-100 opacity-100 delay-[1.5s]' : 'scale-0 opacity-0'
                    }`}
                >
                    <TrippleArrowButton ref={ref} scrollTo={2} />
                </div>
            </ParallaxLayer>
            <ParallaxLayer offset={2}>
                <div
                    className={`fixed right-1 top-96 z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-[2.5px] border-blue-500 bg-white duration-500 hover:h-[4rem] hover:w-[4rem] lg:right-20 ${
                        scroll > 1.9 && scroll < 2.5 ? 'scale-100 opacity-100 delay-[1.5s]' : 'scale-0 opacity-0'
                    }`}
                >
                    <TrippleArrowButton ref={ref} scrollTo={3} />
                </div>
            </ParallaxLayer>
        </Parallax>
    );
}
