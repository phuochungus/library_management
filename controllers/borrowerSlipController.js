const { response } = require("express");
const BorrowerSlip = require("../models/borrowerSlipSchema");
const mysql = require("mysql2");

const MAX_NUMBER_OF_BOOK_ALLOWED = 5;

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

const userIsValid = async (res, userID, bookList) => {
  pool
    .query("SELECT COUNT(bookID) FROM users_currentbooks WHERE userID = ?", [
      userID,
    ])
    .then(async (response) => {
      let numberOfBook = response[0][0]["COUNT(bookID)"];
      if (numberOfBook >= MAX_NUMBER_OF_BOOK_ALLOWED) {
        res.json({
          message:
            "reached book limit allowed to lend, return some books to borrow new ones",
        });
        return false;
      }
      let validUntil = await pool.query(
        "SELECT validUntil FROM users WHERE userID = ?",
        [userID]
      );
      validUntil = validUntil[0][0]["validUntil"];
      if (validUntil >= new Date()) {
        return true;
      } else {
        return false;
      }
    });
  return true;
};

const processTransaction = async (res, userID, bookList) => {
  let availableBooks = await pool.query(
    'SELECT bookID FROM books WHERE status = "Available" AND bookID IN (?)',
    [bookList]
  );
  availableBooks = availableBooks[0].map((element) => element.bookID);

  pool.query('UPDATE books SET status = "Unavailable" WHERE bookID IN (?)', [
    availableBooks,
  ]);

  let insertRows = availableBooks.map((element) => [userID, String(element)]);
  console.log(insertRows);
  pool
    .query("INSERT INTO users_currentbooks VALUES ?", [insertRows])
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  res.json({
    message: "User are approved",
    success: availableBooks,
  });
};

const createSlip = async (req, res, next) => {
  if (!userIsValid(res, req.body.userID, req.body.bookList)) {
    res.json({ message: "User unable to borrow any books!" });
  } else {
    processTransaction(res, req.body.userID, req.body.bookList);
  }
};

module.exports = { createSlip };
