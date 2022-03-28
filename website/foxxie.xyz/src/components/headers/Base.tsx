import { motion } from 'framer-motion';
import Divider from '@mui/material/Divider';

export function Base(props: { title: string; description: string; }) {
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
            <h1 className="text-white font-semibold px-32 sm:px-24 lg:px-20 md:text-xl lg:text-4xl xl:text-5xl pt-10 duration-300 transition-all text-lg">
                {props.title}
            </h1>

            <Divider />

            <h2 className='text-light-white pt-4 px-24 duration-300 transition-all italic'>
                {props.description}
            </h2>
        </motion.div>
    );
}
