const rateLimit = require("express-rate-limit");

/**
 * Limitation du débit des requêtes.
 *
 * Deux limiteurs plutôt qu'un seul : la consultation de l'annuaire et l'envoi
 * d'un message n'ont ni le même coût ni le même risque. Naviguer entre les
 * catégories déclenche légitimement beaucoup de requêtes ; envoyer cinquante
 * messages en une heure à des artisans réels, non.
 */

// Limiteur général : protège l'API d'un usage automatisé massif.
const limiteurGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // fenêtre de 15 minutes
  limit: 100, // par adresse IP et par fenêtre
  standardHeaders: "draft-7", // en-têtes RateLimit-* normalisés
  legacyHeaders: false,
  message: { message: "Trop de requêtes, réessayez plus tard." },
});

// Limiteur strict sur le formulaire de contact : chaque requête acceptée
// envoie un email réel à un artisan. Sans cette limite, l'endpoint est un
// relais de spam ouvert, utilisable depuis notre propre infrastructure.
const limiteurContact = rateLimit({
  windowMs: 60 * 60 * 1000, // fenêtre d'une heure
  limit: 5, // 5 messages par IP et par heure
  standardHeaders: "draft-7",
  legacyHeaders: false,
  // Seuls les envois réussis sont décomptés. Le jeu d'essai a montré que sans
  // cette option, cinq saisies invalides d'affilée (un email mal tapé, un
  // message trop long) épuisaient le quota et bloquaient une heure un visiteur
  // qui n'avait encore rien envoyé. Le risque est couvert par ailleurs : une
  // requête rejetée n'envoie aucun email, et le limiteur général (100 requêtes
  // par quart d'heure) reste opposable à un client qui inonderait la route.
  skipFailedRequests: true,
  message: {
    message:
      "Vous avez envoyé trop de messages. Réessayez dans une heure.",
  },
});

module.exports = { limiteurGeneral, limiteurContact };
