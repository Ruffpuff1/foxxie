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
            <h1 className="text-white font-semibold px-32 sm:px-24 lg:px-20 sm:text-lg md:text-xl lg:text-4xl xl:text-5xl pt-10 duration-300 transition-all text-xs">
                The Foxxie Project
            </h1>

            <Divider />

            <h2 className='text-light-white pt-4 px-24 duration-300 transition-all'>
                A shared duo of bots designed to provide everything you need in community Discord servers.
            </h2>
        </motion.div>
    );
}
