const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fineSchema = new Schema(
  {
    totalDebt: {
      type: Number,
      require: true,
    },
    pay: {
      type: Number,
      require: true,
    },
    remain: {
      type: Number,
      require: true,
    },
    userID: {
      type: Number,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Fine = mongoose.model("fine_receipt", fineSchema);
module.exports = Fine;
