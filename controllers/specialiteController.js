const { Specialite } = require("../models");

const getSpecialitesByCategorie = async (req, res) => {
  const { id } = req.params;
  try {
    const specialite = await Specialite.findAll({
      where: { CategorieId: id },
    });
    res.json(specialite);
  } catch (error) {
    console.error("Error fetching specialites:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching specialites." });
  }
};

module.exports = { getSpecialitesByCategorie };
