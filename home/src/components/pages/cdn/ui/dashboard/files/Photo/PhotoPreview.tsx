import { useRouter } from 'next/router';
import { MdArrowBack, MdArrowDropUp } from 'react-icons/md';

export default function PhotoPreview({ href, hide, url }: Props) {
    const router = useRouter();

    return (
        <div className='fixed top-0 left-0 z-[4] flex h-full w-full flex-col items-center bg-black bg-opacity-80 px-10 pt-5'>
            <header className='items-centter flex w-full justify-between text-gray-200'>
                <div>
                    <button
                        onClick={() => {
                            hide();
                        }}
                        className='overflow-hidden rounded-md bg-opacity-10 p-1 text-2xl duration-500 hover:bg-black'
                    >
                        <MdArrowBack />
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => router.push(href)}
                        className='flex items-center justify-center space-x-1 rounded-md bg-opacity-10 duration-500 hover:cursor-pointer hover:bg-black'
                    >
                        <h2>Open</h2>
                        <MdArrowDropUp className='mt-1 text-xl' />
                    </button>
                </div>
            </header>

            <div className='h-full w-full pb-8'>
                <div className='h-full w-full bg-contain bg-center bg-no-repeat' style={{ backgroundImage: `url('${url}')` }} />
            </div>
        </div>
    );
}

interface Props {
    hide: () => void;
    href: string;
    url: string;
}
