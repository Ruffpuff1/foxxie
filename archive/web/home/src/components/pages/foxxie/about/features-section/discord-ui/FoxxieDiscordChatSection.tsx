import dynamic from 'next/dynamic';

const ChannelInfo = dynamic(() => import('../discord-components/ChannelInfo'));
const ModerationLog = dynamic(() => import('../discord-components/ModerationLog'));
const RoleInfo = dynamic(() => import('../discord-components/RoleInfo'));
const ServerInfo = dynamic(() => import('../discord-components/ServerInfo'));
const UserInfo = dynamic(() => import('../discord-components/UserInfo'));

export default function FoxxieDiscordChatSection({ section }: { section: string }) {
    return (
        <div className='foxxie-main-panel bg-[#37393F]'>
            <div className='flex h-[48px] items-center justify-start space-x-2 px-5 shadow-md'>
                <span className='font-ptSans text-2xl italic text-gray-400'>#</span>
                <span className='font-ptSans text-base font-medium text-[#DCDDDE]'>{section}</span>
            </div>
            {getComponent(section)}
        </div>
    );
}

function getComponent(section: string) {
    switch (section) {
        case 'moderation-log':
            return <ModerationLog />;
        case 'role-info':
            return <RoleInfo />;
        case 'server-info':
            return <ServerInfo />;
        case 'channel-info':
            return <ChannelInfo />;
        case 'user-info':
            return <UserInfo />;
    }
}
