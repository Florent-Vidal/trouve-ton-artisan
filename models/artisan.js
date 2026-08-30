const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Artisan = sequelize.define(
  "Artisan",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    note: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      defaultValue: 0.0,
      // Une note hors de l'échelle n'a pas de sens : la contrainte vit dans
      // le modèle plutôt que d'être supposée correcte à l'insertion.
      validate: { min: 0, max: 5 },
    },
    ville: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code_postal: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    a_propos: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      // C'est l'adresse à laquelle le formulaire de contact écrit :
      // une valeur mal formée rendrait la fonctionnalité inopérante.
      validate: { isEmail: true },
    },
    site_web: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: { isUrl: true },
    },
    top_artisan: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    id_specialite: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: "artisan",
    timestamps: false,
  },
);

module.exports = Artisan;
