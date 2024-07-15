const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
let mongoURL = "mongodb://127.0.0.1:27017/link";
mongoose.connect(mongoURL).then(() => console.log("mongoose connected"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
app.use(express.json());
let port = 8080;
const link = require("./routes/link");
app.use("/link", link);

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
app.use((err, req, res, next) => {
  console.log(err);
});
