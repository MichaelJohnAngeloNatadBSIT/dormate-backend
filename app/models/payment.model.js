// models/payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  description: { type: String, required: true },
  cardNumber: { type: String, required: true },
  expMonth: { type: String, required: true },
  expYear: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
