/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { motion } from 'framer-motion';

const bots = [
    {
        name: 'Foxxie',
        color: 'bg-gray',
        image: "https://cdn.ruffpuff.dev/foxxie.png",
        text: 'Foxxie is an advanced moderation bot. Including automoderation and scam detection. Including a "shield" feature to automatically detect malicious users.',
        link: '/foxxie',
        hidden: false
    },
    {
        name: 'Kettu',
        color: 'bg-gray',
        image: "https://cdn.ruffpuff.dev/kettu.png",
        text: 'Kettu is a bot for providing tooling and information in your server. He comes with a variety of websearch commands including those for fetching Pokémon, Animal Crossing, and Stardew Valley data.',
        link: '/kettu',
        hidden: false
    }
];

export function Botlist() {
    const router = useRouter();
    return (
        <div className="grid grid-cols-2 pt-10 mx-20 font-source-sans flex-col">
            {
                bots.map((bot, i) => {
                    // eslint-disable-next-line array-callback-return
                    if (bot.hidden) return;
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
                            className={`${bot.color} rounded-md lg:h-60 xl:h-68 mt-4 mr-6 hover:bg-opacity-50 duration-700`}>
                            <div className='lg:flex md:flex ml-3'>
                                <img src={bot.image} alt="" className="p-2 rounded-xl h-14 w-14" />
                                <button
                                    onClick={() => router.push(bot.link)}
                                >
                                    <h2 className='font-bold text-white hover:pl-1 hover:underline duration-700 pl-1'>{bot.name}</h2>
                                </button>
                            </div>
                            <p className='text-[#dbd5d5] p-4 pt-0'>
                                {bot.text}
                            </p>
                        </motion.div>
                    );
                })
            }
        </div>
    );
}
