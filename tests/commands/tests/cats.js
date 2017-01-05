const { Command, RichEmbed } = require('../../../src/index');

module.exports = class Cats extends Command {
  constructor(client) {
    super(client, {
      name: 'cats',
      aliases: ['kitty', 'kitties', 'cat'],
      description: 'description',
      arguments: ['[arguments]'],
      examples: `template${client.suffix} [arguments]`,
      guildOnly: false,
    });
  }

  run(msg, args) {
    if (args[0] === 'add') {
      return this.database.model('cats').upsert(
            { name: args[1], image: args[2] },
            { where: { name: args[1] } }).then(() =>
            msg.channel.send(`${'```'}Cat ${args[1]} added!${'```'}`)
        );
    }

    return this.database.model('cats')
    .findOne({ where: { name: args[0] } })
    .then(instance => {
      if (instance) {
        let embed = new RichEmbed()
                .setColor(0x00AE86)
                .setTitle(instance.dataValues.name)
                .setImage(instance.dataValues.image);
        return msg.channel.sendEmbed(embed);
      } else {
        return msg.channel.send(`${'```'}404 Cat not found!${'```'}`);
      }
    });
  }
};
