import useLocale from '@hooks/useLocale';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

/**
 * Handles dynamic intl linking.
 */
export default function Link({ children, className, href }: Props) {
    const router = useRouter();
    const [, hl] = useLocale();
    const link = hl === 'en_us' ? href : `intl/${hl}/${href}`;

    return (
        <button role='link' onClick={() => router.push(link)} className={className}>
            {children}
        </button>
    );
}

interface Props {
    children: ReactNode;
    className?: string;
    href: string;
}
