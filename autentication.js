const wrapasync = require("./wrapasync");

module.exports.isLoggedin = wrapasync((req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
});
