const { Collection } = require('discord.js');
const   Sequelize    = require('sequelize');
const   path         = require("path");
const   fs           = require("fs");

class Database {
    constructor( options ){
        this.sequelize = new Sequelize(options);
        this.models = new Collection();
    }

    get db() {
        return this.sequelize;
    }

    define( name, options ) {
        if(!this.models.get(name)){
            let model = this.sequelize.define( name, options );
            this.models.set( model.name, model );
            return model;
        }else{
            throw new Error(`Model with name '${name}' already exist!`);
        }
    }

    model(name) {
        return this.models.get(name);
    }

    import( file ) {
        let model = this.sequelize.import( file );
        if(!this.models.get( model ) ){
            this.models.set( model.name, model );
            return model;
        }else{
            throw new Error(`Model with name '${name}' already exist!`);
        }
    }

    importFrom( folder ) {
        fs.readdirSync( folder ).filter( file => { return ( file.indexOf(".") !== 0) } ).forEach( file => { this.import( path.join( folder, file ) ) } );
    }

    sync() {
        return this.sequelize.sync()
    }

    start() {
        return this.sync().then( () => {
            return this.sequelize
        });
    }

}

module.exports = Database;