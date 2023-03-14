const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const libraryRulesSchema = new Schema({
  MINIMUM_AGE: {
    type: Number,
    require: true,
  },
  MAXIMUM_AGE: {
    type: Number,
    require: true,
  },
  VALID_PERIOD_BY_DAY_OF_USER_ACCOUNT: {
    type: Number,
    require: true,
  },
  MAXIMUM_YEAR_PUBLISHED_SINCE: {
    type: Number,
    require: true,
  },
  MAX_NUMBER_OF_BOOK_ALLOWED_TO_BORROW: {
    type: Number,
    require: true,
  },
  MAXIMUM_LEND_DAY: {
    type: Number,
    require: true,
  },
});

const libraryRules = mongoose.model("library_rule", libraryRulesSchema);
module.exports = libraryRules;
