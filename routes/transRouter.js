const express = require("express");
// const { Router } = require("express");
const Transactions = require("../models/Transactions");
const cors = require("cors");
const _ = require("lodash");
const TransactionsTrack = require("../models/TransactionsTrack");

const transRouter = express.Router();
transRouter.use(express.json());
transRouter.use(
  cors({
    origin: "*",
  })
);
transRouter.get("/", async (req, res) => {
  return res.send(await Transactions.find());
});
transRouter.get("/balance", async (req, res) => {
  return res.json(await TransactionsTrack.find());
});
transRouter.post("/", async (req, res) => {
  console.log(req.body);
  const { name, type, amount, date } = req.body;

  try {
    const newTrans = new Transactions({
      name,
      type,
      amount,
      date,
    });

    await newTrans.save();

    if (newTrans.type === "savings") {
      const getTotals = await TransactionsTrack.find();
      // if (
      //   getTotals[0].totAmount >
      //   getTotals[0].totSavings +
      //     getTotals[0].getTotals[0].totExpense +
      //     totInvestment
      // ) {
      return await TransactionsTrack.findByIdAndUpdate(
        getTotals[0]._id.toString(),
        {
          totAmount: _.sum([getTotals[0].totAmount, newTrans.amount]),
          totExpense: 0,
          totInvestment: 0,
          totSavings: 0,
          // totSavings: _.sum([newTrans.amount, getTotals[0].totSavings]),
        }
      );
      // }
    }
    if (newTrans.type === "expense") {
      const getTotals = await TransactionsTrack.find();
      if (
        getTotals[0].totAmount >
        getTotals[0].totSavings +
          getTotals[0].getTotals[0].totExpense +
          totInvestment
      ) {
        return await TransactionsTrack.findByIdAndUpdate(
          getTotals[0]._id.toString(),
          {
            totAmount: getTotals[0].totAmount - newTrans.amount,
            totExpense: _.sum([newTrans.amount, getTotals[0].totExpense]),
          }
        );
      }
    }
    if (newTrans.type === "investment") {
      const getTotals = await TransactionsTrack.find();
      if (
        getTotals[0].totAmount >
        getTotals[0].totSavings +
          getTotals[0].getTotals[0].totExpense +
          totInvestment
      ) {
        return await TransactionsTrack.findByIdAndUpdate(
          getTotals[0]._id.toString(),
          {
            totAmount: getTotals[0].totAmount - newTrans.amount,
            totInvestment: _.sum([newTrans.amount, getTotals[0].totInvestment]),
          }
        );
      }
    }
    return res.json(getTotals[0]);
  } catch (err) {
    console.log(err);
  }
});
transRouter.get("/", async (req, res) => {
  try {
    return res.json(await Transactions.find());
  } catch (err) {
    console.log(err);
  }
});

module.exports = transRouter;
