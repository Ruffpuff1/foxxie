import { IParallax, ParallaxLayer } from '@react-spring/parallax';
import clsx from 'clsx';
import { ForwardedRef, forwardRef } from 'react';
import TrippleArrowButton from '../TrippleArrowButton/TrippleArrowButton';

const LayerButtons = forwardRef(function LayerButtons({ scroll }: Props, ref: ForwardedRef<IParallax>) {
    return (
        <>
            <ParallaxLayer offset={0.9} className='pointer-events-none'>
                <div
                    className={clsx(
                        'pointer-events-auto fixed right-3 top-96 z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-[2.5px] border-blue-500 bg-white duration-500 hover:h-[4rem] hover:w-[4rem] lg:right-20',
                        scroll > 0.9 && scroll < 1.5 ? 'scale-100 opacity-100 delay-[1.5s]' : 'scale-0 opacity-0'
                    )}
                >
                    <TrippleArrowButton ref={ref} scrollTo={2} />
                </div>
            </ParallaxLayer>
            <ParallaxLayer offset={2} className='pointer-events-none'>
                <div
                    className={clsx(
                        'pointer-events-auto fixed right-1 top-96 z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-[2.5px] border-blue-500 bg-white duration-500 hover:h-[4rem] hover:w-[4rem] lg:right-20',
                        scroll > 1.9 && scroll < 2.5 ? 'scale-100 opacity-100 delay-[1.5s]' : 'scale-0 opacity-0'
                    )}
                >
                    <TrippleArrowButton ref={ref} scrollTo={3} />
                </div>
            </ParallaxLayer>
            <ParallaxLayer offset={3} className='pointer-events-none'>
                <div
                    className={clsx(
                        'pointer-events-auto fixed right-1 top-96 z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-[2.5px] border-blue-500 bg-white duration-500 hover:h-[4rem] hover:w-[4rem] lg:right-20',
                        scroll > 2.9 && scroll < 3.5 ? 'scale-100 opacity-100 delay-[1.5s]' : 'scale-0 opacity-0'
                    )}
                >
                    <TrippleArrowButton ref={ref} scrollTo={4} />
                </div>
            </ParallaxLayer>
            <ParallaxLayer offset={4} className='pointer-events-none'>
                <div
                    className={clsx(
                        'pointer-events-auto fixed right-1 top-96 z-[1] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-[2.5px] border-blue-500 bg-white duration-500 hover:h-[4rem] hover:w-[4rem] lg:right-20',
                        scroll > 3.9 && scroll < 4.5 ? 'scale-100 opacity-100 delay-[1.5s]' : 'scale-0 opacity-0'
                    )}
                >
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
