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

            // Top 5 người dùng mua nhiều nhất
            const topUsers = await Order.aggregate([
                { $group: { _id: '$user', totalOrders: { $sum: 1 } } },
                { $sort: { totalOrders: -1 } },
                { $limit: 5 },  // Get top 5 users
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

            // Lấy 5 đơn hàng mới nhất và trạng thái của chúng
            const latestOrders = await Order.find()
                .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất
                .limit(5) // Lấy 5 đơn hàng mới nhất
                .populate('user', 'username') // Lấy thông tin tên người dùng
                .select('totalPrice status user createdAt'); // Chỉ lấy các trường cần thiết

            // Gửi kết quả về
            res.status(200).json({
                totalRevenue: totalRevenueAmount,
                topSellingProducts,
                topUsers,  // Changed topUser to topUsers to return an array of users
                totalProducts,
                totalUsers,
                totalOrders,
                latestOrders
            });
        } catch (err) {
            res.status(500).json({ error: 'Something went wrong', message: err.message });
        }
    }
};

module.exports = dashboardController;
