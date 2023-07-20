const { Schema, model } = require("mongoose");

const BudgetUser = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  confirmpassword: {
    type: String,
    require: true,
  },
  pancard: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
});

module.exports = model("BudgetUser", BudgetUser);
