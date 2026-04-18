const artisanController = require("../controllers/artisanController");
const express = require("express");
const router = express.Router();

router.post("/", artisanController.sendContactEmail);

module.exports = router;
