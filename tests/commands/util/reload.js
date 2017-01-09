const { Command } = require('../../../src/index');

module.exports = class Reload extends Command {
  constructor(client) {
    super(client, {
      filename: 'reload',
      name: 'reload',
      description: 'description',
      arguments: ['[arguments]'],
      examples: `template${client.suffix} [arguments]`,
      guildOnly: false,
    });
  }

  run(msg, args) {
    let cmd = this.client.commands.find(args[0]);
    if (cmd) {
      cmd.reload();
      return msg.send(`${cmd.name} reloaded!`);
    } else {
      return msg.send(`${args[0]} not found!`);
    }
  }

};
