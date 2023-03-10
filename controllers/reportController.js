const { response } = require("express");
const mysql = require("mysql2");
const { count } = require("../models/borrowerSlipSchema");
const BorrowerSlip = require("../models/borrowerSlipSchema");

const generateBorrowReport = async (req, res, next) => {
  const selectedMonth = req.body.selectedMonth;
  if (1 <= selectedMonth && selectedMonth <= 12) {
    let startDate = new Date();
    let endDate = new Date();
    const currentYear = startDate.getFullYear();
    startDate.setFullYear(currentYear, selectedMonth - 1, 1);
    endDate.setFullYear(currentYear, selectedMonth, 0);
    await generateReportIn(res, startDate, endDate, selectedMonth);
  }
};

const generateReportIn = async (res, startDate, endDate, selectedMonth) => {
  let docs;
  await BorrowerSlip.find({
    createdAt: { $gte: startDate, $lte: endDate },
  }).then((response) => {
    docs = response;
  });
  let allBookList = docs.map((borrowerSlip) => borrowerSlip.bookList);
  let allBook = [];
  for (bookList of allBookList) {
    for (book of bookList) {
      allBook.push(book);
    }
  }

  let report = {};
  let total = 0;
  for (book of allBook) {
    if (book.genreName != undefined) {
      total++;
      if (report[book.genreName] != undefined) {
        report[book.genreName]["count"]++;
      } else {
        report[book.genreName] = { count: 1 };
      }
    }
  }

  let finalReport = [];
  Object.keys(report).forEach((key) => {
    report[key].percentage = report[key].count / total;
    finalReport.push({
      genreName: key,
      borrowedTimes: report[key].count,
      percentage: report[key].count / total,
    });
  });
  finalReport = { month: selectedMonth, list: finalReport };
  res.json(finalReport);
};

module.exports = { generateBorrowReport };
