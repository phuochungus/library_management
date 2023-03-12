const { json } = require("body-parser");
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    let array = req.headers.authorization.split("Bearer ");
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.SECRET_VALUE);
    req.user = user;
    next();
  } catch (err) {
    res.json({ message: "Authenticate failed!" + err });
  }
};

module.exports = authenticate;
