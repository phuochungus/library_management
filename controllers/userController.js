const pool = require("../dbHandler");

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

const addOne = (req, res) => {
  let currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + RULE_MONTH).toString();

  let user = [
    req.body.name,
    req.body.type,
    req.body.birth,
    req.body.address,
    req.body.email,
    currentDate,
  ];

  pool
    .query(
      "INSERT INTO users(name,type,birth,address,email,validUntil) VALUES (?)",
      [user]
    )
    .then((response) => {
      res.json({ message: "inserted successfully" });
    })
    .catch((err) => {
      res.json({ message: "inserted fail" + err });
    });
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
};

const remove = (req, res) => {
  let userID = req.body.userID;
  pool
    .query("DELETE FROM users WHERE userID = ?", [userID])
    .then((response) => {
      res.json({ message: "deleted successfully" + response });
    })
    .catch((err) => {
      res.json({ message: "deleted fail" });
    });
};

module.exports = { getAll, getOne, addOne, update, remove };
