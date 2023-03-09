const express = require("express");
const router = express.Router();
const returnBookSlipController = require("../controllers/returnBookSlipController");

router.get("/createReturnSlip", returnBookSlipController.createReturnSlip);

module.exports = router;
