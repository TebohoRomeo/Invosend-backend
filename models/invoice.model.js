const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  items: [{ name: String, quantity: Number, price: Number }],
  total: Number,
  logoPath: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
