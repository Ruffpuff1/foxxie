import { Icons } from '@assets/images';
import useLocale from '@hooks/useLocale';
import Link from '@ui/Link/Link';
import { default as BaseNavbar } from '@ui/Navbar/Navbar';
import clsx from 'clsx';
import { MdKeyboardArrowRight } from 'react-icons/md';

export default function Navbar({ noBottom = false, title = '' }) {
    const [{ developers }] = useLocale();
    const { celestia } = developers;

    return (
        <BaseNavbar
            auth
            border
            home='/developers/celestia'
            links={[]}
            locale
            stat
            noHoverIndicators
            icon={Icons.Celestia}
            title={
                title ? (
                    <>
                        <span className='ml-[8px]'>Celestia</span>

                        <MdKeyboardArrowRight className='ml-[8px]' />

                        <span className='ml-[8px]'>{title}</span>
                    </>
                ) : (
                    ' Celestia'
                )
            }
            menu={stick => {
                if (noBottom) return null;

                return (
                    <div
                        className={clsx(
                            'fixed flex h-14 w-full items-center space-x-10 bg-amber-400 px-10 text-sm text-white duration-200',
                            stick ? 'top-[3.9rem]' : 'top-0'
                        )}
                    >
                        <Link href='/developers/celestia'>{celestia.home}</Link>

                        <Link href='/developers/celestia/api'>{celestia.refrence}</Link>
                    </div>
                );
            }}
        />
    );
}
