const specialiteController = require("../controllers/specialiteController");
const express = require("express");
const router = express.Router();

router.get("/:id/specialites", specialiteController.getSpecialitesByCategorie);

module.exports = router;
