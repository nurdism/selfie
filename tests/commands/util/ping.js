const { Command } = require( '../../../src/index' );

module.exports = class Ping extends Command {
    constructor( client ) {
        super( client, {
            name: 'ping',
            description: 'description',
            arguments: ['[arguments]'],
            examples: `template${client.suffix} [arguments]`,
            guildOnly: false,
        });
    }

    run( msg, args, executor, edited ) {
        msg.delete();
        return msg.channel.sendMessage( 'Ping' ).then( message => {
            return message.edit( `Pong! ( took: ${ message.createdTimestamp - msg.createdTimestamp } ms )` );
        });
    }
};
