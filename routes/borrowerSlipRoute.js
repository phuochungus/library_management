const express = require("express");
const router = express.Router();
const BorrowerSlipController = require("../controllers/borrowerSlipController");

router.get("/createSlip", BorrowerSlipController.createSlip);

module.exports = router;
