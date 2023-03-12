const mysql = require("mysql2");
const pool = require("../dbHandler");

const getAll = (req, res) => {
  console.log(req.user);
  pool
    .query("SELECT * FROM books")
    .then((response) => {
      let data = response[0];
      res.json({ data });
    })
    .catch((err) => {
      res.json({
        message: err,
      });
    });
};

const getOne = (req, res) => {
  pool
    .query("SELECT * FROM books WHERE bookID = ?", [req.body.bookID])
    .then((response) => {
      let data = response[0];
      res.json({ data });
    })
    .catch((err) => {
      res.json({ err });
    });
};

const addOne = (req, res) => {
  let book = {
    name: req.body.name,
    genreID: req.body.genreID,
    author: req.body.author,
    publisher: req.body.publisher,
    publicationYear: req.body.publicationYear,
    importedDate: new Date(),
    price: req.body.price,
    maximumLendDay: req.body.maximumLendDay,
  };
  let value = Object.values(book);
  pool
    .query(
      "INSERT INTO " +
        "books(name , genreID, author, publisher, publicationYear, importedDate, price, maximumLendDay) VALUES (?)",
      [value]
    )
    .then((response) => {
      res.json({ message: "inserted successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "inserted fail" + err });
    });
};

const update = async (req, res) => {
  let bookID = req.body.bookID;
  let [result] = await pool.query("SELECT * FROM books WHERE bookID = ?", [
    bookID,
  ]);
  if (result.length == 0) {
    res.json({ message: "item not found" });
    return;
  }
  let book = result[0];
  console.log(book);
  book = {
    name: req.body.name || book.name,
    genreID: req.body.genre || book.genreID,
    author: req.body.author || book.author,
    publisher: req.body.publisher || book.publisher,
    publicationYear: req.body.publicationYear || book.publicationYear,
    importedDate: req.body.importedDate || book.importedDate,
    price: req.body.price || book.price,
    status: req.body.status || book.status,
    maximumLendDay: req.body.maximumLendDay || book.maximumLendDay,
    updatedAt: new Date(),
    bookID: book.bookID,
  };
  pool
    .query(
      "UPDATE books " +
        "SET name = ? , genreID = ? , author = ? , publisher = ? , publicationYear = ? , importedDate = ? , price = ? , status = ? , maximumLendDay = ? , updatedAt = ?" +
        "WHERE bookID = ?",
      Object.values(book)
    )
    .then((response) => {
      if (response[0].affectedRows == 0) {
        res.json({ message: "item not found" });
      } else {
        res.json({ message: "updated successfully" });
      }
    })
    .catch((err) => {
      res.json({ message: "updated fail" });
      console.log(err);
    });
};

const remove = (req, res) => {
  let bookID = req.body.bookID;
  pool
    .query("DELETE FROM books WHERE bookID = ?", [bookID])
    .then((response) => {
      res.json({ message: "deleted successfully" });
    })
    .catch((err) => {
      res.json({ message: "deleted fail" });
    });
};

module.exports = { getAll, getOne, addOne, update, remove };
