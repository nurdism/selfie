const { Message } = require('discord.js');

class CommandMessage {
  constructor(message, command = null, args = [], executor = null, edited = false) {
    Object.defineProperty(this, 'client', { value: message.client });

    this.message = message;
    this.command = command;
    this.args = args;
    this.edited = edited;
    this.executor = executor;
  }

  run() {
    let reject = (reason, response, error) => {
      if (reason === 'error') {
        this.client.emit('commandError', this.command, this, this.args, error);
      } else {
        this.client.emit('commandBlocked', this.command, this, reason);
      }

      this.delete().catch();

      let rejected = this.command.onReject(this.channel, reason, error);
      if (rejected instanceof Promise) {
        return rejected.then(retVal => {
          if (retVal instanceof Message) {
            return retVal.delete(10000);
          } else {
            return this.channel.send(response).then(msg => { msg.delete(10000); });
          }
        });
      } else {
        return this.channel.send(response).then(msg => { msg.delete(10000); });
      }
    };

    if (this.command.guildOnly && !this.message.guild) {
      return reject('guildOnly', `The \`${this.command.name}\` command must be used in a server channel.`);
    }

    if (!this.command.hasPermission(this)) {
      return reject('permission', `You do not have permission to use the \`${this.command.name}\` command here.`);
    }

    if (!this.command.canRun(this)) {
      return reject('run', `You can not run \`${this.command.name}\`, requirements not met.`);
    }

    try {
      this.client.emit('debug', `Running command ${this.command.group}:${this.command.name}.`);
      const command = this.command.run(this, this.args, this.executor, this.edited);
      if (command instanceof Promise) {
        return command.catch(err => reject(
            'error',
            `An error occurred while running '${this.command.name}': \`${err.name}: ${err.message}\``,
            err));
      } else {
        return command;
      }
    } catch (err) {
      return reject(
          'error',
          `An error occurred while running '${this.command.name}': \`${err.name}: ${err.message}\``,
          err);
    }
  }


  getUser(search) {
    let user = this.message.mentions.users.first();
    if (!user) {
      if (!search) {
        return this.author;
      } else {
        user = this.client.users.find(u => u.username === search);
        if (user) {
          return user;
        }

        if (this.guild) {
          let member = this.guild.members.find(m => m.displayName === search);
          if (member) {
            return member.user;
          }
        }
      }
    }
    return false;
  }


    /**
     * Shortcut to `this.message.id`
     * @type {string}
     * @see {@link Message#id}
     */
  get id() {
    return this.message.id;
  }

    /**
     * Shortcut to `this.message.content`
     * @type {string}
     * @see {@link Message#content}
     */
  get content() {
    return this.message.content;
  }

/**
 * Shortcut to `this.message.author`
 * @type {User}
 * @see {@link Message#author}
 */
  get author() {
    return this.message.author;
  }

/**
 * Shortcut to `this.message.channel`
 * @type {Channel}
 * @see {@link Message#channel}
 */
  get channel() {
    return this.message.channel;
  }

/**
 * Shortcut to `this.message.guild`
 * @type {?Guild}
 * @see {@link Message#guild}
 */
  get guild() {
    return this.message.guild;
  }

/**
 * Shortcut to `this.message.member`
 * @type {?GuildMember}
 * @see {@link Message#member}
 */
  get member() {
    return this.message.member;
  }

/**
 * Shortcut to `this.message.pinned`
 * @type {boolean}
 * @see {@link Message#pinned}
 */
  get pinned() {
    return this.message.pinned;
  }

/**
 * Shortcut to `this.message.tts`
 * @type {boolean}
 * @see {@link Message#tts}
 */
  get tts() {
    return this.message.tts;
  }

/**
 * Shortcut to `this.message.nonce`
 * @type {string}
 * @see {@link Message#nonce}
 */
  get nonce() {
    return this.message.nonce;
  }

/**
 * Shortcut to `this.message.system`
 * @type {boolean}
 * @see {@link Message#system}
 */
  get system() {
    return this.message.system;
  }

/**
 * Shortcut to `this.message.embeds`
 * @type {MessageEmbed[]}
 * @see {@link Message#embeds}
 */
  get embeds() {
    return this.message.embeds;
  }

/**
 * Shortcut to `this.message.attachments`
 * @type {Collection<string, MessageAttachment>}
 * @see {@link Message#attachments}
 */
  get attachments() {
    return this.message.attachments;
  }

/**
 * Shortcut to `this.message.reactions`
 * @type {Collection<string, MessageReaction>}
 * @see {@link Message#reactions}
 */
  get reactions() {
    return this.message.reactions;
  }

/**
 * Shortcut to `this.message.createdTimestamp`
 * @type {number}
 * @see {@link Message#createdTimestamp}
 */
  get createdTimestamp() {
    return this.message.createdTimestamp;
  }

/**
 * Shortcut to `this.message.createdAt`
 * @type {Date}
 * @see {@link Message#createdAt}
 */
  get createdAt() {
    return this.message.createdAt;
  }

/**
 * Shortcut to `this.message.editedTimestamp`
 * @type {number}
 * @see {@link Message#editedTimestamp}
 */
  get editedTimestamp() {
    return this.message.editedTimestamp;
  }

/**
 * Shortcut to `this.message.editedAt`
 * @type {Date}
 * @see {@link Message#editedAt}
 */
  get editedAt() {
    return this.message.editedAt;
  }

/**
 * Shortcut to `this.message.mentions`
 * @type {Object}
 * @see {@link Message#mentions}
 */
  get mentions() {
    return this.message.mentions;
  }

/**
 * Shortcut to `this.message.webhookID`
 * @type {?string}
 * @see {@link Message#webhookID}
 */
  get webhookID() {
    return this.message.webhookID;
  }

/**
 * Shortcut to `this.message.cleanContent`
 * @type {string}
 * @see {@link Message#cleanContent}
 */
  get cleanContent() {
    return this.message.cleanContent;
  }

/**
 * Shortcut to `this.message.edits`
 * @type {Message[]}
 * @see {@link Message#edits}
 */
  get edits() {
    return this.message.edits;
  }

/**
 * Shortcut to `this.message.editable`
 * @type {boolean}
 * @see {@link Message#editable}
 */
  get editable() {
    return this.message.editable;
  }

/**
 * Shortcut to `this.message.deletable`
 * @type {boolean}
 * @see {@link Message#deletable}
 */
  get deletable() {
    return this.message.deletable;
  }

/**
 * Shortcut to `this.message.pinnable`
 * @type {boolean}
 * @see {@link Message#pinnable}
 */
  get pinnable() {
    return this.message.pinnable;
  }

/**
 * Shortcut to `this.message.isMentioned(data)`
 * @param {GuildChannel|User|Role|string} data - A guild channel, user, or a role, or the ID of any of these
 * @returns {boolean}
 * @see {@link Message#isMentioned}
 */
  isMentioned(data) {
    return this.message.isMentioned(data);
  }

/**
 * Shortcut to `this.message.isMemberMentioned(data)`
 * @param {GuildMember|User} member - Member/user to check for a mention of
 * @returns {boolean}
 * @see {@link Message#isMemberMentioned}
 */
  isMemberMentioned(member) {
    return this.message.isMemberMentioned(member);
  }

/**
 * Shortcut to `this.message.edit(content)`
 * @param {StringResolvable} content - New content for the message
 * @returns {Promise<Message>}
 * @see {@link Message#edit}
 */
  edit(content) {
    return this.message.edit(content);
  }

/**
 * Shortcut to `this.message.editCode(content)`
 * @param {string} lang - Language for the code block
 * @param {StringResolvable} content - New content for the message
 * @returns {Promise<Message>}
 * @see {@link Message#editCode}
 */
  editCode(lang, content) {
    return this.message.editCode(lang, content);
  }

/**
 * Shortcut to `this.message.react()`
 * @param {string|Emoji|ReactionEmoji} emoji - Emoji to react with
 * @returns {Promise<MessageReaction>}
 * @see {@link Message#react}
 */
  react(emoji) {
    return this.message.react(emoji);
  }

/**
 * Shortcut to `this.message.clearReactions()`
 * @returns {Promise<Message>}
 * @see {@link Message#clearReactions}
 */
  clearReactions() {
    return this.message.clearReactions();
  }

/**
 * Shortcut to `this.message.pin()`
 * @returns {Promise<Message>}
 * @see {@link Message#pin}
 */
  pin() {
    return this.message.pin();
  }

/**
 * Shortcut to `this.message.unpin()`
 * @returns {Promise<Message>}
 * @see {@link Message#unpin}
 */
  unpin() {
    return this.message.unpin();
  }

/**
 * Shortcut to `this.message.delete()`
 * @param {number} [timeout=0] - How long to wait to delete the message in milliseconds
 * @returns {Promise<Message>}
 * @see {@link Message#delete}
 */
  delete(timeout) {
    return this.message.delete(timeout);
  }

/**
 * Shortcut to `this.message.fetchWebhook()`
 * @returns {Promise<?Webhook>}
 * @see {@link Message#fetchWebhook}
 */
  fetchWebhook() {
    return this.message.fetchWebhook();
  }

}

module.exports = CommandMessage;
