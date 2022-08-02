/* eslint-disable @next/next/no-img-element */
import Navbar from '@arts-culture/ui/Navbar';
import { Asset } from '@assets/arts-and-culture/structures';
import { useEffect, useState } from 'react';

export default function StitchedImage({ art }: { art: Asset }) {
    const cols = [1, 2, 3, 4, 5, 6];
    const rows = [1, 2, 3, 4, 5, 6, 7, 8];
    const speed = 0.1;

    const [showFull, setShowFull] = useState(false);
    const [scale, setScale] = useState<number>(0.5);

    const [showNavbar, setShowNavbar] = useState(false);

    const setDefaults = () => {
        setScale(0.5);
    };

    useEffect(() => {
        if (scale! < 0.5) {
            setDefaults();
        }

        if (scale < 1) {
            setShowNavbar(true);
        } else {
            setShowNavbar(false);
        }
    }, [scale, setShowNavbar]);

    useEffect(() => {
        const onZoom = (e: WheelEvent) => {
            if (!showFull) return;

            if (e.deltaY > 0) {
                if (scale <= 0) return;
                setScale(scale! - speed);
            } else {
                if (scale >= (art.big ? 35 : 15)) return;
                setScale(scale! + speed);
            }
        };

        window.addEventListener('wheel', onZoom);

        return () => {
            window.removeEventListener('wheel', onZoom);
        };
    });

    return (
        <>
            <Navbar
                visible
                hide
                show={showNavbar}
                back={{
                    show: showFull,
                    onClick: () => {
                        setShowFull(false);
                        setDefaults();
                    }
                }}
            />

            <div
                className={`fixed top-0 flex h-full w-full items-center justify-center overflow-y-hidden bg-white duration-200 ${
                    showFull ? 'z-[39] opacity-[100%]' : 'z-[-60] opacity-[0%]'
                }`}
            >
                <div className='flex items-center justify-center'>
                    <div className={`${scale! <= 2 ? 'cursor-zoom-out' : ''} duration-100`} style={{ transform: `scale(${scale < 0.5 ? '0.5' : scale})` }}>
                        {art.big ? (
                            <>
                                {rows.map(r => {
                                    return (
                                        <div key={r} className='flex items-center'>
                                            {cols.map(c => {
                                                return (
                                                    <img
                                                        key={c}
                                                        className='no-drag block md:h-[165px] md:w-[165px]'
                                                        src={`https://reese.cafe/images/assets/arts-and-culture/assets/${art.type}s/${art.id}/${r}x${c}.jpg`}
                                                        alt={`${art.name} by ${art.creatorDisplayName} tile ${r}x${c}`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            <img src={art.image} alt={art.description || `${art.name} by ${art.creatorDisplayName}`} />
                        )}
                    </div>
                </div>
            </div>

            <div
                className={`fixed bottom-5 z-[65] self-center rounded-md bg-black bg-opacity-50 py-1 px-2 duration-200 ${
                    scale > 1 && showFull ? 'opacity-[100%]' : 'opacity-[0%]'
                }`}
            >
                <span className='text-white'>
                    Zoom {Math.round((scale / (art.big ? 35 : 15)) * 100) > 100 ? '100' : Math.round((scale / (art.big ? 35 : 15)) * 100)}%
                </span>
            </div>

            <div className='flex w-full items-center justify-center border-b py-10'>
                <button
                    onClick={() => {
                        setDefaults();
                        setShowFull(true);
                    }}
                    className='cursor-zoom-in'
                    style={{
                        backgroundColor: art.bgColor
                    }}
                >
                    <img
                        className='md:h-[440px]'
                        src={`https://reese.cafe/images/assets/arts-and-culture/assets/${art.type}s/${art.id}.jpg`}
                        alt={art.description || `${art.name} by ${art.creatorDisplayName}`}
                    />
                </button>
            </div>
        </>
    );
}
