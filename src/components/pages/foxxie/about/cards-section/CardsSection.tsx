export default function CardsSection() {
    return (
        <section className='flex flex-col items-start space-y-10 px-10 pb-20'>
            <div className='group h-[200px] rounded-lg p-4 text-white hover:cursor-pointer'>
                <a
                    href='https://crowdin.com/project/foxxie-bot'
                    target='_blank'
                    rel='noreferrer'
                    style={{ transform: 'skewX(3deg)' }}
                    className='group absolute h-[200px] w-[360px] rounded-lg bg-[#2F3136] p-4 hover:cursor-pointer hover:shadow-lg md:w-[600px]'
                >
                    <h2 className='flex items-center justify-start text-xl font-semibold duration-200 group-hover:translate-y-[-2px]'>Multiple languages</h2>
                    <p className='mt-2 text-sm italic text-gray-300 duration-200 group-hover:translate-y-[-2px] md:text-base'>
                        With the help of translators Foxxie has been translated completely into Spanish. We aim to provide more languages in the future. If you&apos;d
                        like to contribute translations you can do so on our crowdin page. Click on this card to learn more.
                    </p>
                </a>
            </div>

            <div className='group h-[200px] rounded-lg p-4 text-white hover:cursor-pointer'>
                <a
                    href='/foxxie/story'
                    target='_blank'
                    rel='noreferrer'
                    style={{ transform: 'skewX(3deg)' }}
                    className='group absolute h-[200px] w-[360px] rounded-lg bg-[#2F3136] p-4 hover:cursor-pointer hover:shadow-lg md:w-[600px]'
                >
                    <h2 className='flex items-center justify-start text-xl font-semibold duration-200 group-hover:translate-y-[-2px]'>Story</h2>
                    <p className='mt-2 text-sm italic text-gray-300 duration-200 group-hover:translate-y-[-2px] md:text-base'>
                        Foxxie is a Discord bot. But he&apos;s been around for a long time. Read more about his history and how he&apos;s evolved since his creation by
                        clicking on this card.
                    </p>
                </a>
            </div>
        </section>
    );
}
