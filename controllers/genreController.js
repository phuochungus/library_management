const { response } = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();
  
const getAll = (req, res, next) => {
  pool
    .query("SELECT * FROM genre")
    .then((response) => {
      var data = response[0];
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
      var data = response[0];
      res.json({ data });
    })
    .catch((err) => {
      res.json({ err });
    });
};

const addOne = (req, res, next) => {
  var value = [req.body.genreID, req.body.name];
  pool
    .query("INSERT INTO genre VALUES (?)", [value])
    .then((response) => {
      res.json({ message: "inserted successfully" });
    })
    .catch((err) => {
      res.json({ message: "inserted fail" });
    });
};

const update = (req, res, next) => {
  var genreID = req.body.genreID;
  var genreName = req.body.name;
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
  var genreID = req.body.genreID;
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
