import { ReactNode, useState } from 'react';
import { SiGithub, SiGmail, SiTwitter } from 'react-icons/si';
import useLocale from '../../../hooks/useLocale';

export default function HomeSocials() {
    const [
        {
            home: { tooltips }
        }
    ] = useLocale();

    return (
        <ul className='mt-2 hidden items-center justify-center space-x-4 md:ml-56 md:justify-start'>
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

function Icon({ children, text }: { children: ReactNode; text: string; url: string }) {
    const [hover, setHover] = useState(false);

    return (
        <li className='flex flex-col items-center'>
            <button
                aria-label={text}
                onMouseEnter={() => {
                    setHover(true);
                }}
                onMouseLeave={() => {
                    setHover(false);
                }}
            >
                <span className='text-xl'>{children}</span>
            </button>

            {hover && (
                <span aria-hidden='true' className='absolute bottom-[24rem] rounded-md bg-black  p-1 text-[0.6rem] text-white md:bottom-[20rem]'>
                    {text}
                </span>
            )}
        </li>
    );
}
