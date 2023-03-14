const pool = require("../utils/dbHandler");

const getAll = (req, res, next) => {
  pool
    .query("SELECT * FROM genre")
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

const getOne = (req, res, next) => {
  pool
    .query("SELECT * FROM genre WHERE genreID = ?", [req.body.genreID])
    .then((response) => {
      let data = response[0];
      res.json({ data });
    })
    .catch((err) => {
      res.json({ err });
    });
};

const addOne = (req, res, next) => {
  let value = [req.body.genreID, req.body.name];
  pool
    .query("INSERT INTO genre VALUES (?)", [value])
    .then((response) => {
      res.json({ message: "inserted successfully" });
    })
    .catch((err) => {
      res.status(300).send({ message: "inserted fail" });
    });
};

const update = (req, res, next) => {
  let genreID = req.body.genreID;
  let genreName = req.body.name;
  pool
    .query("UPDATE genre SET name = ? WHERE genreID = ?", [genreName, genreID])
    .then((response) => {
      if (response[0].affectedRows == 0) {
        res.json({ message: "item not found" });
      } else {
        res.json({ message: "updated successfully" });
      }
    })
    .catch((err) => {
      res.json({ message: "updated fail" });
    });
};

const remove = (req, res, next) => {
  let genreID = req.body.genreID;
  pool
    .query("DELETE FROM genre WHERE genreID = ?", [genreID])
    .then((response) => {
      res.json({ message: "deleted successfully" });
    })
    .catch((err) => {
      res.json({ message: "deleted fail" });
    });
};

module.exports = { getAll, getOne, addOne, update, remove };
