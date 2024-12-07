const mongoose = require('mongoose');

async function connect() {
    // Sử dụng URI từ biến môi trường, nếu không có thì mặc định dùng `localhost`
    const mongoURI = process.env.NODE_ENV === 'docker'
        ? process.env.MONGO_URI_DOCKER
        : process.env.MONGO_URI_LOCAL || 'mongodb://localhost:27017/productList';

    try {
        await mongoose.connect(mongoURI, {
    
            connectTimeoutMS: 30000,  // Tăng thời gian chờ kết nối
            socketTimeoutMS: 30000,   // Tăng thời gian chờ socket
        });
        console.log(`Connected to MongoDB at ${mongoURI} successfully`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
}

module.exports = { connect };
