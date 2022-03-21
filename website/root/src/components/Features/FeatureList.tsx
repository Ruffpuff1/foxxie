import { Ban } from "./Foxxie/Ban";
import { InfoUser } from "./Foxxie/InfoUser";
import { Wolfram } from "./Kettu/Wolfram";
import Divider from '@mui/material/Divider';
import { Pokemon } from "./Kettu/Pokemon";

const features = [
    {
        name: 'Moderation',
        Feature: Ban,
        description: 'Foxxie comes with extensive moderation features, including the basic ones you\'d expect.',
        bot: 'Foxxie'
    },
    {
        name: 'Basic tools',
        Feature: Wolfram,
        description: 'Kettu has a bunch of tools that can help you, like a color command, image generation and wolfram.',
        bot: 'Kettu'
    },
    {
        name: 'Information',
        Feature: InfoUser,
        description: 'Foxxie has information about anything in your server, from users to roles, even channels and emojis!',
        bot: 'Foxxie'
    },
    {
        name: 'Websearch',
        Feature: Pokemon,
        description: 'Kettu includes multiple websearch features, including Pokémon, Animal Crossing, Github, and more.',
        bot: 'Kettu'
    }
];

export function Features() {
    return (
        <div className='mt-10'>
            {
                features.map(({ name, Feature, description, bot }, i) => {
                    return (
                        <div
                            key={name}
                            className={`sm:hidden hidden md:flex lg:flex xl:flex transition-all duration-300 ${i % 2 ? 'pl-20 mt-20 mr-64' : 'ml-64 pr-20 mt-20'}`}
                        >
                            <div className='sm:block hidden md:block lg:block xl:block'>
                                <h1
                                    className='font-bold font-source-sans text-xl md:text-3xl p-2 text-white'
                                >
                                    {`${name} | ${bot}`}
                                </h1>

                                <p className='font-semibold font-source-sans text-light-white px-3 mb-2 text-sm'>
                                    {description}
                                </p>
                            </div>
                            <div className='sm:hidden hidden md:hidden lg:block xl:block'>
                                <Feature />
                            </div>

                            <Divider />
                        </div>
                    );
                })
            }
        </div>
    );
}
