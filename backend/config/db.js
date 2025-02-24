const mongoose = require("mongoose");

const connectString =
    process.env.MONGO_URI || `mongodb://localhost:27017/khangStore`;

const connectDB = async () => {
    try {
        await mongoose.connect(connectString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`Kết nối MongoDB thành công: `);
    } catch (error) {
        console.error(`Lỗi kết nối MongoDB: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;
