const { response } = require("express");
const mysql = require("mysql2");

const ReturnBookSlip = require("../models/returnBookSlipSchema");

const createReturnSlip = (req, res, next) => {
  const userID = req.body.userID;
};

module.exports = createReturnSlip;
