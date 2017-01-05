const { Command } = require('../../../src/index');

module.exports = class Settings extends Command {
  constructor(client) {
    super(client, {
      name: 'setting',
      description: 'description',
      arguments: ['[arguments]'],
      examples: `template${client.suffix} [arguments]`,
      guildOnly: false,
    });
  }

  run(msg, args) {
    let setting = this.settings.get('test', null);

    this.settings.set('test', args[0]);

    let new_setting = this.settings.get('test', null);

    return msg.channel.send(`${'```'}${setting} => ${new_setting}${'```'}`);
  }
};
