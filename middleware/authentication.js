const jwt = require("jsonwebtoken");
const pool = require("../utils/dbHandler");
const bcrypt = require("bcrypt");

let refreshTokens = [];

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const username = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.username = username;
    next();
  } catch (err) {
    res.json({ message: "Authenticate failed!: " + err });
  }
};

const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let passwordInDB = await getPasswordFromDB(username);
  bcrypt.compare(password, passwordInDB, function (err, result) {
    if (err) {
      res.json({ message: "login fail!" });
    }
    if (result == true) {
      let accessToken = generateAccessToken({ username });
      let refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN);
      refreshTokens.push(refreshToken);
      res.json({ message: "login successfully!", accessToken, refreshToken });
    } else {
      res.json({ message: "wrong password" });
    }
  });
};
const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.ACCESS_TOKEN, {
    expiresIn: "30s",
  });
};

const getPasswordFromDB = async (username) => {
  let response = await pool.query(
    "SELECT password FROM admin WHERE username = ?",
    [username]
  );
  return response[0][0].password;
};

const token = (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken(
      { username: user.username },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "30s",
      }
    );
    res.json({ accessToken });
  });
};

const remove = (req, res) => {
  const refreshToken = req.body.refreshToken;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.sendStatus(204);
};

module.exports = { authenticate, login, token, remove };
