module.exports = function( database, DataTypes ) {
    return database.define("cats", {
        name: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
};
