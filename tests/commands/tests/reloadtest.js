const { Command } = require('../../../src/index');

module.exports = class ReloadTest extends Command {
  constructor(client) {
    super(client, {
      filename: 'reloadtest',
      name: 'reloadtest',
      description: 'description',
      arguments: ['[arguments]'],
      examples: `template${client.suffix} [arguments]`,
      guildOnly: false,
    });
  }

  run(msg) {
    msg.send('GGGGoooooooot!');
  }

};
