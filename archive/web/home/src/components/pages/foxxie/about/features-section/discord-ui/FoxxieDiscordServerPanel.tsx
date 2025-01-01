import Image from 'next/image';
import { SiDiscord } from 'react-icons/si';
import { Images } from '../../../../../../assets/images';

export default function FoxxieDiscordServerPanel() {
    return (
        <div className='hidden h-full w-[72px] bg-[#202225] md:block'>
            <ul className='flex flex-col items-start'>
                <li className='group flex items-center justify-start space-x-[0.4rem] py-2'>
                    <div className='w-[5px] rounded-r-md bg-white text-white opacity-0 duration-300 group-hover:opacity-100'>.</div>
                    <div className='flex flex-col items-center'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-3xl bg-[#37393F] transition-all duration-300 group-hover:cursor-pointer group-hover:rounded-xl group-hover:bg-[#5965F2]'>
                            <SiDiscord className='text-2xl text-[#DCDDDE]' />
                        </div>
                        {/** the line under the discord icon */}
                        <div className='mt-2 h-[2px] w-8 bg-[#2F3136] text-[#202225]'>.</div>
                    </div>
                </li>

                <li className='group flex items-center justify-start space-x-[0.4rem] py-2'>
                    <div className='w-[5px] rounded-r-md bg-white text-white opacity-0 duration-300 group-hover:opacity-100'>.</div>
                    <div className='flex flex-col items-center'>
                        <Image
                            alt='The Corner Store server icon'
                            src={Images.TheCornerStore}
                            width={48}
                            height={48}
                            className='flex h-12 w-12 items-center justify-center rounded-3xl transition-all duration-300 group-hover:cursor-pointer group-hover:rounded-xl'
                        />
                    </div>
                </li>

                <li className='group flex items-center justify-start space-x-[0.4rem] py-2'>
                    <div className='h-[40px] w-[5px] rounded-r-md bg-white text-white opacity-100'>.</div>
                    <div className='flex flex-col items-center'>
                        <Image
                            src={Images.Foxxie}
                            alt="Foxxie's place server icon"
                            width={48}
                            height={48}
                            className='flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:cursor-pointer'
                        />
                    </div>
                </li>
            </ul>
        </div>
    );
}
