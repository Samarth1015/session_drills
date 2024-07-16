const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    require: true,
  },
});
const Url = mongoose.model("Url", urlSchema);
module.exports = { Url };
