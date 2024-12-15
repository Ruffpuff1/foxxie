import { Performer } from '@assets/music/performers';
import useLocale from '@hooks/useLocale';
import clsx from 'clsx';
import { useState } from 'react';

export default function Performers({ performers }: Props) {
    const [expand, setExpand] = useState(false);
    const [{ music }] = useLocale();

    return (
        <div className='mb-10 h-auto w-full bg-white pt-10 pb-0'>
            <div className='flex items-center space-x-3 px-10'>
                <h2 className='text-xl'>Performers</h2>

                <button
                    className='text-sm text-gray-600'
                    onClick={() => {
                        setExpand(!expand);
                    }}
                >
                    {expand ? 'Hide' : 'Expand'}
                </button>
            </div>

            <div
                className={clsx(
                    'w-[calc(60rem + 7.5rem)] mb-10 h-full overflow-auto px-5 duration-300',
                    expand
                        ? 'mt-10 flex max-h-[20000rem] flex-col items-center space-y-10 whitespace-normal lg:mt-0 lg:block lg:px-10'
                        : 'mt-10 max-h-80 space-x-10 space-y-0 whitespace-nowrap'
                )}
            >
                {performers.map(performer => {
                    return (
                        <div
                            key={performer.name}
                            className={clsx('inline-block h-72 w-60 rounded-md border bg-white p-5 shadow-lg', {
                                'mr-10': expand
                            })}
                        >
                            <div className='flex flex-col items-center'>
                                <div className='flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full shadow-md'>
                                    {/* <Image src={performer.img} height={60} width={60} alt={performer.name} /> */}
                                </div>
                                <h3 className='mt-5'>{performer.name}</h3>
                                <h4 className='text-sm text-gray-600'>{`${performer.solo ? `(${music.orchestra.solo}) ` : ''}${music.orchestra[performer.instrument]}${
                                    performer.violinPosition ? ` ${performer.violinPosition}` : ''
                                }`}</h4>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

interface Props {
    performers: Performer[];
}
