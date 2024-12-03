const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/productList');
     
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); 
    }
}

module.exports = { connect };
