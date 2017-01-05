const Sequelize = require("sequelize");

class Settings {
    constructor( client, database ){

        Object.defineProperty( this, 'database', { value: database } );

        Object.defineProperty( this, 'client', { value: client } );

        this.model = this.database.define( 'settings', {
            client: {
                type: Sequelize.STRING,
                primaryKey: true,
                unique: true
            },
            data: {
                type: Sequelize.STRING,
                allowNull: false,
            }
        });

        this.settings = {};

    }

    init(){
        return this.model.findOne({where: { client: this.client.user.id }}).then( instance => {
            if(instance){
                try {
                  this.settings = JSON.parse(instance.dataValues.data);
                } catch(err) {
                    client.emit('warn', `Unable to parse settings!`);
                }
                if( this.settings.suffix )
                    this.client.suffix = this.settings.suffix;
            }
        });
    }

    set( key, value ){

        if( !this.settings[key] || this.settings[key] != value ){
            if( key == 'suffix' )
                this.client.suffix = value;

            this.settings[key] = value;
            this.model.upsert({ client: this.client.user.id, data: JSON.stringify(this.settings) }, { where: { client: this.client.user.id } });
        }

        return this.settings[key];
    }

    get( key, defValue ){
        return (this.settings[key]) ? this.settings[key] : this.set( key, defValue );
    }

    remove( key ){
        this.settings.delete(guild);
        this.model.destroy({ where: { client: this.client.user.id  } });
    }
}

module.exports = Settings;