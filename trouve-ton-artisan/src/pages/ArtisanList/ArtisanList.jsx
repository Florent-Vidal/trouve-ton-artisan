import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  fetchArtisansByCategorie,
  fetchCategories,
  searchArtisans,
} from "../../services/api";
import "./ArtisanList.scss";

// role="img" + aria-hidden sur les ★ pour éviter la lecture "étoile noire x5" par les screen readers
function StarRating({ note }) {
  return (
    <div className="stars" role="img" aria-label={"Note : " + note + " sur 5"}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className={
            i <= Math.round(note) ? "star star--full" : "star star--empty"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ArtisanList() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");
  const isSearch = !slug && !!searchQuery;

  const [artisans, setArtisans] = useState([]);
  const [categorie, setCategorie] = useState(null);
  const [error, setError] = useState(null);
  // Identifiant de la vue dont les données sont actuellement à l'écran.
  const [cleAffichee, setCleAffichee] = useState(null);
  const cle = isSearch ? "q:" + searchQuery : "c:" + slug;

  // « En cours de chargement » n'est pas un état à conserver : c'est le constat
  // que les données affichées ne correspondent pas encore à l'URL demandée. Le
  // déduire évite un setState synchrone dans l'effet (cascade de rendus
  // signalée par ESLint) et rend impossible un écran de chargement qui reste
  // affiché parce qu'un setLoading(false) a été oublié dans une branche.
  const loading = cleAffichee !== cle;

  useEffect(() => {
    // Une navigation rapide entre deux catégories lance deux requêtes ; sans ce
    // drapeau, la plus lente écrase la plus récente et l'écran affiche les
    // artisans de la catégorie précédente.
    let obsolete = false;

    const appliquer = (listeArtisans, categorieTrouvee, messageErreur) => {
      if (obsolete) return;
      setArtisans(listeArtisans);
      setCategorie(categorieTrouvee);
      setError(messageErreur);
      setCleAffichee(cle);
    };

    if (isSearch) {
      searchArtisans(searchQuery)
        .then((data) => appliquer(data, null, null))
        .catch(() =>
          appliquer([], null, "Impossible d'effectuer la recherche.")
        );
    } else {
      Promise.all([
        // Le nom de la catégorie n'est qu'un habillage du titre : son échec ne
        // doit pas empêcher l'affichage de la liste.
        fetchCategories().catch(() => []),
        fetchArtisansByCategorie(slug),
      ])
        .then(([cats, data]) =>
          appliquer(
            data,
            cats.find((c) => c.id === parseInt(slug)) || null,
            null
          )
        )
        .catch(() =>
          appliquer([], null, "Impossible de charger les artisans.")
        );
    }

    return () => {
      obsolete = true;
    };
  }, [slug, isSearch, searchQuery, cle]);

  const pageTitle = isSearch
    ? 'Résultats pour "' + searchQuery + '"'
    : categorie
      ? categorie.nom.toUpperCase()
      : "Chargement...";

  const breadcrumbLabel = isSearch
    ? "Recherche"
    : categorie
      ? categorie.nom
      : "Catégorie";

  // Titre dynamique de page (WCAG 2.4.2)
  useEffect(() => {
    if (isSearch && searchQuery) {
      document.title = 'Recherche "' + searchQuery + '" — Trouve ton Artisan';
    } else if (categorie) {
      document.title = categorie.nom + " — Trouve ton Artisan";
    } else {
      document.title = "Artisans — Trouve ton Artisan";
    }
  }, [isSearch, searchQuery, categorie]);

  return (
    <div className="artisan-list">
      <div className="artisan-list__container">
        <nav className="breadcrumb" aria-label="Fil d'Ariane">
          <Link to="/">Accueil</Link>
          <span aria-hidden="true"> → </span>
          <span aria-current="page">{breadcrumbLabel}</span>
        </nav>

        <h1 className="artisan-list__title">{pageTitle}</h1>

        {loading && <p className="artisan-list__loading">Chargement...</p>}
        {error && <p className="artisan-list__error">{error}</p>}

        <div className="artisan-list__grid">
          {artisans.map((a) => (
            <Link
              to={"/artisan/" + a.id}
              key={a.id}
              className="artisan-card"
              aria-label={"Voir la fiche de " + a.nom}
            >
              {/* h3 : h1 = titre page, h2 absent, noms d'artisans au niveau 3 */}
              <h3 className="artisan-card__nom">{a.nom}</h3>
              <StarRating note={a.note} />
              <p className="artisan-card__specialite">
                {a.Specialite ? a.Specialite.nom : ""}
              </p>
              <p className="artisan-card__localisation">
                {a.ville}{a.code_postal ? ", " + a.code_postal : ""}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ArtisanList;
