const User = require("../models/userModel");
const handleAsync = require("../utils/handelAsync");
const { BadRequestError, NotFoundError } = require("../core/errorResponse");
const { CREATED, SuccessResponse } = require("../core/successResponse");
const { createNewUser, getUserByEmail } = require("../services/userService");
const { hashPassword, comparePassword } = require("../helpers/bcryptHelper");
const { generateToken } = require("../helpers/jwtHelper");

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

    const token = generateToken(newUser._id, res);

    const metadata = {
        user: newUser,
        token,
    };

    const message = "Tạo user mới thành công";

    return new CREATED({ metadata, message }).send(res);
});

const login = handleAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
        throw new BadRequestError("Vui lòng nhập đầy đủ thông tin");
    }

    const userHolder = await getUserByEmail(email);
    if (!userHolder) throw new NotFoundError("Người dùng chưa đăng kí!");

    // So sánh mật khẩu
    const isPassword = await comparePassword(password, userHolder.password);
    if (!isPassword) throw new BadRequestError("Sai mật khẩu");

    const token = generateToken(userHolder._id, res);

    const metadata = {
        token,
    };

    const message = "Đăng nhập thành công";

    return new SuccessResponse({ metadata, message }).send(res);
});

const logout = handleAsync(async (req, res, next) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0), // Xóa cookie ngay lập tức
    });

    const message = "Đăng xuất thành công";

    return new SuccessResponse({ message }).send(res);
});

module.exports = { createUser, login, logout };
