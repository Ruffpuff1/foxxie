import { exhibits } from '@assets/arts-and-culture/data';
import { Museum } from '@assets/arts-and-culture/structures/Museum';
import { useRouter } from 'next/router';

export default function Exhibits({ museum }: { museum: Museum }) {
    const router = useRouter();
    const museumExhibits = exhibits.filter(e => e.museumId === museum.id);

    if (!museumExhibits.length) return null;

    return (
        <div className='mb-20 w-full overflow-x-scroll px-5 md:px-28'>
            <h2 className='mb-5 tracking-wide text-gray-500'>{museumExhibits.length} Exhibits</h2>

            {museumExhibits.length > 0 && (
                <div className='overflow-x-scroll whitespace-nowrap'>
                    <ul className='block items-center space-x-5'>
                        {museumExhibits
                            .sort((a, b) => (b.startDate && a.startDate ? b.startDate?.getTime() - a.startDate?.getTime() : 0))
                            .map(m => {
                                return (
                                    <li key={m.id} className='group inline-block h-44 w-44 overflow-hidden rounded-md md:h-56 md:w-56'>
                                        <button
                                            onClick={() => router.push(m.page)}
                                            style={{
                                                backgroundImage: `url('${m.image}')`
                                            }}
                                            className='h-full w-full rounded-md bg-cover bg-center bg-no-repeat duration-200 group-hover:scale-[1.1]'
                                        >
                                            <div className='h-full w-full rounded-md bg-black bg-opacity-50 tracking-wide text-white'>
                                                <span className='flex h-full w-full max-w-[90%] items-end rounded-md p-2 text-start text-sm tracking-wide text-white duration-200 group-hover:text-transparent'>
                                                    {m.name}
                                                </span>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            )}
        </div>
    );
}
