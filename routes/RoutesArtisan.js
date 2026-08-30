// @ts-nocheck
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Artisan = require("../models/artisan");
const Categorie = require("../models/categorie");
const Specialite = require("../models/specialite");
const validateContact = require("../middleware/validateContact");
const { limiteurContact } = require("../middleware/rateLimit");
const { escapeHtml, escapeHtmlMultiligne } = require("../utils/escapeHtml");
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// GET /api/artisans/categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Categorie.findAll({ order: [["nom", "ASC"]] });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// GET /api/artisans/top/artisans
router.get("/top/artisans", async (req, res) => {
  try {
    const artisans = await Artisan.findAll({
      where: { top_artisan: 1 },
      include: [{ model: Specialite }],
      limit: 3,
    });
    res.json(artisans);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// GET /api/artisans/categorie/:id
router.get("/categorie/:id", async (req, res) => {
  try {
    const artisans = await Artisan.findAll({
      include: [
        {
          model: Specialite,
          where: { id_categorie: req.params.id },
        },
      ],
    });
    res.json(artisans);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// GET /api/artisans/recherche/:nom
router.get("/recherche/:nom", async (req, res) => {
  try {
    const { Op } = require("sequelize");
    const artisans = await Artisan.findAll({
      where: { nom: { [Op.like]: "%" + req.params.nom + "%" } },
      include: [{ model: Specialite }],
    });
    res.json(artisans);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// POST /api/artisans/:id/contact
// Le limiteur s'exécute en premier : inutile de valider ni d'interroger la
// base pour une requête qui sera de toute façon refusée.
router.post("/:id/contact", limiteurContact, validateContact, async (req, res) => {
  try {
    // Champs déjà validés et nettoyés par le middleware validateContact.
    const { nom, email, objet, message } = req.body;

    const artisan = await Artisan.findByPk(req.params.id);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan non trouvé." });
    }

    await transporter.sendMail({
      // L'expéditeur est une adresse du domaine, contrôlée par le service.
      // Y mettre l'email du visiteur serait une usurpation d'expéditeur, et
      // le message serait rejeté par les contrôles SPF et DKIM.
      from: '"Trouve ton Artisan" <' + process.env.MAIL_USER + ">",
      to: artisan.email,
      // replyTo : un simple « Répondre » écrit directement au visiteur,
      // sans qu'on ait eu besoin d'usurper son adresse.
      replyTo: email,
      subject: objet,
      // Toutes les valeurs venant du visiteur sont échappées avant d'être
      // insérées dans le HTML : sans cela, une saisie contenant du balisage
      // serait interprétée par le client de messagerie de l'artisan.
      html:
        "<p><strong>Message de :</strong> " +
        escapeHtml(nom) +
        " (" +
        escapeHtml(email) +
        ")</p>" +
        "<p><strong>Objet :</strong> " +
        escapeHtml(objet) +
        "</p>" +
        "<hr/>" +
        "<p>" +
        escapeHtmlMultiligne(message) +
        "</p>",
    });

    res.json({ success: true, message: "Email envoyé avec succès." });
  } catch (error) {
    console.error("Erreur envoi email :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'envoi.", error: error.message });
  }
});

// GET /api/artisans/:id
router.get("/:id", async (req, res) => {
  try {
    const artisan = await Artisan.findByPk(req.params.id, {
      include: [{ model: Specialite }],
    });
    if (!artisan)
      return res.status(404).json({ message: "Artisan non trouvé" });
    res.json(artisan);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// GET /api/artisans
router.get("/", async (req, res) => {
  try {
    const artisans = await Artisan.findAll({
      include: [{ model: Specialite }],
    });
    res.json(artisans);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;
