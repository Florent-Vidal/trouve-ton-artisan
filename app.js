const express = require("express");
const cors = require("cors");

const artisansRouter = require("./routes/RoutesArtisan");
const apiKeyAuth = require("./middleware/auth");
const { limiteurGeneral } = require("./middleware/rateLimit");

const app = express();

// En production, l'application tourne derrière le proxy de Railway : sans ce
// réglage, toutes les requêtes semblent provenir d'une seule adresse IP et la
// limitation de débit deviendrait soit inopérante, soit globale à tous les
// visiteurs. La valeur 1 signifie « un seul proxy de confiance en amont ».
app.set("trust proxy", 1);

app.use(limiteurGeneral);

// CORS restreint aux origines connues : aucun autre site ne peut appeler
// l'API depuis un navigateur.
//
// La liste est lue dans CORS_ORIGINS (valeurs séparées par des virgules)
// plutôt que codée en dur : l'URL du front change à chaque nouveau projet
// Vercel, et une origine oubliée ici bloquerait toute l'application côté
// navigateur sans erreur serveur visible. Le repli couvre le développement.
const originesAutorisees = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({ origin: originesAutorisees }));

app.use(express.json());
app.use(apiKeyAuth);

app.use("/api/artisans", artisansRouter);

// L'application est exportée sans être démarrée : server.js s'occupe de
// l'écoute et de la base, les tests importent app directement.
module.exports = app;
