module.exports = {
    name: 'ping',
    description: 'Shows the latency of the bot.',
    execute(message) {
  message.channel.send(`:ping_pong: Latency is ${Date.now() - message.createdTimestamp} ms`)
     }
  }