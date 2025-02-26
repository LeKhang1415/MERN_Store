const User = require("../models/userModel");
const handleAsync = require("../utils/handelAsync");
const { BadRequestError } = require("../core/errorResponse");
const { CREATED } = require("../core/successResponse");
const { createNewUser } = require("../services/userService");
const { hashPassword } = require("../helpers/bcryptHelper");

const createUser = handleAsync(async (req, res) => {
    const { name, email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !password) {
        throw new BadRequestError("Vui lòng nhập đầy đủ thông tin");
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new BadRequestError("Email đã được sử dụng");
    }

    // Tạo và lưu user mới

    const hashedPassword = await hashPassword(password);

    const newUser = await createNewUser({
        email,
        password: hashedPassword,
        name,
    });

    const metadata = {
        user: newUser,
    };

    const message = "Tạo user mới thành công";

    return new CREATED({ metadata, message }).send(res);
});

module.exports = { createUser };
