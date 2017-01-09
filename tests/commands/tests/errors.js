const { Command } = require('../../../src/index');

module.exports = class ErrorTest extends Command {
  constructor(client) {
    super(client, {
      filename: 'errors',
      name: 'errors',
      aliases: ['error'],
      description: 'description',
      arguments: ['[arguments]'],
      examples: `template${client.suffix} [arguments]`,
      guildOnly: true,
    });
  }

  hasPermission(msg) {
    if (msg.args[0] && msg.args[0] === 'permission') {
      return false;
    }
    return msg.channel.permissionsFor(msg.member).hasPermission('SEND_MESSAGES');
  }

  canRun(msg) {
    if (msg.args[0] && msg.args[0] === 'canRun') {
      return false;
    }
    return msg.author.id === this.client.user.id;
  }

  run(msg, args) {
    if (args[0] && args[0] === 'throw') {
      return msg.send(new Array(2500).join('d'));
    }
    return undefined;
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
