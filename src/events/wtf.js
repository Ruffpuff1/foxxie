const { Event } = require('@foxxie/tails');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'wtf'
        })
    }

    run(failure) {
        console.log(failure);
    }
}