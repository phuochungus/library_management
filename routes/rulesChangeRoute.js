const express = require("express");
const router = express.Router();
const rulesChange = require("../controllers/rulesChangeController");

router.post("/changeAge", rulesChange.changeAge);
router.post("/renew", rulesChange.extendValidPeriod);
router.post("/changeDefauldValidPeriod", rulesChange.changeDefaultValidPeriod);
router.post(
  "/changeMaxYearPublishedSince",
  rulesChange.changeMaxYearPublishedSince
);
router.post(
  "/changeMaxNumberOfBookAllowedToBorrow",
  rulesChange.changeMaxNumberOfBookAllowedToBorrow
);
router.post("/changeMaximumLendDay", rulesChange.changeMaximumLendDay);

module.exports = router;
