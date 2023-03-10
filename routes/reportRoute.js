const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/reportController");

router.get("/borrowReport", ReportController.generateBorrowReport);

module.exports = router;
