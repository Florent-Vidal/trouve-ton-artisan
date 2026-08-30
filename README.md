# Trouve ton artisan

Application web permettant aux particuliers de la région Auvergne-Rhône-Alpes de
trouver un artisan par catégorie ou par nom, de consulter sa fiche détaillée et
de le contacter directement par email — sans inscription ni intermédiaire.

Architecture client/serveur découplée : un client React consomme une API REST
Node.js/Express adossée à une base de données MySQL pilotée par Sequelize.

Projet réalisé dans le cadre du Titre Professionnel Développeur Web et Web
Mobile, à partir d'un cahier des charges imposant la charte graphique
institutionnelle de la Région.

---

## Fonctionnalités

| Écran | Route | Description |
| --- | --- | --- |
| Accueil | `/` | Les quatre étapes du parcours et les trois artisans du mois |
| Liste | `/categorie/:id` | Les artisans d'une catégorie |
| Recherche | `/recherche?q=` | Résultats de la recherche par nom |
| Fiche artisan | `/artisan/:id` | Détail et formulaire de contact |
| Pages légales | `/mentions-legales`, `/donnees-personnelles`, `/accessibilite`, `/cookies` | Quatre pages servies par un composant unique |
| 404 | `*` | Toute URL inconnue |

La recherche propose des suggestions à partir de deux caractères, avec un
anti-rebond de 300 ms et fermeture au clic extérieur.

Le jeu de données initial comporte 4 catégories et 15 spécialités.

---

## Accessibilité

Le projet a fait l'objet d'un cycle dédié à la conformité **WCAG 2.0 niveau AA**,
sanctionné par une validation du balisage auprès du W3C.

- Lien d'évitement en tête de document, masqué hors focus
- Contour de focus de 3 px sur `:focus-visible` — visible au clavier, masqué au clic
- Rôles et libellés explicites : `role="banner"`, `role="search"`, `role="listbox"`
- Fil d'Ariane avec `aria-current="page"`
- Titre du document mis à jour à chaque changement de page (critère 2.4.2)
- Mention « s'ouvre dans un nouvel onglet » sur les liens externes
- Étoiles de notation décoratives (`aria-hidden`), la note étant fournie
  textuellement par un `aria-label` sur le conteneur

Les ratios de contraste de la charte imposée ont été mesurés : tous satisfont le
seuil AA de 4,5:1 (texte 10,41:1 sur blanc, fil d'Ariane 7,00:1, lien 4,86:1).

---

## Stack technique

**Front-end** — React 19, Vite, React Router 7, Sass (SCSS)

**Back-end** — Node.js 22, Express 5, Sequelize 6, MySQL, Nodemailer

**Sécurité** — authentification par clé API, `express-rate-limit`, CORS restreint,
échappement HTML des contenus transmis par email

**Tests** — Jest, Supertest

---

## Prérequis

- Node.js 22 ou supérieur
- Un serveur MySQL démarré
- Un compte SMTP de test (Mailtrap) pour l'envoi d'email en développement

---

## Installation

```bash
git clone https://github.com/Florent-Vidal/trouve-ton-artisan.git
cd trouve-ton-artisan
```

### API

```bash
npm install

cp .env.example .env
# puis renseigner les valeurs dans .env

# Créer le schéma puis injecter le jeu de données
mysql -u root -p < 01_create_database.sql
mysql -u root -p < 02_seed_database.sql

npm start
```

L'API écoute sur `http://localhost:3000`. Deux lignes doivent s'afficher :
`Serveur lancé sur le port 3000`, puis `Connexion à la base de données réussie.`

### Client

Dans un second terminal :

```bash
cd trouve-ton-artisan
npm install
cp .env.example .env   # renseigner VITE_API_URL et VITE_API_KEY
npm run dev
```

Le client est servi sur `http://localhost:5173`.

### Migrations

`01_create_database.sql` crée le schéma complet et convient à toute nouvelle
installation. Les bases créées avant l'ajout du code postal doivent appliquer :

```bash
mysql -u root -p < 03_migration_code_postal.sql
```

---

## Variables d'environnement

### API — `.env` à la racine

| Variable | Rôle |
| --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Connexion MySQL |
| `PORT` | Port d'écoute de l'API (3000 par défaut) |
| `API_KEY` | Clé attendue dans l'en-tête `x-api-key` de chaque requête |
| `CORS_ORIGINS` | Origines autorisées, séparées par des virgules |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS` | Serveur SMTP |

### Client — `trouve-ton-artisan/.env`

| Variable | Rôle |
| --- | --- |
| `VITE_API_URL` | URL de base de l'API, **terminée par `/api`** |
| `VITE_API_KEY` | Clé API, identique à `API_KEY` côté serveur |

Aucun de ces fichiers n'est versionné : `.env.example` documente les clés
attendues sans en livrer les valeurs.

> Les variables `VITE_*` sont intégrées au build, pas lues à l'exécution :
> toute modification impose de reconstruire le client.

---

## API

Toutes les routes sont préfixées par `/api/artisans` et exigent l'en-tête
`x-api-key`. Sans clé, l'API répond `401` ; avec une clé invalide, `403`.

| Méthode | Route | Description |
| --- | --- | --- |
| `GET` | `/categories` | Les catégories, triées alphabétiquement |
| `GET` | `/top/artisans` | Les trois artisans du mois |
| `GET` | `/categorie/:id` | Artisans d'une catégorie, via jointure sur la spécialité |
| `GET` | `/recherche/:nom` | Recherche par correspondance partielle |
| `GET` | `/:id` | Fiche d'un artisan et sa spécialité |
| `GET` | `/` | Liste complète |
| `POST` | `/:id/contact` | Envoi d'un message à l'artisan |

> Dans `routes/RoutesArtisan.js`, `/recherche/:nom` et `/top/artisans` sont
> déclarées **avant** `/:id`. Express teste les routes dans l'ordre : sans cette
> précaution, `/api/artisans/recherche` correspondrait au motif `/:id`.

Corps attendu par `POST /:id/contact` :

```json
{
  "nom": "Claire Martin",
  "email": "claire@exemple.fr",
  "objet": "Demande de devis",
  "message": "Bonjour, je souhaiterais un devis."
}
```

Les quatre champs sont obligatoires et validés côté serveur. Réponses possibles :
`200` en cas de succès, `400` si la validation échoue (le corps détaille les
erreurs), `404` si l'artisan n'existe pas, `429` au-delà de cinq messages par
heure, `500` en cas d'échec de l'envoi.

---

## Modèle de données

```
CATEGORIE (id, nom)
     │ 1,n  « contient »
     ▼ 1,1
SPECIALITE (id, nom, id_categorie)
     │ 0,n  « regroupe »
     ▼ 1,1
ARTISAN (id, nom, note, ville, code_postal, a_propos,
         email, site_web, top_artisan, id_specialite)
```

Une catégorie contient une ou plusieurs spécialités ; une spécialité appartient à
une seule catégorie. Une spécialité regroupe zéro ou plusieurs artisans ; un
artisan n'exerce qu'une seule spécialité — cette cardinalité justifie une clé
étrangère plutôt qu'une table d'association.

Les associations sont déclarées dans `models/index.js`. Les identifiants sont de
type `INT UNSIGNED`, la note en `DECIMAL(2,1)` afin d'éviter les erreurs
d'arrondi d'un flottant.

---

## Structure du projet

```
trouve-ton-artisan/                  racine — API
├── config/database.js               connexion Sequelize à MySQL
├── models/                          categorie, specialite, artisan, index
├── routes/RoutesArtisan.js          six routes REST
├── middleware/
│   ├── auth.js                      vérification de la clé API
│   ├── validateContact.js           validation serveur du formulaire
│   └── rateLimit.js                 limiteurs général et contact
├── utils/escapeHtml.js              échappement HTML des emails
├── tests/                           tests unitaires et d'intégration
├── app.js                           construit l'application Express
├── server.js                        écoute et connexion à la base
├── 01_create_database.sql           schéma
├── 02_seed_database.sql             jeu de données
├── 03_migration_code_postal.sql     migration incrémentale
└── trouve-ton-artisan/              client React
    ├── src/components/              Header, Footer (JSX + SCSS)
    ├── src/pages/                   Home, ArtisanList, ArtisanDetail,
    │                                Legal, NotFound
    ├── src/services/api.js          appels HTTP centralisés
    ├── src/styles/main.scss         charte et styles globaux
    └── vercel.json                  réécriture des routes SPA
```

`app.js` construit l'application sans la démarrer ; `server.js` la met en écoute
et vérifie la connexion à la base. Cette séparation permet aux tests d'importer
l'application sans ouvrir de port.

Chaque composant et chaque page possède son propre fichier `.scss` aux côtés de
son fichier `.jsx`.

---

## Sécurité

| Mesure | Mise en œuvre |
| --- | --- |
| Authentification | Clé API vérifiée sur chaque requête par un middleware global |
| Injection SQL | Tous les accès passent par Sequelize, qui transmet les valeurs comme paramètres liés |
| XSS | Échappement systématique des saisies avant insertion dans le corps HTML de l'email |
| Validation | Présence, type, format d'email et longueurs maximales, côté serveur |
| Abus de service | 100 requêtes par IP toutes les 15 min ; 5 messages par heure sur le formulaire |
| CORS | Origines déclarées en variable d'environnement |
| Proxy | `trust proxy` réglé pour que la limitation de débit fonctionne derrière un proxy |
| Secrets | Aucun identifiant dans le code source ; `.env` non versionné |

### Limite assumée

La clé API est intégrée au client au moment du build : elle est donc lisible par
tout visiteur qui inspecte les fichiers téléchargés. Une clé embarquée dans une
application monopage publique n'est jamais un secret. Elle écarte les appels
automatisés opportunistes, mais la protection effective de l'API repose sur la
restriction des origines CORS et sur la limitation de débit.

### Pistes d'amélioration

- Ajouter `helmet` pour les en-têtes de sécurité HTTP
- Utiliser une base de test dédiée, distincte de la base de développement
- Étendre la couverture de tests aux routes catégories et spécialités
- Exécuter la suite de tests automatiquement à chaque pull request

---

## Tests

```bash
npm run test:unit    # tests unitaires — aucune base nécessaire
npm test             # suite complète — MySQL démarré et base initialisée
```

Les tests unitaires couvrent le middleware de validation et la fonction
d'échappement HTML, en isolation. Les tests d'intégration appellent l'API réelle :
refus sans clé, refus avec clé invalide, lecture des catégories, résistance à une
tentative d'injection SQL, `404` sur un identifiant inexistant et `400` sur un
formulaire vide.

---

## Scripts disponibles

### API

| Script | Effet |
| --- | --- |
| `npm start` | Démarre l'API |
| `npm run dev` | Démarre l'API avec rechargement automatique (nodemon) |
| `npm test` | Suite de tests complète |
| `npm run test:unit` | Tests unitaires uniquement |

### Client

| Script | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement Vite |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualise le build |
| `npm run lint` | ESLint |

---

## Déploiement

L'application a été déployée en production : le client sur **Vercel**, l'API et la
base MySQL sur **Railway**, avec déploiement automatique à chaque push sur la
branche principale.

- Vercel : répertoire racine `trouve-ton-artisan`, build `vite build`,
  réécriture des routes SPA via `vercel.json`
- Railway : commande de démarrage `node server.js`, variables d'environnement
  saisies dans l'interface de la plateforme

Le service d'API est actuellement en sommeil, le crédit d'essai de la plateforme
étant épuisé. La remise en service consiste à recréer le service, y réinjecter
les variables et exécuter les deux scripts SQL.

---

## Auteur

**Florent Vidal** — Titre Professionnel Développeur Web et Web Mobile,
Centre Européen de Formation.
