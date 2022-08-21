import { useHover } from '@reeseharlak/usehooks';
import clsx from 'clsx';
import { MdAdd } from 'react-icons/md';

export default function Hawaii2022() {
    const hwHover = useHover('pumpkin_jul_9_2022');
    const showMoreHw = useHover('more-hawaii-btn');

    return (
        <div>
            <div
                style={{
                    transform: hwHover ? 'translate(2px, -5px) ' : 'translate(0px, 0px)'
                }}
                className='absolute top-36 right-[42%] z-40 flex select-none items-center duration-[800ms] lg:top-[13.5rem]'
            >
                <div className='h-3 w-3 rounded-full bg-blue-500' />
                <h2 className='ml-2 inline whitespace-nowrap text-lg font-normal leading-[1.3] text-[#333333]'>Hawaii Trip</h2>

                <div
                    id='more-hawaii-btn'
                    className={clsx(
                        'ml-2 origin-top-right border border-blue-200 duration-[600ms] ',
                        showMoreHw ? 'h-8 w-12 scale-[6] rounded-md bg-blue-200' : 'h-8 w-8 rounded-xl bg-transparent'
                    )}
                >
                    <MdAdd
                        className={clsx('mt-1 ml-1 text-xl text-blue-500 delay-500 duration-500', {
                            'hidden opacity-0': showMoreHw
                        })}
                    />
                    <p
                        className={clsx('p-1 text-[.125rem] text-[#4F4F4F]', {
                            invisible: !showMoreHw
                        })}
                    >
                        On July 9th 2022, we went to Hawaii for a week. Unfortunately we couldn&apos;t bring Pumpkin with us. She stayed with our Grandma and her
                        &quot;cousin&quot; Bella.
                    </p>
                </div>
            </div>

            <div className='mb-[6rem] translate-x-[-3rem] translate-y-[-7rem] lg:translate-y-0 lg:translate-x-0'>
                <div
                    style={{
                        transform: hwHover ? 'skew(.8deg, .8deg) scale(.95) translate(2px, -5px) ' : 'scale(1) translate(0px, 0px)',
                        backgroundImage: `url('https://reese.cafe/images/assets/reese/pumpkin/pumpkin_jul_9_2022.jpg')`
                    }}
                    id='pumpkin_jul_9_2022'
                    className='h-[144px] w-[188px] bg-cover bg-center bg-no-repeat p-2 duration-[800ms] md:h-[241px] md:w-[288px] lg:h-[341px] lg:w-[388px]'
                />
            </div>
        </div>
    );
}
