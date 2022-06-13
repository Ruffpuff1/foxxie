import { ReactNode, useState } from 'react';
import { SiGithub, SiGmail, SiTwitter } from 'react-icons/si';
import useLocale from '../../hooks/useLocale';

export default function HomeSocials() {
    const [{ home: { tooltips } }] = useLocale();

    return (
        <ul className='hidden mt-2 items-center justify-center md:justify-start md:ml-56 space-x-4'>
            <Icon url='https://github.com/Ruffpuff1' text={tooltips.github}>
                <SiGithub />
            </Icon>
            <Icon url='https://twitter.com/reeseharlak' text={tooltips.twitter}>
                <SiTwitter />
            </Icon>
            <Icon url='mailto:reese@ruffpuff.dev' text={tooltips.email}>
                <SiGmail />
            </Icon>
        </ul>
    );
}

function Icon({ children, text }: { children: ReactNode; text: string; url: string; }) {
    const [hover, setHover] = useState(false);

    return (
        <li className='flex flex-col items-center'>

            <button
                aria-label={text}
                onMouseEnter={() => { setHover(true); }}
                onMouseLeave={() => { setHover(false); }}
            >
                <span className='text-xl hover:text-blue-500 duration-500'>
                    {children}
                </span>
            </button>

            {
                hover &&
                <span aria-hidden='true' className='bg-black absolute bottom-[24rem] md:bottom-[20rem]  text-white text-[0.6rem] p-1 rounded-md'>
                    {text}
                </span>
            }
        </li>
    );
}