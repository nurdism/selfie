const { Command } = require( '../../../src/index' );
const { inspect } = require('util');
module.exports = class CommandTable extends Command {
    constructor( client ) {
        super( client, {
            name: 'commands',
            description: 'description',
            arguments: ['[arguments]'],
            examples: `template${client.suffix} [arguments]`,
            guildOnly: false,
        });
    }

    hasPermission( msg ){
        return true;
    }

    canRun( msg ){
        return true;
    }

    run( msg, args, executor, edited ) {
        return msg.channel.send(`${'```'}${inspect( this.client.registry.commandTable, { depth: 2, showHidden: true } ) }${'```'}`);
    }

    onReject( channel, reason, error ){
        switch ( reason ) {
            case 'guildOnly': return channel.sendMessage(`Guild Only Command`); break;
            case 'permission': return channel.sendMessage(`No Permission to run`); break;
            case 'run': return channel.sendMessage(`Can't run, missing requirement...`); break;
            case 'error': return channel.sendMessage(`\`${error.name}: ${error.message}\``); break;
        }
    }

};