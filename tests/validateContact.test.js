const validateContact = require("../middleware/validateContact");
const { escapeHtml, escapeHtmlMultiligne } = require("../utils/escapeHtml");

/**
 * Tests unitaires : ni base de données, ni réseau.
 * Ils s'exécutent en une fraction de seconde et ne peuvent donc pas échouer
 * pour une raison étrangère au code testé.
 */

const fauxRes = () => {
  const res = { statusCode: null, body: null };
  res.status = (code) => ((res.statusCode = code), res);
  res.json = (payload) => ((res.body = payload), res);
  return res;
};

describe("validateContact", () => {
  it("laisse passer une saisie valide et nettoie les espaces", () => {
    const req = {
      body: {
        nom: "  Claire  ",
        email: " claire@exemple.fr ",
        objet: " Devis ",
        message: " Bonjour ",
      },
    };
    let suivant = false;
    validateContact(req, fauxRes(), () => (suivant = true));

    expect(suivant).toBe(true);
    expect(req.body).toEqual({
      nom: "Claire",
      email: "claire@exemple.fr",
      objet: "Devis",
      message: "Bonjour",
    });
  });

  it("refuse une adresse email invalide avec un code 400", () => {
    const req = {
      body: { nom: "Claire", email: "claire@", objet: "Devis", message: "Bonjour" },
    };
    const res = fauxRes();
    let suivant = false;
    validateContact(req, res, () => (suivant = true));

    // La chaîne s'arrête : la route ne doit jamais être atteinte.
    expect(suivant).toBe(false);
    expect(res.statusCode).toBe(400);
    expect(res.body.details).toContain("L'adresse email n'est pas valide.");
  });

  it("signale les quatre champs manquants d'un corps vide", () => {
    const res = fauxRes();
    validateContact({ body: {} }, res, () => {});

    expect(res.statusCode).toBe(400);
    expect(res.body.details).toHaveLength(4);
  });

  it("refuse un message dépassant la longueur maximale", () => {
    const res = fauxRes();
    validateContact(
      {
        body: {
          nom: "Claire",
          email: "claire@exemple.fr",
          objet: "Devis",
          message: "a".repeat(5001),
        },
      },
      res,
      () => {},
    );

    expect(res.statusCode).toBe(400);
  });
});

describe("escapeHtml", () => {
  it("neutralise une tentative d'injection de script", () => {
    const resultat = escapeHtml('<script>alert("xss")</script>');

    expect(resultat).toBe("&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;");
    expect(resultat).not.toContain("<script>");
  });

  it("échappe avant de convertir les sauts de ligne", () => {
    const resultat = escapeHtmlMultiligne("<b>gras</b>\nligne 2");

    // Le <br> injecté par nos soins survit ; le <b> du visiteur est neutralisé.
    expect(resultat).toBe("&lt;b&gt;gras&lt;/b&gt;<br>ligne 2");
  });
});
