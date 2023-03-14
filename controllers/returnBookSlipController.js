const pool = require("../utils/dbHandler");

const ReturnBookSlip = require("../models/returnBookSlipSchema");

const FINE_PER_DATE = 1000;

const createReturnSlip = async (req, res) => {
  const userID = req.body.userID;
  const bookList = req.body.bookList;
  if (await userHasRightBook(userID, bookList)) {
    try {
      await processTransaction(res, userID, bookList);
    } catch (error) {
      res.json({ message: "error happend!" });
    }
  } else {
    res.json({ message: "User did not borrow some book!" });
  }
};

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
    "SELECT bookID, borrowedDate, maximumLendDay FROM books WHERE bookID IN (?)",
    [bookList]
  );

  for (i in bookInfo) {
    let borrowedDays = caculateNumberOfDay(
      bookInfo[i]["borrowedDate"],
      new Date()
    );
    let passDueDays = borrowedDays - bookInfo[i]["maximumLendDay"];
    if (passDueDays < 0) passDueDays = 0;
    let insertedRow = {
      no: i,
      bookID: bookInfo[i]["bookID"],
      borrowedDate: bookInfo[i]["borrowedDate"],
      borrowedDays,
      fine: passDueDays * FINE_PER_DATE,
    };
    returnSlip.bookList.push(insertedRow);
    totalFineThisSlip += insertedRow.fine;
  }
  totalDebt += totalFineThisSlip;
  let test = {
    ...returnSlip,
    totalFineThisSlip,
    totalDebt,
  };

  returnSlip = ReturnBookSlip({
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
      console.log(err);
    });
  pool.query(
    'UPDATE books SET status = "Available", borrowedDate = NULL WHERE bookID IN (?)',
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

const getAll = (req, res, next) => {
  ReturnBookSlip.find()
    .then((response) => {
      res.json({ response });
    })
    .catch((err) => {
      res.json({ err });
    });
};

const getAllFromUser = (req, res) => {
  ReturnBookSlip.find({ userID: req.body.userID })
    .then((response) => {
      res.json({ response });
    })
    .catch((err) => {
      res.json({ err });
    });
};

const getOne = (req, res) => {
  ReturnBookSlip.find({ _id: req.body.returnBookSlipID })
    .then((response) => {
      res.json({ response });
    })
    .catch((err) => {
      res.json({ err });
    });
};

module.exports = { createReturnSlip, getAll, getAllFromUser, getOne };
