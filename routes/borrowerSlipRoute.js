const express = require("express");
const router = express.Router();
const BorrowerSlipController = require("../controllers/borrowerSlipController");

router.get("/createBorrowerSlip", BorrowerSlipController.createBorrowerSlip);

module.exports = router;
