const BorrowerSlip = require("../models/borrowerSlipSchema");
const pool = require("../utils/dbHandler");
const LibraryRules = require("../utils/libraryRules");

const MAX_NUMBER_OF_BOOK_ALLOWED = 5;

const createBorrowerSlip = async (req, res) => {
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

  let userInfo = await pool.query(
    'SELECT * FROM users WHERE userID = ? AND isDeleted = "NO"',
    [userID]
  );

  userInfo = userInfo[0][0];
  if (userInfo) {
    await Promise.all([
      isNotReachBooksLimit(userID, bookList, responseMessage),
      isUserAccountValid(userInfo, responseMessage),
      isFollowingBookAvailable(bookList, responseMessage),
    ])
      .then((response) => {
        console.log(response);
        flag = true;
      })
      .catch((err) => {
        console.log(err);
        flag = false;
      });
  } else {
    responseMessage.message = "Account not found or deleted!";
    return false;
  }
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

const isUserAccountValid = async (userInfo, responseMessage) => {
  if (
    (await isUserAccountStilValidNow(userInfo.createdAt)) ||
    (await isUserAgeValid(userInfo.birth))
  ) {
    return true;
  } else {
    responseMessage.message = "User account invalid!";
    throw responseMessage;
  }
};

const isUserAccountStilValidNow = async (createdDay) => {
  // let createdDay = await pool.query(
  //   'SELECT createdAt FROM users WHERE userID = ? AND isDeleted = "NO"',
  //   [userID]
  // );
  // createdDay = createdDay[0][0]["createdAt"];
  let rules = await LibraryRules.getLibraryRules();
  if (
    createdDay.addDays(rules.VALID_PERIOD_BY_DAY_OF_USER_ACCOUNT) >= new Date()
  ) {
    return true;
  } else {
    return false;
  }
};

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const isUserAgeValid = async (birth) => {
  let age = new Date().getFullYear - birth.getFullYear;
  let rules = await LibraryRules.getLibraryRules();
  if (rules.MINIMUM_AGE <= age && age <= rules.MAXIMUM_AGE) {
    return true;
  }
  return false;
};

const isFollowingBookAvailable = async (bookList, responseMessage) => {
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
    "SELECT b.bookID, b.name, b.author, g.name as genreName, g.genreID as genreID FROM books b, genre g WHERE bookID IN (?) AND b.genreID = g.genreID",
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

const getAll = (req, res) => {
  BorrowerSlip.find()
    .then((response) => {
      res.json({ response });
    })
    .catch((err) => {
      res.json({ err });
    });
};

const getAllFromUser = (req, res) => {
  BorrowerSlip.find({ userID: req.body.userID })
    .then((response) => {
      res.json({ response });
    })
    .catch((err) => {
      res.json({ err });
    });
};

const getOne = (req, res) => {
  BorrowerSlip.find({ _id: req.body.borrowerSlipID })
    .then((response) => {
      res.json({ response });
    })
    .catch((err) => {
      res.json({ err });
    });
};

module.exports = {
  createBorrowerSlip,
  getAll,
  getAllFromUser,
  getOne,
  isUserAgeValid,
};
