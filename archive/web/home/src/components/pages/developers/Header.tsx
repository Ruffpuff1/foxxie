import { ReactNode } from 'react';

export default function Header({ children }: { children: ReactNode }) {
    return <h1 className='mb-[28px] text-[32px] font-[400] tracking-[0] text-[#202124]'>{children}</h1>;
}
