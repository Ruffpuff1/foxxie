import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Colors, Images } from '@assets/images';
import Head from 'next/head';
import Image from 'next/image';
import { IParallax, Parallax, ParallaxLayer } from '@react-spring/parallax';
import { useEffect, useRef, useState } from 'react';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import Navbar from '@about-me/Navbar';

const Home: NextPage = () => {
    const ref = useRef<IParallax>(null);
    const [scroll, setScroll] = useState(0);

    const onScroll = () => {
        setScroll(ref.current!.current / ref.current!.space);
    };

    useEffect(() => {
        if (!ref.current || !ref.current.container) return;
        ref.current.container.current.onscroll = onScroll;
    }, [ref]);

    useEffect(() => {
        const onWheel = (ev: globalThis.WheelEvent) => {
            let past = 0;

            if (past !== ev.deltaY) {
                if (ev.deltaY > 0 && ref.current) {
                    ref.current.scrollTo(scroll + 0.15);
                } else if (ev.deltaY < 0 && ref.current) {
                    ref.current.scrollTo(scroll - 0.15);
                }

                past = ev.deltaY;
            }
        };

        window.addEventListener('wheel', onWheel);

        return () => {
            window.removeEventListener('wheel', onWheel);
        };
    });

    return (
        <>
            <Head>
                <link rel='icon' href={Images.Reese} />
                <meta name='theme-color' content={Colors.RuffGray} />
            </Head>
            <NextSeo
                title='Pumpkin'
                description=''
                openGraph={{
                    title: 'Pumpkin',
                    description: ''
                }}
            />

            <Navbar />

            <Parallax ref={ref} pages={3} className='hori-cont' horizontal>
                <ParallaxLayer style={{}} className='z-[-1]' sticky={{ start: 1, end: 2.5 }}>
                    <div
                        className={`fixed top-20 left-[calc(50%-70px)] flex h-12 w-36 select-none items-center justify-center rounded-full bg-blue-500 text-center align-middle text-4xl text-white duration-300 ${
                            scroll > 0.9 && scroll < 2.1 ? 'scale-100' : 'scale-0'
                        }`}
                    >
                        <span>2021</span>
                    </div>
                </ParallaxLayer>
                <ParallaxLayer offset={0}>
                    <div className='mt-60 flex h-screen flex-col items-center justify-start'>
                        <h1 className='text-4xl text-black'>Pumpkin</h1>

                        <div className='mt-16 flex flex-col items-center'>
                            <h3 className='text-[.9rem] font-[400]'>Scroll to explore</h3>

                            <div
                                className={`mt-3 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-[2.5px] border-blue-500 bg-white opacity-100 delay-200 duration-500 hover:h-[4rem] hover:w-[4rem]`}
                            >
                                <button
                                    onClick={() => {
                                        ref.current?.scrollTo(1);
                                    }}
                                    className='flex items-center space-x-[-15px] duration-500 hover:ml-2'
                                >
                                    <MdOutlineKeyboardArrowRight className='text-2xl text-blue-500' />
                                    <MdOutlineKeyboardArrowRight className='text-2xl text-blue-500' />
                                    <MdOutlineKeyboardArrowRight className='text-2xl text-blue-500' />
                                </button>
                            </div>
                        </div>
                    </div>
                </ParallaxLayer>

                <ParallaxLayer offset={1}>
                    <div className='mx-20 flex h-screen items-center justify-center lg:mx-0'>
                        <Image
                            src='https://lh3.googleusercontent.com/jZvYUJCRVp9_QOq_7ksB5S7rkmRZLTYdl2PzSviznk6gKA_Y0CPXeJsUS4iEV26mItm7xEMBYmfDtJKNg9D4aCCe5imzw2QO3zkaazwEhyRDA2goI9ppd4fORggbwtj5szy8btlJ8y4csSz99OCrvftDt-LJ3NZVxek3SswIn1YmdB-KsDGNBdUlLJfBl-4SsZjnkCeKxAi2yhrtBRg3hIEv50WMb_hnN87vbHSmfiP1OGZJBXQ0Stluj5BioY8hGzLwxNyI5keyYBaz22j-Uj6yVVtYCIKOq7BvQc8kO5j6go1425rNBwgRfNiLY0E5WPLBbWfWu7ug1Gs6WBspgy-guqBDqDsQ2VhQq77sFi54Cm4qjn7SdmHYxCutGvLyv2BtMYbE1S-7Brm1PYNw5TqHnDRYOMbsNV2pbYITTVmZeQ16hLVmAI4vYxx0o1D3EViv3sfz8bCFbfzbujYxjafLRhbQZHF0DpoAee6PhUWOQX3mguZTEu1KsCVs1RUiGelBTyspzFcs9yx6SLlEVIKKEVI8OpzEZbrn_qY98O5hIXffCFlwR1I9Rv-4ZelX193zx3hc8T5qSNiN_CqBdzoa37FmwOZovff1DYdWbUdxo0XXYaGtl9KwQQWg97e9Rv7lUwdTTTPq_3r60OY8WLK-Vd6CnfxzviB6ZjnRpIpeQ2beZ_WZVNUbmJrQezcglWcKgPvoPt-lyKDfpACMnr9MPC9WbB8kEQjwQcaUI4D2EGebvrj3uS7fF00c=w2124-h1592-no?authuser=0'
                            alt=''
                            width={727}
                            height={545}
                        />
                    </div>

                    <div
                        className={`fixed right-3 top-96 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-[2.5px] border-blue-500 bg-white delay-500 duration-500 hover:h-[4rem] hover:w-[4rem] lg:right-20 ${
                            scroll > 0.9 && scroll < 1.5 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                        }`}
                    >
                        <button
                            onClick={() => {
                                ref.current?.scrollTo(2);
                            }}
                            className='flex items-center space-x-[-15px] duration-500 hover:ml-2'
                        >
                            <MdOutlineKeyboardArrowRight className='text-2xl text-blue-500' />
                            <MdOutlineKeyboardArrowRight className='text-2xl text-blue-500' />
                            <MdOutlineKeyboardArrowRight className='text-2xl text-blue-500' />
                        </button>
                    </div>
                </ParallaxLayer>
                <ParallaxLayer offset={2}>
                    <div className='my-20 flex h-full items-center justify-between px-10 lg:p-40'>
                        <div className='p-2'>
                            <Image
                                src='https://lh3.googleusercontent.com/rDmg9NyUUgObMW49UxI4cxSEmOqHmVwDT9D1eVdiCJbyJ_9vftNiO3Wy4dcVenhXJSzNLM0I7OVlXzUQpyWO6j9Z2lsWrz4GPMlufaEBfZj0MqkqfFuHLiQB9GyJzDhcvPMbHstSlN2sJww42sCwyc1qA6iFhbnXO3uTS6dbUKYGuBFuJfqTL55hT3rCNYCHQaYTW6EJn6gUt_Tgv1HKDkyVG2ugcdqo1fCz3gcPCth8aLI0n8ID-A4Jk7P0acMZM_Sxp_hpRUgLpE57ZydRnaQcg_rC-_jDHnS99dZeAfLxLIQMAEBbmEZMCp_yKb1XS9XvmeFJ6pub-xaZ8lrJ0UorMR3QvFgEsw96eGSJ8lMHoCwikdWAjGcN4OZND0Yzf3zX17hBlyqjhu4id7jk50DI0MxTqgOFGjBtLDBCahe-yxFzK6ab8hI5MCx3vxLl-NvSX8asvUVhKxLeY66iNGbxGX_IbYNZa7zoO5Y8maeONHkgIx7xr7ou8g117VGXCMIsdsqlALX8KWBqDT1qNdxN3jyOFz9kThLohX6eU8XsXEpdv05eH40VLrZOue6eGLkiGRLt13GP1FCAVPp586DEK0dkNGZHVbOo2f_b51ShhbIoOCPcauEiab-PMDAS_LaMrZNgmzQGpzKtyiE7QGGX_PQN6BGeM2Wu2wKg04mxWqfIonSNSaY5T7Q6m-OdpNJSPE08HjcD1vc_mTS0rm-kTg0GAGbevmy_D9euni_dJtQkcQ6O_v7qFVt-=w1194-h1592-no?authuser=0'
                                alt=''
                                className=''
                                width={597 / 2}
                                height={796 / 2}
                            />
                        </div>

                        <div className='mb-60 p-2'>
                            <Image
                                src='https://lh3.googleusercontent.com/37P7vgA5LLVo8rvbp-JMtwjTm_m2m9-ZZ5hSn5KBjqvl5MA9j9OIDFail2MU1iv_SGcHwp_NfyCeNnxk5lGZmgQY3W9v4qHyesk0OAWhqd3H2svIPVOnmSiCJmsfAeYTf8jdekw0DK6vWMk6e1aValTXuMH5uRPJFzXLjH_p8VabxCEz8BiKjBpqJF9WCmNOYr3a6JWpHPlPnOAwRhLFWaZ0tF3ahnkgXjoqtq0Lwk0SVkHEJJbZ4t3EOgGZT0WKI3JTiFqzf07YChESAcC76a4se9NF2_Sq_YKKWHONpGVsQ1ZRilVX1_9BX-ksBVgzl_rkcINBt5BW_uYL8Jjo1-L-dBWQFYbohA1ZnpJrzMaHPhHnR57ATZx3xV5LoAdCVODam45yOEp8Dmu6VTXR0stJJ8WXmF4abSrLroE5eBP1rygYzdpdd4UQAo7fG75Q2rTeVl1ZCceGwwNsFdK0xBKlaikvZUFJT2GKlKkZJDfHQ3rtVb_7kHsxkiZqFK4XplnUmhqpx_4EJjMLTod4H7JV7sPsCMSRPcCP1-w-Ii176M2Sh8mRi9w_vSdKzg0Q-QU3_fHRQZMP8lweapamS3oWhLu1hryQKDFlrjsu_vanElEv1OwiLyUbveuPGl_UbEOXco6dBUh8Alk-ICUmdZAt5PHd3Rx98WnV-49E7NPRH4_h6cIRxp_WJENUUAatwavl6eOKM1c-_nXJqMNrBNLTXzMdVMlOBemo0h3RR6jDmaJPAre6NabqSosR=w2064-h1592-no?authuser=0'
                                alt=''
                                width={727 / 2}
                                height={561 / 2}
                            />
                        </div>
                    </div>
                </ParallaxLayer>
            </Parallax>
        </>
    );
};

export default Home;
