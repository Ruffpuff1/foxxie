import { Locale } from '@assets/locales/types';
import useLocale from '@hooks/useLocale';
import { useClickOutside, useScroll } from '@reeseharlak/usehooks';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { MdArrowDropDown, MdLanguage } from 'react-icons/md';

export default function NavbarLanguageSelector({ closeId, padSide }: { closeId?: string; padSide?: boolean }) {
    const router = useRouter();
    const [, hl] = useLocale();

    const [showMenu, setShowMenu] = useState(false);

    useClickOutside(
        () => {
            setShowMenu(false);
        },
        'navbar-language-selector',
        [showMenu]
    );

    useScroll(
        () => {
            setShowMenu(false);
        },
        undefined,
        closeId
    );

    return (
        <div id='navbar-language-selector'>
            <button
                onClick={() => {
                    setShowMenu(!showMenu);
                }}
                aria-haspopup='true'
                aria-controls='nav-language'
                className='mr-1 flex h-[36px] max-w-[154px] items-center rounded-sm border bg-white pl-[11px] pr-[7px] leading-[36px] text-gray-800 duration-200 hover:bg-gray-100'
            >
                <MdLanguage className='mr-[8px] text-[24px] text-gray-800' />
                <span className='whitespace-nowrap'>{hlToLang(hl)}</span>
                <MdArrowDropDown className='text-[24px]' />
            </button>

            <div
                id='nav-language'
                className={clsx(
                    'absolute top-[64px] max-h-[304px] overflow-y-auto overflow-x-hidden rounded-md rounded-t-none border bg-white py-0 font-[400] text-[#3c4043] shadow-lg duration-200',
                    showMenu ? 'opacity-100' : 'opacity-0',
                    padSide ? 'right-[59px]' : 'right-[12px]',
                    {
                        'pointer-events-none': !showMenu
                    }
                )}
            >
                <ul role='presentation' className='m-0 block p-0'>
                    <li role='presentation' className={clsx('m-0 min-w-full pl-[8px] pr-[38px] text-[14px]', hl === 'en_us' ? 'bg-[#e8f0fe]' : 'hover:bg-gray-100')}>
                        <a
                            href={`/intl/en_us${router.asPath.replace(/\/intl\/(es_mx|en_us)/, '')}`}
                            role='menuitem'
                            className='flex min-h-[48px] items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap break-words px-[16px]'
                        >
                            English
                        </a>
                    </li>

                    <li role='presentation' className={clsx('m-0 min-w-full pl-[8px] pr-[38px] text-[14px]', hl === 'es_mx' ? 'bg-[#e8f0fe]' : 'hover:bg-gray-100')}>
                        <a
                            href={`/intl/es_mx${router.asPath.replace(/\/intl\/(es_mx|en_us)/, '')}`}
                            role='menuitem'
                            className='flex min-h-[48px] items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap break-words px-[16px]'
                        >
                            Español
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

function hlToLang(hl: Locale) {
    switch (hl) {
        case 'en_us':
            return 'English';
        case 'es_mx':
            return 'Español';
    }
}
