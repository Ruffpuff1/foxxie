const CHANNELS = ['moderation-log', 'user-info', 'server-info', 'role-info', 'channel-info'];

export default function FoxxieDiscordChannelPanel({ setSection, section }: Props) {
    return (
        <div className='hidden h-full w-[240px] bg-[#2F3136] md:block'>
            <div className='font-ptSans h-[48px] p-3 font-medium text-white shadow-md hover:cursor-pointer hover:bg-[#37393F]'>Foxxie&apos;s Place</div>
            <div className='my-4 mx-2 space-y-1'>
                {CHANNELS.map(c => {
                    return (
                        <button
                            key={c}
                            onClick={() => {
                                setSection(c);
                            }}
                            className={`font-ptSans flex w-full items-center justify-start rounded-md py-1 px-1 ${
                                section === c ? 'bg-[#41454E] text-white' : 'text-[#96989C] hover:bg-[#41454E] hover:text-white'
                            }`}
                        >
                            # {c}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

interface Props {
    section: string;
    setSection: (s: string) => void;
}
