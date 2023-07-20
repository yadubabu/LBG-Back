const { Schema, model } = require("mongoose");

const TransactionsTrack = new Schema({
  totAmount: {
    type: Number,
    required: true,
  },
  totSavings: {
    type: Number,
    required: true,
  },
  totExpense: {
    type: Number,
    required: true,
  },
  totInvestment: {
    type: Number,
    required: true,
  },
});

module.exports = model("TransactionsTrack", TransactionsTrack);
