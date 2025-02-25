const User = require("../models/User");
const handleAsync = require("../utils/handleAsync");

const createUser = handleAsync(async (req, res) => {
    const { name, email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !password) {
        return res
            .status(400)
            .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Tạo và lưu user mới
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({
        message: "Người dùng được tạo thành công",
        user: newUser,
    });
});

module.exports = { createUser };
