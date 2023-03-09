const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SimpleBookElementSchema = new Schema(
  {
    no: {
      type: Number,
      require: true,
    },
    bookID: {
      type: Number,
      require: true,
    },
    borrowedDate: {
      type: Date,
      require: true,
    },
    borrowedDays: {
      type: Number,
      require: true,
    },
    fine: {
      type: Number,
      require: true,
      default: 0,
    },
  },
  { _id: false }
);

const returnBookSlipSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    userID: {
      type: String,
      require: true,
    },
    totalFineThisSlip: {
      type: Number,
      default: 0,
    },
    totalDebt: {
      type: Number,
      default: 0,
    },
    bookList: [SimpleBookElementSchema],
  },
  { timestamps: true }
);

const ReturnBookSlip = mongoose.model("return_book_slip", returnBookSlipSchema);
module.exports = { ReturnBookSlip };
