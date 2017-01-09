const { Collection } = require('discord.js');
const SelfieCommand = require('./../command/index');
const path = require('path');

class Registry {
  constructor(client) {
    Object.defineProperty(this, 'client', { value: client });
    this.commands = new Collection();
  }

  register(commands) {
    if (!Array.isArray(commands)) throw new TypeError('Commands must be an Array.');

    for (let obj of commands) {
      let command, Command = obj.command, group = obj.group, cmdpath = obj.path;

      if (typeof Command === 'function') command = new Command(this.client);

      // Verify that it's an actual command
      if (!(command instanceof SelfieCommand)) {
        this.client.emit('warn', `Attempting to register an invalid command object: ${command}; skipping.`);
        continue;
      }

      // Set group
      if (group) {
        command.group = group;
      } else {
        this.client.emit('warn', `Attempting to register a command with out group: ${command.name}; skipping.`);
        continue;
      }

      // Set path
      if (cmdpath) {
        command.path = path.join(cmdpath, group, `${command.filename}.js`);
      }

      // Make sure there aren't any conflicts
      if (this.commands.some(cmd => cmd.name === command.name || cmd.aliases.includes(command.name))) {
        this.client.emit('warn', `A command with the name/alias "${command.name}" is already registered; skipping.`);
      }

      for (const alias of command.aliases) {
        if (this.commands.some(cmd => cmd.name === alias || cmd.aliases.includes(alias))) {
          this.client.emit('warn', `A command with the name/alias "${alias}" (${command.name}) is already registered; skipping.`);
        }
      }

      this.commands.set(command.name, command);
      this.client.emit('commandRegister', command, this);
    }

    return this;
  }

  registerIn(options) {
    const obj = require('require-all')(options);
    const commands = [];
    Object.keys(obj).forEach(i => {
      Object.keys(obj[i]).forEach(j => {
        commands.push({ command: obj[i][j], group: i, path: options });
      });
    });
    return this.register(commands);
  }

  reregister(command, old) {
    if (typeof command === 'function') command = new command(this.client); // eslint-disable-line new-cap
    if (command.name !== old.name) throw new Error('Command name cannot change.');
    command.group = old.group;
    command.path = old.path;
    this.commands.set(command.name, command);

    this.client.emit('commandReregister', command, old);
    this.client.emit('debug', `Reregistered command ${command.group}:${command.filename}.`);
  }

  unregister(command) {
    if (typeof command === 'string') {
      command = this.find(command);
    }
    this.commands.delete(command.name);
    this.client.emit('commandUnregister', command);
    this.client.emit('debug', `Unregistered command ${command.group}:${command.filename}.`);
  }

  find(name) {
    for (let command of this.commands) {
      if (command[1].name === name || command[1].aliases.includes(name)) {
        return command[1];
      }
    }
    return false;
  }

  get table() {
    let table = {};
    this.commands.forEach(command => {
      if (!table[command.group]) table[command.group] = [];
      table[command.group].push({
        name: command.name,
        aliases: command.aliases,
        description: command.description,
        arguments: command.arguments,
        examples: command.examples,
      });
    });
    return table;
  }
}

module.exports = Registry;
