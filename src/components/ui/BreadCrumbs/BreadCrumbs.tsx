import { Translations } from '@assets/locales/types';
import useLocale from '@hooks/useLocale';
import Link from '@ui/Link/Link';
import clsx from 'clsx';
import { ReactNode, useMemo } from 'react';
import { MdArrowForwardIos } from 'react-icons/md';

export default function BreadCrumbs({ className, children, crumbs }: Props) {
    const [translations] = useLocale();
    const crumbArray = useMemo(() => crumbs(translations), [crumbs, translations]);

    return (
        <div className={clsx(className, 'flex items-center space-x-2 p-[40px] pb-0 text-sm text-gray-600')}>
            {crumbArray.map((crumb, idx) => {
                return (
                    <>
                        <Link href={crumb.href} className='hover:text-blue-500 active:text-blue-500 active:underline'>
                            {crumb.title}
                        </Link>

                        {Boolean(idx !== crumbArray.length - 1) && <>{children ? <>{children}</> : <MdArrowForwardIos className='text-xs' />}</>}
                    </>
                );
            })}
        </div>
    );
}

interface Props {
    crumbs: (translations: Translations) => Crumb[];
    className?: string;
    children?: ReactNode;
}

export interface Crumb {
    href: string;
    title: string;
}
