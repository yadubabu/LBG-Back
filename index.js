const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const BudgetUser = require("./models/BudgetUser");

const Transactions = require("./models/Transactions");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
mongoose
  .connect("mongodb+srv://mohini:mohinimohini@cluster0.sqdke.mongodb.net/test")
  .then(() => console.log("DB Connected"));

app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.use("/addtrans", require("./routes/transRouter"));
app.use("/gettrans", require("./routes/transRouter"));
app.use("/getbalance", require("./routes/transRouter"));
app.use("/", require("./routes/userRouter"));
// app.use("/", require("./routes/userRouter"));

app.listen(5000, () => {
  console.log("Server Running on Port 5000");
});
