import { ReactNode } from 'react';

export default function Subsection({ id, children, header }: Props) {
    return (
        <section id={id} className='text-[#202124]'>
            {header && <h2 className='mt-[48px] mb-[24px] text-[24px] text-[rgb(32,33,36)]'>{header}</h2>}
            {children}
        </section>
    );
}

interface Props {
    id?: string;
    children: ReactNode;
    header?: string;
}
