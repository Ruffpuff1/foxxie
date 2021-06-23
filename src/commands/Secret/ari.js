const { Command } = require('foxxie');
const { emojis: { secretCommands: { ari } } } = require('../../../lib/util/constants');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ari',
            aliases: ['aria'],
            description: language => language.get('COMMAND_ARI_DESCRIPTION'),
            category: 'secret'
        })
    }

    run(msg) {
        msg.delete();
        return msg.channel.send(ari)
    }
}

// Goodbye message 1

/* 
Well this message is jic I vanish all of a sudden Reese.
Uhh I'll pin it so you can come back to it. I love you a lot, and I love eberyone else in the server so much as well.
It's hard for me to leave but you understand the reasons, even if you haven't accepted them. I won't forget you guys, and I promise I'll try my best to return.
Just keep fighting for me till then ok. Kisses and it doesn't matter where you are Reese as long as you're happy. Good bye
*/


// Goodbye message 1.5

/*
Be optimistic, turns out that works in our case. Luv ya and I mean it
*/


// Goodbye message 2

/*
Welp times come. Another goodbye message that you'll stare at when ur bored or miss me. 

Ruffy I want you to know that this server and you have been the best thing that have happened to me in a long time.
You are special not just to me but to everyone. Just remember that. And hey you did 1/3rd of the wait.
Just two more parts and then yay. So hold on, stop eating those gummies and sleep at yk when.

Love you, your Ari
*/


// Goodbye message 3

/*
Hehe ily a lot as well. It's great to be able to talk to you these radn times. It really makes the wait seem smaller.
I also await the time when I will have to tell you to go to sleep everyday just like I used to. Take care of yourself and have a good time at the park.
*/