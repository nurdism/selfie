const { Command } = require('../../../src/index');
const { inspect } = require('util');
module.exports = class CommandTable extends Command {
  constructor(client) {
    super(client, {
      name: 'commands',
      description: 'description',
      arguments: ['[arguments]'],
      examples: `template${client.suffix} [arguments]`,
      guildOnly: false,
    });
  }


  run(msg) {
    return msg.channel.send(`${'```'}${
      inspect(
          this.client.registry.commandTable,
          { depth: 2, showHidden: true }
          )}${'```'}`);
  }

};
