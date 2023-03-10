const express = require("express");
const router = express.Router();
const fineReceiptController = require("../controllers/fineReceiptController");

router.get("/add", fineReceiptController.add);

module.exports = router;
