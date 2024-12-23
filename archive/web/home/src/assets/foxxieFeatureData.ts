export const foxxieFeatures: Feature[] = [
    {
        name: 'moderation-log',
        description:
            "Log moderation actions in your server so you can keep track of what your mods are doing when you're away. Additionally configure automoderation logging too see what actions Foxxie takes."
    },
    {
        name: 'user-info',
        description:
            'See information on any user on Discord. Like their account creation date and avater. Then for users in your server, see what roles, warnings, and notes they have.'
    },
    {
        name: 'server-info',
        description: 'Learn more about your server. List the roles and members it has as well as see how many messages Foxxie has counted in it.'
    },
    {
        name: 'role-info',
        description:
            'Get information on server roles, like the name, color, members, and permissions it has. Additionally gain insight on certain properties the role has.'
    },
    {
        name: 'channel-info',
        description: 'Get infomation on any channel in your server as well as have different information depending on the channel type.'
    }
];

interface Feature {
    name: 'role-info' | 'server-info' | 'user-info' | 'moderation-log' | 'channel-info';
    description: string;
}
