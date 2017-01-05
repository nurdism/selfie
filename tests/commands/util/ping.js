const { Command } = require('../../../src/index');

module.exports = class Ping extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      description: 'description',
      arguments: ['[arguments]'],
      examples: `template${client.suffix} [arguments]`,
      guildOnly: false,
    });
  }

  run(msg) {
    msg.delete();
    return msg.send('Ping').then(message => message.edit(`Pong! ( took: ${message.createdTimestamp - msg.createdTimestamp} ms )`));
  }
};
