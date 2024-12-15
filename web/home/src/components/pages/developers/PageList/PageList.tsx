import useLocale from '@hooks/useLocale';
import { useScroll } from '@reeseharlak/usehooks';
import clsx from 'clsx';
import { useState } from 'react';

export default function PageList({ items, className, color }: Props) {
    const [height, setHeight] = useState(0);
    const [{ developers }] = useLocale();

    useScroll(setHeight, undefined, 'devsite-body');
    console.log(height);

    return (
        <div id='page-list' className={clsx(className, 'select-none')}>
            <ul className={clsx('border-l-[4px] pl-[12px] text-sm', color ? color : 'border-l-blue-700')}>
                <li>
                    <h2 className='font-semibold'>{developers.onThisPage}</h2>
                </li>
                {items.map(item => {
                    return (
                        <li key={item.href}>
                            <a
                                href={item.href}
                                className={clsx({
                                    'text-[15px] font-[450] text-blue-800 duration-200': height >= item.start && height <= item.end
                                })}
                            >
                                {item.title}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

interface Props {
    items: ListItem[];
    className?: string;
    color?: string;
}

export interface ListItem {
    href: string;
    title: string;
    start: number;
    end: number;
}
