const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListElementSchema = new Schema(
  {
    id: {
      type: Number,
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
    readerID: {
      type: Number,
      require: true,
    },
    readerName: {
      type: String,
      require: true,
    },
    bookList: [ListElementSchema],
  },
  { timestamps: true }
);

const BorrowerSlip = mongoose.model("BorrowerSlip", BorrowerSlipSchema);
module.exports = { BorrowerSlip };
