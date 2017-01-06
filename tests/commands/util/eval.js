const { Command } = require('../../../src/index');
const { inspect } = require('util');
const beautify = require('js-beautify').js_beautify;

module.exports = class Eval extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      description: 'Evaluates some javascript and displays the output.',
      arguments: ['[arguments]'],
      examples: `eval${client.suffix} ( client.user.id == message.author.id )`,
    });

    this.blacklist = ['token'];
    this.hidden = ['token', 'email'];
  }

  run(msg, args, executor) {
    let code = msg.content.replace(`${executor}${this.client.suffix} `, '');

    for (const word of this.blacklist) {
      if (code.indexOf(word) !== -1) {
        return msg.edit(`Error: \`${word}\` is a blacklisted word from eval command.`).then(m => {
          m.delete(10000);
        });
      }
    }

    try {
      /*eslint-disable */

      let commandMessage = msg;
      let message = msg.message.message;
      let guild = msg.message.guild;
      let channel = msg.message.channel;
      let member = msg.message.member;
      let user = msg.message.member.user;
      let settings = this.settings;
      let database = this.database;
      let client = this.client;
      let command = msg.command;

      /*eslint-enable */

      let evaled = eval(code);

      if (evaled instanceof Promise) {
        return evaled.then(val => this.send(msg, code, val)).catch(err => this.error(msg, code, err));
      } else {
        return this.send(msg, code, evaled);
      }
    } catch (err) {
      return this.error(msg, code, err);
    }
  }

  error(msg, code, error) {
    code = beautify(this.clean(code));
    error = `${error.name}: ${error.message}`;
    let send = `\`\`\`javascript\nInput:\n ${code}\n------------------------\n${error}\n\`\`\``;
    if (send.length > 2000) {
      return msg.edit(`\`\`\`javascript\nInput: ${code}\n\`\`\``).then(() => msg.channel.send(`\`\`\`javascript\nOutput: ${error}\n\`\`\``));
    } else {
      return msg.edit(send);
    }
  }

  send(msg, code, evaled) {
    evaled = this.format(evaled);
    code = beautify(this.clean(code));
    let send = `\`\`\`javascript\nInput: ${code}\n------------------------\n${evaled}\n\`\`\``;

    if (send.length > 2000) {
      return msg.edit(`\`\`\`javascript\nInput: ${code}\n\`\`\``).then(() => {
        send = `\`\`\`javascript\nOutput: ${evaled}\n\`\`\``;
        if (send.length > 2000) {
          return msg.channel.send(`\`\`\`javascript\nOutput Too large to display.\n\`\`\``);
        } else {
          return msg.channel.send(send);
        }
      });
    } else {
      return msg.edit(send);
    }
  }

  format(output) {
    let type = typeof output;
    let instance;

    if (type === 'object' && output !== null) {
      if (output.constructor) instance = output.constructor.name; else instance = '';
      output = Object.assign({}, output);
      for (const word of this.hidden) {
        if (output[word]) {
          output[word] = '-hidden-';
        }
      }
    } else if (type === 'object' && output === null) {
      type = 'undefined';
    }

    if (type !== 'string') output = beautify(inspect(output, { depth: 0, showHidden: true }), { indent_size: 2, indent_char: ' ' });

    switch (type) {
      case 'undefined':
        return `Output: ${output}`;
      case 'number':
      case 'string':
      case 'boolean':
        return `Output: (${type}) ${output}`;
      case 'function':
      case 'symbol':
        return `Output: ${output}`;
      case 'object':
        return `Output: \n${instance} ${output}\ntype:${type}`;
      default:
        return `Output: \n${output}\ntype:${type || 'Unknown'}`;
    }
  }

  clean(text) {
    return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
  }

};
