const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = user;
    next();
  } catch (err) {
    res.json({ message: "Authenticate failed!" });
  }
};

module.exports = authenticate;
