const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Sequelize } = require("sequelize");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);

app.use(express.json());

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connexion à la base de données réussie !");
    app.listen(PORT, () => {
      console.log(`Le serveur tourne sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion à la base de données :", err);
    process.exit(1);
  });
