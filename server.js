const express = require("express");
const bodyParser = require("body-parser");

const genreRoute = require("./routes/genreRoute");
const userRoute = require("./routes/userRoute");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

app.use("/api/genre", genreRoute);
app.use("/api/user", userRoute);
