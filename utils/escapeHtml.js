/**
 * Échappe les caractères qui ont une signification en HTML.
 *
 * Le message de contact est du texte saisi librement par un visiteur, puis
 * inséré dans un email au format HTML. Sans échappement, une saisie comme
 * <script>…</script> ou <img src=x onerror=…> serait interprétée comme du
 * balisage par le client de messagerie de l'artisan : c'est un XSS stocké.
 *
 * On échappe plutôt que d'assainir : le message est du texte brut, il n'a
 * aucune raison de contenir du HTML légitime. Une bibliothèque comme `xss`
 * sert à nettoyer du HTML riche que l'on souhaite conserver ; ce n'est pas
 * le besoin ici, et l'échappement est plus strict.
 */
const ENTITES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const escapeHtml = (valeur) =>
  String(valeur ?? "").replace(/[&<>"']/g, (c) => ENTITES[c]);

/**
 * Échappe le texte puis convertit les sauts de ligne en <br>.
 * L'ordre est essentiel : échapper d'abord, injecter le <br> ensuite, sinon
 * le <br> lui-même serait échappé et s'afficherait littéralement.
 */
const escapeHtmlMultiligne = (valeur) =>
  escapeHtml(valeur).replace(/\r?\n/g, "<br>");

module.exports = { escapeHtml, escapeHtmlMultiligne };
