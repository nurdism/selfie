class Command {
    constructor( client, options ){
        if(typeof options !== 'object') throw new TypeError('Command info must be an Object.');
        if(typeof options.name !== 'string') throw new TypeError('Command name must be a string.');
        if(options.name !== options.name.toLowerCase()) throw new Error('Command name must be lowercase.');
        if(options.aliases && (!Array.isArray(options.aliases) || options.aliases.some(ali => typeof ali !== 'string'))) {
            throw new TypeError('Command aliases must be an Array of strings.');
        }
        if(options.arguments && (!Array.isArray(options.arguments) || options.arguments.some(ali => typeof ali !== 'string'))) {
            throw new TypeError('Command arguments must be an Array of strings.');
        }
        if(options.aliases && options.aliases.some(ali => ali !== ali.toLowerCase())) {
            throw new Error('Command aliases must be lowercase.');
        }

        Object.defineProperty( this, 'client', { value: client } );

        Object.defineProperty( this, 'settings', { value: client.settings } );

        Object.defineProperty( this, 'database', { value: client.database } );

        this.aliases = options.aliases || [];
        this.guildOnly = options.guildOnly || false;

        this.name = options.name;
        this.description = options.description || 'No description available.';
        this.arguments = options.arguments || ['No arguments set.'];
        this.examples = options.examples || 'No examples available.';
    }

    hasPermission( msg ){
        return true;
    }

    canRun( msg ){
        return true;
    }

    run( msg, args, executor, edited ) {
        return msg;
    }

    onReject( channel, reason, error ){

    }
}

module.exports = Command;