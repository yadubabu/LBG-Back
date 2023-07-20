const { Schema, model } = require("mongoose");

const Categories = new Schema({
  type: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});
module.exports = model("Categories", Categories);
