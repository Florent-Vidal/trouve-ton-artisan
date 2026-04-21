# Trouve Ton Artisan — Back-End

 Cette API permet aux utilisateurs de rechercher des artisans par catégorie, spécialité ou nom, de consulter leur fiche détaillée et de les contacter par email.

## Stack technique

- **Back-End** : Node.js, Express
- **ORM** : Sequelize
- **Base de données** : MySQL
- **Email** : Nodemailer (Mailtrap en développement)
- **Sécurité** : express-rate-limit, xss, cors

## Installation

```bash
# Cloner le repo
git clone https://github.com/Florent-Vidal/trouve-ton-artisan.git
cd trouve-ton-artisan

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Remplir le .env avec vos identifiants

# Créer la base de données MySQL
# Créer une base "trouve-ton-artisan" dans MySQL Workbench

# Remplir la base avec les données initiales
node server/seed.js

# Lancer le serveur
node server/server.js
```

Le serveur tourne sur `http://localhost:3000`.

## Endpoints de l'API

### Catégories

| Méthode | URL                               | Description                              |
| ------- | --------------------------------- | ---------------------------------------- |
| GET     | `/api/categories`                 | Récupère toutes les catégories           |
| GET     | `/api/categories/:id/specialites` | Récupère les spécialités d'une catégorie |

### Artisans

| Méthode | URL                              | Description                    |
| ------- | -------------------------------- | ------------------------------ |
| GET     | `/api/artisans/top`              | Récupère les artisans du mois  |
| GET     | `/api/artisans/search?nom=terme` | Recherche un artisan par nom   |
| GET     | `/api/artisans/:id`              | Récupère un artisan par son id |

### Contact

| Méthode | URL            | Description                |
| ------- | -------------- | -------------------------- |
| POST    | `/api/contact` | Envoie un email de contact |

Le body du POST `/api/contact` attend :

```json
{
  "nom": "Nom de l'utilisateur",
  "email": "email@exemple.com",
  "message": "Votre message"
}
```

## Structure du projet

Architecture MVC (Modèle - Vue - Controller)

```
trouve-ton-artisan/
├── server/
│   ├── config/
│   │   └── database.js        # Connexion Sequelize à MySQL
│   ├── controllers/
│   │   ├── artisanController.js    # Logique métier artisans + contact
│   │   ├── categorieController.js  # Logique métier catégories
│   │   └── specialiteController.js # Logique métier spécialités
│   ├── models/
│   │   ├── artisan.js         # Modèle Artisan
│   │   ├── categorie.js       # Modèle Categorie
│   │   ├── specialite.js      # Modèle Specialite
│   │   └── index.js           # Associations entre modèles
│   ├── routes/
│   │   ├── artisanRoutes.js   # Routes artisans
│   │   ├── categorieRoutes.js # Routes catégories
│   │   ├── contactRoutes.js   # Route contact
│   │   └── specialiteRoutes.js # Routes spécialités
│   ├── seed.js                # Script de remplissage de la BDD
│   └── server.js              # Point d'entrée du serveur
├── .env.example               # Variables d'environnement (template)
├── .gitignore
└── README.md
```

## Variables d'environnement

```
DB_NAME=trouve-ton-artisan
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
PORT=3000
CORS_ORIGIN=http://localhost:5173
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
```

## Sécurité

- **Rate Limiting** : Limite à 100 requêtes par IP toutes les 15 minutes
- **Protection XSS** : Nettoyage des données utilisateur dans le formulaire de contact
- **CORS** : Origines autorisées configurées via le .env
