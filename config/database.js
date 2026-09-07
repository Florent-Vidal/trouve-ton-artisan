const { Sequelize } = require("sequelize");
require("dotenv").config();

if (!process.env.DB_PASSWORD) {
  console.error("DB_PASSWORD manquant dans le fichier .env");
  process.exit(1);
}

const sequelize = new Sequelize(
  process.env.DB_NAME || "",
  process.env.DB_USER || "",
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    dialect: "mysql",
    logging: false,
  },
);

module.exports = sequelize;
