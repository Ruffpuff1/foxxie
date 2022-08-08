import useHover from '@hooks/useHover';
import { ParallaxLayer } from '@react-spring/parallax';
import clsx from 'clsx';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import Arizona2022 from '../Arizona2022/Arizona2022';

export default function Layer2022One() {
    const [showMoreLa, setShowMoreLa] = useState(false);
    const [laHover, setLaHover] = useState(false);

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
        'more-la-btn',
        () => {
            setShowMoreLa(true);
        },
        () => {
            setShowMoreLa(false);
        }
    );

    return (
        <ParallaxLayer offset={4} style={{ height: '90%' }}>
            <div
                style={{
                    backgroundImage: `url('https://reese.cafe/cdn/assets/reese/pumpkin/timeline/timeline_2022_1.svg')`
                }}
                className='my-20 flex h-full items-center justify-between bg-cover bg-center bg-no-repeat px-10 lg:p-40'
            >
                <Arizona2022 />

                <div>
                    <div
                        style={{
                            transform: laHover ? 'translate(-2px, 5px) ' : 'translate(0px, 0px)'
                        }}
                        className='absolute right-[-4rem] bottom-[15rem] z-40 flex select-none items-center duration-[800ms] lg:right-44'
                    >
                        <div className='h-3 w-3 rounded-full bg-purple-500' />
                        <h2 className='ml-2 inline text-lg font-[400] leading-[1.3] text-[#333333]'>Visit to L.A.</h2>

                        <div
                            id='more-la-btn'
                            className={clsx(
                                'ml-2 origin-bottom-right border border-purple-200 duration-[600ms] ',
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

                    <div className='translate-x-20 lg:translate-x-0'>
                        <div
                            style={{
                                transform: laHover ? 'skew(-.8deg, -.8deg) scale(.95) translate(-2px, 5px) ' : 'scale(1) translate(0px, 0px)',
                                backgroundImage: `url('https://reese.cafe/images/assets/reese/pumpkin/pumpkin_apr_24_2022.jpg')`
                            }}
                            id='pumpkin_apr_24_2022'
                            className='mb-60 h-[125.5px] w-[233.5px] bg-cover bg-center bg-no-repeat p-2 duration-[800ms] md:h-[225.5px] md:w-[333.5px] lg:h-[325.5px] lg:w-[433.5px]'
                        />
                    </div>
                </div>
            </div>
        </ParallaxLayer>
    );
}
