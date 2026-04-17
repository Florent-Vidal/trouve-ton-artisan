const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Categorie = require("./categorie")(sequelize, DataTypes);
const Specialite = require("./specialite")(sequelize, DataTypes);
const Artisan = require("./artisan")(sequelize, DataTypes);

Categorie.hasMany(Specialite);
Specialite.belongsTo(Categorie);
Specialite.hasMany(Artisan);
Artisan.belongsTo(Specialite);

module.exports = { sequelize, Categorie, Specialite, Artisan };
