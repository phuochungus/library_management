const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");

const genreRoute = require("./routes/genreRoute");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const bookRoute = require("./routes/bookRoute");
const borrowerSlipRoute = require("./routes/borrowerSlipRoute");
const returnBookSlipRoute = require("./routes/returnBookSlipRoute");
const fineReceiptRoute = require("./routes/fineReceiptRoute");
const reportRoute = require("./routes/reportRoute");
const authentication = require("./middleware/authenticate");
const LibraryRules = require("./utils/libraryRules");

//MongoDB init
const option = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(
  "mongodb+srv://m001-student:" +
    process.env.MONGODB_PASSWORD +
    "@sandbox.bffmayt.mongodb.net/library?retryWrites=true&w=majority",
  option
);

const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log("Connection to MongoDB established!");
});
//finish init

//config app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

LibraryRules.getLibraryRules();

app.use("/api/genre", genreRoute);
app.use("/api/user", userRoute);
app.use("/api", adminRoute);
app.use("/api/book", bookRoute);
app.use("/api/borrow/", borrowerSlipRoute);
app.use("/api/return", returnBookSlipRoute);
app.use("/api/fineReceipt", fineReceiptRoute);
app.use("/api/report", reportRoute);
