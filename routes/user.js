const express = require("express");
const router = express.Router();

const passport = require("passport");
const wrapasync = require("../wrapasync");

router.get(
  "/",
  wrapasync((req, res, next) => {
    res.render("./user/signin.ejs");
  })
);
router.post(
  "/password",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res, next) => {
    res.redirect("/link");
  }
);
module.exports = router;
