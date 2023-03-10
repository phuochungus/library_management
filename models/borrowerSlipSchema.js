const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListElementSchema = new Schema(
  {
    bookID: {
      type: Number,
      require: true,
    },
    genreName: {
      type: String,
      require: true,
    },
    genreID: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    author: {
      type: String,
      require: true,
    },
  },
  { _id: false }
);

const BorrowerSlipSchema = new Schema(
  {
    userID: {
      type: Number,
      require: true,
    },

    name: {
      type: String,
      require: true,
    },
    bookList: [ListElementSchema],
  },
  { timestamps: true }
);

const BorrowerSlip = mongoose.model("borrower_slip", BorrowerSlipSchema);
module.exports = BorrowerSlip;
