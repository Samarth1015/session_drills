module.exports.login = async (req, res, next) => {
  res.render("./user/signin.ejs");
};

module.exports.postcheck = async (req, res, next) => {
  res.redirect("/link");
};
