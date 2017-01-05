const { RichEmbed } = require('discord.js');
module.exports = {
  version: require('../package.json').version,
  SelfieClient: require('./client'),
  Command: require('./command'),
  RichEmbed,
};
