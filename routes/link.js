const express = require("express");
const router = express.Router();
const { Url } = require("../models/url");
const { default: mongoose } = require("mongoose");

const wrapAsync = require("../wrapasync");

router
  .route("/")
  .get(
    wrapAsync(async (req, res) => {
      const links = await Url.find({});
      res.render("index.ejs", { links });
    })
  )
  .post(async (req, res) => {
    let { url } = req.body;
    const newUrl = new Url({ url: url });
    await newUrl.save();

    res.redirect("/link");
  });

module.exports = router;
