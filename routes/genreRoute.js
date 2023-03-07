const express = require("express");
const router = express.Router();
const userController = require("../controllers/genreController");

router.get("/", userController.getAllGenre);

module.exports = router;
