require("dotenv").config();
const sequelize = require("./config/database");
const { Categorie, Specialite, Artisan } = require("./models");

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });

    await Categorie.bulkCreate([
      { nom: "Alimentation" },
      { nom: "Bâtiment" },
      { nom: "Fabrication" },
      { nom: "Services" },
    ]);

    await Specialite.bulkCreate([
      { nom: "Boucher", categorieId: 1 },
      { nom: "Boulanger", categorieId: 1 },
      { nom: "Chocolatier", categorieId: 1 },
      { nom: "Traiteur", categorieId: 1 },
      { nom: "Chauffagiste", categorieId: 2 },
      { nom: "Electricien", categorieId: 2 },
      { nom: "Menuisier", categorieId: 2 },
      { nom: "Plombier", categorieId: 2 },
      { nom: "Bijoutier", categorieId: 3 },
      { nom: "Couturier", categorieId: 3 },
      { nom: "Ferronier", categorieId: 3 },
      { nom: "Coiffeur", categorieId: 4 },
      { nom: "Fleuriste", categorieId: 4 },
      { nom: "Toiletteur", categorieId: 4 },
      { nom: "Webdesign", categorieId: 4 },
    ]);

    await Artisan.bulkCreate([
      // Alimentation
      {
        nom: "Boucherie Dumont",
        note: 4.5,
        ville: "Lyon",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "boucherie.dumond@gmail.com",
        site_web: null,
        top_artisan: false,
        specialiteId: 1,
      },
      {
        nom: "Au pain chaud",
        note: 4.8,
        ville: "Montélimar",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "aupainchaud@hotmail.com",
        site_web: null,
        top_artisan: true,
        specialiteId: 2,
      },
      {
        nom: "Chocolaterie Labbé",
        note: 4.9,
        ville: "Lyon",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "chocolaterie-labbe@gmail.com",
        site_web: "https://chocolaterie-labbe.fr",
        top_artisan: true,
        specialiteId: 3,
      },
      {
        nom: "Traiteur Truchon",
        note: 4.1,
        ville: "Lyon",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "contact@truchon-traiteur.fr",
        site_web: "https://truchon-traiteur.fr",
        top_artisan: false,
        specialiteId: 4,
      },

      // Bâtiment
      {
        nom: "Orville Salmons",
        note: 5.0,
        ville: "Evian",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "o-salmons@live.com",
        site_web: null,
        top_artisan: true,
        specialiteId: 5,
      },
      {
        nom: "Mont Blanc Éléctricité",
        note: 4.5,
        ville: "Chamonix",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "contact@mont-blanc-electricite.com",
        site_web: "https://mont-blanc-electricite.com",
        top_artisan: false,
        specialiteId: 6,
      },
      {
        nom: "Boutot & fils",
        note: 4.7,
        ville: "Bourg-en-Bresse",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "boutot-menuiserie@gmail.com",
        site_web: "https://boutot-menuiserie.com",
        top_artisan: false,
        specialiteId: 7,
      },
      {
        nom: "Vallis Bellemare",
        note: 4.0,
        ville: "Vienne",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "v.bellemare@gmail.com",
        site_web: "https://plomberie-bellemare.com",
        top_artisan: false,
        specialiteId: 8,
      },

      // Services
      {
        nom: "Royden Charbonneau",
        note: 3.8,
        ville: "Saint-Priest",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "r.charbonneau@gmail.com",
        site_web: null,
        top_artisan: false,
        specialiteId: 12,
      },
      {
        nom: "Leala Dennis",
        note: 3.8,
        ville: "Chambéry",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "l.dennos@hotmail.fr",
        site_web: "https://coiffure-leala-chambery.fr",
        top_artisan: false,
        specialiteId: 12,
      },
      {
        nom: "C'est sup'hair",
        note: 4.1,
        ville: "Romans-sur-Isère",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "sup-hair@gmail.com",
        site_web: "https://sup-hair.fr",
        top_artisan: false,
        specialiteId: 12,
      },
      {
        nom: "Le monde des fleurs",
        note: 4.6,
        ville: "Annonay",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "contact@le-monde-des-fleurs-annonay.fr",
        site_web: "https://le-monde-des-fleurs-annonay.fr",
        top_artisan: false,
        specialiteId: 13,
      },
      {
        nom: "Valérie Laderoute",
        note: 4.5,
        ville: "Valence",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "v-laredoute@gmail.com",
        site_web: null,
        top_artisan: false,
        specialiteId: 14,
      },
      {
        nom: "CM Graphisme",
        note: 4.4,
        ville: "Valence",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "contact@cm-graphisme.com",
        site_web: "https://cm-graphisme.com",
        top_artisan: false,
        specialiteId: 15,
      },

      // Fabrication
      {
        nom: "Claude Quinn",
        note: 4.2,
        ville: "Aix-les-Bains",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "claude.quinn@gmail.com",
        site_web: null,
        top_artisan: false,
        specialiteId: 9,
      },
      {
        nom: "Amitee Lécuyer",
        note: 4.5,
        ville: "Annecy",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "a.amitee@hotmail.com",
        site_web: "https://lecuyer-couture.com",
        top_artisan: false,
        specialiteId: 10,
      },
      {
        nom: "Ernest Carignan",
        note: 5.0,
        ville: "Le Puy-en-Velay",
        a_propos:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin.",
        email: "e-carigan@hotmail.com",
        site_web: null,
        top_artisan: false,
        specialiteId: 11,
      },
    ]);

    console.log("Base de données remplie avec succès !");
    process.exit(0);
  } catch (error) {
    console.error("Erreur lors du remplissage :", error);
    process.exit(1);
  }
};

seedDatabase();
