import { years } from '@ruffpuff/utilities';
import React from 'react';
import Link from './Link';
import Pronouns from './Pronouns';

const violin = new Date('September 1 2015');
const birth = new Date('August 29 2005');

export default function Article() {
    const vDur = Math.round(calcYears(violin));
    const bDur = calcYears(birth).toFixed(2);

    return (
        <section className='mt-3 mb-36 flex flex-col items-center space-y-8 px-16 text-center md:px-96'>
            <p>
                Hi, my name is Reese. I go by <Pronouns /> pronouns and am a {bDur} year old web developer and musician from California.
            </p>
            <p>
                I started learning to code in 2021 with my Discord bot <Link url='/foxxie/about'>Foxxie</Link>. Since then, I&apos;ve spent time learning a variety of
                technologies including Go, SwiftUI, React, and more. Currently my primary focus is making Next.js sites using React.js and Tailwindcss. You can read more
                about my projects and work <Link url='/my-work'>here</Link>.
            </p>
            <p>
                I&apos;ve been playing violin for the past {vDur} years, it is a massive part of my life as it is something I enjoy playing very much. I make scores for
                orchestra using Musescore and play concerts with my orchestra in school.
            </p>
        </section>
    );
}

function calcYears(d: Date) {
    const now = new Date();
    const dur = now.getTime() - d.getTime();
    return dur / years(1);
}
