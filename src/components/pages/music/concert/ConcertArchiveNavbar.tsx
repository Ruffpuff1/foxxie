import useLocale from '@hooks/useLocale';
import Navbar from '@ui/Navbar/Navbar';
import { MdKeyboardArrowRight } from 'react-icons/md';

export default function ConcertArchiveNavbar() {
    const [{ music }] = useLocale();

    return (
        <Navbar
            noHoverIndicators
            border
            stat
            locale
            home='/music'
            links={[{ path: '/music/orchestra', text: music.orchestra.orchestra }]}
            title={
                <>
                    <span className='ml-[8px]'>{music.music}</span>

                    <MdKeyboardArrowRight className='ml-[8px] hidden md:block' />

                    <span className='ml-[8px] hidden md:block'>{music.concertArchive}</span>
                </>
            }
            icon='https://reese.cafe/images/icons/violin.png'
        />
    );
}
