const { Artisan } = require("../models/");
const { Op } = require("sequelize");

const getTopArtisans = async (req, res) => {
  try {
    const artisans = await Artisan.findAll({
      where: { top_artisan: true },
    });
    res.json(artisans);
  } catch (error) {
    console.error("Error fetching artisans:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching artisans." });
  }
};

const getArtisanById = async (req, res) => {
  const { id } = req.params;
  try {
    const artisan = await Artisan.findByPk(id);
    if (!artisan) {
      return res.status(404).json({ error: "Artisan not found." });
    }
    res.json(artisan);
  } catch (error) {
    console.error("Error fetching artisan:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the artisan." });
  }
};

const searchArtisans = async (req, res) => {
  const { nom } = req.query;
  try {
    const artisans = await Artisan.findAll({
      where: {
        nom: { [Op.like]: `%${nom}%` },
      },
    });
    res.json(artisans);
  } catch (error) {
    console.error("Error searching artisans:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching artisans." });
  }
};

const sendContactEmail = async (req, res) => {
  const { nom, email, message } = req.body;
  try {
    // Logic to send email (e.g., using nodemailer)
    res.json({ success: true, message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res
      .status(500)
      .json({ error: "An error occurred while sending the contact email." });
  }
};

module.exports = {
  getTopArtisans,
  getArtisanById,
  searchArtisans,
  sendContactEmail,
};
