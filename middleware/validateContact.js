/**
 * Validation des données du formulaire de contact, côté serveur.
 *
 * Le formulaire React marque déjà ses champs comme obligatoires, mais cette
 * contrainte ne vit que dans le navigateur : un appel direct à l'API la
 * contourne entièrement. La validation serveur est la seule qui protège.
 */
const MAX_NOM = 100;
const MAX_OBJET = 150;
const MAX_MESSAGE = 5000;

// Vérification volontairement simple : elle écarte les saisies manifestement
// invalides sans prétendre valider la RFC 5322, ce qu'aucune expression
// régulière ne fait correctement.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateContact = (req, res, next) => {
  const { nom, email, objet, message } = req.body ?? {};
  const erreurs = [];

  if (typeof nom !== "string" || nom.trim() === "") {
    erreurs.push("Le nom est obligatoire.");
  } else if (nom.length > MAX_NOM) {
    erreurs.push(`Le nom ne peut pas dépasser ${MAX_NOM} caractères.`);
  }

  if (typeof email !== "string" || !EMAIL.test(email.trim())) {
    erreurs.push("L'adresse email n'est pas valide.");
  }

  if (typeof objet !== "string" || objet.trim() === "") {
    erreurs.push("L'objet est obligatoire.");
  } else if (objet.length > MAX_OBJET) {
    erreurs.push(`L'objet ne peut pas dépasser ${MAX_OBJET} caractères.`);
  }

  if (typeof message !== "string" || message.trim() === "") {
    erreurs.push("Le message est obligatoire.");
  } else if (message.length > MAX_MESSAGE) {
    erreurs.push(`Le message ne peut pas dépasser ${MAX_MESSAGE} caractères.`);
  }

  if (erreurs.length > 0) {
    return res
      .status(400)
      .json({ message: "Données invalides.", details: erreurs });
  }

  // Le contrôleur ne travaillera que sur des valeurs déjà validées et nettoyées.
  req.body = {
    nom: nom.trim(),
    email: email.trim(),
    objet: objet.trim(),
    message: message.trim(),
  };

  next();
};

module.exports = validateContact;
