class MessageExtension {

  send(content, options) {
    return this.channel.send(content, options);
  }

  sendCode(content, lang, options) {
    return this.channel.send(`${'```'}${lang ? `${lang}\n` : 'js\n'}${content}${'```'}`, options);
  }

  sendEmbed(embed) {
    return this.channel.sendEmbed(embed);
  }

  editEmbed(embed, content) {
    return this.edit(content || '', { embed: embed });
  }

  /**
   * Applies the interface to a class prototype
   * @param {Function} target - The constructor function to apply to the prototype of
   * @private
   */
  static applyToClass(target) {
    for (const prop of [
      'send',
      'sendCode',
      'sendEmbed',
      'editEmbed',
    ]) {
      Object.defineProperty(target.prototype, prop, Object.getOwnPropertyDescriptor(this.prototype, prop));
    }
  }

}

module.exports = MessageExtension;
