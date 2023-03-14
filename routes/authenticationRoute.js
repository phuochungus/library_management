const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");

router.post("/login", authentication.login);
router.post("/token", authentication.token);
router.delete("/delete", authentication.remove);

module.exports = router;
