const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../dbHandler");

const login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  pool
    .query(
      'SELECT * FROM admin WHERE username = ? AND password = ? AND isDeleted = "NO"',
      [username, password]
    )
    .then((response) => {
      if (response[0].length != 0) {
        let token = jwt.sign({ name: username }, process.env.SECRET_VALUE, {
          expiresIn: "1h",
        });
        res.json({ message: "login successfully!", token });
      } else {
        res.json({ message: "account not found!" });
      }
    })
    .catch((err) => {
      res.json({ message: "err: " + err });
    });
};

const register = (req, res) => {
  bcrypt.hash(
    req.body.password,
    process.env.SECRET_VALUE,
    (err, hashedPassword) => {
      if (err) {
        res.json({
          error: err,
        });
      }
      let user = {
        name: req.body.name,
        username: req.body.username,
        password: hashedPassword,
        birth: req.body.birth,
        address: req.body.address,
        email: req.body.email,
      };
      pool
        .query(
          "INSERT INTO admin(name, username, password, birth, address, email) VALUES ?",
          [[Object.values(user)]]
        )
        .then((response) => {
          res.json({
            message: "admin added successfully!",
          });
        })
        .catch((err) => {
          res.json({ message: "err: " + err });
        });
    }
  );
};

const update = async (req, res, next) => {
  let username = req.body.username;
  let [result] = await pool.query("SELECT * FROM admin WHERE username = ?", [
    username,
  ]);
  if (result.length == 0) {
    res.json({ message: "item not found" });
    return;
  }
  let admin = result[0];
  admin = {
    name: req.body.name || admin.name,
    birth: req.body.birth || admin.birth,
    address: req.body.address || admin.address,
    email: req.body.email || admin.email,
    updatedAt: new Date(),
    username: admin.username,
  };
  adminInfo = Object.values(admin);
  pool
    .query(
      "UPDATE admin" +
        " SET name = ?, birth = ?, address = ?, email = ?, updatedAt = ?" +
        " where username = ?",
      adminInfo
    )
    .then((response) => {
      res.json({ message: "updated successfully" });
    })
    .catch((err) => {
      res.json({ message: "updated fail" + err });
    });
};

const remove = (req, res) => {
  pool
    .query('UPDATE FROM admin SET isDeleted = "YES" WHERE username = ?', [
      req.body.username,
    ])
    .then((response) => {
      if (response[0].affectedRows == 0) {
        res.json({ message: "delete successful!" });
      }
    })
    .catch((err) => {
      res.json({ message: "deleted fail!" });
    });
};

module.exports = { login, register, update, remove };
