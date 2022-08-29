import { Concert, emhsConcerts } from '@assets/music/concerts';
import useConcertSong from '@hooks/music/useConcertSong';
import useLocale from '@hooks/useLocale';
import ConcertArchiveNavbar from '@music/concert/ConcertArchiveNavbar';
import Performers from '@music/concert/Performers';
import Link from '@ui/Link/Link';
import Meta from '@ui/Meta';
import clsx from 'clsx';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';

const Festival2022: NextPage<Props> = ({ concert }) => {
    const [{ developers, music }] = useLocale();
    const [currentSong, setSong] = useConcertSong(concert.songs);

    return (
        <>
            <Meta
                title={`${currentSong.title} - ${concert.name} - ${music.concertArchive}`}
                description={`An archive of ${concert.school}'s ${concert.name} orchestra concert.`}
                icon='https://reese.cafe/images/icons/violin.png'
                noRobots
            />

            <ConcertArchiveNavbar />

            <div className='fixed top-[64px] left-0 z-[1] flex h-[calc(100%-64px)] w-full flex-col items-start justify-start overflow-auto bg-gray-50 duration-200 lg:w-[65%]'>
                <h1 className='p-10 pb-5 text-2xl md:text-4xl'>{concert.name}</h1>

                <div className='flex flex-col items-start px-10 pb-5 text-xs lg:hidden'>
                    {concert.songs.map(s => {
                        return (
                            <button
                                onClick={() => setSong(s.id)}
                                className={clsx({
                                    'text-[13px] text-blue-500': s.id === currentSong.id
                                })}
                                key={s.id}
                            >
                                {s.title}
                            </button>
                        );
                    })}
                </div>

                <Link href={`/music/orchestra/${concert.school.href}`} className='pl-10 text-sm text-gray-600 hover:underline'>
                    {concert.school.name}
                </Link>

                <div className='p-10'>
                    <p className=''>
                        View full playlist at{' '}
                        <Link href={`https://${concert.playlistUrl}`} blue popup className='font-[500] hover:underline'>
                            {concert.playlistUrl}
                        </Link>
                    </p>
                </div>

                <div className='w-full px-10 pt-5 pb-20'>
                    <iframe
                        className='h-[225px] w-[350px] duration-200 lg:h-[425px] lg:w-[650px] xl:h-[450px] xl:w-[700px]'
                        src={`https://www.youtube.com/embed/${currentSong.embedId}`}
                        title='YouTube video player'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                    />

                    <h2 className='mt-10 text-2xl'>{currentSong.title}</h2>
                    <h3 className='text-sm text-gray-600'>{currentSong.composer}</h3>
                </div>

                <Performers performers={currentSong.performers} />

                <footer className='w-full bg-gray-50 shadow-lg'>
                    <div className='flex flex-col items-start justify-center space-y-4 border-b py-6 px-8 text-[14.5px] leading-[20px] text-gray-500'>
                        <h3 className='text-[16px] leading-[26px] text-gray-800'>{developers.footer.contactUs}</h3>
                        <a href='/github' className='duration-200 hover:text-blue-500'>
                            Github
                        </a>
                        <a href='/twitter' className='duration-200 hover:text-blue-500'>
                            Twitter
                        </a>
                    </div>

                    <div className='flex items-center justify-start space-x-3 border-b'>
                        <Link href='/' className='my-1 rounded-md py-6 px-8 text-xl font-medium text-gray-600'>
                            Reese Harlak
                        </Link>
                    </div>

                    <div className='flex items-center justify-start space-x-3 py-7 px-8 text-[14.5px] text-gray-500'>
                        <Link href='/policies/developers/terms' className='hover:text-blue-500'>
                            {developers.footer.terms}
                        </Link>
                        <span>|</span>
                        <Link href='/policies/privacy' className='hover:text-blue-500'>
                            {developers.footer.privacy}
                        </Link>
                    </div>
                </footer>
            </div>

            <div className='fixed top-[64px] right-0 z-[2] h-[calc(100%-64px)] w-0 space-y-4 overflow-x-hidden whitespace-nowrap bg-white p-0 shadow-lg duration-200 lg:w-[35%] lg:overflow-auto lg:p-10'>
                {concert.songs.map(song => {
                    return (
                        <button
                            onClick={() => setSong(song.id)}
                            key={song.id}
                            className={clsx('flex min-w-full flex-col items-start justify-start whitespace-normal rounded-md border p-2 duration-300 hover:shadow-lg', {
                                'text-blue-500 shadow-lg': song.id === currentSong.id
                            })}
                        >
                            <h2 className='text-lg font-[500]'>{song.title}</h2>
                            <h3 className='text-start text-xs text-gray-600'>{song.composer}</h3>
                        </button>
                    );
                })}
            </div>
        </>
    );
};

interface Props {
    concert: Concert;
}

export const getStaticProps: GetStaticProps<Props> = ({ params }) => {
    const path = (Array.isArray(params?.path) ? params?.path.join('/') : params?.path) as string | undefined;
    const concert = emhsConcerts.find(c => c.path === path);

    if (!concert)
        return {
            notFound: true
        };

    return {
        props: {
            concert
        }
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: emhsConcerts.map(c => ({
            params: {
                path: c.path.split('/')
            }
        })),
        fallback: 'blocking'
    };
};

export default Festival2022;
