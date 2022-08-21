import { Images } from '@assets/images';
import useLocale from '@hooks/useLocale';
import Link from '@ui/Link/Link';
import Image from 'next/image';

export default function HomeAboutSection() {
    const [translations] = useLocale();

    return (
        <section id='about' className='flex h-[900px] flex-col items-center justify-evenly bg-gray-50 lg:flex-row'>
            <div className='hidden lg:block'>
                <Image width={414} height={414} src={Images.Reese} alt='Me' />
            </div>
            <div className='flex flex-col items-center lg:block'>
                <div className='mb-5 lg:hidden'>
                    <Image width={340} height={340} src={Images.Reese} alt='Me' />
                </div>
                <h2 className='text-3xl font-normal text-gray-600'>{translations.home.aboutMe}</h2>
                <p className='text-gray-700'>{translations.home.aboutMeTag}</p>
                <Link
                    href='/about-me'
                    className='mt-5 rounded-md border border-gray-500 bg-white px-5 py-3 text-blue-500 transition-[color,background-color,border-color] duration-200 hover:border-blue-500 hover:bg-blue-50'
                >
                    {translations.readNow}
                </Link>
            </div>
        </section>
    );
}
