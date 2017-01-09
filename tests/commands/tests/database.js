const { Command } = require('../../../src/index');
const Sequelize = require('sequelize');

module.exports = class Database extends Command {
  constructor(client) {
    super(client, {
      filename: 'database',
      name: 'database',
      aliases: ['dbtest'],
      description: 'description',
      arguments: ['[arguments]'],
      examples: `template${client.suffix} [arguments]`,
      guildOnly: false,
    });

    this.dbtest = this.database.define('dbtest', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  }

  run(msg) {
    this.dbtest.create({ id: msg.id, content: msg.content });
    return this.dbtest.findAll().then(rows => {
      let data = [];
      for (const row of rows) {
        data.push(`${row.dataValues.id}: ${row.dataValues.content}`);
      }
      return msg.sendCode(data.join('\n'));
    });
  }
};
