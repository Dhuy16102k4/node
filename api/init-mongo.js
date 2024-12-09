const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');

const url = process.env.MONGO_URI;
const dbName = 'productList'; 

const collections = [
    { file: './data/productList.carts.json', collection: 'carts' },
    { file: './data/productList.categories.json', collection: 'categories' },
    { file: './data/productList.orders.json', collection: 'orders' },
    { file: './data/productList.products.json', collection: 'products' },
    { file: './data/productList.users.json', collection: 'users' }
];

(async () => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        console.log('Đã kết nối tới MongoDB');

        const db = client.db(dbName);

        for (const { file, collection } of collections) {
            
            const data = JSON.parse(fs.readFileSync(file, 'utf8'));
            
            if (Array.isArray(data) && data.length > 0) {
                await db.collection(collection).deleteMany({});
                
                const processedData = data.map(item => {
                    return { ...item, _id: new ObjectId(item._id.$oid) };
                });

                await db.collection(collection).insertMany(processedData);
                console.log(`Đã import dữ liệu từ ${file} vào collection ${collection}`);
            } else {
                console.log(`Không có dữ liệu để import từ ${file}`);
            }
        }

        await client.close();
    } catch (error) {
        console.error('Lỗi khi import dữ liệu:', error);
    }
})();
