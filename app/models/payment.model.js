// models/payment.js
const { Schema } = require("mongoose");

module.exports = (mongoose) => {
  const Payment = mongoose.model(
    "payment",
    mongoose.Schema(
      {
        amount: Number,
        payment_id: String,
        type: String,
        checkout_url: String,
        status: String,
        payment_type: String,
        user_id: String,
        dorm_id: String,
        email: String,
        name: String,
        phone: String,
        status: String,
        createdAt: { type: Date, default: Date.now },
      },
      { timestamps: true }
    )
  );
  return Payment;
};
