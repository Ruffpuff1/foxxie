import { useHover } from '@reeseharlak/usehooks';
import clsx from 'clsx';
import { MdAdd } from 'react-icons/md';

export default function Arizona2022() {
    const azHover = useHover('pumpkin_mar_28_2022');
    const showMoreAz = useHover('more-arizona-btn');

    return (
        <div>
            <div
                style={{
                    transform: azHover ? 'translate(2px, -5px) ' : 'translate(0px, 0px)'
                }}
                className='absolute top-40 right-40 z-40 flex select-none items-center duration-[800ms] lg:right-0 lg:left-40 lg:top-[17rem]'
            >
                <div className='h-3 w-3 rounded-full bg-blue-500' />
                <h2 className='ml-2 inline whitespace-nowrap text-lg font-normal leading-[1.3] text-[#333333]'>Trip to Arizona</h2>

                <div
                    id='more-arizona-btn'
                    className={clsx(
                        'ml-2 origin-top-right border border-blue-200 duration-[600ms] ',
                        showMoreAz ? 'h-8 w-12 scale-[6] rounded-md bg-blue-200' : 'h-8 w-8 rounded-xl bg-transparent'
                    )}
                >
                    <MdAdd
                        className={clsx('mt-1 ml-1 text-xl text-blue-500 delay-500 duration-500', {
                            'hidden opacity-0': showMoreAz
                        })}
                    />
                    <p
                        className={clsx('p-1 text-[.125rem] text-[#4F4F4F]', {
                            invisible: !showMoreAz
                        })}
                    >
                        Lorem ipsum dolor sit amet consectetur
                    </p>
                </div>
            </div>

            <div className='translate-x-[-3rem] translate-y-[-7rem] lg:translate-y-0 lg:translate-x-0'>
                <div
                    style={{
                        transform: azHover ? 'skew(.8deg, .8deg) scale(.95) translate(2px, -5px) ' : 'scale(1) translate(0px, 0px)',
                        backgroundImage: `url('https://rsehrk.com/images/assets/reese/pumpkin/pumpkin_mar_28_2022.jpg')`
                    }}
                    id='pumpkin_mar_28_2022'
                    className='h-[125.5px] w-[234px] bg-cover bg-center bg-no-repeat p-2 duration-[800ms] md:h-[225.5px] md:w-[334px] lg:h-[325.5px] lg:w-[434px]'
                />
            </div>
        </div>
    );
}
