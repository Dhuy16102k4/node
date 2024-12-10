const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voucherSchema = new Schema({
  code: { type: String, required: true, unique: true }, // The voucher code
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true }, // Type of discount: percentage or fixed amount
  discountValue: { type: Number, required: true }, // Discount value (percentage or fixed amount)
  minOrderValue: { type: Number, default: 0 }, // Minimum order value to apply voucher
  expiryDate: { type: Date, required: true }, // Expiry date for the voucher
  usageLimit: { type: Number, default: 1 }, // Maximum number of times a voucher can be used
  usedCount: { type: Number, default: 0 }, // Number of times the voucher has been used
  isActive: { type: Boolean, default: true }, // Whether the voucher is active or not
  createdAt: { type: Date, default: Date.now }, // When the voucher was created
  updatedAt: { type: Date, default: Date.now } // When the voucher was last updated
});

module.exports = mongoose.model('Voucher', voucherSchema);
