import useLocale from '@hooks/useLocale';
import clsx from 'clsx';
import { ReactNode } from 'react';

/**
 * Handles dynamic intl linking.
 */
export default function Link({ children, className, href }: Props) {
    const [, hl] = useLocale();
    const link = hl === 'en_us' ? href : `/intl/${hl}${href}`;

    return (
        <a href={link} className={clsx('inline-block', className)}>
            {children}
        </a>
    );
}

interface Props {
    children: ReactNode;
    className?: string;
    href: string;
}
