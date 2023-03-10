const express = require("express");
const router = express.Router();
const BorrowerSlipController = require("../controllers/borrowerSlipController");

router.get("/createBorrowerSlip", BorrowerSlipController.createBorrowerSlip);
router.get("/getAll", BorrowerSlipController.getAll);
router.get("/getAllFromUser", BorrowerSlipController.getAllFromUser);
router.get("/getOne", BorrowerSlipController.getOne);

module.exports = router;
