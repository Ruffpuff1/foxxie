import { ReactNode } from 'react';

export default function Link({ children, url }: { children: ReactNode; url: string }) {
    return (
        <a href={url} className='text-gray-500 hover:text-gray-400 hover:underline'>
            {children}
        </a>
    );
}
