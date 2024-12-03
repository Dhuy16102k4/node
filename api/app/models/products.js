const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    img: { type: String, required: true },
    stock: { type: Number, required: true },
    
    // Quản lý các bình luận 
    reviews: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            name: { type: String, required: true },
            comment: { type: String, required: true },
            rating: { type: Number, min: 1, max: 10, required: true },  // Điểm đánh giá từ 1 đến 10
            createdAt: { type: Date, default: Date.now }
        }
    ],

    // Tính toán điểm trung bình từ tất cả các đánh giá
    averageRating: { type: Number, min: 1, max: 10, default: null }
});

// Hàm để tính toán lại điểm trung bình sau khi có một đánh giá mới
productSchema.methods.calculateAverageRating = function() {
    if (this.reviews.length === 0) {
        this.averageRating = null;
        return;
    }

    let totalRating = 0;
    this.reviews.forEach(review => {
        totalRating += review.rating;
    });

    this.averageRating = totalRating / this.reviews.length;
};

productSchema.pre('save', function(next) {

    this.calculateAverageRating();
    next();
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
