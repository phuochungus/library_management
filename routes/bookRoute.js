const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const authentication = require("../middleware/authentication");

router.get("/", authentication.authenticate, bookController.getAll);
router.get("/get", bookController.getOne);
router.post("/add", bookController.addOne);
router.put("/update", bookController.update);
router.delete("/remove", bookController.remove);

module.exports = router;
