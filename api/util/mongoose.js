module.exports = {
    mutipleMongooseToObject: function (mongooses) {
        return mongooses.map(mongoose => (typeof mongoose.toObject === 'function' ? mongoose.toObject() : mongoose));
    },
    MongooseToObject: function (mongoose) {
        return mongoose && typeof mongoose.toObject === 'function' ? mongoose.toObject() : mongoose;
    }
};
