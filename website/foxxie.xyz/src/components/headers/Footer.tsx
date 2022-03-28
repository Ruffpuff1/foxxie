export function Footer() {
    return (
        <h2 className='text-light-white px-4 bottom-4 sm:px-24 absolute duration-300 transition-all italic bg-gray w-full'>
            By inviting you agree to our <a
                href='/terms'
                target='_blank'
                rel="noreferrer"
                className='hover:text-kettu duration-500'
            >
                Terms of Service
            </a> and <a
                href='/conduct'
                target='_blank'
                rel="noreferrer"
                className='hover:text-kettu duration-500'
            >
                Code of Conduct
            </a>. <a
                href='https://github.com/FoxxieBot/foxxie/blob/main/LICENSE'
                target='_blank'
                rel="noreferrer"
                className='hover:text-foxxie duration-500'
            >
                Copyright © Foxxie 2021
            </a>
        </h2>
    );
}
