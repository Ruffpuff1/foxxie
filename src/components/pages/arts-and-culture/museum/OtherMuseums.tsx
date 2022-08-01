import { museums } from '@assets/arts-and-culture/data';
import { Museum } from '@assets/arts-and-culture/structures/Museum';
import { toTitleCase } from '@ruffpuff/utilities';
import { useRouter } from 'next/router';

export default function OtherMuseums({ museum }: { museum: Museum }) {
    const router = useRouter();
    const regions = [...new Set(museum.regions)];

    if (!regions.length) return null;
    const limit = 1;

    return (
        <>
            {regions.reverse().map((r, idx) => {
                if (idx >= limit) return null;

                const sameReg = museums.filter(m => m.regions.includes(r) && m.id !== museum.id);
                if (!sameReg.length) return null;

                return (
                    <div key={r} className='mb-20 w-full px-5 md:px-28'>
                        <h2 className='mb-5 tracking-wide text-gray-500'>Other Museums in {toTitleCase(r.replace(/-/g, ' '))}</h2>

                        {sameReg.length > 0 && (
                            <div className='overflow-x-scroll whitespace-nowrap'>
                                <ul className='block items-center space-x-5'>
                                    {sameReg.map(m => {
                                        return (
                                            <li key={m.id} className='group inline-block h-44 w-44 overflow-hidden rounded-md md:h-56 md:w-56'>
                                                <button
                                                    onClick={() => router.push(m.page)}
                                                    style={{
                                                        backgroundImage: `url('${m.bannerUrl}')`
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
            })}
        </>
    );
}
