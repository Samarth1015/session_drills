const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapasync = require("../wrapasync");
const controllerUser = require("../controller/user");
var GoogleStrategy = require("passport-google-oidc");
const User = require("../models/user");
router.get("/federated/google", passport.authenticate("google"));

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/link");
  }
);
router.get("/", wrapasync(controllerUser.login));
router.post(
  "/password",
  passport.authenticate("local", { failureRedirect: "/login" }),
  wrapasync(controllerUser.postcheck)
);
module.exports = router;
