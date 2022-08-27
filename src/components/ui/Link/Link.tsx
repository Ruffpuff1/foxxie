import useLocale from '@hooks/useLocale';
import clsx from 'clsx';
import { AriaRole, forwardRef, ReactNode, RefObject } from 'react';

/**
 * Handles dynamic intl linking.
 */
const Link = forwardRef(function Link({ children, className, href, id, role }: Props, ref) {
    const [, hl] = useLocale();
    const link = href.startsWith('/') ? (hl === 'en_us' ? href : `/intl/${hl}${href}`) : href;

    return (
        <a ref={ref as RefObject<HTMLAnchorElement>} id={id} href={link} className={clsx('inline-block', className)} role={role}>
            {children}
        </a>
    );
});

export default Link;

interface Props {
    children: ReactNode;
    id?: string;
    className?: string;
    href: string;
    noBr?: boolean;
    role?: AriaRole;
}
