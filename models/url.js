const { url } = require("inspector");
const mongoose = require("mongoose");
const { type } = require("os");
const { stringify } = require("querystring");

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    require: true,
  },
});
const Url = mongoose.model("Url", urlSchema);
module.exports = { Url };
