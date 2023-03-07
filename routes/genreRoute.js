const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genreController");

router.get("/", genreController.getAll);
router.get("/get", genreController.getOne);
router.post("/add", genreController.addOne);
router.put("/update", genreController.update);
router.delete("/remove", genreController.remove);

module.exports = router;
