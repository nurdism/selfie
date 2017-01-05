const { Client } = require('discord.js');
const Dispatcher = require('./dispatcher');
const Registry = require('./registry');
const Database = require('./../providers/database');
const Settings = require('./../providers/settings');

class SelfieClient extends Client {
  constructor(options) {
    super(options);

    this.database = new Database(this, options.database, options.sequelize);

    this.settings = new Settings(this, this.database);

    this.registry = new Registry(this);

    this.dispatcher = new Dispatcher(this, this.registry);

    this.suffix = options.suffix || '?';

    this.on('message', msg => {
      try {
        this.dispatcher.handleMessage(msg);
      } catch (err) {
        this.emit('error', err);
      }
    });

    this.on('messageUpdate', (msg, old) => {
      try {
        this.dispatcher.handleMessage(msg, old);
      } catch (err) {
        this.emit('error', err);
      }
    });

    this.on('ready', () => {
      this.settings.init();
    });
  }

  login(token) {
    return this.database.start().then(() => super.login(token)).catch(err => { this.emit('error', err); });
  }

}

module.exports = SelfieClient;
