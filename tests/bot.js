const { SelfieClient } = require('../src');
const config = require('./../config.json');
const selfie = new SelfieClient({ suffix: '?', database: 'sqlite://tests.db' });
const winston = require('winston');
const path = require('path');
const { oneLine } = require('common-tags');

selfie.on('ready', () => {
  winston.info(
    oneLine`Client ready; logged in as ${selfie.user.username}#${selfie.user.discriminator}
   (${selfie.user.id}), Serving in ${selfie.guilds.array().length} servers!`
  );
})
.on('disconnect', () => {
  winston.warn('Disconnected!');
})
.on('reconnect', () => {
  winston.warn('Reconnecting...');
})
.on('commandRegister', (cmd, registry) => {
  winston.info(`Registered command (${registry.commands.array().length}) ${cmd.group}:${cmd.name}`);
})
.on('commandReregister', (cmd, old) => {
  winston.info(`Registered command ${old.group}:${old.name} => ${cmd.group}:${cmd.name}`);
})
.on('commandUnregister', cmd => {
  winston.info(`Unregistered command ${cmd.group}:${cmd.name}`);
})
.on('unknownCommand', (cmd, args) => {
  winston.warn(`Unknown Command: ${cmd} => ${args}`);
})
.on('commandBlocked', (cmd, cmdMessage, reason) => {
  winston.warn(`Command Blocked: ${cmd.group}:${cmd.name}, reason: ${reason}, args: ${cmdMessage.args.join(' ')}`);
})
.on('commandError', (cmd, cmdMessage, args, err) => {
  winston.warn(`Command Error: ${cmd.group}:${cmd.name}, ${err.name}: ${err.message} \n ${err.stack}`);
})
.on('message', (m) => {
  if (m.author.id === selfie.user.id && m.guild) {
    winston.info(`${m.guild.name} on #${m.channel.name} => ${m.author.username}:${m.content}`);
  } else if (!m.guild) {
    winston.info(`DM Message => ${m.author.username}>>${m.channel.recipient.username}:${m.content}`);
  }
})
.on('messageUpdate', (m, o) => {
  if (m.author.id === selfie.user.id && m.guild) {
    winston.info(`${m.guild.name} on #${m.channel.name} (edit) => ${m.author.username}:${m.content} >> ${o.content}`);
  } else if (!m.guild) {
    winston.info(`DM Message (edit) => ${m.author.username}>>${m.channel.recipient.username}:${m.content} >> ${o.content}`);
  }
})
// .on('debug', winston.info)
.on('warn', winston.warn)
.on('error', winston.error);

selfie.commands.registerIn(path.join(__dirname, 'commands'));

selfie.database.importFrom(path.join(__dirname, 'models'));

selfie.login(config.token);
