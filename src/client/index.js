const { Client } = require('discord.js');
const Dispatcher = require('./dispatcher');
const Registry = require('./registry');
const Database = require('./../providers/database');
const Settings = require('./../providers/settings');

class SelfieClient extends Client {
  constructor(options) {
    super(options);

    if (options.database) {
      this.database = new Database(this, options.database);

      this.settings = new Settings(this, this.database);
    }

    this.commands = new Registry(this);

    this.dispatcher = new Dispatcher(this, this.commands);

    this.suffix = options.suffix || '?';

    this.on('message', msg => {
      this.dispatcher.handleMessage(msg);
    });

    this.on('messageUpdate', (msg, old) => {
      this.dispatcher.handleMessage(msg, old);
    });

    this.on('ready', () => {
      this.settings.init();
    });
  }

  login(token) {
    if (this.database) {
      return this.database.start().then(() => super.login(token)).catch(err => { this.emit('error', err); });
    } else {
      return super.login(token);
    }
  }

}

module.exports = SelfieClient;
