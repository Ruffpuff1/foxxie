import { useRouter } from "next/router";
import { motion } from 'framer-motion';

/* eslint-disable @next/next/no-img-element */
const bots = [
    {
        name: 'Foxxie',
        color: 'bg-orange-600',
        image: "https://cdn.ruffpuff.dev/foxxie.png",
        text: 'Foxxie is an advanced moderation bot. Including automoderation and scam detection. Including a "shield" feature to automatically detect malicious users.',
        link: '/foxxie'
    },
    {
        name: 'Kettu',
        color: 'bg-red-400',
        image: "https://cdn.ruffpuff.dev/kettu.png",
        text: 'Kettu is a bot for providing tooling and information in your server. He comes with a variety of websearch commands including those for fetching Pokémon, Animal Crossing, and Stardew Valley data.',
        link: '/kettu'
    }
];

export function Botlist() {
    const router = useRouter();
    return (
        <div className="grid grid-cols-2 pt-10 space-x-4 mx-20 font-source-sans flex-col">
            {
                bots.map((bot, i) => {
                    return (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                transition: {
                                    duration: 0.4,
                                    delay: 0.2 + (i / 100 + 0.05) * 5,
                                    ease: [0.48, 0.15, 0.25, 0.96]
                                }
                            }}
                            key={bot.name}
                            className={`${bot.color} rounded-md lg:h-40 xl:h-48`}>
                            <div className='flex'>
                                <img src={bot.image} alt="" className="w-12 h-12 p-2 rounded-xl" />
                                <button
                                    onClick={() => router.push(bot.link)}
                                >
                                    <h2 className='font-bold text-white hover:pl-1 hover:underline duration-700'>{bot.name}</h2>
                                </button>
                            </div>
                            <p className='text-white font-semibold p-2 pt-0'>
                                {bot.text}
                            </p>
                        </motion.div>
                    );
                })
            }
        </div>
    );
}
