const express = require("express");
const app = express();
const path = require("path");
const User = require("./models/user");
const cookie = require("cookieparser");
const router = express.Router();
require("dotenv").config();
const GitHubStrategy = require("passport-github2");

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
passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser((user, cb) => {
  User.findById(user.id)
    .then((foundUser) => {
      cb(null, foundUser);
    })
    .catch((err) => {
      cb(err);
    });
});
//github
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/github/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log("profile:", profile); // Log the profile object to inspect its structure

      let email = null;
      if (profile.emails && profile.emails.length > 0) {
        email = profile.emails[0].value;
      }

      try {
        const user = await User.findOneAndUpdate(
          { githubId: profile.id },
          {
            githubId: profile.id,
            username: profile.username,
            name: profile.displayName,
            email: email,
            provider: "github",
          },
          { upsert: true, new: true }
        );
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
app.use(express.json());
let port = 8080;
var GoogleStrategy = require("passport-google-oidc");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/oauth2/redirect/google",
      scope: ["profile", "email"],
    },
    async (issuer, profile, cb) => {
      console.log(profile); // Log the profile object to see its structure
      try {
        let user = await User.findOne({
          provider: "google",
          subject: profile.id,
        });
        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value, // Ensure emails array is accessed correctly
            provider: "google",
            subject: profile.id,
            name: profile.displayName,
          });
          await user.save();
        }
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/link");
  }
);
const link = require("./routes/link");
app.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/link",
    failureRedirect: "/login",
  })
);
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
