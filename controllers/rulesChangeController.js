const LibraryRules = require("../utils/libraryRules");
const pool = require("../utils/dbHandler");

const changeAge = async (req, res) => {
  const minAge = req.body.minAge;
  const maxAge = req.body.maxAge;
  if (minAge && maxAge) {
    if (minAge <= maxAge) {
      try {
        LibraryRules.modifyRules({ MINIMUM_AGE: minAge, MAXIMUM_AGE: maxAge });
        res.json({ message: "Change applied successfully!" });
      } catch (error) {
        res.json({ messafe: "Error occur!" });
      }
    } else {
      res.json({ message: "minimum age must smaller than maximum age" });
    }
  } else {
    res.json({ message: "minAge and maxAge field can not be empty" });
  }
};

const extendValidPeriod = async (req, res) => {
  const userID = req.body.userID;
  const days = req.body.days;
  if (userID && days) {
    pool
      .query("UPDATE users SET renewDays = renewDays + ? WHERE userID = ?", [
        days,
        userID,
      ])
      .then((response) => {
        res.json({ message: "renew successfully!" });
      })
      .catch((error) => {
        res.json({ message: "renew fail!" + error });
      });
  } else {
    res.json({ message: "Bad request" });
  }
};

const changeDefaultValidPeriod = (req, res) => {
  const validPeriod = req.body.validPeriod;
  if (validPeriod) {
    try {
      LibraryRules.modifyRules({
        VALID_PERIOD_BY_DAY_OF_USER_ACCOUNT: validPeriod,
      });
      res.json({ message: "Change applied successfully!" });
    } catch (error) {
      res.json({ messafe: "Error occur!" });
    }
  } else {
    res.json({ message: "valid period field can not be empty" });
  }
};

const changeMaxYearPublishedSince = (req, res) => {
  const maxYearPublishedSince = req.body.maxYearPublishedSince;
  if (maxYearPublishedSince) {
    try {
      LibraryRules.modifyRules({
        MAXIMUM_YEAR_PUBLISHED_SINCE: maxYearPublishedSince,
      });
      res.json({ message: "Change applied successfully!" });
    } catch (error) {
      res.json({ messafe: "Error occur!" });
    }
  } else {
    res.json({ message: "maxYearPublishedSince field can not be empty" });
  }
};

const changeMaxNumberOfBookAllowedToBorrow = (req, res) => {
  const maxNumberOfBookAllowedToBorrow =
    req.body.maxNumberOfBookAllowedToBorrow;
  if (maxNumberOfBookAllowedToBorrow) {
    try {
      LibraryRules.modifyRules({
        MAX_NUMBER_OF_BOOK_ALLOWED_TO_BORROW: maxNumberOfBookAllowedToBorrow,
      });
      res.json({ message: "Change applied successfully!" });
    } catch (error) {
      res.json({ messafe: "Error occur!" });
    }
  } else {
    res.json({
      message: "maxNumberOfBookAllowedToBorrow field can not be empty",
    });
  }
};

const changeMaximumLendDay = (req, res) => {
  const maximumLendDay = req.body.maximumLendDay;
  console.log(maximumLendDay);
  if (maximumLendDay) {
    try {
      LibraryRules.modifyRules({
        MAXIMUM_LEND_DAY: maximumLendDay,
      });
      res.json({ message: "Change applied successfully!" });
    } catch (error) {
      res.json({ messafe: "Error occur!" });
    }
  } else {
    res.json({
      message: "maximumLendDay field can not be empty",
    });
  }
};

module.exports = {
  changeAge,
  extendValidPeriod,
  changeDefaultValidPeriod,
  changeMaxYearPublishedSince,
  changeMaxNumberOfBookAllowedToBorrow,
  changeMaximumLendDay,
};
