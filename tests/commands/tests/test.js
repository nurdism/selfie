const { Command } = require('../../../src/index');

module.exports = class Test extends Command {
  constructor(client) {
    super(client, {
      name: 'test',
      description: 'description',
      arguments: ['[arguments]'],
      examples: `template${client.suffix} [arguments]`,
      guildOnly: true,
    });
  }

  run(msg, args, executor, edited) {
    return msg.sendCode(`args:${args}\nexecutor:${executor}\nedited:${edited}`);
  }
};
