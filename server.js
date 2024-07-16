const express = require("express");
const app = express();
const path = require("path");
const User = require("./models/user");
const cookie = require("cookieparser");

const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const mongoose = require("mongoose");
const logIn = require("./routes/user");
const passport = require("passport");
const LocalPassport = require("passport-local");

let mongoURL = "mongodb://127.0.0.1:27017/link";
mongoose.connect(mongoURL).then(() => console.log("mongoose connected"));
const sessionOption = {
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
app.use(express.json());
let port = 8080;

const link = require("./routes/link");

app.use("/link", link);
app.use("/login", logIn);
app.get("/signup", (req, res, next) => {
  res.render("./user/signup.ejs");
});
app.post("/demo", async (req, res, next) => {
  console.log(req.body);
  let { username, email, password } = req.body;
  const fakeUser = new User({ email, username });
  await User.register(fakeUser, password);
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
app.use((err, req, res, next) => {
  console.log(err);
});
