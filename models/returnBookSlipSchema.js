const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SimpleBookElement = new Schema(
  {
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
    readerName: {
      type: String,
      require: true,
    },
    readerID: {
      type: String,
      require: true,
    },
    date: {
      type: Date,
      require: true,
    },
    totalFine: {
      type: Number,
      default: 0,
    },
    totalDebt: {
      type: Number,
      default: 0,
    },
    bookList: [SimpleBookElement],
  },
  { timestamps: true }
);

const ReturnBookSlip = mongoose.model("return_book_slip", returnBookSlipSchema);
module.exports = { Fine };
