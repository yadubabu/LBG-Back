const express = require("express");
const BudgetUser = require("../models/BudgetUser");

const userRouter = express.Router();

userRouter.post("/adduser", async (req, res) => {
  const { name, email, password, confirmpassword, pancard, phone } = req.body;

  try {
    const newUser = new BudgetUser({
      name,
      email,
      password,
      confirmpassword,
      pancard,
      phone,
    });
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
    return await res.status(200).json(getUser);
  } catch (err) {
    console.log(err);
  }
});

module.exports = userRouter;
