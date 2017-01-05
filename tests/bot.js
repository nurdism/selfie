const { SelfieClient } = require('../src');
const config = require('./../config.json');
const selfie = new SelfieClient( { suffix: "?", database: "sqlite://tests.db" } );
const path = require('path');

selfie.on( 'ready',             () => { console.info(`Client ready; logged in as ${ selfie.user.username }#${ selfie.user.discriminator } (${ selfie.user.id }), Serving in ${ selfie.guilds.array().length } servers!`); })
      .on( 'disconnect',        () => { console.warn( 'Disconnected!' ) })
      .on( 'reconnect',         () => { console.warn( 'Reconnecting...' ) })
      .on( 'commandRegister',   ( cmd, registry ) => { console.info( `Registered command ${cmd.group}:${cmd.name}`) })
      .on( 'unknownCommand',    ( cmd, args ) => { console.warn( `Unknown Command: ${cmd}` ) })
      .on( 'commandBlocked',    ( cmd, cmdMessage, reason ) => { console.warn( `Command Blocked: ${cmd.group}:${cmd.name}, reason: ${reason}, args: ${cmdMessage.args.join( ' ' )}` ) })
      .on( 'commandError',      ( cmd, cmdMessage, args, err ) => { console.warn( `Command Error: ${cmd.group}:${cmd.name}, ${err.name}: ${err.message} \n ${err.stack}` )  })
      .on( 'message',           ( m ) => { if( m.author.id == selfie.user.id ) console.log( `${m.guild.name} on #${m.channel.name} => ${m.author.username}:${m.content}` )  })
      .on( 'messageUpdate',     ( m, o ) => { if( m.author.id == selfie.user.id ) console.log( `${o.guild.name} on #${o.channel.name} (edit) => ${o.author.username}:${o.content}` ) })
      //.on( 'debug',  console.info )
      .on( 'warn',   console.warn )
      .on( 'error',  console.error );


selfie.registry.registerCommandsIn( path.join( __dirname, 'commands' ) );

selfie.database.importFrom( path.join( __dirname, 'models' ) );

selfie.login(config.token);