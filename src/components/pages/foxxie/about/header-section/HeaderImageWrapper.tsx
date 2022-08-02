/* eslint-disable @next/next/no-img-element */
import React, { ReactNode } from 'react';

export default function HeaderImageWrapper({ children }: { children: ReactNode }) {
    return (
        <div className='flex w-full flex-col items-center justify-between px-16 md:mt-20 xl:mt-0 xl:flex-row'>
            <div className='flex flex-col items-center justify-center xl:items-start'>{children}</div>

            <img
                className='flex flex-col items-center rounded-xl shadow-2xl md:h-[400px] md:w-[700px]'
                src='https://reese.cafe/images/assets/foxxie/user_info.png'
                alt='Foxxie user info'
            />
        </div>
    );
}
