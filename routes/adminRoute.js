const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/register", adminController.register);
router.get("/login", adminController.login);
router.put("/update", adminController.update);
router.delete("/remove", adminController.remove);

module.exports = router;
