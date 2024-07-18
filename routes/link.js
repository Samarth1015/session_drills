const express = require("express");
const router = express.Router();
const { Url } = require("../models/url");
const { default: mongoose } = require("mongoose");
const { isLoggedin } = require("../autentication");

const wrapAsync = require("../wrapasync");
const controllerUrl = require("../controller/urls");

router
  .route("/")
  .get(isLoggedin, wrapAsync(controllerUrl.index))
  .post(wrapAsync(controllerUrl.adding));

module.exports = router;
