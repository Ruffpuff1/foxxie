import { toTitleCase } from '@ruffpuff/utilities';
import { SiDiscord } from 'react-icons/si';
import { foxxieFeatures } from '../../../../../../assets/foxxieFeatureData';

export default function FoxxieFeaturesList() {
    return (
        <div className='flex h-[100vh] w-screen sm:hidden'>
            <div className='foxxie-main-panel bg-[#37393F]'>
                <div className='flex h-[48px] items-center justify-start space-x-2 px-5 shadow-md'>
                    <span className='text-2xl italic text-gray-400'>#</span>
                    <span className='text-base font-medium text-[#DCDDDE]'>foxxies-features</span>
                </div>

                <div className='py-4'>
                    <h3 className='flex flex-col border-l-2 border-l-[#5965F2] bg-[#373B48] px-4 py-1 text-[#DCDDDE] hover:bg-[#3B3D51]'>
                        <span className='text-sm'>
                            <i>Tip: view this site on a bigger screen for a better experience.</i>
                        </span>
                        <SiDiscord className='mt-1 text-xl' />
                    </h3>
                    <div className='mt-10 space-y-8 px-4'>
                        {foxxieFeatures.map(feature => {
                            return (
                                <div key={feature.name} className='border-b-[#202225]'>
                                    <h3 className='text-xl font-medium text-[#DCDDDE]'>{toTitleCase(feature.name.replace('-', ' '))}</h3>
                                    <p className='text-sm text-[#DCDDDE]'>{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
