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

const getAllGenre = (req, res, next) => {
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

module.exports = { getAllGenre };
