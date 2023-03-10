const { response } = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const Fine = require("../models/fineReceiptSchema");

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

const add = async (req, res, next) => {
  const userID = req.body.userID;
  const receiveMoney = req.body.receiveMoney;

  let [rows] = await pool.query(
    "SELECT name, currentDebt FROM users WHERE userID = ?",
    [userID]
  );
  let currentDebt = rows[0].currentDebt;
  if (receiveMoney > currentDebt) {
    res.json({ message: "receive can not larger than debt" });
  } else if (receiveMoney == 0) {
    res.json({ message: "money must be larger than 0" });
  } else {
    makeFineReceipt(
      res,
      rows[0].name,
      rows[0].currentDebt,
      userID,
      receiveMoney
    );
  }
};

const makeFineReceipt = (res, name, totalDebt, userID, receiveMoney) => {
  let fine = Fine({
    name,
    userID,
    totalDebt,
    pay: receiveMoney,
    remain: totalDebt - receiveMoney,
  });
  fine
    .save()
    .then((response1) => {
      pool
        .query(
          "UPDATE users SET currentDebt = currentDebt - ? WHERE userID = ?",
          [receiveMoney, userID]
        )
        .then((response2) => {
          res.json({ response1 });
        });
    })
    .catch((err) => {
      res.json({ err });
    });
};

module.exports = { add };
