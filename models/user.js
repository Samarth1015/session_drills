const mongoose = require("mongoose");
const passportLoacalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});
userSchema.plugin(passportLoacalMongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;
