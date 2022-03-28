import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useRouter } from "next/router";
import { motion } from 'framer-motion';

export function Nav() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();

    return (
        <motion.div
            className="text-light-white"
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
            <AppBar color='transparent' position='absolute'>
                <Toolbar className='space-x-20'>
                    <div className="text-lg font-source-sans mb-6">
                        <button
                            className='absolute'
                            onClick={() => { return router.push('/'); }}
                        >
                            <p className='font-bold hover:underline text-sm sm:text-base'>Foxxie Project</p>
                        </button>
                    </div>
                    <div className="text-lg font-source-sans mb-6 pl-12 sm:pl-16">
                        <button
                            className='absolute'
                            onClick={() => { return router.push('https://ruffpuff.dev/community'); }}
                        >
                            <p className='font-bold hover:underline text-sm sm:text-base'>Support</p>
                        </button>
                    </div>
                    <div className="text-lg font-source-sans mb-6 pl-4">
                        <button
                            className='absolute'
                            onClick={() => { return router.push('https://ko-fi.com/ruffpuff'); }}
                        >
                            <p className='font-bold hover:underline text-sm sm:text-base'>Ko-fi</p>
                        </button>
                    </div>
                    <div className="text-lg font-source-sans mb-6">
                        <button
                            className='absolute'
                            onClick={() => { return router.push('/'); }}
                        >
                            <p className='font-bold hover:underline text-sm sm:text-base'>Docs</p>
                        </button>
                    </div>
                </Toolbar>
            </AppBar>
        </motion.div>
    );
}
