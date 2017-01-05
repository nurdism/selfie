const { Command } = require( '../../../src/index' );

module.exports = class Template extends Command {
    constructor( client ) {
        super( client, {
            name: 'template',
            aliases: [ 'temp' ],
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
        return msg.channel.send('Tempalte!');
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