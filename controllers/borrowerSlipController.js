const { response } = require("express");
const mysql = require("mysql2");

const BorrowerSlip = require("../models/borrowerSlipSchema");

const MAX_NUMBER_OF_BOOK_ALLOWED = 5;

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

const createBorrowerSlip = async (req, res, next) => {
  const userID = req.body.userID;
  const bookList = req.body.bookList;
  let responseMessage;

  console.log("origin: " + bookList);

  if (borrowRequestIsValid(userID, bookList, responseMessage)) {
    processRequest(res, userID, bookList);
  } else {
    res.json({
      message: "User unable to borrow any books!",
      detail: responseMessage,
    });
  }
};

const borrowRequestIsValid = async (userID, bookList, responseMessage) => {
  //TODO: can be optimize with concurrency
  if (await isReachBooksLimit(userID, bookList, responseMessage)) {
    return false;
  }
  if (!(await isUserAccountValid(userID, responseMessage))) {
    return false;
  }
  return true;
};

const isReachBooksLimit = async (userID, bookList, responseMessage) => {
  let [rows] = await pool.query(
    "SELECT COUNT(bookID) FROM users_currentbooks WHERE userID = ?",
    [userID]
  );
  const currentNumberOfBookKeepByUser = rows[0]["COUNT(bookID)"];

  let availableBooks = await pool.query(
    'SELECT bookID FROM books WHERE status = "Available" AND bookID IN (?)',
    [bookList]
  );

  availableBooks = availableBooks[0].map((element) => element.bookID);

  let deepCopiedBookList = JSON.parse(JSON.stringify(bookList));

  const difference = deepCopiedBookList.filter(
    (x) => !availableBooks.includes(x)
  );
  console.log("booklist: " + bookList);

  if (difference.length != 0) {
    responseMessage = "Book unavailable: " + difference;
    return true;
  }
  if (
    currentNumberOfBookKeepByUser + availableBooks >
    MAX_NUMBER_OF_BOOK_ALLOWED
  ) {
    responseMessage =
      "Reach book limit allowed to lend, return some books to borrow new ones";
    return true;
  }
  return false;
};

const isUserAccountValid = async (userID, responseMessage) => {
  let validUntil = await pool.query(
    "SELECT validUntil FROM users WHERE userID = ?",
    [userID]
  );
  validUntil = validUntil[0][0]["validUntil"];
  if (validUntil < new Date()) {
    responseMessage = "User account has expired!";
    return false;
  }
  return true;
};

const processRequest = async (res, userID, bookList) => {
  console.log(bookList);
  await updateBooksStatusToUnavailable(bookList);

  let insertRows = makeInsertRows(userID, bookList);
  pool
    .query("INSERT INTO users_currentbooks VALUES ?", [insertRows])
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
  await storeBorrowerSlipToDB(res, userID, bookList);
};

const updateBooksStatusToUnavailable = async (bookList) => {
  pool
    .query('UPDATE books SET status = "Unavailable" WHERE bookID IN (?)', [
      bookList,
    ])
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

const makeInsertRows = (userID, bookList) => {
  console.log(bookList);
  return bookList.map((element) => [userID, String(element)]);
};

const storeBorrowerSlipToDB = async (res, userID, bookList) => {
  let userInfo = await pool.query(
    "SELECT name, userID FROM users WHERE userID = ?",
    [userID]
  );
  userInfo = userInfo[0][0];

  let bookInfo = await pool.query(
    "SELECT bookID, name, author FROM books WHERE bookID IN (?)",
    [bookList]
  );
  bookInfo = bookInfo[0];

  let slip = new BorrowerSlip({ ...userInfo, bookList: bookInfo });
  slip
    .save()
    .then((response) => {
      res.json({ response });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { createBorrowerSlip };
