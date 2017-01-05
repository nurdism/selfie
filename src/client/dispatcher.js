const Command = require('./../command/index');
const CommandMessage = require('./../command/message');

class Dispatcher {
  constructor(client, commands) {
    Object.defineProperty(this, 'client', { value: client });
    this.commands = commands;
  }

  handleMessage(message, old) {
    if (!this.shouldHandleMessage(message, old)) return;
    let command = this.parseMessage(message, old);
    if (command instanceof CommandMessage) {
      command.run();
    }
  }

  shouldHandleMessage(message, old) {
    if (old) message = old;
    if (message.author.id !== this.client.user.id) return false;
    try {
      return message.content.match(/\S+/)[0].endsWith(this.client.suffix);
    } catch (e) {
      return false;
    }
  }

  parseMessage(message, old) {
    let edited = false;
    let content = message.content;

    if (old) {
      content = old.content;
      message = old;
      edited = true;
    }

    let regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
    let matches, cmd, args = [];
    while ((matches = regex.exec(content)) !== null) {
      if (!cmd) {
        cmd = matches[0].replace(this.client.suffix, '').toLowerCase();
      } else {
        args.push(matches[1] || matches[0]);
      }
    }

    let command = this.commands.find(cmd);
    if (command instanceof Command) {
      return new CommandMessage(message, command, args, cmd, edited);
    } else {
      this.client.emit('unknownCommand', cmd, args, edited);
      return false;
    }
  }
}

module.exports = Dispatcher;
