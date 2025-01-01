import { default as IntlLink } from '@ui/Link/Link';
import { ReactNode } from 'react';

export default function Link({ children, url }: { children: ReactNode; url: string }) {
    return (
        <IntlLink href={url} className='text-gray-500 hover:text-gray-400 hover:underline'>
            {children}
        </IntlLink>
    );
}
