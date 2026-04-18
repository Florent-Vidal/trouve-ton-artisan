const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");
const categorieRoutes = require("./routes/categorieRoutes");
const specialiteRoutes = require("./routes/specialiteRoutes");
const artisanRoutes = require("./routes/artisanRoutes");
const contactRoutes = require("./routes/contactRoutes");
const rateLimit = require("express-rate-limit");

const app = express();

const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Trop de requêtes, réessayez plus tard." },
});

app.use(limiter);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);

app.use(express.json());

app.use("/api/categories", categorieRoutes);
app.use("/api/categories", specialiteRoutes);
app.use("/api/artisans", artisanRoutes);
app.use("/api/contact", contactRoutes);

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
