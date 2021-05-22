module.exports = {
    name: 'testdisboard',
    aliases: ['td', 'testbump'],
    usage: 'fox testdisboard',
    permissions: 'MANAGE_MESSAGES',
    category: 'settings',
    execute: async({message}) => {

        await message.client.tasks.get('disboard').message(message.client, message.guild);
        message.responder.success();
    }
}