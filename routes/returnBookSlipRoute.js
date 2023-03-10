const express = require("express");
const router = express.Router();
const returnBookSlipController = require("../controllers/returnBookSlipController");

router.get("/createReturnSlip", returnBookSlipController.createReturnSlip);
router.get("/getAll", returnBookSlipController.getAll);
router.get("/getAllFromUser", returnBookSlipController.getAllFromUser);
router.get("/getOne", returnBookSlipController.getOne);

module.exports = router;
