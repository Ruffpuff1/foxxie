import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
    const [hover, setHover] = useState(false);

    return (
        <section className='mt-40 flex flex-col items-center px-16 md:px-36'>
            <Image
                width={510}
                height={380}
                onMouseEnter={() => {
                    setHover(true);
                }}
                onMouseLeave={() => {
                    setHover(false);
                }}
                src='https://reese.cafe/images/assets/reese/reese-and-rain.jpeg'
                className='h-full w-full rounded-md md:h-1/3 md:w-1/2'
                alt='My friend and I at the park - 2021'
            />
            <span className={`mt-1 text-sm duration-200 ${hover ? '' : 'opacity-20'}`}>My friend and I at the park - 2021</span>
        </section>
    );
}
