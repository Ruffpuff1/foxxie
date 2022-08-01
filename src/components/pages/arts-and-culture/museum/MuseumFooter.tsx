import { Museum } from '@assets/arts-and-culture/structures/Museum';
import Hours from './Hours/Hours';

export default function MuseumFooter({ museum }: { museum: Museum }) {
    return (
        <footer className='my-20 mx-5 flex flex-col items-start justify-start space-y-10 md:flex-row md:items-start md:justify-center md:space-y-0 md:space-x-20'>
            <div>
                <h2 className='mb-2 text-base font-[500]'>{museum.name}</h2>
                {museum.phone && <p className='mb-2 text-left text-sm text-[#3C4043]'>{museum.getPhoneNumber()}</p>}
                <p className='mb-2 text-left text-sm text-[#3C4043]'>{museum.address}</p>

                <div>
                    <p>
                        <span className='text-sm text-[#4C4043]'>Visit </span>
                        <a className='text-sm text-blue-400 hover:underline' href={museum.website}>
                            {museum.name}&apos;s Website
                        </a>
                    </p>
                </div>
            </div>

            <Hours museum={museum} />
        </footer>
    );
}
