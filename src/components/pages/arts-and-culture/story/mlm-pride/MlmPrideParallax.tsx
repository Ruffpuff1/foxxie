/* eslint-disable @next/next/no-img-element */
import { IParallax, Parallax, ParallaxLayer } from '@react-spring/parallax';

import useVisibility from 'src/hooks/useVisibility';

import Footer from '@arts-culture/story/mlm-pride/layers/Footer';
import FlagBackground from '@arts-culture/story/mlm-pride/layers/Flag/FlagBackground';
import WorldMap from '@arts-culture/story/mlm-pride/layers/WorldMap/WorldMap';
import Navbar from '@arts-culture/ui/Navbar';
import Flag from './layers/Flag/Flag';
import { useEffect, useRef, useState } from 'react';
import { Story } from '@assets/arts-and-culture/structures';

export default function MlmPrideParallax({ story }: { story: Story }) {
    const [isVisible, , bnRef] = useVisibility<HTMLDivElement>();
    const [hsVis, , hsRef] = useVisibility<HTMLDivElement>();

    const [gVis, , gRef] = useVisibility();
    const [wVis, , wRef] = useVisibility();
    const [pVis, , pRef] = useVisibility();

    const [percent, setPercent] = useState(0);

    const ref = useRef<IParallax>(null);

    const onScroll = () => {
        setPercent((ref.current!.current / ref.current!.space / 13) * 100);
    };

    useEffect(() => {
        if (!ref.current || !ref.current.container) return;
        ref.current.container.current.onscroll = onScroll;
    });

    return (
        <>
            <Navbar
                visible={!isVisible}
                emailSubject="Read about Gay history with Reese's MLM pride story"
                emailBody='https://reese.cafe/arts-and-culture/story/mlm-pride'
            />
            <main className={`fixed top-[3.2rem] h-full w-full overflow-y-auto font-ptSans font-[400] tracking-[.01428571em] duration-200`}>
                <Parallax ref={ref} style={{ scrollBehavior: 'smooth' }} pages={14}>
                    <ParallaxLayer sticky={{ start: 0, end: 0.2 }} className='bg-transparent'>
                        <div ref={bnRef} className='flex h-full w-full items-start justify-center pt-60'>
                            <FlagBackground />
                        </div>
                    </ParallaxLayer>

                    <ParallaxLayer sticky={{ start: 1, end: 2 }} id='map'>
                        <WorldMap />
                    </ParallaxLayer>

                    <ParallaxLayer sticky={{ start: 3, end: 3.5 }}>
                        <section className='h-full bg-white'>e</section>
                    </ParallaxLayer>

                    <ParallaxLayer sticky={{ start: 4.3, end: 11.3 }}>
                        <div ref={hsRef} className='card h-[100vh] bg-[#0D4755]'>
                            <Flag visible={hsVis} purple={pVis} white={wVis} green={gVis} />
                        </div>
                    </ParallaxLayer>

                    <ParallaxLayer sticky={{ start: 5.3, end: 11.3 }}>
                        <section className='flex flex-col items-start justify-start space-y-2 p-10 pt-[23rem] text-white'>
                            <h1 className={`text-end text-3xl ${hsVis ? 'blur-none' : 'blur-sm'}`}>New Gay Male Flag</h1>
                            <h2>
                                User{' '}
                                <a href='https://gayflagblog.tumblr.com/post/186181118619/' className='italic duration-200 hover:text-blue-500'>
                                    gayflagblog
                                </a>{' '}
                                on Tumblr. “Gay Man Flag.” 10 July 2019.
                            </h2>
                        </section>
                    </ParallaxLayer>

                    <ParallaxLayer sticky={{ start: 5.3, end: 6.3 }} className='flex items-start justify-end p-10 pt-5 text-white'>
                        <p className='mt-5 w-1/2 text-end text-lg'>
                            This new, more widely accepted, and used version of the gay men’s flag. It is meant to represent gay men specifically, much like those of the
                            lesbian, bisexual, and transgender flags. The previous version is doubted in its intention and the meaning of its colors. Since the creation
                            of this new flag, it has been more widely accepted as a more inclusive flag.
                        </p>
                    </ParallaxLayer>

                    <ParallaxLayer sticky={{ start: 7.3, end: 9.3 }}>
                        <section ref={gRef} className='flex items-start justify-end p-10 pt-5 text-white'>
                            <p className='mt-5 w-1/2 text-end text-lg'>
                                The green symbolizes <i>community</i> and the teal symbolizes <i>joy</i>. These two colors together represent nature the creator thought
                                this was important because “love between men is often seen as <i>unnatural</i> in this eyes of society and in religion.” Also, gay men
                                have historically used green flowers and plants such as carnations and hyacinths to symbolize their love.
                            </p>
                        </section>
                    </ParallaxLayer>

                    <ParallaxLayer sticky={{ start: 7.8, end: 9.3 }}>
                        <section ref={wRef} className='flex flex-col items-end justify-end p-10 pt-56 text-white'>
                            <p className='mt-5 w-1/2 text-end text-lg'>
                                The white stripe in this flag is adopted from the transgender pride flag. This is because transgender, nonbinary, and
                                gender-non-conforming men are often erased or talked over in gay representation. The creator addresses that “we have a lot of unaddressed
                                and blatant transphobia, internalized, homophobia, and toxic masculinity directed towards [gender-non-conforming or non-cisgender
                                identifying men] in our community that we need to address and resolve.”
                            </p>

                            <img
                                className={`mt-2 w-40 translate-y-[2rem] duration-300 ${wVis && !pVis ? 'translate-x-[-75rem]' : 'translate-x-[-100rem]'}`}
                                src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Transgender_Pride_flag.svg/510px-Transgender_Pride_flag.svg.png'
                                alt='Transgender pride flag'
                            />
                        </section>
                    </ParallaxLayer>

                    <ParallaxLayer sticky={{ start: 8.3, end: 9.3 }}>
                        <section ref={pRef} className='flex items-start justify-end p-10 pt-[28rem] text-white'>
                            <p className='mt-5 w-1/2 text-end text-lg'>
                                The purple meaning fortitude and indigo diversity in the flag together represent diversity in presentation, relationships, and life
                                experience. The creator cites that we are “so often stereotyped as all fitting into these neat little categories”, especially by means of
                                fetishization and non-MLM individuals.
                            </p>
                        </section>
                    </ParallaxLayer>

                    <ParallaxLayer sticky={{ start: 10.3, end: 11.3 }}>
                        <section className='flex flex-col items-end justify-start p-10 pt-5 text-white'>
                            <p className='mt-5 w-1/2 text-end text-lg'>
                                Despite this, there are so many different ways to be a man and much more ways to be a man who loves other men. The creator sites the use
                                of purple, a mix of blue and red. Rather than using blue like other gay men&apos;s flag proposals. The usage of the light blue stripe
                                leading into a deep purple symbolizes how there are some in the community that fit stereotypes whereas others may not at all.
                            </p>
                            <p className='mt-5 w-1/2 text-end text-lg'>
                                The overall goal of this flag was to be inclusive of all gay men. Including those who identify as asexual, aromantic, questioning or
                                queer, nonbinary, or gender-non-conforming.
                            </p>
                        </section>
                    </ParallaxLayer>

                    <ParallaxLayer sticky={{ start: 12.3, end: 13 }}>
                        <Footer art={story.assets!} />
                    </ParallaxLayer>
                </Parallax>
            </main>

            <div className='fixed bottom-0 z-[40] h-1 w-full bg-white'>
                <div style={{ width: `${percent}%` }} className='bg-blue-500'>
                    e
                </div>
            </div>
        </>
    );
}
