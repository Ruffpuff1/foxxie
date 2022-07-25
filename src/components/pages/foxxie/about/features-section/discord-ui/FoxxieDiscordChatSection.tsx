import ModerationLog from '../discord-components/ModerationLog';
import UserInfo from '../discord-components/UserInfo';
import ServerInfo from '../discord-components/ServerInfo';
import RoleInfo from '../discord-components/RoleInfo';
import ChannelInfo from '../discord-components/ChannelInfo';

export default function FoxxieDiscordChatSection({ section }: { section: string }) {
    return (
        <div className='foxxie-main-panel bg-[#37393F]'>
            <div className='flex h-[48px] items-center justify-start space-x-2 px-5 shadow-md'>
                <span className='font-ptSans text-2xl italic text-gray-400'>#</span>
                <span className='font-ptSans text-base font-[500] text-[#DCDDDE]'>{section}</span>
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
