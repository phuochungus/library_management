const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAll);
router.get("/get", userController.getOne);
router.post("/add", userController.addOne);
router.put("/update", userController.update);
router.delete("/remove", userController.remove);

module.exports = router;
