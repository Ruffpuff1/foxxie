import Navbar from '@arts-culture/ui/Navbar';
import { Story } from '@assets/arts-and-culture/structures';
import useVisibility from '@hooks/useVisibility';
import { IParallax, Parallax, ParallaxLayer } from '@react-spring/parallax';
import { useEffect, useRef, useState } from 'react';
import FlagBackground from '../mlm-pride/layers/Flag/FlagBackground';
import Footer from '../mlm-pride/layers/Footer';

export default function SlidingStoryParallax({ story }: { story: Story }) {
    const steps = story.steps!;
    const pages = steps.length * 2 + 3;

    console.log(pages);

    const [isVisible, , bnRef] = useVisibility<HTMLDivElement>();

    const [percent, setPercent] = useState(0);

    const ref = useRef<IParallax>(null);

    const onScroll = () => {
        setPercent((ref.current!.current / ref.current!.space / (pages - 1)) * 100);
    };

    useEffect(() => {
        if (!ref.current || !ref.current.container) return;
        ref.current.container.current.onscroll = onScroll;
    });

    return (
        <>
            <Navbar visible={!isVisible} hide emailBody={`https://reese.cafe/arts-and-culture/story/${story.id}`} />

            <main className={`fixed top-[3.2rem] h-full w-full overflow-y-auto font-ptSans font-[400] tracking-[.01428571em] duration-200`}>
                <Parallax ref={ref} style={{ scrollBehavior: 'smooth' }} pages={pages}>
                    <ParallaxLayer sticky={{ start: 0, end: 0.4 }} className='bg-transparent'>
                        <div ref={bnRef} className='flex h-full w-full items-start justify-center pt-60'>
                            <FlagBackground />
                        </div>
                    </ParallaxLayer>

                    {steps.map((step, idx) => {
                        const base = idx === 0 ? 1 : idx * 2 + 1;
                        const start = base;
                        const end = start + 2;

                        return (
                            <>
                                <ParallaxLayer key={step.header} sticky={{ start, end }} className='bg-transparent'>
                                    <div
                                        style={{
                                            backgroundImage: step.img ? `url('${step.img}')` : undefined
                                        }}
                                        className={`flex h-full w-full items-start justify-center ${step.img ? 'bg-cover bg-center' : 'bg-white'}`}
                                    >
                                        <div className='h-full w-full bg-black bg-opacity-70 backdrop-blur-sm'>
                                            <div
                                                style={{
                                                    backgroundImage: step.img ? `url('${step.img}')` : undefined
                                                }}
                                                className={`flex h-full w-full items-start justify-center ${
                                                    step.img ? 'bg-contain bg-center bg-no-repeat md:bg-cover' : 'bg-white'
                                                }`}
                                            >
                                                {step.img && <div className='hidden h-full w-full bg-black bg-opacity-60 md:block' />}
                                            </div>
                                        </div>
                                    </div>
                                </ParallaxLayer>

                                <ParallaxLayer key={`${step.header}/2`} sticky={{ start: start + 0.3, end }} className='bg-transparent'>
                                    <div
                                        className={`flex h-full w-full flex-col items-start justify-end p-10 pb-20 duration-200 ${
                                            step.img ? 'text-white' : 'text-black'
                                        }`}
                                    >
                                        <h2 className='text-xl font-[500] tracking-wider'>{step.header}</h2>
                                        <p className='text-lg font-[450] tracking-wide'>{step.description}</p>
                                    </div>
                                </ParallaxLayer>
                            </>
                        );
                    })}

                    <ParallaxLayer sticky={{ start: pages - 1, end: pages }}>
                        <Footer art={story.assets!} />
                    </ParallaxLayer>
                </Parallax>
            </main>

            <div className='fixed bottom-0 z-[40] h-1 w-full bg-white'>
                <div style={{ width: `${percent}%` }} className='h-1 bg-blue-500' />
            </div>
        </>
    );
}
