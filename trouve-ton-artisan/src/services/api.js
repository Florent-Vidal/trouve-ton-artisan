const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const API_KEY = import.meta.env.VITE_API_KEY || "";

async function apiFetch(endpoint, options = {}) {
  const response = await fetch(BASE_URL + endpoint, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    // L'API renvoie un message explicite : quota d'envois dépassé, champ
    // invalide, artisan introuvable. Le jeter ici obligerait l'interface à
    // afficher « une erreur est survenue » là où le serveur savait dire quoi.
    let corps = null;
    try {
      corps = await response.json();
    } catch {
      // Réponse sans corps JSON (502 d'un proxy, coupure réseau) : on garde
      // le code HTTP comme seule information disponible.
    }
    const erreur = new Error(corps?.message || "Erreur " + response.status);
    erreur.statut = response.status;
    erreur.details = corps?.details || null;
    throw erreur;
  }
  return response.json();
}

export const fetchCategories = () => apiFetch("/artisans/categories");
export const fetchArtisansDuMois = () => apiFetch("/artisans/top/artisans");
export const fetchArtisansByCategorie = (id) =>
  apiFetch("/artisans/categorie/" + id);
export const searchArtisans = (nom) =>
  apiFetch("/artisans/recherche/" + encodeURIComponent(nom));
export const fetchArtisan = (id) => apiFetch("/artisans/" + id);
export const sendContactForm = (artisanId, data) =>
  apiFetch("/artisans/" + artisanId + "/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
