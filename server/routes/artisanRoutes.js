const artisanController = require("../controllers/artisanController");
const express = require("express");
const router = express.Router();

router.get("/search", artisanController.searchArtisans);
router.get("/top", artisanController.getTopArtisans);
router.get("/:id", artisanController.getArtisanById);

module.exports = router;
