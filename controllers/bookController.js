const pool = require("../utils/dbHandler");
const LibraryRules = require("../utils/libraryRules");

const getAll = async (req, res) => {
  pool
    .query("SELECT * FROM books")
    .then(async (response) => {
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
      let bookInfo = response[0][0];
      if (bookInfo.publicationYear) res.json({ bookInfo });
    })
    .catch((err) => {
      res.json({ err });
    });
};

const addOne = async (req, res) => {
  const book = {
    name: req.body.name,
    genreID: req.body.genreID,
    author: req.body.author,
    publisher: req.body.publisher,
    publicationYear: req.body.publicationYear,
    importedDate: new Date(),
    price: req.body.price,
  };
  try {
    let value = Object.values(book);
    if (await isBookNotOutdated(book.publicationYear)) {
      pool
        .query(
          "INSERT INTO " +
            "books(name , genreID, author, publisher, publicationYear, importedDate, price) VALUES (?)",
          [value]
        )
        .then((response) => {
          res.json({ message: "inserted successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.json({ message: "inserted fail" + err });
        });
    } else {
      res.json({ message: "Book's publication year too old" });
    }
  } catch (error) {
    res.json({ error });
  }
};

const getDistanceByYearFromNow = (pastYear) => {
  return new Date().getFullYear() - pastYear;
};

const isBookOutdated = async (publicationYear) => {
  let rules = await LibraryRules.getLibraryRules();
  if (
    getDistanceByYearFromNow(publicationYear) <=
    rules.MAXIMUM_YEAR_PUBLISHED_SINCE
  ) {
    return false;
  } else {
    return true;
  }
};

const isBookNotOutdated = async (publicationYear) => {
  return !(await isBookOutdated(publicationYear));
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
  book = {
    name: req.body.name || book.name,
    genreID: req.body.genre || book.genreID,
    author: req.body.author || book.author,
    publisher: req.body.publisher || book.publisher,
    publicationYear: req.body.publicationYear || book.publicationYear,
    importedDate: req.body.importedDate || book.importedDate,
    price: req.body.price || book.price,
    status: req.body.status || book.status,
    updatedAt: new Date(),
    bookID: book.bookID,
  };

  pool
    .query(
      "UPDATE books " +
        "SET name = ? , genreID = ? , author = ? , publisher = ? , publicationYear = ? , importedDate = ? , price = ? , status = ? , updatedAt = ?" +
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

module.exports = {
  getAll,
  getOne,
  addOne,
  update,
  remove,
  getDistanceByYearFromNow,
  isBookOutdated,
  isBookNotOutdated,
};
