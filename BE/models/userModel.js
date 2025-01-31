const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    githubId : {type: String},
    name: { type: String },
  },
  { timestamps: true }
);

userSchema.statics.findOrCreate = async function (condition, data) {
  let user = await this.findOne(condition);
  if (!user) {
    user = await this.create(data);
  }
  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
