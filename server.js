const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");
require("dotenv").config({ path: "./config.env" });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

app.post("/create-session-payment", cors(), async (req, res) => {
  let { amount, id } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "NZD",
      description: "Shoppie Company",
      payment_method: id,
      confirm: true,
    });

    console.log("Payment", payment);
    res.json({
      message: "Payment Successful",
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
});

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
