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
  let responseMessage = { message: "", detail: null };

  if (await borrowRequestIsValid(userID, bookList, responseMessage)) {
    processRequest(res, userID, bookList);
  } else {
    console.log(responseMessage);
    res.json({
      message: responseMessage,
    });
  }
};

const borrowRequestIsValid = async (userID, bookList, responseMessage) => {
  let flag = false;

  await Promise.all([
    isNotReachBooksLimit(userID, bookList, responseMessage),
    isUserAccountStillValid(userID, responseMessage),
    isAllBookAvailable(bookList, responseMessage),
  ])
    .then((response) => {
      console.log("done");
      flag = true;
    })
    .catch((err) => {
      return;
    });
  return flag;
};

const isNotReachBooksLimit = async (userID, bookList, responseMessage) => {
  let [rows] = await pool.query(
    "SELECT COUNT(bookID) FROM users_currentbooks WHERE userID = ?",
    [userID]
  );
  const currentNumberOfBookKeepByUser = rows[0]["COUNT(bookID)"];

  let availableBooks = await pool.query(
    'SELECT bookID FROM books WHERE status = "Available" AND bookID IN (?)',
    [bookList]
  );

  availableBooks = availableBooks[0].map((element) => String(element.bookID));

  let deepCopiedBookList = JSON.parse(JSON.stringify(bookList));

  const difference = deepCopiedBookList.filter(
    (x) => !availableBooks.includes(x)
  );

  if (difference.length != 0) {
    responseMessage.message = "Book unavailable: ";
    responseMessage.detail = difference;
    throw responseMessage;
  }
  if (
    currentNumberOfBookKeepByUser + availableBooks.length >
    MAX_NUMBER_OF_BOOK_ALLOWED
  ) {
    responseMessage.message =
      "Reach book limit allowed to lend, return some books to borrow new ones";
    throw responseMessage;
  }
  return true;
};

const isUserAccountStillValid = async (userID, responseMessage) => {
  let validUntil = await pool.query(
    "SELECT validUntil FROM users WHERE userID = ?",
    [userID]
  );
  validUntil = validUntil[0][0]["validUntil"];
  if (validUntil < new Date()) {
    responseMessage = "User account has expired!";
    throw responseMessage;
  }
  return true;
};

const isAllBookAvailable = async (bookList, responseMessage) => {
  let [rows] = await pool.query(
    'SELECT * FROM books WHERE bookID IN (?) AND status = "Available"',
    [bookList]
  );

  if (rows.length == bookList.length) {
    return true;
  } else {
    responseMessage.message = "Some books are not available at the moment!";
    throw responseMessage;
  }
};

const processRequest = async (res, userID, bookList) => {
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
    .query(
      'UPDATE books SET status = "Unavailable", borrowedDate = ? WHERE bookID IN (?)',
      [new Date(), bookList]
    )
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
