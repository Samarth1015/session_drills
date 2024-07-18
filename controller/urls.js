const { Url } = require("../models/url");

module.exports.index = async (req, res, next) => {
  const links = await Url.find({});
  res.render("index.ejs", { links });
};

module.exports.adding = async (req, res) => {
  let { url } = req.body;
  const newUrl = new Url({ url: url });
  await newUrl.save();

  res.redirect("/link");
};
