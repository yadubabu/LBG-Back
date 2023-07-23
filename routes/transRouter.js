const express = require("express");
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

    const getTotals = await TransactionsTrack.find();
    const totalAmount = _.sum([
      // getTotals[0].totSavings,
      getTotals[0].totExpense,
      getTotals[0].totInvestment,
      newTrans.amount,
    ]);
    console.log(totalAmount);
    if (newTrans.type === "savings") {
      return await TransactionsTrack.findByIdAndUpdate(
        getTotals[0]._id.toString(),
        {
          totAmount: _.sum([getTotals[0].totAmount, newTrans.amount]),
          totSavings: _.sum([newTrans.amount, getTotals[0].totSavings]),
        }
      );
    }
    if (newTrans.type === "expense") {
      if (getTotals[0].totAmount > totalAmount) {
        return await TransactionsTrack.findByIdAndUpdate(
          getTotals[0]._id.toString(),
          {
            totAmount: getTotals[0].totAmount - newTrans.amount,
            totExpense: _.sum([newTrans.amount, getTotals[0].totExpense]),
          }
        );
      } else {
        console.log("There is no suffecient balance in your account");
      }
    }
    if (newTrans.type === "investment") {
      if (getTotals[0].totAmount > totalAmount) {
        return await TransactionsTrack.findByIdAndUpdate(
          getTotals[0]._id.toString(),
          {
            totAmount: getTotals[0].totAmount - newTrans.amount,
            totInvestment: _.sum([newTrans.amount, getTotals[0].totInvestment]),
          }
        );
      } else {
        console.log("There is no suffecient balance in your account");
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
transRouter.delete("/deletetrans/:id", async (req, res) => {
  const id = req.params.id.toString();
  const editTransactions = await TransactionsTrack.find();

  try {
    return Transactions.findByIdAndDelete(id).then((doc) => {
      // if (doc.type === "expense") {
      //   return res.json(editTransactions[0]);
      // }
      if (doc.type === "expense") {
        return TransactionsTrack.updateOne({
          totAmount: _.sum([editTransactions[0].totAmount, doc.amount]),
          totExpense: editTransactions[0].totExpense - doc.amount,
        });
      } else if (doc.type === "savings") {
        return TransactionsTrack.updateOne({
          totAmount: editTransactions[0].totAmount - doc.amount,
          totSavings: editTransactions[0].totSavings - doc.amount,
        });
      } else if (doc.type === "investment") {
        return TransactionsTrack.updateOne({
          totAmount: _.sum([editTransactions[0].totAmount, doc.amount]),
          totInvestment: editTransactions[0].totInvestment - doc.amount,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});
module.exports = transRouter;
