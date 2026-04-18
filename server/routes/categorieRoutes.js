const categorieController = require("../controllers/categorieController");
const express = require("express");
const router = express.Router();

router.get("/", categorieController.getAllCategories);

module.exports = router;
