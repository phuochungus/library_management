const pool = require("../utils/dbHandler");
const isUserAgeValid = require("./borrowerSlipController").isUserAgeValid;

const getAll = (req, res) => {
  pool
    .query("SELECT * FROM users")
    .then((response) => {
      let data = response[0];
      res.json({ data });
    })
    .catch((err) => {
      res.json(err);
    });
};

const getOne = (req, res) => {
  pool
    .query("SELECT * FROM users WHERE userID = ?", [req.body.userID])
    .then((response) => {
      let data = response[0];
      res.json({ data });
    })
    .catch((err) => {
      res.json(err);
    });
};

const addOne = async (req, res) => {
  let user = [
    req.body.name,
    req.body.type,
    req.body.birth,
    req.body.address,
    req.body.email,
  ];

  if (await isUserAgeValid(req.body.birth)) {
    pool
      .query(
        "INSERT INTO users (name, type, birth, address, email) VALUES (?)",
        [user]
      )
      .then((response) => {
        res.json({ message: "inserted successfully" });
      })
      .catch((err) => {
        res.json({ message: "inserted fail" + err });
      });
  } else {
    res.json({ message: "User's age not supported!" });
  }
};

const update = async (req, res) => {
  let userID = req.body.userID;
  let [result] = await pool.query("SELECT * FROM users WHERE userID = ?", [
    userID,
  ]);
  let user = result[0];
  user = {
    name: req.body.name || user.name,
    type: req.body.type || user.type,
    birth: req.body.birth || user.birth,
    address: req.body.address || user.address,
    email: req.body.email || user.email,
    updatedAt: new Date(),
    userID: user.userID,
  };
  if (await isUserAgeValid(user.birth)) {
    userInfo = Object.values(user);
    pool
      .query(
        "UPDATE users" +
          " SET name = ?, type = ?, birth = ?, address = ?, email = ?, updatedAt = ?" +
          " where userID = ?",
        userInfo
      )
      .then((response) => {
        if (response[0].affectedRows == 0) {
          res.json({ message: "item not found" });
        } else {
          res.json({ message: "updated successfully" });
        }
      })
      .catch((err) => {
        res.json({ message: "updated fail" + err });
      });
  } else {
    res.json({ message: "User's age not supported!" });
  }
};

const remove = async (req, res) => {
  const userID = req.body.userID;
  if (await userHaveReturnAllBook(userID)) {
    pool
      .query('UPDATE users SET isDeleted = "YES" WHERE userID = ?', [userID])
      .then((response) => {
        res.json({ message: "deleted successfully" });
      })
      .catch((err) => {
        res.json({ message: "deleted fail" });
      });
  } else {
    res.json({ message: "deleted fail! return all book" });
  }
};

const userHaveReturnAllBook = async (userID) => {
  try {
    let response = await pool.query(
      "SELECT numberOfCurrentBookBorrowedByUser(?) as numberOfBook",
      [userID]
    );

    if (response[0][0].numberOfBook == 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

module.exports = { getAll, getOne, addOne, update, remove };
