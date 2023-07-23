const express = require("express");
const BudgetUser = require("../models/BudgetUser");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");

userRouter.post("/adduser", async (req, res) => {
  const { name, email, password, confirmpassword, pancard, phone } = req.body;
  let hasspassword = await bcrypt.hash(password, 12);
  let confirmHash = await bcrypt.hash(confirmpassword, 12);

  try {
    const newUser = new BudgetUser({
      name,
      email,
      password: hasspassword,
      confirmpassword: confirmHash,
      pancard,
      phone,
    });
    const addAccount = new TransactionsTrack({
      totAmount: 5000,
      totSavings: 0,
      totExpense: 0,
      totInvestment: 0,
    });
    await addAccount.save();
    await newUser.save();
    return res.status(200).json("User Registered Successfully");
  } catch (err) {
    console.log(err);
  }
});
userRouter.post("/loginuser", async (req, res) => {
  const { email, password } = req.body;
  try {
    const getUser = await BudgetUser.findOne({ email });
    let isValid = false;
    isValid = await bcrypt.compare(password, getUser.password);
    if (isValid) {
      return await res.status(200).json(getUser.name);
    } else {
      return await res.send("Invalid Credentails");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = userRouter;
