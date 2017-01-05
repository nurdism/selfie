const { Collection } = require('discord.js');
const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');

class Database {
  constructor(client, options) {
    Object.defineProperty(this, 'client', { value: client });

    this.sequelize = new Sequelize(options);

    this.models = new Collection();
  }

  get db() {
    return this.sequelize;
  }

  define(name, options) {
    if (!this.models.get(name)) {
      let model = this.sequelize.define(name, options);
      this.models.set(model.name, model);
      return model;
    } else {
      throw new Error(`Model with name '${name}' already exists!`);
    }
  }

  model(name) {
    return this.models.get(name);
  }

  import(file) {
    let model = this.sequelize.import(file);
    if (!this.models.get(model)) {
      this.models.set(model.name, model);
      return model;
    } else {
      throw new Error(`Model with name '${model.name}' already exists!`);
    }
  }

  importFrom(folder) {
    fs.readdirSync(folder)
        .filter(file => file.indexOf('.') !== 0)
        .forEach(file => { this.import(path.join(folder, file)); });
  }

  sync() {
    return this.sequelize.sync();
  }

  start() {
    return this.sequelize.authenticate()
        .then(() => {
          this.client.emit('debug', 'Connection has been established successfully.');
          return this.sync();
        }).then(() => {
          this.client.emit('debug', 'Database successfully synced!');
          return this.sequelize;
        })
        .catch(err => { this.client.emit('error', err); });
  }

}

module.exports = Database;
