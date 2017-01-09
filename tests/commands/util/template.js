const { Command } = require('../../../src/index');

module.exports = class Template extends Command {
  constructor(client) {
    super(client, {
      filename: 'template',
      name: 'template',
      aliases: ['temp'],
      description: 'description',
      arguments: ['[arguments]'],
      examples: `template${client.suffix} [arguments]`,
      guildOnly: false,
    });
  }

  hasPermission(msg) {
    return msg.channel.permissionsFor(msg.member).hasPermission('SEND_MESSAGES');
  }

  canRun(msg) {
    return msg.author.id === this.client.user.id;
  }

  run(msg, args, executor, edited) {
    return msg.sendCode(`args:${args}\nexecutor:${executor}\nedited:${edited}`);
  }

  onReject(channel, reason, error) {
    let reasons = {
      guildOnly: 'Guild Only Command',
      permission: 'No Permission to run',
      run: 'Can\'t run, missing requirement...',
      error: error ? `\`${error.name}: ${error.message}\`` : 'An error has occurred.',
    };

    return reasons[reason] ? channel.send(reasons[reason]) : false;
  }

};
