import { motion } from 'framer-motion';
import Divider from '@mui/material/Divider';

export function Main() {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{
                y: 0,
                opacity: 1,
                transition: {
                    duration: 0.4,
                    delay: 0.4,
                    ease: [0.48, 0.15, 0.25, 0.96]
                }
            }}
        >
            <h1 className="text-white font-medium lg:text-6xl md:text-5xl sm:px-40 sm:text-4xl text-2xl px-44 lg:px-20 pt-10 duration-300 transition-all">
                The Foxxie Project
            </h1>

            <Divider />

            <h2 className='text-light-white pt-4 px-24 sm:px-24 lg:px-20 md:px-20 duration-300 transition-all'>
                A shared duo of bots designed to provide everything you need in community Discord servers.
            </h2>
        </motion.div>
    );
}
