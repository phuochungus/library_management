const { json } = require("body-parser");
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    let array = req.headers.authorization.split("Bearer ");
    console.log(array);
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.SECRET_VALUE);
    req.user = decode;
    next();
  } catch (err) {
    res.json({ message: "Authenticate failed!" + err });
  }
};

module.exports = authenticate;
