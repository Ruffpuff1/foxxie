import { latestWorks } from 'src/assets/projects';

/* eslint-disable @next/next/no-img-element */
export default function WorkLatest() {
    return (
        <div id='latest' className='mb-20 px-10'>
            <h2 className='text-left text-[#5f6368]'>Latest works</h2>

            <div className='mt-2 grid grid-cols-1 gap-16 lg:grid-cols-3'>
                {latestWorks.map(work => {
                    return (
                        <a
                            key={work.homepage}
                            href={work.homepage}
                            className='flex items-center overflow-y-hidden rounded-md rounded-l-none pr-2 duration-200 hover:bg-blue-50 lg:items-start lg:justify-between'
                        >
                            <img className='h-14 w-14' height={56} width={56} src={work.icon} alt={work.name} />
                            <div className='ml-6'>
                                <h4 className='text-xl text-[#202124] text-ellipsis'>{`${work.name.length > 62 ? `${work.name.slice(0, 66).trim()}...` : work.name}`}</h4>
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
