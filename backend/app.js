const express = require("express");
const helmet = require("helmet");
const Routes = require("./routes");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

connectDB();

// Thiết lập các middleware để bảo vệ ứng dụng, xử lý dữ liệu từ request body và cookies
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Xử lý dữ liệu từ form (x-www-form-urlencoded)
app.use(cookieParser());

// Khởi tạo routes
app.use("/", Routes);

// Xử lý lỗi
app.use((req, res, next) => {
    const error = new Error("Không tìm thấy");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        stack: error.stack,
        message: error.message || "Lỗi hệ thống",
    });
});

module.exports = app;
