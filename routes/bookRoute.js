const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.get("/", bookController.getAll);
router.get("/get", bookController.getOne);
router.post("/add", bookController.addOne);
router.put("/update", bookController.update);
router.delete("/remove", bookController.remove);

module.exports = router;
