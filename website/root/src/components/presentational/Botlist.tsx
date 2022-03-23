/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { motion } from 'framer-motion';

const bots = [
    {
        name: 'Foxxie',
        tag: 'Moderation',
        color: 'bg-gray',
        image: "https://cdn.ruffpuff.dev/foxxie.png",
        text: 'Foxxie is an advanced moderation bot. Including automoderation and scam detection. Including a "shield" feature to automatically detect malicious users.',
        link: '',
        hidden: false
    },
    {
        name: 'Kettu',
        tag: 'Tools',
        color: 'bg-gray',
        image: "https://cdn.ruffpuff.dev/kettu.png",
        text: 'Kettu is a bot for providing tooling and information in your server. He comes with a variety of websearch commands including those for fetching Pokémon, Animal Crossing, and Stardew Valley data.',
        link: '/kettu/invite',
        hidden: false
    }
];

export function Botlist() {
    const router = useRouter();
    return (
        <div className="lg:grid lg:grid-cols-2 sm:mx-20 mx-28 font-source-sans mt-10 mb-10">
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
                            className={`${bot.color} rounded-md lg:mr-4 mt-4 hover:bg-opacity-50 duration-700 overflow-hidden`}>
                            <div className='ml-3 sm:block flex justify-left'>
                                <img src={bot.image} alt={`${bot.name}'s avatar`} className="p-2 rounded-xl h-14 w-14" />
                                <button
                                    onClick={() => router.push(bot.link)}
                                >
                                    <h2 className='font-bold text-white hover:pl-3 duration-700 hover:underline pl-1 flex '>
                                        {bot.name}
                                        <h2 className='ml-2 hidden sm:block'>
                                            ({bot.tag})
                                        </h2>
                                    </h2>
                                </button>
                            </div>
                            <p className='text-[#dbd5d5] p-4 pt-0 text-sm md:text-base hidden sm:block'>
                                {bot.text}
                            </p>
                        </motion.div>
                    );
                })
            }
        </div>
    );
}
