const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fineSchema = new Schema(
  {
    total: {
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
    readerID: {
      type: Number,
      require: true,
    },
    readerName: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Fine = mongoose.model("Fine", fineSchema);
module.exports = { Fine };
