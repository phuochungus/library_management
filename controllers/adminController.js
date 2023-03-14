const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../utils/dbHandler");

// const login = async (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   let passwordInDB = await getPasswordFromDB(username);
//   bcrypt.compare(password, passwordInDB, function (err, result) {
//     if (err) {
//       res.json({ message: "login fail!" });
//     }
//     if (result == true) {
//       let token = jwt.sign({ name: username }, process.env.ACCESS_TOKEN, {
//         expiresIn: "1h",
//       });
//       res.json({ message: "login successfully!", token });
//     } else {
//       res.json({ message: "wrong password" });
//     }
//   });
// };

// const getPasswordFromDB = async (username) => {
//   let response = await pool.query(
//     "SELECT password FROM admin WHERE username = ?",
//     [username]
//   );
//   return response[0][0].password;
// };

const register = (req, res) => {
  bcrypt.hash(
    req.body.password,
    Number(process.env.SALT_ROUND),
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
    .query(
      'UPDATE admin SET isDeleted = "YES", updatedAt = CURRENT_TIMESTAMP() WHERE username = ?',
      [req.body.username]
    )
    .then((response) => {
      if (response[0].affectedRows != 0) {
        res.json({ message: "delete successful!" });
      } else {
        res.json({ message: "deleted fail!" });
      }
    })
    .catch((err) => {
      res.json({ message: "deleted fail!" + err });
    });
};

module.exports = { register, update, remove };
