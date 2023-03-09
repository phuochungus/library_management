const mysql = require("mysql2");

const ReturnBookSlip = require("../models/returnBookSlipSchema");

const FINE_PER_DATE = 1000;

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

const userHasRightBook = async (userID, bookList) => {
  try {
    let [rows] = await pool.query(
      "SELECT * FROM users_currentbooks WHERE userID = ? AND bookID IN (?)",
      [userID, bookList]
    );
    if (rows.length == bookList.length) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    res.json({ error });
    return false;
  }
};

const createReturnSlip = async (req, res) => {
  const userID = req.body.userID;
  const bookList = req.body.bookList;
  if (await userHasRightBook(userID, bookList)) {
    try {
      processTransaction(res, userID, bookList);
    } catch (error) {
      res.json({ message: "error happend!" });
    }
  } else {
    res.json({ message: "some book not borrowed by user!" });
  }
};

const processTransaction = async (res, userID, bookList) => {
  let [name] = await pool.query(
    "SELECT name, currentDebt FROM users WHERE userID = ?",
    [userID]
  );
  let totalDebt = name[0]["currentDebt"];
  let returnSlip = {
    name: name[0]["name"],
    userID,
    bookList: [],
  };
  let totalFineThisSlip = 0;

  let [bookInfo] = await pool.query(
    "SELECT bookID, borrowDate, maximumLendDay FROM books WHERE bookID IN (?)",
    [bookList]
  );

  for (i in bookInfo) {
    let borrowedDays = caculateNumberOfDay(
      bookInfo[i]["borrowDate"],
      new Date()
    );
    let passDueDays = caculateNumberOfDay(
      borrowedDays - bookInfo[i]["maximumLendDay"]
    );
    let insertedRow = ReturnBookSlip.SimpleBookElement({
      no: i,
      bookID: bookInfo[i]["bookID"],
      borrowedDate: bookInfo[i]["borrowDate"],
      borrowedDays,
      fine: passDueDays * FINE_PER_DATE,
    });
    returnSlip.bookList.push(insertedRow);
    totalFineThisSlip += insertedRow.fine;
  }
  totalDebt += totalFineThisSlip;
  returnSlip = ReturnBookSlip.ReturnBookSlip({
    ...returnSlip,
    totalFineThisSlip,
    totalDebt,
  });
  returnSlip
    .save()
    .then((response) => {
      res.json({ response });
    })
    .catch((err) => {
      res.json({ err });
    });
  pool.query(
    'UPDATE books SET status = "Available", borrowDate = NULL WHERE bookID IN (?)',
    [bookList]
  );
  pool.query(
    "DELETE FROM users_currentbooks WHERE userID = ? AND bookID IN (?)",
    [userID, bookList]
  );
};

const caculateNumberOfDay = (date1, date2) => {
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

module.exports = { createReturnSlip };
