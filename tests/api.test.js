require("dotenv").config();

const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");

/**
 * Tests d'intégration : ils appellent l'application réelle et interrogent la
 * base. MySQL doit être accessible et la variable API_KEY renseignée.
 */
const CLE = process.env.API_KEY;

afterAll(async () => {
  // Sans cette fermeture, Jest ne rend jamais la main : la connexion reste ouverte.
  await sequelize.close();
});

describe("Authentification par clé API", () => {
  it("refuse une requête sans clé avec un code 401", async () => {
    const res = await request(app).get("/api/artisans/categories");
    expect(res.status).toBe(401);
  });

  it("refuse une clé invalide avec un code 403", async () => {
    const res = await request(app)
      .get("/api/artisans/categories")
      .set("x-api-key", "cle-manifestement-fausse");
    expect(res.status).toBe(403);
  });
});

describe("GET /api/artisans/categories", () => {
  it("retourne les catégories avec une clé valide", async () => {
    const res = await request(app)
      .get("/api/artisans/categories")
      .set("x-api-key", CLE);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /api/artisans/recherche/:nom", () => {
  it("ne renvoie rien sur une tentative d'injection SQL, et la base reste intacte", async () => {
    const injection = encodeURIComponent("' OR 1=1 --");
    const res = await request(app)
      .get(`/api/artisans/recherche/${injection}`)
      .set("x-api-key", CLE);

    // Sequelize transmet la valeur au SGBD comme paramètre lié : la chaîne
    // est traitée comme un nom d'artisan à chercher, pas comme du SQL.
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);

    // On vérifie que la table n'a pas été vidée par la tentative.
    const apres = await request(app)
      .get("/api/artisans/categories")
      .set("x-api-key", CLE);
    expect(apres.body.length).toBeGreaterThan(0);
  });
});

describe("GET /api/artisans/:id", () => {
  it("retourne 404 sur un identifiant inexistant", async () => {
    const res = await request(app)
      .get("/api/artisans/999999")
      .set("x-api-key", CLE);

    expect(res.status).toBe(404);
  });
});

describe("POST /api/artisans/:id/contact", () => {
  it("refuse un corps vide avec un code 400", async () => {
    const res = await request(app)
      .post("/api/artisans/1/contact")
      .set("x-api-key", CLE)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.details).toHaveLength(4);
  });
});
