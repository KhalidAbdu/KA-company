const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    username: {type: String, trim: true, required: true, unique: true},
    passwordHash: {type: String, required: true},
    cart: {type: Schema.Types.ObjectId, ref: 'Cart'}
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
