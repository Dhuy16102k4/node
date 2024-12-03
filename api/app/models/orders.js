const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Người đặt hàng
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Sản phẩm trong đơn hàng
            quantity: { type: Number, required: true }, // Số lượng sản phẩm
            price: { type: Number, required: true } // Giá tại thời điểm đặt hàng
        }
    ],
    totalPrice: { type: Number, required: true }, // Tổng giá trị đơn hàng
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], 
        default: 'Pending' 
    }, // Trạng thái đơn hàng
    address: { type: String, required: true }, // Địa chỉ giao hàng
    paymentMethod: { type: String, enum: ['Cash', 'Credit Card', 'Online'], default: 'Cash' }, // Phương thức thanh toán
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
