const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const connectDB = require("./config/db");

// Cấu hình biến môi trường
dotenv.config();

// Kết nối MongoDB
connectDB();

// Khởi tạo ứng dụng Express
const app = express();

// Thiết lập các middleware để bảo vệ ứng dụng, xử lý dữ liệu từ request body và cookies
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Xử lý dữ liệu từ form (x-www-form-urlencoded)
app.use(cookieParser());

// Route đơn giản
app.get("/", (req, res) => {
    res.send(" Server đang chạy...");
});

// Cấu hình cổng và khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});
