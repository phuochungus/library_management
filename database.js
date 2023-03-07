const express = require("express");
const bodyParser = require("body-parser");
const generRoute = require("./routes/genreRoute");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

app.use("/api", generRoute);
