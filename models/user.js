const mongoose = require("mongoose");
const passportLoacalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
  },
  subject: {
    type: String,
  },
  name: {
    type: String,
  },
  githubId: {
    type: String,
  },
});

userSchema.plugin(passportLoacalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
