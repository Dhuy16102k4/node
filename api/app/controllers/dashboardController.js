const Order = require('../models/orders');
const Product = require('../models/products');
const User = require('../models/users');

const dashboardController = {
    async getDashboardStats(req, res) {
        try {
            // Tổng doanh thu
            const totalRevenue = await Order.aggregate([
                { $match: { status: { $in: ['Confirmed', 'Shipped', 'Delivered'] } } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ]);
            const totalRevenueAmount = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

            // 5 sản phẩm bán chạy nhất
            const topSellingProducts = await Order.aggregate([
                { $unwind: '$products' },
                { $group: { _id: '$products.product', totalQuantity: { $sum: '$products.quantity' } } },
                { $sort: { totalQuantity: -1 } },
                { $limit: 5 },
                { $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productInfo'
                }},
                { $unwind: '$productInfo' },
                { $project: { productName: '$productInfo.name', totalQuantity: 1, price: '$productInfo.price' } }
            ]);

            // Người dùng mua nhiều nhất
            const topUser = await Order.aggregate([
                { $group: { _id: '$user', totalOrders: { $sum: 1 } } },
                { $sort: { totalOrders: -1 } },
                { $limit: 1 },
                { $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }},
                { $unwind: '$userInfo' },
                { $project: { username: '$userInfo.username', totalOrders: 1 } }
            ]);

            // Tổng số sản phẩm, người dùng và đơn hàng
            const totalProducts = await Product.countDocuments();
            const totalUsers = await User.countDocuments();
            const totalOrders = await Order.countDocuments();

            // Gửi kết quả về
            res.status(200).json({
                totalRevenue: totalRevenueAmount,
                topSellingProducts,
                topUser: topUser.length > 0 ? topUser[0] : {},
                totalProducts,
                totalUsers,
                totalOrders
            });
        } catch (err) {
            res.status(500).json({ error: 'Something went wrong', message: err.message });
        }
    }
};

module.exports = dashboardController;
