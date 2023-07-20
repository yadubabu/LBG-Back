const express = require("express");
const BudgetUser = require("../models/BudgetUser");

const authRouter = express.Router();

authRouter.get("/", (req, res) => {
  res.send("Hai I am user");
});

authRouter.post("/loginuser", async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(email, password);
    // const getUser = await BudgetUser.findOne(email);
    // console.log(getUser);
  } catch (err) {
    console.log(err);
  }
});

module.exports = authRouter;
