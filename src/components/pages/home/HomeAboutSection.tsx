/* eslint-disable @next/next/no-img-element */
import { Images } from '@assets/images';
import { useRouter } from 'next/router';

export default function HomeAboutSection() {
    const router = useRouter();

    return (
        <section id='about' className='flex h-[900px] flex-col items-center justify-evenly bg-gray-50 md:flex-row'>
            {/* <div className='bg-blue-500 md:hidden w-[2px] h-60' /> */}
            <img width={414} height={414} className='hidden md:block' src={Images.Reese} alt='Me' />
            <div className='flex flex-col items-center md:block'>
                <img width={340} height={340} src={Images.Reese} className='mb-5 md:hidden' alt='Me' />
                <h2 className='text-3xl font-[400] text-gray-600'>About me</h2>
                <p className='text-gray-700'>Read a bit about me and what I like to do.</p>
                <button
                    onClick={() => router.push('/about-me')}
                    className='mt-5 rounded-md border border-gray-500 bg-white px-5 py-3 text-blue-500 transition-[color,background-color,border-color] duration-200 hover:border-blue-500 hover:bg-blue-50'
                >
                    Read now
                </button>
            </div>
        </section>
    );
}
