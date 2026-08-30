require("dotenv").config();

const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3000;

// Le serveur démarre immédiatement : sur Railway, la sonde de santé de la
// plateforme doit obtenir une réponse rapidement, avant même que la
// connexion à la base ne soit établie.
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

// La connexion à la base est vérifiée ensuite, et son échec est journalisé
// explicitement plutôt que de rester silencieux.
sequelize
  .authenticate()
  .then(() => {
    console.log("Connexion à la base de données réussie.");
  })
  .catch((err) => {
    console.error("Erreur de connexion à la base de données :", err.message);
  });
