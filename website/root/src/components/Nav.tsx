import { useRouter } from "next/router";
import { useState } from "react";
import { Linklist } from "./Linklist";
import { motion } from 'framer-motion';

export function Nav({ showAll, name = '/' }: { showAll?: boolean; name?: string; }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [showNames, setShowNames] = showAll ? [true, () => { }] : useState(false);
    const router = useRouter();

    return (
        <motion.div
            className="text-white"
            initial={{
                y: -20,
                opacity: 0
            }}
            animate={{
                y: 0,
                opacity: 1,
                transition: {
                    duration: 0.3,
                    delay: 0.1,
                    ease: [0.48, 0.15, 0.25, 0.96]
                }
            }}
            exit={{
                y: -20,
                opacity: 0
            }}
        >
            {
                name === '/'
                    ? <div className="text-lg font-source-sans">
                        <button
                            className='absolute left-0 pl-5 pt-2 cursor-default'
                        >
                            <p className='font-bold'>Foxxie Project</p>
                        </button>
                    </div>
                    : name === 'foxxie'
                        ?
                        < div className="text-lg font-source-sans" >
                            <button
                                className='absolute left-0 pl-5 pt-2'
                                onClick={() => setShowNames(!showNames)}
                            >
                                <p className='font-bold'>Foxxie</p>
                            </button>
                            <button
                                className={`duration-300 absolute left-20 pt-2${showNames ? ' opacity-100 pl-3 cursor-pointer' : ' opacity-0 pl-1 cursor-default'}`}
                                onClick={() => {
                                    if (!showNames) return;
                                    router.push('/kettu');
                                }}
                            >
                                <p className='font-medium'>Kettu</p>
                            </button>
                            <div className='absolute right-0 pr-5 pt-2'>
                                <Linklist name='foxxie' />
                            </div>
                        </div >
                        : <div className="text-lg font-source-sans">
                            <button
                                className='absolute left-0 pl-5 pt-2'
                                onClick={() => setShowNames(!showNames)}
                            >
                                <p className='font-bold'>Kettu</p>
                            </button>
                            <button
                                className={`duration-300 absolute left-20 pt-2${showNames ? ' opacity-100 pl-3 cursor-pointer' : ' opacity-0 pl-1 cursor-default'}`}
                                onClick={() => {
                                    if (!showNames) return;
                                    router.push('/foxxie');
                                }}
                            >
                                <p className='font-medium'>Foxxie</p>
                            </button>
                            <div className='absolute right-0 pr-5 pt-2'>
                                <Linklist name='kettu' />
                            </div>
                        </div>
            }
        </motion.div>
    );
}
